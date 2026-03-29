import type {
  AnswerState,
  BouquetCardData,
  BouquetReaction,
  FlowerFamilyId,
  GestureLevelId,
  OccasionId,
  PaletteId,
  Question,
  ShapeId,
  VibeId,
  VisualOption,
} from './types'

export const emptyAnswers = (): AnswerState => ({
  palette: [],
  likedFlowers: [],
  avoidFlowers: [],
  bouquetReactions: {},
})

const unsplashPhoto = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=960&q=75`

export const vibeOptions: VisualOption<VibeId>[] = [
  {
    id: 'soft',
    label: 'Нежно и воздушно',
    hint: 'Мягкие оттенки, романтика, без резкости.',
    emoji: '☁️',
    celebration: 'Поймала очень мягкий вайб.',
    swatch: ['#f8d8df', '#fff5ef', '#f6e0cb'],
  },
  {
    id: 'bright',
    label: 'Ярко и живо',
    hint: 'Чтобы букет добавлял энергии и настроения.',
    emoji: '🍊',
    celebration: 'Любишь, когда букет не молчит.',
    swatch: ['#ffbf69', '#ffd166', '#ef476f'],
  },
  {
    id: 'elegant',
    label: 'Собранно и элегантно',
    hint: 'Чисто, красиво, благородно и без хаоса.',
    emoji: '🎀',
    celebration: 'Вкус на аккуратную красоту принят.',
    swatch: ['#fff8ef', '#d8d2ca', '#dbcaf2'],
  },
  {
    id: 'dramatic',
    label: 'Вау, с характером',
    hint: 'Можно смелее, заметнее и немного театральнее.',
    emoji: '🔥',
    celebration: 'Любишь, когда букет умеет произвести впечатление.',
    swatch: ['#5f0f40', '#9a031e', '#f4a261'],
  },
]

export const paletteOptions: VisualOption<PaletteId>[] = [
  {
    id: 'blush',
    label: 'Пудрово-розовый',
    hint: 'Нежный, романтичный и спокойный.',
    emoji: '🩰',
    celebration: 'Пастель пошла в сердечко.',
    swatch: ['#f8d8df', '#f9e6eb', '#f6c8d4'],
  },
  {
    id: 'cream',
    label: 'Кремово-молочный',
    hint: 'Чисто, спокойно и дорого выглядит.',
    emoji: '🥛',
    celebration: 'Светлая палитра всегда выручает.',
    swatch: ['#fff8ef', '#f5efe2', '#ece5d8'],
  },
  {
    id: 'peach',
    label: 'Персиковый',
    hint: 'Тепло, мягко и нежно без приторности.',
    emoji: '🍑',
    celebration: 'Теплый оттенок выбран.',
    swatch: ['#ffc6a8', '#ffd9bf', '#ffb997'],
  },
  {
    id: 'berry',
    label: 'Ягодный',
    hint: 'Глубже, насыщеннее, но еще романтично.',
    emoji: '🍓',
    celebration: 'Есть запрос на насыщенный цвет.',
    swatch: ['#8f2d56', '#b93168', '#d95980'],
  },
  {
    id: 'yellow',
    label: 'Солнечный желтый',
    hint: 'Весело, тепло и очень живо.',
    emoji: '🌼',
    celebration: 'Солнечный цвет добавлен.',
    swatch: ['#ffd166', '#ffe28a', '#f7b801'],
  },
  {
    id: 'red',
    label: 'Красный акцент',
    hint: 'Страстно, заметно, не для каждого повода.',
    emoji: '❤️',
    celebration: 'В палитре разрешена страсть.',
    swatch: ['#c1121f', '#e5383b', '#780000'],
  },
  {
    id: 'lilac',
    label: 'Сиреневый',
    hint: 'Нежно, свежо и чуть более необычно.',
    emoji: '💜',
    celebration: 'Сирень добавляет характер.',
    swatch: ['#cdb4db', '#d9c2f0', '#b8a1d9'],
  },
  {
    id: 'green',
    label: 'Зеленый акцент',
    hint: 'Свежесть, ботаничность, ощущение воздуха.',
    emoji: '🍃',
    celebration: 'Любовь к свежести засчитана.',
    swatch: ['#adc178', '#dde5b6', '#6a994e'],
  },
]

export const shapeOptions: VisualOption<ShapeId>[] = [
  {
    id: 'airy',
    label: 'Воздух и легкость',
    hint: 'Как будто букет собран не по линейке.',
    emoji: '🫧',
    celebration: 'Выбрана легкая и живая форма.',
  },
  {
    id: 'neat',
    label: 'Аккуратно и чисто',
    hint: 'Собранно, спокойно и без визуального шума.',
    emoji: '📏',
    celebration: 'Есть любовь к чистому силуэту.',
  },
  {
    id: 'mono',
    label: 'Лучше один герой',
    hint: 'Один тип цветка звучит понятнее, чем микс.',
    emoji: '🌷',
    celebration: 'Моно-букеты вышли в плюс.',
  },
  {
    id: 'lush',
    label: 'Пышно и щедро',
    hint: 'Когда хочется объема и эффекта подарка.',
    emoji: '🎁',
    celebration: 'Пышность одобрена.',
  },
]

export const gestureLevelOptions: VisualOption<GestureLevelId>[] = [
  {
    id: 'quiet',
    label: 'Мило, без пафоса',
    hint: 'Лучше трогательно, чем громко.',
    emoji: '🤍',
    celebration: 'Ставка на деликатность сохранена.',
  },
  {
    id: 'balanced',
    label: 'Заметно, но уместно',
    hint: 'Хочется красиво, но без перебора.',
    emoji: '✨',
    celebration: 'Найден очень жизненный баланс.',
  },
  {
    id: 'grand',
    label: 'Люблю когда прям вау',
    hint: 'Можно щедро, заметно и с жестом.',
    emoji: '💥',
    celebration: 'Разрешение на вау-эффект получено.',
  },
]

export const flowerOptions: VisualOption<FlowerFamilyId>[] = [
  {
    id: 'peonies',
    label: 'Пионы',
    hint: 'Мягкие, пышные, романтичные.',
    emoji: '🌸',
    celebration: 'Пионы практически всегда выглядят как комплимент.',
    swatch: ['#f6c8d4', '#f8d8df', '#fff5ef'],
  },
  {
    id: 'tulips',
    label: 'Тюльпаны',
    hint: 'Легкие, чистые и очень понятные.',
    emoji: '🌷',
    celebration: 'Тюльпаны делают все проще и свежее.',
    swatch: ['#ff8fab', '#ffd166', '#f8f9fa'],
  },
  {
    id: 'ranunculus',
    label: 'Ранункулюсы',
    hint: 'Изящные, собранные, нежные.',
    emoji: '🪷',
    celebration: 'Очень красивый и аккуратный выбор.',
    swatch: ['#f9bec7', '#eddcd2', '#dbcaf2'],
  },
  {
    id: 'roses',
    label: 'Розы',
    hint: 'От супер-безопасно до слишком громко.',
    emoji: '🌹',
    celebration: 'Розы оставляем в игре, но с нюансами.',
    swatch: ['#f28482', '#f5cac3', '#c1121f'],
  },
  {
    id: 'hydrangeas',
    label: 'Гортензии',
    hint: 'Объем, мягкость и вау-фактура.',
    emoji: '🫧',
    celebration: 'Есть интерес к более фактурным букетам.',
    swatch: ['#cdb4db', '#bde0fe', '#eff7f6'],
  },
  {
    id: 'wildflowers',
    label: 'Полевой вайб',
    hint: 'Свежо, мило, живо и не слишком формально.',
    emoji: '🌼',
    celebration: 'Поймано ощущение “будто собрали специально для меня”.',
    swatch: ['#ffd166', '#adc178', '#fff8ef'],
  },
  {
    id: 'lilies',
    label: 'Лилии',
    hint: 'Выразительный аромат и очень спорные ассоциации.',
    emoji: '🤍',
    celebration: 'Отметила важный ароматный маркер.',
    swatch: ['#fff8ef', '#ffe8cc', '#f4d35e'],
  },
  {
    id: 'chrysanthemums',
    label: 'Хризантемы',
    hint: 'Практичные, но романтический вайб читается не всегда.',
    emoji: '🌼',
    celebration: 'Полезный стоп-сигнал для скучных букетов.',
    swatch: ['#f7ede2', '#f6bd60', '#84a59d'],
  },
]

export const bouquets: BouquetCardData[] = [
  {
    id: 'peony-cloud',
    title: 'Пионовое облако',
    subtitle: 'Мягко, объемно и очень комплиментарно',
    note: 'Без официоза, но с ощущением “я старался”.',
    colors: ['#f6c8d4', '#f8d8df', '#fff8ef', '#f6e0cb'],
    photoUrl: unsplashPhoto('photo-1656056970279-0cdd04b60434'),
    emoji: '🌸',
    vibes: ['soft', 'elegant'],
    shapes: ['airy', 'lush'],
    flowerFamilies: ['peonies', 'ranunculus'],
    occasions: ['everyday', 'birthday', 'achievement'],
    intensity: 'balanced',
    universal: true,
  },
  {
    id: 'tulip-ribbon',
    title: 'Ленточные тюльпаны',
    subtitle: 'Чисто, просто и очень уместно',
    note: 'Идеально, когда хочется подарить цветы без пафоса.',
    colors: ['#ff8fab', '#ffd166', '#fff8ef', '#adc178'],
    photoUrl: unsplashPhoto('photo-1615385639736-362b69696227'),
    emoji: '🌷',
    vibes: ['soft', 'bright'],
    shapes: ['neat', 'mono'],
    flowerFamilies: ['tulips'],
    occasions: ['everyday', 'achievement'],
    intensity: 'quiet',
    universal: true,
  },
  {
    id: 'cream-rose',
    title: 'Кремовые розы без пафоса',
    subtitle: 'Классика, но спокойная и взрослая',
    note: 'Подходит, когда нужен элегантный жест без драмы.',
    colors: ['#fff8ef', '#f5efe2', '#f8d8df'],
    photoUrl: unsplashPhoto('photo-1559779080-6970e0186790'),
    emoji: '🌹',
    vibes: ['soft', 'elegant'],
    shapes: ['neat', 'mono'],
    flowerFamilies: ['roses'],
    occasions: ['everyday', 'birthday', 'apology'],
    intensity: 'balanced',
    universal: true,
  },
  {
    id: 'ranunculus-air',
    title: 'Ранункулюсы и воздух',
    subtitle: 'Изящно, легко и очень “с заботой”',
    note: 'Букет для человека, который считывает детали.',
    colors: ['#f9bec7', '#eddcd2', '#dbcaf2', '#fff8ef'],
    photoUrl: unsplashPhoto('photo-1684473339098-dfccf406c68e'),
    emoji: '🪷',
    vibes: ['soft', 'elegant'],
    shapes: ['airy', 'neat'],
    flowerFamilies: ['ranunculus'],
    occasions: ['everyday', 'birthday'],
    intensity: 'quiet',
    universal: true,
  },
  {
    id: 'sunny-field',
    title: 'Солнечный полевой микс',
    subtitle: 'Легкий, живой, как хорошее настроение',
    note: 'Работает, если нравится ощущение свежести и неидеальности.',
    colors: ['#ffd166', '#adc178', '#ffc6a8', '#fff8ef'],
    photoUrl: unsplashPhoto('photo-1628363462308-68313cc1470b'),
    emoji: '🌼',
    vibes: ['bright', 'soft'],
    shapes: ['airy', 'lush'],
    flowerFamilies: ['wildflowers', 'tulips'],
    occasions: ['everyday', 'achievement'],
    intensity: 'balanced',
    universal: false,
  },
  {
    id: 'hydrangea-glow',
    title: 'Гортензии в объеме',
    subtitle: 'Фактурно, заметно и по-праздничному',
    note: 'Лучше на событие, чем на обычный день.',
    colors: ['#cdb4db', '#bde0fe', '#eff7f6', '#adc178'],
    photoUrl: unsplashPhoto('photo-1660549071168-e71c087ef09e'),
    emoji: '🫧',
    vibes: ['elegant', 'dramatic'],
    shapes: ['lush'],
    flowerFamilies: ['hydrangeas', 'roses'],
    occasions: ['birthday', 'achievement'],
    intensity: 'grand',
    universal: false,
    caution: 'Может быть слишком заметным для обычной встречи.',
  },
  {
    id: 'red-rose-grand',
    title: 'Красные розы в вау-режиме',
    subtitle: 'Сильный жест и очень конкретное настроение',
    note: 'Красиво, но не “по умолчанию” и не на каждый день.',
    colors: ['#c1121f', '#9a031e', '#f4a261', '#780000'],
    photoUrl: unsplashPhoto('photo-1608027790251-5e0c80d043d9'),
    emoji: '❤️',
    vibes: ['dramatic', 'elegant'],
    shapes: ['mono', 'lush'],
    flowerFamilies: ['roses'],
    occasions: ['birthday', 'apology'],
    intensity: 'grand',
    universal: false,
    caution: 'Для обычного повода может ощущаться слишком громко.',
  },
  {
    id: 'lily-parade',
    title: 'Лилии с сильным ароматом',
    subtitle: 'Очень заметно и очень на любителя',
    note: 'Точно не самый безопасный вариант, если вкус не обсужден.',
    colors: ['#fff8ef', '#ffe8cc', '#f4d35e', '#adc178'],
    photoUrl: unsplashPhoto('photo-1712258090342-f31b387221a3'),
    emoji: '🤍',
    vibes: ['elegant'],
    shapes: ['lush'],
    flowerFamilies: ['lilies'],
    occasions: ['birthday', 'apology'],
    intensity: 'grand',
    universal: false,
    caution: 'Аромат и ассоциации могут резко не зайти.',
  },
  {
    id: 'rainbow-market',
    title: 'Радужный маркет-микс',
    subtitle: 'Ярко, громко и немного случайно',
    note: 'Иногда выглядит как “взял первое, что было”.',
    colors: ['#ffd166', '#ef476f', '#cdb4db', '#adc178'],
    photoUrl: unsplashPhoto('photo-1596047510164-c33ea1025eae'),
    emoji: '🎉',
    vibes: ['bright'],
    shapes: ['lush'],
    flowerFamilies: ['chrysanthemums', 'roses', 'wildflowers'],
    occasions: ['birthday'],
    intensity: 'grand',
    universal: false,
    caution: 'Есть риск выглядеть небрежно и безлично.',
  },
]

export const questions: Question[] = [
  {
    id: 'vibe',
    field: 'vibe',
    type: 'single',
    eyebrow: 'Шаг 1',
    title: 'Какой букет вообще ощущается “моим”?',
    subtitle: 'Выбираем общий вайб без сложных терминов.',
    options: vibeOptions,
  },
  {
    id: 'palette',
    field: 'palette',
    type: 'multi',
    eyebrow: 'Шаг 2',
    title: 'Какие оттенки радуют глаз?',
    subtitle: 'Можно выбрать несколько. Это станет твоей базовой палитрой.',
    helper: 'Совет: 2-3 оттенка обычно достаточно.',
    options: paletteOptions,
    minSelections: 1,
    maxSelections: 3,
  },
  {
    id: 'shape',
    field: 'shape',
    type: 'single',
    eyebrow: 'Шаг 3',
    title: 'По форме ближе что?',
    subtitle: 'Не про цветы, а про ощущение от букета целиком.',
    options: shapeOptions,
  },
  {
    id: 'gestureLevel',
    field: 'gestureLevel',
    type: 'single',
    eyebrow: 'Шаг 4',
    title: 'Насколько “громким” может быть букет?',
    subtitle: 'Чтобы потом было легче отличить мило от слишком сильно.',
    options: gestureLevelOptions,
  },
  {
    id: 'likedFlowers',
    field: 'likedFlowers',
    type: 'multi',
    eyebrow: 'Шаг 5',
    title: 'Какие цветы вообще хочется видеть чаще?',
    subtitle: 'Выбираем фаворитов. Это сильнее всего влияет на финальный список.',
    helper: 'Можно отметить несколько любимчиков.',
    options: flowerOptions,
    minSelections: 1,
  },
  {
    id: 'bouquetReactions',
    field: 'bouquetReactions',
    type: 'bouquet',
    eyebrow: 'Шаг 6',
    title: 'Мини Flinder: оцени примеры букетов',
    subtitle: 'Лайк, “ну может быть” или “нет, спасибо”.',
    helper: 'Нужно оценить хотя бы 4 примера.',
    bouquetIds: bouquets.map((bouquet) => bouquet.id),
    minSelections: 4,
  },
  {
    id: 'avoidFlowers',
    field: 'avoidFlowers',
    type: 'multi',
    eyebrow: 'Шаг 7',
    title: 'Что лучше вообще не дарить?',
    subtitle: 'Если запретов нет, шаг можно пропустить.',
    helper: 'Отмеченное здесь попадет в секцию “никогда не бери”.',
    options: flowerOptions,
    minSelections: 0,
  },
]

export const reactionLabels: Record<BouquetReaction, string> = {
  like: 'Очень да',
  maybe: 'Нормально',
  no: 'Нет',
}

export const vibeLabelMap = Object.fromEntries(
  vibeOptions.map((option) => [option.id, option.label]),
) as Record<VibeId, string>

export const paletteLabelMap = Object.fromEntries(
  paletteOptions.map((option) => [option.id, option.label]),
) as Record<PaletteId, string>

export const shapeLabelMap = Object.fromEntries(
  shapeOptions.map((option) => [option.id, option.label]),
) as Record<ShapeId, string>

export const gestureLabelMap = Object.fromEntries(
  gestureLevelOptions.map((option) => [option.id, option.label]),
) as Record<GestureLevelId, string>

export const flowerLabelMap = Object.fromEntries(
  flowerOptions.map((option) => [option.id, option.label]),
) as Record<FlowerFamilyId, string>

export const occasionLabelMap: Record<OccasionId, string> = {
  everyday: 'На обычный день',
  birthday: 'На день рождения',
  apology: 'Когда нужно извиниться',
  achievement: 'На праздник или достижение',
}

export const occasionReasonMap: Record<OccasionId, string> = {
  everyday: 'для обычного дня',
  birthday: 'для дня рождения',
  apology: 'для ситуации, где нужен теплый жест',
  achievement: 'для поздравления и красивого повода',
}

export const optionSwatches = {
  palette: Object.fromEntries(
    paletteOptions.map((option) => [option.id, option.swatch ?? []]),
  ) as Record<PaletteId, string[]>,
  flowers: Object.fromEntries(
    flowerOptions.map((option) => [option.id, option.swatch ?? []]),
  ) as Record<FlowerFamilyId, string[]>,
}

export const validIds = {
  vibes: new Set(vibeOptions.map((option) => option.id)),
  palette: new Set(paletteOptions.map((option) => option.id)),
  shapes: new Set(shapeOptions.map((option) => option.id)),
  gestures: new Set(gestureLevelOptions.map((option) => option.id)),
  flowers: new Set(flowerOptions.map((option) => option.id)),
  bouquets: new Set(bouquets.map((bouquet) => bouquet.id)),
}
