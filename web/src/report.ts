import { DEFAULT_LOCALE, formatList, textOf } from './content'
import {
  bouquets,
  emptyAnswers,
  getLocaleData,
  optionSwatches,
  validIds,
} from './data'
import type {
  AnswerState,
  BouquetCardData,
  BouquetReaction,
  FlowerFamilyId,
  Locale,
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

function dedupe(items: string[]) {
  return [...new Set(items)]
}

function paletteMatches(bouquet: BouquetCardData, palette: PaletteId[]) {
  return palette.filter((item) =>
    bouquet.colors.some((color) => optionSwatches.palette[item].includes(color)),
  )
}

function scoreBouquet(
  bouquet: BouquetCardData,
  answers: AnswerState,
  locale: Locale,
  occasion?: OccasionId,
) {
  const labels = getLocaleData(locale)
  let score = bouquet.universal ? 2 : 0
  const reasons: string[] = []
  const concerns: string[] = []

  if (answers.vibe && bouquet.vibes.includes(answers.vibe)) {
    score += 3
    reasons.push(
      locale === 'ru'
        ? `совпадает по вайбу: ${labels.vibeLabelMap[answers.vibe].toLowerCase()}`
        : `matches the vibe: ${labels.vibeLabelMap[answers.vibe].toLowerCase()}`,
    )
  }

  if (answers.shape && bouquet.shapes.includes(answers.shape)) {
    score += 2
    reasons.push(
      locale === 'ru'
        ? `по форме это ${labels.shapeLabelMap[answers.shape].toLowerCase()}`
        : `shape-wise it feels ${labels.shapeLabelMap[answers.shape].toLowerCase()}`,
    )
  }

  if (answers.gestureLevel) {
    if (bouquet.intensity === answers.gestureLevel) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `по масштабу жеста это ${labels.gestureLabelMap[
              answers.gestureLevel
            ].toLowerCase()}`
          : `gesture level feels ${labels.gestureLabelMap[
              answers.gestureLevel
            ].toLowerCase()}`,
      )
    } else if (answers.gestureLevel === 'quiet' && bouquet.intensity === 'grand') {
      score -= 2
      concerns.push(
        locale === 'ru' ? 'может ощущаться слишком громко' : 'may feel too loud',
      )
    } else if (answers.gestureLevel === 'grand' && bouquet.intensity === 'quiet') {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'может показаться слишком скромным'
          : 'may feel a little too modest',
      )
    }
  }

  const matchedPalette = paletteMatches(bouquet, answers.palette)

  if (matchedPalette.length > 0) {
    score += matchedPalette.length * 2
    reasons.push(
      locale === 'ru'
        ? `попадает в палитру ${formatList(
            matchedPalette.map((item) => labels.paletteLabelMap[item].toLowerCase()),
            locale,
          )}`
        : `lands inside the palette ${formatList(
            matchedPalette.map((item) => labels.paletteLabelMap[item].toLowerCase()),
            locale,
          )}`,
    )
  }

  const likedFlowers = answers.likedFlowers.filter((flower) =>
    bouquet.flowerFamilies.includes(flower),
  )

  if (likedFlowers.length > 0) {
    score += likedFlowers.length * 3
    reasons.push(
      locale === 'ru'
        ? `есть любимые цветы: ${formatList(
            likedFlowers.map((flower) => labels.flowerLabelMap[flower].toLowerCase()),
            locale,
          )}`
        : `includes favorite flowers: ${formatList(
            likedFlowers.map((flower) => labels.flowerLabelMap[flower].toLowerCase()),
            locale,
          )}`,
    )
  }

  const avoidedFlowers = answers.avoidFlowers.filter((flower) =>
    bouquet.flowerFamilies.includes(flower),
  )

  if (avoidedFlowers.length > 0) {
    score -= avoidedFlowers.length * 8
    concerns.push(
      locale === 'ru'
        ? `внутри есть ${formatList(
            avoidedFlowers.map((flower) => labels.flowerLabelMap[flower].toLowerCase()),
            locale,
          )}`
        : `it contains ${formatList(
            avoidedFlowers.map((flower) => labels.flowerLabelMap[flower].toLowerCase()),
            locale,
          )}`,
    )
  }

  const reaction = answers.bouquetReactions[bouquet.id]

  if (reaction) {
    score += reactionWeight[reaction]

    if (reaction === 'like') {
      reasons.push(
        locale === 'ru'
          ? 'поймал прямой лайк на примере'
          : 'got a direct like in the example round',
      )
    }

    if (reaction === 'maybe') {
      reasons.push(
        locale === 'ru'
          ? 'пример вызвал нейтрально-хорошую реакцию'
          : 'felt safely okay in the example round',
      )
    }

    if (reaction === 'no') {
      concerns.push(
        locale === 'ru' ? 'поймал прямой дизлайк' : 'got a direct dislike in the example round',
      )
    }
  }

  if (occasion) {
    if (bouquet.occasions.includes(occasion)) {
      score += 3
      reasons.push(
        locale === 'ru'
          ? `уместен ${labels.occasionReasonMap[occasion]}`
          : `fits well ${labels.occasionReasonMap[occasion]}`,
      )
    } else if (!bouquet.universal) {
      score -= 1
    }
  }

  if (bouquet.caution) {
    concerns.push(textOf(bouquet.caution, locale))
  }

  return {
    bouquet,
    score,
    reasons: dedupe(reasons).slice(0, 3),
    concerns: dedupe(concerns).slice(0, 2),
  } satisfies RankedBouquet
}

function rankBouquets(answers: AnswerState, locale: Locale, occasion?: OccasionId) {
  return [...bouquets]
    .map((bouquet) => scoreBouquet(bouquet, answers, locale, occasion))
    .sort((left, right) => right.score - left.score)
}

function isHardNoGo(item: RankedBouquet, answers: AnswerState) {
  return (
    answers.bouquetReactions[item.bouquet.id] === 'no' ||
    answers.avoidFlowers.some((flower) => item.bouquet.flowerFamilies.includes(flower)) ||
    item.score < 0
  )
}

function buildHeadline(answers: AnswerState, locale: Locale) {
  const labels = getLocaleData(locale)

  if (answers.vibe) {
    return locale === 'ru'
      ? `Букетный вайб: ${labels.vibeLabelMap[answers.vibe].toLowerCase()}`
      : `Bouquet vibe: ${labels.vibeLabelMap[answers.vibe].toLowerCase()}`
  }

  return locale === 'ru' ? 'Букетный вайб: безопасно и с заботой' : 'Bouquet vibe: safe and thoughtful'
}

function buildSummary(answers: AnswerState, locale: Locale, safeChoice?: RankedBouquet) {
  const labels = getLocaleData(locale)
  const palette = answers.palette.map((item) => labels.paletteLabelMap[item].toLowerCase())
  const flowers = answers.likedFlowers.map((item) => labels.flowerLabelMap[item].toLowerCase())
  const bits = [
    answers.shape
      ? locale === 'ru'
        ? `форма: ${labels.shapeLabelMap[answers.shape].toLowerCase()}`
        : `shape: ${labels.shapeLabelMap[answers.shape].toLowerCase()}`
      : null,
    palette.length > 0
      ? locale === 'ru'
        ? `палитра: ${formatList(palette, locale)}`
        : `palette: ${formatList(palette, locale)}`
      : null,
    flowers.length > 0
      ? locale === 'ru'
        ? `любимые цветы: ${formatList(flowers, locale)}`
        : `favorite flowers: ${formatList(flowers, locale)}`
      : null,
    safeChoice
      ? locale === 'ru'
        ? `самая безопасная отправная точка: ${textOf(
            safeChoice.bouquet.title,
            locale,
          ).toLowerCase()}`
        : `safest starting point: ${textOf(safeChoice.bouquet.title, locale).toLowerCase()}`
      : null,
  ].filter(Boolean)

  return bits.length > 0 ? `${bits.join('. ')}.` : locale === 'ru' ? 'Паспорт вкуса собран.' : 'Taste passport generated.'
}

function buildNoGoItems(locale: Locale, answers: AnswerState, ranked: RankedBouquet[]) {
  const labels = getLocaleData(locale)
  const items: ReportNoGoItem[] = []
  const seen = new Set<string>()

  for (const flower of answers.avoidFlowers) {
    const label = labels.flowerLabelMap[flower]
    if (seen.has(label)) {
      continue
    }

    seen.add(label)
    items.push({
      title: label,
      reason:
        locale === 'ru'
          ? 'Это отмечено как жесткое “нет”, без экспериментов.'
          : 'This is marked as a hard no, so it should never become an experiment.',
      colors: optionSwatches.flowers[flower],
      emoji: '⛔️',
    })
  }

  for (const [bouquetId, reaction] of Object.entries(answers.bouquetReactions)) {
    if (reaction !== 'no') {
      continue
    }

    const bouquet = bouquets.find((item) => item.id === bouquetId)
    if (!bouquet) {
      continue
    }

    const title = textOf(bouquet.title, locale)
    if (seen.has(title)) {
      continue
    }

    seen.add(title)
    items.push({
      title,
      reason:
        locale === 'ru'
          ? 'Этот пример поймал прямой дизлайк в свайп-части.'
          : 'This example got a direct dislike in the visual reaction round.',
      colors: bouquet.colors,
      emoji: bouquet.emoji,
    })
  }

  for (const item of ranked.slice().reverse()) {
    if (items.length >= 4) {
      break
    }

    if (!item.bouquet.caution) {
      continue
    }

    const title = textOf(item.bouquet.title, locale)

    if (seen.has(title)) {
      continue
    }

    seen.add(title)
    items.push({
      title,
      reason:
        item.concerns[0] ??
        (locale === 'ru'
          ? 'Слишком рискованный вариант для базового выбора.'
          : 'Too risky to keep as a default baseline choice.'),
      colors: item.bouquet.colors,
      emoji: item.bouquet.emoji,
    })
  }

  return items.slice(0, 4)
}

function buildCheatSheet(
  locale: Locale,
  answers: AnswerState,
  safeChoices: RankedBouquet[],
  noGoItems: ReportNoGoItem[],
) {
  const labels = getLocaleData(locale)
  const lines: string[] = []

  if (safeChoices[0]) {
    lines.push(
      locale === 'ru'
        ? `Если сомневаешься, бери "${textOf(safeChoices[0].bouquet.title, locale)}".`
        : `If you are unsure, go with "${textOf(safeChoices[0].bouquet.title, locale)}".`,
    )
  }

  if (answers.gestureLevel) {
    lines.push(
      locale === 'ru'
        ? `По масштабу жеста держись уровня: ${labels.gestureLabelMap[
            answers.gestureLevel
          ].toLowerCase()}.`
        : `Keep the gesture level around: ${labels.gestureLabelMap[
            answers.gestureLevel
          ].toLowerCase()}.`,
    )
  }

  if (answers.palette.length > 0) {
    lines.push(
      locale === 'ru'
        ? `Базовая палитра: ${formatList(
            answers.palette.map((item) => labels.paletteLabelMap[item].toLowerCase()),
            locale,
          )}.`
        : `Base palette: ${formatList(
            answers.palette.map((item) => labels.paletteLabelMap[item].toLowerCase()),
            locale,
          )}.`,
    )
  }

  if (noGoItems[0]) {
    lines.push(
      locale === 'ru'
        ? `Безопасное правило: не бери "${noGoItems[0].title}".`
        : `Safe rule: do not buy "${noGoItems[0].title}".`,
    )
  }

  return lines.slice(0, 4)
}

export function generateReport(answers: AnswerState, locale: Locale = DEFAULT_LOCALE): ReportData {
  const labels = getLocaleData(locale)
  const ranked = rankBouquets(answers, locale)
  const safePool = ranked.filter(
    (item) =>
      !isHardNoGo(item, answers) &&
      (item.bouquet.universal || item.bouquet.occasions.includes('everyday')),
  )
  const safeChoices = (safePool.length > 0 ? safePool : ranked).slice(0, 3)

  const occasionChoices = occasionOrder.map((occasion) => {
    const bestForOccasion =
      rankBouquets(answers, locale, occasion).find((item) => !isHardNoGo(item, answers)) ??
      safeChoices[0]

    return {
      occasion,
      label: labels.occasionLabelMap[occasion],
      pick: bestForOccasion,
    }
  })

  const moodTags = [
    answers.vibe ? labels.vibeLabelMap[answers.vibe] : null,
    answers.shape ? labels.shapeLabelMap[answers.shape] : null,
    answers.gestureLevel ? labels.gestureLabelMap[answers.gestureLevel] : null,
    ...answers.palette.slice(0, 2).map((item) => labels.paletteLabelMap[item]),
  ].filter(Boolean) as string[]

  const noGoItems = buildNoGoItems(locale, answers, ranked)

  return {
    headline: buildHeadline(answers, locale),
    summary: buildSummary(answers, locale, safeChoices[0]),
    moodTags,
    safeChoices,
    occasionChoices,
    noGoItems,
    cheatSheet: buildCheatSheet(locale, answers, safeChoices, noGoItems),
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
