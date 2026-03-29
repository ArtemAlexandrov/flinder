import {
  bouquets,
  emptyAnswers,
  flowerLabelMap,
  gestureLabelMap,
  occasionLabelMap,
  occasionReasonMap,
  optionSwatches,
  paletteLabelMap,
  shapeLabelMap,
  validIds,
  vibeLabelMap,
} from './data'
import type {
  AnswerState,
  BouquetCardData,
  BouquetReaction,
  FlowerFamilyId,
  OccasionId,
  PaletteId,
  RankedBouquet,
  ReportData,
  ReportNoGoItem,
} from './types'

export const STORAGE_KEY = 'flinder.answers.v1'
const SHARE_PREFIX = 'f='

const reactionWeight: Record<BouquetReaction, number> = {
  like: 5,
  maybe: 1,
  no: -7,
}

const occasionOrder: OccasionId[] = [
  'everyday',
  'birthday',
  'apology',
  'achievement',
]

function listToHuman(items: string[]) {
  if (items.length === 0) {
    return ''
  }

  if (items.length === 1) {
    return items[0]
  }

  if (items.length === 2) {
    return `${items[0]} и ${items[1]}`
  }

  return `${items.slice(0, -1).join(', ')} и ${items.at(-1)}`
}

function dedupe(items: string[]) {
  return [...new Set(items)]
}

function paletteMatches(bouquet: BouquetCardData, palette: PaletteId[]) {
  return palette.filter((item) =>
    bouquet.colors.some((color) => optionSwatches.palette[item].includes(color)),
  )
}

function scoreBouquet(bouquet: BouquetCardData, answers: AnswerState, occasion?: OccasionId) {
  let score = bouquet.universal ? 2 : 0
  const reasons: string[] = []
  const concerns: string[] = []

  if (answers.vibe && bouquet.vibes.includes(answers.vibe)) {
    score += 3
    reasons.push(`совпадает по вайбу: ${vibeLabelMap[answers.vibe].toLowerCase()}`)
  }

  if (answers.shape && bouquet.shapes.includes(answers.shape)) {
    score += 2
    reasons.push(`по форме это ${shapeLabelMap[answers.shape].toLowerCase()}`)
  }

  if (answers.gestureLevel) {
    if (bouquet.intensity === answers.gestureLevel) {
      score += 2
      reasons.push(
        `по масштабу жеста это ${gestureLabelMap[answers.gestureLevel].toLowerCase()}`,
      )
    } else if (answers.gestureLevel === 'quiet' && bouquet.intensity === 'grand') {
      score -= 2
      concerns.push('может ощущаться слишком громко')
    } else if (answers.gestureLevel === 'grand' && bouquet.intensity === 'quiet') {
      score -= 1
      concerns.push('может показаться слишком скромным')
    }
  }

  const matchedPalette = paletteMatches(bouquet, answers.palette)

  if (matchedPalette.length > 0) {
    score += matchedPalette.length * 2
    reasons.push(
      `попадает в палитру ${listToHuman(
        matchedPalette.map((item) => paletteLabelMap[item].toLowerCase()),
      )}`,
    )
  }

  const likedFlowers = answers.likedFlowers.filter((flower) =>
    bouquet.flowerFamilies.includes(flower),
  )

  if (likedFlowers.length > 0) {
    score += likedFlowers.length * 3
    reasons.push(
      `есть любимые цветы: ${listToHuman(
        likedFlowers.map((flower) => flowerLabelMap[flower].toLowerCase()),
      )}`,
    )
  }

  const avoidedFlowers = answers.avoidFlowers.filter((flower) =>
    bouquet.flowerFamilies.includes(flower),
  )

  if (avoidedFlowers.length > 0) {
    score -= avoidedFlowers.length * 8
    concerns.push(
      `внутри есть ${listToHuman(
        avoidedFlowers.map((flower) => flowerLabelMap[flower].toLowerCase()),
      )}`,
    )
  }

  const reaction = answers.bouquetReactions[bouquet.id]

  if (reaction) {
    score += reactionWeight[reaction]

    if (reaction === 'like') {
      reasons.push('поймал прямой лайк на примере')
    }

    if (reaction === 'maybe') {
      reasons.push('пример вызвал нейтрально-хорошую реакцию')
    }

    if (reaction === 'no') {
      concerns.push('поймал прямой дизлайк')
    }
  }

  if (occasion) {
    if (bouquet.occasions.includes(occasion)) {
      score += 3
      reasons.push(`уместен ${occasionReasonMap[occasion]}`)
    } else if (!bouquet.universal) {
      score -= 1
    }
  }

  if (bouquet.caution) {
    concerns.push(bouquet.caution)
  }

  return {
    bouquet,
    score,
    reasons: dedupe(reasons).slice(0, 3),
    concerns: dedupe(concerns).slice(0, 2),
  } satisfies RankedBouquet
}

function rankBouquets(answers: AnswerState, occasion?: OccasionId) {
  return [...bouquets]
    .map((bouquet) => scoreBouquet(bouquet, answers, occasion))
    .sort((left, right) => right.score - left.score)
}

function isHardNoGo(item: RankedBouquet, answers: AnswerState) {
  return (
    answers.bouquetReactions[item.bouquet.id] === 'no' ||
    answers.avoidFlowers.some((flower) => item.bouquet.flowerFamilies.includes(flower)) ||
    item.score < 0
  )
}

function buildHeadline(answers: AnswerState) {
  const parts = [
    answers.vibe ? vibeLabelMap[answers.vibe] : 'Чуткий',
    answers.shape ? shapeLabelMap[answers.shape] : 'букетный',
  ]

  return `${parts.join(' + ')} вкус`
}

function buildSummary(answers: AnswerState, safeChoice?: RankedBouquet) {
  const palette = answers.palette.map((item) => paletteLabelMap[item].toLowerCase())
  const flowers = answers.likedFlowers.map((item) => flowerLabelMap[item].toLowerCase())
  const bits = [
    answers.vibe ? vibeLabelMap[answers.vibe].toLowerCase() : null,
    answers.shape ? shapeLabelMap[answers.shape].toLowerCase() : null,
    palette.length > 0 ? `палитра: ${listToHuman(palette)}` : null,
    flowers.length > 0 ? `любимые цветы: ${listToHuman(flowers)}` : null,
    safeChoice
      ? `самая безопасная отправная точка: ${safeChoice.bouquet.title.toLowerCase()}`
      : null,
  ].filter(Boolean)

  return `${bits.join('. ')}.`
}

function buildNoGoItems(answers: AnswerState, ranked: RankedBouquet[]) {
  const items: ReportNoGoItem[] = []
  const seen = new Set<string>()

  for (const flower of answers.avoidFlowers) {
    const label = flowerLabelMap[flower]
    if (seen.has(label)) {
      continue
    }

    seen.add(label)
    items.push({
      title: label,
      reason: 'Это отмечено как жесткое “нет”, без экспериментов.',
      colors: optionSwatches.flowers[flower],
      emoji: '⛔️',
    })
  }

  for (const [bouquetId, reaction] of Object.entries(answers.bouquetReactions)) {
    if (reaction !== 'no') {
      continue
    }

    const bouquet = bouquets.find((item) => item.id === bouquetId)
    if (!bouquet || seen.has(bouquet.title)) {
      continue
    }

    seen.add(bouquet.title)
    items.push({
      title: bouquet.title,
      reason: 'Этот пример поймал прямой дизлайк в свайп-части.',
      colors: bouquet.colors,
      emoji: bouquet.emoji,
    })
  }

  for (const item of ranked.slice().reverse()) {
    if (items.length >= 4) {
      break
    }

    if (!item.bouquet.caution || seen.has(item.bouquet.title)) {
      continue
    }

    seen.add(item.bouquet.title)
    items.push({
      title: item.bouquet.title,
      reason: item.concerns[0] ?? 'Слишком рискованный вариант для базового выбора.',
      colors: item.bouquet.colors,
      emoji: item.bouquet.emoji,
    })
  }

  return items.slice(0, 4)
}

function buildCheatSheet(
  answers: AnswerState,
  safeChoices: RankedBouquet[],
  noGoItems: ReportNoGoItem[],
) {
  const lines: string[] = []

  if (safeChoices[0]) {
    lines.push(`Если сомневаешься, бери "${safeChoices[0].bouquet.title}".`)
  }

  if (answers.gestureLevel) {
    lines.push(
      `По громкости жеста держись уровня: ${gestureLabelMap[
        answers.gestureLevel
      ].toLowerCase()}.`,
    )
  }

  if (answers.palette.length > 0) {
    lines.push(
      `Базовая палитра: ${listToHuman(
        answers.palette.map((item) => paletteLabelMap[item].toLowerCase()),
      )}.`,
    )
  }

  if (noGoItems[0]) {
    lines.push(`Безопасное правило: не бери "${noGoItems[0].title}".`)
  }

  return lines.slice(0, 4)
}

export function generateReport(answers: AnswerState): ReportData {
  const ranked = rankBouquets(answers)
  const safePool = ranked.filter(
    (item) =>
      !isHardNoGo(item, answers) &&
      (item.bouquet.universal || item.bouquet.occasions.includes('everyday')),
  )
  const safeChoices = (safePool.length > 0 ? safePool : ranked).slice(0, 3)

  const occasionChoices = occasionOrder.map((occasion) => {
    const bestForOccasion =
      rankBouquets(answers, occasion).find((item) => !isHardNoGo(item, answers)) ??
      safeChoices[0]

    return {
      occasion,
      label: occasionLabelMap[occasion],
      pick: bestForOccasion,
    }
  })

  const moodTags = [
    answers.vibe ? vibeLabelMap[answers.vibe] : null,
    answers.shape ? shapeLabelMap[answers.shape] : null,
    answers.gestureLevel ? gestureLabelMap[answers.gestureLevel] : null,
    ...answers.palette.slice(0, 2).map((item) => paletteLabelMap[item]),
  ].filter(Boolean) as string[]

  const noGoItems = buildNoGoItems(answers, ranked)

  return {
    headline: buildHeadline(answers),
    summary: buildSummary(answers, safeChoices[0]),
    moodTags,
    safeChoices,
    occasionChoices,
    noGoItems,
    cheatSheet: buildCheatSheet(answers, safeChoices, noGoItems),
  }
}

function toBase64Url(value: string) {
  return window
    .btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '')
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return window.atob(`${normalized}${padding}`)
}

function normalizePalette(values: unknown) {
  if (!Array.isArray(values)) {
    return []
  }

  return values.filter(
    (value): value is PaletteId =>
      typeof value === 'string' && validIds.palette.has(value as PaletteId),
  )
}

function normalizeFlowers(values: unknown) {
  if (!Array.isArray(values)) {
    return []
  }

  return values.filter(
    (value): value is FlowerFamilyId =>
      typeof value === 'string' && validIds.flowers.has(value as FlowerFamilyId),
  )
}

function normalizeReactions(value: unknown) {
  if (!value || typeof value !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, reaction]) =>
        validIds.bouquets.has(key) &&
        typeof reaction === 'string' &&
        ['like', 'maybe', 'no'].includes(reaction),
    ),
  ) as AnswerState['bouquetReactions']
}

export function normalizeAnswers(value: unknown): AnswerState {
  const base = emptyAnswers()

  if (!value || typeof value !== 'object') {
    return base
  }

  const candidate = value as Partial<AnswerState>

  return {
    vibe:
      typeof candidate.vibe === 'string' && validIds.vibes.has(candidate.vibe)
        ? candidate.vibe
        : undefined,
    palette: normalizePalette(candidate.palette),
    shape:
      typeof candidate.shape === 'string' && validIds.shapes.has(candidate.shape)
        ? candidate.shape
        : undefined,
    gestureLevel:
      typeof candidate.gestureLevel === 'string' &&
      validIds.gestures.has(candidate.gestureLevel)
        ? candidate.gestureLevel
        : undefined,
    likedFlowers: normalizeFlowers(candidate.likedFlowers),
    avoidFlowers: normalizeFlowers(candidate.avoidFlowers),
    bouquetReactions: normalizeReactions(candidate.bouquetReactions),
  }
}

export function hasMeaningfulAnswers(answers: AnswerState) {
  return Boolean(
    answers.vibe ||
      answers.shape ||
      answers.gestureLevel ||
      answers.palette.length ||
      answers.likedFlowers.length ||
      answers.avoidFlowers.length ||
      Object.keys(answers.bouquetReactions).length,
  )
}

export function encodeAnswers(answers: AnswerState) {
  return `${SHARE_PREFIX}${toBase64Url(JSON.stringify(answers))}`
}

export function decodeAnswers(hash: string) {
  const cleanHash = hash.replace(/^#/u, '')

  if (!cleanHash.startsWith(SHARE_PREFIX)) {
    return null
  }

  try {
    return normalizeAnswers(
      JSON.parse(fromBase64Url(cleanHash.slice(SHARE_PREFIX.length))),
    )
  } catch {
    return null
  }
}

export function readStoredAnswers() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeAnswers(JSON.parse(raw)) : emptyAnswers()
  } catch {
    return emptyAnswers()
  }
}

export function persistAnswers(answers: AnswerState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
}

export function clearPersistedAnswers() {
  window.localStorage.removeItem(STORAGE_KEY)
}
