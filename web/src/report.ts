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
  GiftFormatId,
  GreeneryLevelId,
  Locale,
  OccasionId,
  PaletteId,
  PlantStyleId,
  RankedBouquet,
  RoseStyleId,
  ReportData,
  ReportNoGoItem,
  ScentLevelId,
  TulipStyleId,
  WrappingStyleId,
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

function normalizeSingleValue<T extends string>(
  value: unknown,
  set: Set<T>,
) {
  return typeof value === 'string' && set.has(value as T) ? (value as T) : undefined
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

  if (answers.giftFormat) {
    if (answers.giftFormat === 'both') {
      score += bouquet.giftKind === 'cut' ? 1 : 0
    } else if (answers.giftFormat === 'cut') {
      if (bouquet.giftKind === 'cut') {
        score += 3
        reasons.push(
          locale === 'ru'
            ? 'совпадает по формату: именно букет'
            : 'matches the preferred format: bouquet',
        )
      } else {
        score -= 8
        concerns.push(
          locale === 'ru'
            ? 'предпочтение было не в пользу растений в горшке'
            : 'the preference leaned away from potted plants',
        )
      }
    } else if (bouquet.giftKind === 'potted') {
      score += 5
      reasons.push(
        locale === 'ru'
          ? 'совпадает по формату: растение в горшке'
          : 'matches the preferred format: potted plant',
      )
    } else {
      score -= 6
      concerns.push(
        locale === 'ru'
          ? 'предпочтение было в пользу растений в горшке'
          : 'the preference leaned toward potted plants',
      )
    }
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

  if (answers.scentLevel) {
    if (bouquet.scentLevel === answers.scentLevel) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `по аромату это ${labels.scentLabelMap[answers.scentLevel].toLowerCase()}`
          : `scent-wise it feels ${labels.scentLabelMap[answers.scentLevel].toLowerCase()}`,
      )
    } else if (answers.scentLevel === 'low' && bouquet.scentLevel === 'strong') {
      score -= 5
      concerns.push(
        locale === 'ru' ? 'аромат может оказаться слишком сильным' : 'the scent may feel too strong',
      )
    } else if (answers.scentLevel === 'strong' && bouquet.scentLevel === 'low') {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'может не дать желаемого ароматного эффекта'
          : 'may feel less fragrant than desired',
      )
    }
  }

  if (answers.greeneryLevel) {
    if (bouquet.greeneryLevel === answers.greeneryLevel) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `по зелени это ${labels.greeneryLabelMap[answers.greeneryLevel].toLowerCase()}`
          : `greenery level feels ${labels.greeneryLabelMap[answers.greeneryLevel].toLowerCase()}`,
      )
    } else if (answers.greeneryLevel === 'minimal' && bouquet.greeneryLevel === 'lush') {
      score -= 2
      concerns.push(
        locale === 'ru' ? 'может быть слишком много зелени' : 'may include too much greenery',
      )
    } else if (answers.greeneryLevel === 'lush' && bouquet.greeneryLevel === 'minimal') {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'может показаться слишком “чистым”'
          : 'may feel a little too stripped-back',
      )
    }
  }

  if (answers.wrappingStyle) {
    if (bouquet.wrappingStyle === answers.wrappingStyle) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `по оформлению это ${labels.wrappingLabelMap[answers.wrappingStyle].toLowerCase()}`
          : `presentation feels ${labels.wrappingLabelMap[answers.wrappingStyle].toLowerCase()}`,
      )
    } else if (answers.wrappingStyle === 'bare' && bouquet.wrappingStyle === 'decorative') {
      score -= 2
      concerns.push(
        locale === 'ru'
          ? 'упаковка может ощущаться слишком нарядной'
          : 'the wrapping may feel too dressed-up',
      )
    } else if (answers.wrappingStyle === 'decorative' && bouquet.wrappingStyle === 'bare') {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'может показаться слишком простым по подаче'
          : 'may feel too plain in presentation',
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

  if (answers.roseStyle && answers.likedFlowers.includes('roses') && bouquet.roseStyle) {
    if (bouquet.roseStyle === answers.roseStyle) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `если розы, то это формат ${labels.roseStyleLabelMap[answers.roseStyle].toLowerCase()}`
          : `for roses, this lands in the ${labels.roseStyleLabelMap[
              answers.roseStyle
            ].toLowerCase()} zone`,
      )
    } else if (bouquet.flowerFamilies.includes('roses')) {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'тип роз может быть не самым точным попаданием'
          : 'the rose styling may miss the preferred nuance',
      )
    }
  }

  if (answers.tulipStyle && answers.likedFlowers.includes('tulips') && bouquet.tulipStyle) {
    if (bouquet.tulipStyle === answers.tulipStyle) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `тюльпанный вайб совпадает: ${labels.tulipStyleLabelMap[
              answers.tulipStyle
            ].toLowerCase()}`
          : `the tulip styling matches: ${labels.tulipStyleLabelMap[
              answers.tulipStyle
            ].toLowerCase()}`,
      )
    } else if (bouquet.flowerFamilies.includes('tulips')) {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'подача тюльпанов может быть не той'
          : 'the tulip presentation may feel slightly off',
      )
    }
  }

  if (
    answers.plantStyle &&
    (answers.giftFormat === 'potted' || answers.giftFormat === 'both') &&
    bouquet.giftKind === 'potted' &&
    bouquet.plantStyle
  ) {
    if (bouquet.plantStyle === answers.plantStyle) {
      score += 2
      reasons.push(
        locale === 'ru'
          ? `по формату растения это ${labels.plantStyleLabelMap[
              answers.plantStyle
            ].toLowerCase()}`
          : `the plant style lands in ${labels.plantStyleLabelMap[
              answers.plantStyle
            ].toLowerCase()}`,
      )
    } else {
      score -= 1
      concerns.push(
        locale === 'ru'
          ? 'тип растения может быть не самым точным'
          : 'the plant type may miss the preferred nuance',
      )
    }
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

  if (answers.giftFormat && answers.vibe) {
    return locale === 'ru'
      ? `Профиль: ${labels.giftFormatLabelMap[answers.giftFormat].toLowerCase()}, ${labels.vibeLabelMap[
          answers.vibe
        ].toLowerCase()}`
      : `Profile: ${labels.giftFormatLabelMap[answers.giftFormat].toLowerCase()}, ${labels.vibeLabelMap[
          answers.vibe
        ].toLowerCase()}`
  }

  if (answers.vibe) {
    return locale === 'ru'
      ? `Букетный вайб: ${labels.vibeLabelMap[answers.vibe].toLowerCase()}`
      : `Bouquet vibe: ${labels.vibeLabelMap[answers.vibe].toLowerCase()}`
  }

  if (answers.giftFormat) {
    return locale === 'ru'
      ? `Формат: ${labels.giftFormatLabelMap[answers.giftFormat]}`
      : `Format: ${labels.giftFormatLabelMap[answers.giftFormat]}`
  }

  return locale === 'ru' ? 'Букетный вайб: безопасно и с заботой' : 'Bouquet vibe: safe and thoughtful'
}

function buildSummary(answers: AnswerState, locale: Locale, safeChoice?: RankedBouquet) {
  const labels = getLocaleData(locale)
  const palette = answers.palette.map((item) => labels.paletteLabelMap[item].toLowerCase())
  const flowers = answers.likedFlowers.map((item) => labels.flowerLabelMap[item].toLowerCase())
  const bits = [
    answers.giftFormat
      ? locale === 'ru'
        ? `формат: ${labels.giftFormatLabelMap[answers.giftFormat].toLowerCase()}`
        : `format: ${labels.giftFormatLabelMap[answers.giftFormat].toLowerCase()}`
      : null,
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
    answers.scentLevel
      ? locale === 'ru'
        ? `аромат: ${labels.scentLabelMap[answers.scentLevel].toLowerCase()}`
        : `scent: ${labels.scentLabelMap[answers.scentLevel].toLowerCase()}`
      : null,
    answers.wrappingStyle
      ? locale === 'ru'
        ? `оформление: ${labels.wrappingLabelMap[answers.wrappingStyle].toLowerCase()}`
        : `wrapping: ${labels.wrappingLabelMap[answers.wrappingStyle].toLowerCase()}`
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

  if (answers.giftFormat === 'cut') {
    const title = locale === 'ru' ? 'Растения в горшке вместо букета' : 'Potted plants instead of bouquets'
    seen.add(title)
    items.push({
      title,
      reason:
        locale === 'ru'
          ? 'Здесь ожидание скорее про букетный жест, а не про подарок для ухода.'
          : 'This preference leans toward a bouquet gesture, not a care-taking plant gift.',
      colors: ['#adc178', '#dde5b6', '#f5efe2'],
      emoji: '🪴',
    })
  }

  if (answers.scentLevel === 'low') {
    const title = locale === 'ru' ? 'Сильный аромат' : 'Strong floral scent'
    if (!seen.has(title)) {
      seen.add(title)
      items.push({
        title,
        reason:
          locale === 'ru'
            ? 'Лучше не рисковать лилиями и другими очень ароматными вариантами.'
            : 'Better not risk lilies or other very scented options here.',
        colors: ['#fff8ef', '#ffe8cc', '#f4d35e'],
        emoji: '🌺',
      })
    }
  }

  if (answers.wrappingStyle === 'bare') {
    const title = locale === 'ru' ? 'Слишком нарядная упаковка' : 'Overly decorative wrapping'
    if (!seen.has(title)) {
      seen.add(title)
      items.push({
        title,
        reason:
          locale === 'ru'
            ? 'Лучше минимально и спокойно, без ощущения “слишком старались с декором”.'
            : 'Keep the presentation cleaner and calmer, without overdecorating it.',
        colors: ['#f5efe2', '#d8d2ca', '#fff8ef'],
        emoji: '🎀',
      })
    }
  }

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

  if (answers.giftFormat) {
    lines.push(
      locale === 'ru'
        ? `Формат по умолчанию: ${labels.giftFormatLabelMap[answers.giftFormat].toLowerCase()}.`
        : `Default format: ${labels.giftFormatLabelMap[answers.giftFormat].toLowerCase()}.`,
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

  if (answers.scentLevel) {
    lines.push(
      locale === 'ru'
        ? `По аромату держись уровня: ${labels.scentLabelMap[answers.scentLevel].toLowerCase()}.`
        : `Keep the scent around: ${labels.scentLabelMap[answers.scentLevel].toLowerCase()}.`,
    )
  }

  if (answers.wrappingStyle) {
    lines.push(
      locale === 'ru'
        ? `По оформлению ориентир: ${labels.wrappingLabelMap[answers.wrappingStyle].toLowerCase()}.`
        : `Presentation cue: ${labels.wrappingLabelMap[answers.wrappingStyle].toLowerCase()}.`,
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
    answers.giftFormat ? labels.giftFormatLabelMap[answers.giftFormat] : null,
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

function normalizeSingleGiftFormat(value: unknown) {
  return normalizeSingleValue<GiftFormatId>(value, validIds.giftFormats)
}

function normalizeSingleScent(value: unknown) {
  return normalizeSingleValue<ScentLevelId>(value, validIds.scents)
}

function normalizeSingleGreenery(value: unknown) {
  return normalizeSingleValue<GreeneryLevelId>(value, validIds.greenery)
}

function normalizeSingleWrapping(value: unknown) {
  return normalizeSingleValue<WrappingStyleId>(value, validIds.wrapping)
}

function normalizeSingleRoseStyle(value: unknown) {
  return normalizeSingleValue<RoseStyleId>(value, validIds.roseStyles)
}

function normalizeSingleTulipStyle(value: unknown) {
  return normalizeSingleValue<TulipStyleId>(value, validIds.tulipStyles)
}

function normalizeSinglePlantStyle(value: unknown) {
  return normalizeSingleValue<PlantStyleId>(value, validIds.plantStyles)
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
    giftFormat: normalizeSingleGiftFormat(candidate.giftFormat),
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
    scentLevel: normalizeSingleScent(candidate.scentLevel),
    greeneryLevel: normalizeSingleGreenery(candidate.greeneryLevel),
    wrappingStyle: normalizeSingleWrapping(candidate.wrappingStyle),
    likedFlowers: normalizeFlowers(candidate.likedFlowers),
    roseStyle: normalizeSingleRoseStyle(candidate.roseStyle),
    tulipStyle: normalizeSingleTulipStyle(candidate.tulipStyle),
    plantStyle: normalizeSinglePlantStyle(candidate.plantStyle),
    avoidFlowers: normalizeFlowers(candidate.avoidFlowers),
    bouquetReactions: normalizeReactions(candidate.bouquetReactions),
  }
}

export function hasMeaningfulAnswers(answers: AnswerState) {
  return Boolean(
    answers.giftFormat ||
      answers.vibe ||
      answers.shape ||
      answers.gestureLevel ||
      answers.scentLevel ||
      answers.greeneryLevel ||
      answers.wrappingStyle ||
      answers.palette.length ||
      answers.likedFlowers.length ||
      answers.roseStyle ||
      answers.tulipStyle ||
      answers.plantStyle ||
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
