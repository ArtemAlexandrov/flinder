import type {
  AnswerState,
  BouquetCardData,
  BouquetReaction,
  FlowerFamilyId,
  GestureLevelId,
  LocalizedText,
  Locale,
  OccasionId,
  PaletteId,
  Question,
  ShapeId,
  VibeId,
  VisualOption,
} from './types'
import { textOf } from './content'

const l = (ru: string, en: string): LocalizedText => ({ ru, en })

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
    label: l('Нежно и воздушно', 'Soft and airy'),
    hint: l(
      'Мягкие оттенки, романтика, без резкости.',
      'Powdery tones, romance, and nothing too sharp.',
    ),
    emoji: '☁️',
    celebration: l('Поймала очень мягкий вайб.', 'Very soft bouquet energy, noted.'),
    swatch: ['#f8d8df', '#fff5ef', '#f6e0cb'],
  },
  {
    id: 'bright',
    label: l('Ярко и живо', 'Bright and lively'),
    hint: l(
      'Чтобы букет добавлял энергии и настроения.',
      'A bouquet that instantly adds energy and good mood.',
    ),
    emoji: '🍊',
    celebration: l('Любишь, когда букет не молчит.', 'So she likes flowers that do not whisper.'),
    swatch: ['#ffbf69', '#ffd166', '#ef476f'],
  },
  {
    id: 'elegant',
    label: l('Собранно и элегантно', 'Clean and elegant'),
    hint: l(
      'Чисто, красиво, благородно и без хаоса.',
      'Polished, refined, and never visually messy.',
    ),
    emoji: '🎀',
    celebration: l('Вкус на аккуратную красоту принят.', 'Elegant taste locked in.'),
    swatch: ['#fff8ef', '#d8d2ca', '#dbcaf2'],
  },
  {
    id: 'dramatic',
    label: l('Вау, с характером', 'Bold, with presence'),
    hint: l(
      'Можно смелее, заметнее и немного театральнее.',
      'A little stronger, bolder, and more dramatic is allowed.',
    ),
    emoji: '🔥',
    celebration: l(
      'Любишь, когда букет умеет произвести впечатление.',
      'Okay, she likes a bouquet that can make an entrance.',
    ),
    swatch: ['#5f0f40', '#9a031e', '#f4a261'],
  },
]

export const paletteOptions: VisualOption<PaletteId>[] = [
  {
    id: 'blush',
    label: l('Пудрово-розовый', 'Blush pink'),
    hint: l('Нежный, романтичный и спокойный.', 'Soft, romantic, and calm.'),
    emoji: '🩰',
    celebration: l('Пастель пошла в сердечко.', 'Pastel tones made the cut.'),
    swatch: ['#f8d8df', '#f9e6eb', '#f6c8d4'],
  },
  {
    id: 'cream',
    label: l('Кремово-молочный', 'Creamy white'),
    hint: l('Чисто, спокойно и дорого выглядит.', 'Clean, calm, and expensive-looking.'),
    emoji: '🥛',
    celebration: l('Светлая палитра всегда выручает.', 'Light palettes are always safe.'),
    swatch: ['#fff8ef', '#f5efe2', '#ece5d8'],
  },
  {
    id: 'peach',
    label: l('Персиковый', 'Peach'),
    hint: l('Тепло, мягко и нежно без приторности.', 'Warm and soft without becoming sugary.'),
    emoji: '🍑',
    celebration: l('Теплый оттенок выбран.', 'A warm tone is officially in.'),
    swatch: ['#ffc6a8', '#ffd9bf', '#ffb997'],
  },
  {
    id: 'berry',
    label: l('Ягодный', 'Berry'),
    hint: l('Глубже, насыщеннее, но еще романтично.', 'Deeper, richer, still romantic.'),
    emoji: '🍓',
    celebration: l('Есть запрос на насыщенный цвет.', 'There is definitely room for richer color.'),
    swatch: ['#8f2d56', '#b93168', '#d95980'],
  },
  {
    id: 'yellow',
    label: l('Солнечный желтый', 'Sunny yellow'),
    hint: l('Весело, тепло и очень живо.', 'Happy, warm, and very alive.'),
    emoji: '🌼',
    celebration: l('Солнечный цвет добавлен.', 'Sunshine is now part of the palette.'),
    swatch: ['#ffd166', '#ffe28a', '#f7b801'],
  },
  {
    id: 'red',
    label: l('Красный акцент', 'Red accent'),
    hint: l('Страстно, заметно, не для каждого повода.', 'Passionate and strong, but not for every moment.'),
    emoji: '❤️',
    celebration: l('В палитре разрешена страсть.', 'Bold romantic color is allowed.'),
    swatch: ['#c1121f', '#e5383b', '#780000'],
  },
  {
    id: 'lilac',
    label: l('Сиреневый', 'Lilac'),
    hint: l('Нежно, свежо и чуть более необычно.', 'Soft, fresh, and a little less expected.'),
    emoji: '💜',
    celebration: l('Сирень добавляет характер.', 'Lilac adds a nice bit of personality.'),
    swatch: ['#cdb4db', '#d9c2f0', '#b8a1d9'],
  },
  {
    id: 'green',
    label: l('Зеленый акцент', 'Fresh green'),
    hint: l('Свежесть, ботаничность, ощущение воздуха.', 'Fresh, botanical, airy.'),
    emoji: '🍃',
    celebration: l('Любовь к свежести засчитана.', 'Freshness has been officially noted.'),
    swatch: ['#adc178', '#dde5b6', '#6a994e'],
  },
]

export const shapeOptions: VisualOption<ShapeId>[] = [
  {
    id: 'airy',
    label: l('Воздух и легкость', 'Airy and loose'),
    hint: l(
      'Как будто букет собран не по линейке.',
      'Like it was arranged with taste, not a ruler.',
    ),
    emoji: '🫧',
    celebration: l('Выбрана легкая и живая форма.', 'Light and effortless shape selected.'),
  },
  {
    id: 'neat',
    label: l('Аккуратно и чисто', 'Neat and clean'),
    hint: l(
      'Собранно, спокойно и без визуального шума.',
      'Structured, calm, and free of visual noise.',
    ),
    emoji: '📏',
    celebration: l('Есть любовь к чистому силуэту.', 'There is love for a clean silhouette.'),
  },
  {
    id: 'mono',
    label: l('Лучше один герой', 'One hero is enough'),
    hint: l(
      'Один тип цветка звучит понятнее, чем микс.',
      'One flower type can feel much more intentional than a mix.',
    ),
    emoji: '🌷',
    celebration: l('Моно-букеты вышли в плюс.', 'Monofloral bouquets are clearly welcome.'),
  },
  {
    id: 'lush',
    label: l('Пышно и щедро', 'Full and generous'),
    hint: l(
      'Когда хочется объема и эффекта подарка.',
      'For moments when volume and gift energy really matter.',
    ),
    emoji: '🎁',
    celebration: l('Пышность одобрена.', 'Full bouquet energy approved.'),
  },
]

export const gestureLevelOptions: VisualOption<GestureLevelId>[] = [
  {
    id: 'quiet',
    label: l('Мило, без пафоса', 'Sweet, not loud'),
    hint: l('Лучше трогательно, чем громко.', 'Better tender than dramatic.'),
    emoji: '🤍',
    celebration: l('Ставка на деликатность сохранена.', 'Delicate gift energy saved.'),
  },
  {
    id: 'balanced',
    label: l('Заметно, но уместно', 'Noticeable, but tasteful'),
    hint: l('Хочется красиво, но без перебора.', 'Beautiful, but still appropriate.'),
    emoji: '✨',
    celebration: l('Найден очень жизненный баланс.', 'A very practical balance has been found.'),
  },
  {
    id: 'grand',
    label: l('Люблю когда прям вау', 'I like a real wow moment'),
    hint: l('Можно щедро, заметно и с жестом.', 'Go generous, visible, and celebratory.'),
    emoji: '💥',
    celebration: l('Разрешение на вау-эффект получено.', 'Permission for a wow moment granted.'),
  },
]

export const flowerOptions: VisualOption<FlowerFamilyId>[] = [
  {
    id: 'peonies',
    label: l('Пионы', 'Peonies'),
    hint: l('Мягкие, пышные, романтичные.', 'Soft, lush, and romantic.'),
    emoji: '🌸',
    celebration: l(
      'Пионы практически всегда выглядят как комплимент.',
      'Peonies almost always feel like a compliment.',
    ),
    swatch: ['#f6c8d4', '#f8d8df', '#fff5ef'],
  },
  {
    id: 'tulips',
    label: l('Тюльпаны', 'Tulips'),
    hint: l('Легкие, чистые и очень понятные.', 'Light, clean, and beautifully simple.'),
    emoji: '🌷',
    celebration: l('Тюльпаны делают все проще и свежее.', 'Tulips make everything feel easier and fresher.'),
    swatch: ['#ff8fab', '#ffd166', '#f8f9fa'],
  },
  {
    id: 'ranunculus',
    label: l('Ранункулюсы', 'Ranunculus'),
    hint: l('Изящные, собранные, нежные.', 'Elegant, refined, and soft.'),
    emoji: '🪷',
    celebration: l('Очень красивый и аккуратный выбор.', 'A very refined favorite choice.'),
    swatch: ['#f9bec7', '#eddcd2', '#dbcaf2'],
  },
  {
    id: 'roses',
    label: l('Розы', 'Roses'),
    hint: l('От супер-безопасно до слишком громко.', 'From very safe to way too much, depending on the style.'),
    emoji: '🌹',
    celebration: l('Розы оставляем в игре, но с нюансами.', 'Roses stay in play, with nuance.'),
    swatch: ['#f28482', '#f5cac3', '#c1121f'],
  },
  {
    id: 'hydrangeas',
    label: l('Гортензии', 'Hydrangeas'),
    hint: l('Объем, мягкость и вау-фактура.', 'Volume, softness, and a real wow texture.'),
    emoji: '🫧',
    celebration: l('Есть интерес к более фактурным букетам.', 'There is interest in more textured bouquets.'),
    swatch: ['#cdb4db', '#bde0fe', '#eff7f6'],
  },
  {
    id: 'wildflowers',
    label: l('Полевой вайб', 'Wildflower vibe'),
    hint: l('Свежо, мило, живо и не слишком формально.', 'Fresh, sweet, alive, and not too formal.'),
    emoji: '🌼',
    celebration: l(
      'Поймано ощущение “будто собрали специально для меня”.',
      'That “made especially for me” feeling has been captured.',
    ),
    swatch: ['#ffd166', '#adc178', '#fff8ef'],
  },
  {
    id: 'lilies',
    label: l('Лилии', 'Lilies'),
    hint: l(
      'Выразительный аромат и очень спорные ассоциации.',
      'A strong scent and very specific associations.',
    ),
    emoji: '🤍',
    celebration: l('Отмечен важный ароматный маркер.', 'An important scent signal has been noted.'),
    swatch: ['#fff8ef', '#ffe8cc', '#f4d35e'],
  },
  {
    id: 'chrysanthemums',
    label: l('Хризантемы', 'Chrysanthemums'),
    hint: l(
      'Практичные, но романтический вайб читается не всегда.',
      'Practical, but not always romantic in the way you want.',
    ),
    emoji: '🌼',
    celebration: l('Полезный стоп-сигнал для скучных букетов.', 'A very useful stop-signal for generic bouquets.'),
    swatch: ['#f7ede2', '#f6bd60', '#84a59d'],
  },
]

export const bouquets: BouquetCardData[] = [
  {
    id: 'peony-cloud',
    title: l('Пионовое облако', 'Peony cloud'),
    subtitle: l(
      'Мягко, объемно и очень комплиментарно',
      'Soft, full, and effortlessly flattering',
    ),
    note: l(
      'Без официоза, но с ощущением “я старался”.',
      'No stiffness, but it still says “I clearly put thought into this.”',
    ),
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
    title: l('Ленточные тюльпаны', 'Ribbon tulips'),
    subtitle: l('Чисто, просто и очень уместно', 'Clean, simple, and very easy to get right'),
    note: l(
      'Идеально, когда хочется подарить цветы без пафоса.',
      'Perfect when you want flowers without overdoing the gesture.',
    ),
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
    title: l('Кремовые розы без пафоса', 'Cream roses without the drama'),
    subtitle: l(
      'Классика, но спокойная и взрослая',
      'A classic look, but calmer and more grown-up',
    ),
    note: l(
      'Подходит, когда нужен элегантный жест без драмы.',
      'A good option when the gesture should feel elegant, not intense.',
    ),
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
    title: l('Ранункулюсы и воздух', 'Ranunculus and air'),
    subtitle: l(
      'Изящно, легко и очень “с заботой”',
      'Refined, light, and very intentionally caring',
    ),
    note: l(
      'Букет для человека, который считывает детали.',
      'A bouquet for someone who notices thoughtful details.',
    ),
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
    title: l('Солнечный полевой микс', 'Sunny field mix'),
    subtitle: l(
      'Легкий, живой, как хорошее настроение',
      'Light, fresh, and full of easy good mood',
    ),
    note: l(
      'Работает, если нравится ощущение свежести и неидеальности.',
      'Works beautifully if she likes freshness and a less “perfect” arrangement.',
    ),
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
    title: l('Гортензии в объеме', 'Hydrangea glow'),
    subtitle: l(
      'Фактурно, заметно и по-праздничному',
      'Textured, visible, and very celebration-coded',
    ),
    note: l(
      'Лучше на событие, чем на обычный день.',
      'Better for a real occasion than for an ordinary date.',
    ),
    colors: ['#cdb4db', '#bde0fe', '#eff7f6', '#adc178'],
    photoUrl: unsplashPhoto('photo-1660549071168-e71c087ef09e'),
    emoji: '🫧',
    vibes: ['elegant', 'dramatic'],
    shapes: ['lush'],
    flowerFamilies: ['hydrangeas', 'roses'],
    occasions: ['birthday', 'achievement'],
    intensity: 'grand',
    universal: false,
    caution: l(
      'Может быть слишком заметным для обычной встречи.',
      'Might feel too big for an ordinary casual meetup.',
    ),
  },
  {
    id: 'red-rose-grand',
    title: l('Красные розы в вау-режиме', 'Grand red roses'),
    subtitle: l(
      'Сильный жест и очень конкретное настроение',
      'A strong gesture with a very specific emotional tone',
    ),
    note: l(
      'Красиво, но не “по умолчанию” и не на каждый день.',
      'Beautiful, but definitely not an automatic default choice.',
    ),
    colors: ['#c1121f', '#9a031e', '#f4a261', '#780000'],
    photoUrl: unsplashPhoto('photo-1608027790251-5e0c80d043d9'),
    emoji: '❤️',
    vibes: ['dramatic', 'elegant'],
    shapes: ['mono', 'lush'],
    flowerFamilies: ['roses'],
    occasions: ['birthday', 'apology'],
    intensity: 'grand',
    universal: false,
    caution: l(
      'Для обычного повода может ощущаться слишком громко.',
      'For a normal day it may feel too loud and too loaded.',
    ),
  },
  {
    id: 'lily-parade',
    title: l('Лилии с сильным ароматом', 'Strong-scent lily bouquet'),
    subtitle: l(
      'Очень заметно и очень на любителя',
      'Very noticeable and very much an acquired taste',
    ),
    note: l(
      'Точно не самый безопасный вариант, если вкус не обсужден.',
      'Definitely not the safest option if preferences were never discussed.',
    ),
    colors: ['#fff8ef', '#ffe8cc', '#f4d35e', '#adc178'],
    photoUrl: unsplashPhoto('photo-1712258090342-f31b387221a3'),
    emoji: '🤍',
    vibes: ['elegant'],
    shapes: ['lush'],
    flowerFamilies: ['lilies'],
    occasions: ['birthday', 'apology'],
    intensity: 'grand',
    universal: false,
    caution: l(
      'Аромат и ассоциации могут резко не зайти.',
      'The scent and associations can be an immediate hard no.',
    ),
  },
  {
    id: 'rainbow-market',
    title: l('Радужный маркет-микс', 'Rainbow market mix'),
    subtitle: l(
      'Ярко, громко и немного случайно',
      'Bright, loud, and a little too random',
    ),
    note: l(
      'Иногда выглядит как “взял первое, что было”.',
      'Sometimes reads as “I just picked whatever was there.”',
    ),
    colors: ['#ffd166', '#ef476f', '#cdb4db', '#adc178'],
    photoUrl: unsplashPhoto('photo-1596047510164-c33ea1025eae'),
    emoji: '🎉',
    vibes: ['bright'],
    shapes: ['lush'],
    flowerFamilies: ['chrysanthemums', 'roses', 'wildflowers'],
    occasions: ['birthday'],
    intensity: 'grand',
    universal: false,
    caution: l(
      'Есть риск выглядеть небрежно и безлично.',
      'High risk of feeling generic and not very thoughtful.',
    ),
  },
]

export const questions: Question[] = [
  {
    id: 'vibe',
    field: 'vibe',
    type: 'single',
    eyebrow: l('Шаг 1', 'Step 1'),
    title: l('Какой букет вообще ощущается “моим”?', 'What bouquet style feels like “me”?'),
    subtitle: l(
      'Выбираем общий вайб без сложных терминов.',
      'Pick the overall vibe first, without any flower jargon.',
    ),
    options: vibeOptions,
  },
  {
    id: 'palette',
    field: 'palette',
    type: 'multi',
    eyebrow: l('Шаг 2', 'Step 2'),
    title: l('Какие оттенки радуют глаз?', 'Which color palette feels right?'),
    subtitle: l(
      'Можно выбрать несколько. Это станет твоей базовой палитрой.',
      'Pick a few. This becomes the base palette for the final report.',
    ),
    helper: l('Совет: 2-3 оттенка обычно достаточно.', 'Tip: 2-3 tones are usually enough.'),
    options: paletteOptions,
    minSelections: 1,
    maxSelections: 3,
  },
  {
    id: 'shape',
    field: 'shape',
    type: 'single',
    eyebrow: l('Шаг 3', 'Step 3'),
    title: l('По форме ближе что?', 'Which bouquet shape feels closest?'),
    subtitle: l(
      'Не про цветы, а про ощущение от букета целиком.',
      'Not about the flowers themselves, but about the full bouquet silhouette.',
    ),
    options: shapeOptions,
  },
  {
    id: 'gestureLevel',
    field: 'gestureLevel',
    type: 'single',
    eyebrow: l('Шаг 4', 'Step 4'),
    title: l('Насколько “громким” может быть букет?', 'How loud can the bouquet gesture be?'),
    subtitle: l(
      'Чтобы потом было легче отличить мило от слишком сильно.',
      'This helps separate “sweet” from “too much” later on.',
    ),
    options: gestureLevelOptions,
  },
  {
    id: 'likedFlowers',
    field: 'likedFlowers',
    type: 'multi',
    eyebrow: l('Шаг 5', 'Step 5'),
    title: l(
      'Какие цветы вообще хочется видеть чаще?',
      'Which flowers would she actually love seeing more often?',
    ),
    subtitle: l(
      'Выбираем фаворитов. Это сильнее всего влияет на финальный список.',
      'Pick favorites. These shape the final recommendation set the most.',
    ),
    helper: l('Можно отметить несколько любимчиков.', 'You can pick several favorites.'),
    options: flowerOptions,
    minSelections: 1,
  },
  {
    id: 'bouquetReactions',
    field: 'bouquetReactions',
    type: 'bouquet',
    eyebrow: l('Шаг 6', 'Step 6'),
    title: l('Мини Flinder: оцени примеры букетов', 'Mini Flinder: react to bouquet examples'),
    subtitle: l(
      'Лайк, “ну может быть” или “нет, спасибо”.',
      'Use love it, maybe, or no thanks.',
    ),
    helper: l('Нужно оценить хотя бы 4 примера.', 'Rate at least 4 examples.'),
    bouquetIds: bouquets.map((bouquet) => bouquet.id),
    minSelections: 4,
  },
  {
    id: 'avoidFlowers',
    field: 'avoidFlowers',
    type: 'multi',
    eyebrow: l('Шаг 7', 'Step 7'),
    title: l('Что лучше вообще не дарить?', 'What should never be in the bouquet?'),
    subtitle: l(
      'Если запретов нет, шаг можно пропустить.',
      'If there are no hard no’s, this step can be skipped.',
    ),
    helper: l(
      'Отмеченное здесь попадет в секцию “никогда не бери”.',
      'Anything selected here becomes part of the “never buy this” section.',
    ),
    options: flowerOptions,
    minSelections: 0,
  },
]

export const reactionLabels: Record<Locale, Record<BouquetReaction, string>> = {
  ru: {
    like: 'Очень да',
    maybe: 'Норм',
    no: 'Нет',
  },
  en: {
    like: 'Love it',
    maybe: 'Maybe',
    no: 'Nope',
  },
}

export const occasionLabelMap: Record<Locale, Record<OccasionId, string>> = {
  ru: {
    everyday: 'На обычный день',
    birthday: 'На день рождения',
    apology: 'Когда нужно извиниться',
    achievement: 'На праздник или достижение',
  },
  en: {
    everyday: 'For an ordinary day',
    birthday: 'For a birthday',
    apology: 'For an apology',
    achievement: 'For a celebration',
  },
}

export const occasionReasonMap: Record<Locale, Record<OccasionId, string>> = {
  ru: {
    everyday: 'для обычного дня',
    birthday: 'для дня рождения',
    apology: 'для ситуации, где нужен теплый жест',
    achievement: 'для поздравления и красивого повода',
  },
  en: {
    everyday: 'for an everyday date',
    birthday: 'for a birthday',
    apology: 'for an apology situation',
    achievement: 'for a celebration or achievement',
  },
}

function createOptionLabelMap<T extends string>(options: VisualOption<T>[], locale: Locale) {
  return Object.fromEntries(options.map((option) => [option.id, textOf(option.label, locale)])) as Record<
    T,
    string
  >
}

export function getLocaleData(locale: Locale) {
  return {
    vibeLabelMap: createOptionLabelMap(vibeOptions, locale),
    paletteLabelMap: createOptionLabelMap(paletteOptions, locale),
    shapeLabelMap: createOptionLabelMap(shapeOptions, locale),
    gestureLabelMap: createOptionLabelMap(gestureLevelOptions, locale),
    flowerLabelMap: createOptionLabelMap(flowerOptions, locale),
    reactionLabels: reactionLabels[locale],
    occasionLabelMap: occasionLabelMap[locale],
    occasionReasonMap: occasionReasonMap[locale],
  }
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
