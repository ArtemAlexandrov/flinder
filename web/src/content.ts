import type { Locale, LocalizedText } from './types'

export const DEFAULT_LOCALE: Locale = 'ru'
export const LOCALE_STORAGE_KEY = 'flinder.locale.v1'
export const SUPPORTED_LOCALES: Locale[] = ['ru', 'en']

const copy = {
  ru: {
    metaTitle: 'Flinder',
    topbar: {
      kicker: 'Flower passport builder',
      note: 'Несколько простых шагов, после которых получается понятный отчет о вкусах.',
    },
    localeLabel: 'Язык',
    pickedBadge: 'твое',
    intro: {
      kicker: 'Как это работает',
      title: 'Сначала выбираем стиль и примеры, потом получаем готовый flower-passport',
      text:
        'Нужно просто пройти по карточкам, отметить что нравится, а что нет, и в конце получится отчет, с которым легко выбирать цветы без догадок.',
      primaryCta: 'Собрать flower-passport',
      resumeCta: 'Продолжить черновик',
      facts: ['3 минуты', 'без ботанического жаргона', 'готовая ссылка для шаринга'],
      chips: {
        top: 'меньше слов',
        bottom: 'больше примеров',
      },
      cards: [
        {
          title: 'Сначала настроение и стиль',
          text: 'Выбираешь карточки с тем, что визуально нравится больше всего.',
        },
        {
          title: 'Потом реальные примеры',
          text: 'Отмечаешь, какие букеты и цветочные подарки нравятся, а какие нет.',
        },
        {
          title: 'В конце понятный отчет',
          text: 'Ты получаешь безопасные варианты, подсказки по случаям и список того, что лучше не брать.',
        },
      ],
      preview: {
        kicker: 'Что будет в финале',
        title: 'Отчет, которым реально можно пользоваться в цветочном магазине',
        bullets: [
          '3 безопасных варианта “если сомневаюсь, беру это”',
          'Подходящие варианты на обычный день, день рождения, извинение и повод',
          'Отдельная секция “не дарить ни в коем случае”',
          'Ссылка, которую можно переслать без регистрации и бэкенда',
        ],
      },
    },
    quiz: {
      progressLabel: 'Готово',
      nudgeKicker: 'Легкий режим',
      summaryKicker: 'Уже считывается такой вкус',
      summaryEmpty:
        'Пока пусто. Выбери пару карточек, и здесь появится быстрый портрет вкуса.',
      nudges: [
        'Начинаем с самого прикладного: какой формат подарка вообще нужен.',
        'Общий вайб уже сужает круг намного сильнее, чем кажется.',
        'Палитра делает будущий отчет гораздо точнее.',
        'Форма помогает отличить “мило” от “совсем не то”.',
        'Масштаб жеста спасает от слишком громких букетов.',
        'Любимые цветы почти всегда дают самые полезные подсказки.',
        'Это уже умное уточнение, чтобы отчет был не абстрактным.',
        'Еще одно полезное уточнение по вкусу, а не по терминам.',
        'Хорошая ветка: она как раз убирает неоднозначность.',
        'Запах часто решает судьбу всего подарка.',
        'Зелень и упаковка влияют на впечатление сильнее, чем кажется.',
        'Теперь включаем визуальную интуицию на реальных примерах.',
        'Последний фильтр: что точно не стоит брать.',
      ],
      selectedLabel: 'Выбрано',
      minimumLabel: 'Минимум',
      canSkip: 'Можно пропустить',
      ratedLabel: 'Оценено',
      needAtLeast: 'Нужно минимум',
      back: 'Назад',
      next: 'Дальше',
      buildReport: 'Собрать отчет',
      reactionLegend: 'Реагируй по ощущениям: это полезнее, чем пытаться объяснить вкус словами.',
    },
    report: {
      heroKicker: 'Готовый flower-passport',
      shareHint: 'Ссылка сохраняет и ответы, и язык интерфейса.',
      copyLink: 'Скопировать ссылку',
      copied: 'Ссылка скопирована',
      print: 'Печать / PDF',
      edit: 'Подправить ответы',
      safeKicker: 'Безопасная база',
      safeTitle: 'Варианты, которые хорошо работают почти всегда',
      occasionKicker: 'По случаям',
      occasionTitle: 'Что дарить в разном контексте',
      noGoKicker: 'Красные флаги',
      noGoTitle: 'Что не стоит дарить',
      cheatKicker: 'Короткая шпаргалка для парня',
      cheatTitle: 'Как не ошибиться с выбором',
      restart: 'Пройти заново',
      shareReady: 'Share-ready',
    },
    toasts: {
      copied: 'Ссылка скопирована.',
      copyFailed: 'Не вышло скопировать ссылку.',
      reactionPrefix: 'Отмечено',
    },
  },
  en: {
    metaTitle: 'Flinder',
    topbar: {
      kicker: 'Flower passport builder',
      note: 'A few simple steps that turn taste into a clear and practical preference report.',
    },
    localeLabel: 'Language',
    pickedBadge: 'picked',
    intro: {
      kicker: 'How it works',
      title: 'First choose the style and examples, then get a ready-to-use flower passport',
      text:
        'Just move through the cards, mark what feels right and what does not, and the result becomes a clear report you can actually use when buying flowers.',
      primaryCta: 'Build the flower passport',
      resumeCta: 'Resume draft',
      facts: ['3-minute flow', 'no florist jargon', 'shareable result'],
      chips: {
        top: 'less explaining',
        bottom: 'more examples',
      },
      cards: [
        {
          title: 'Start with mood and style',
          text: 'Pick the cards that feel visually closest instead of naming flower varieties.',
        },
        {
          title: 'Then rate real examples',
          text: 'Mark which bouquets and floral gifts feel right, and which ones do not.',
        },
        {
          title: 'Finish with a clear report',
          text: 'You get safe picks, occasion cues, and a clear list of things to avoid.',
        },
      ],
      preview: {
        kicker: 'What you get in the end',
        title: 'A report you can actually use inside a flower shop',
        bullets: [
          '3 safe picks for the “I am not sure, I will take this” moment',
          'Recommendations for everyday dates, birthdays, apologies, and celebrations',
          'A separate “never buy this” section',
          'A link you can share without accounts or backend setup',
        ],
      },
    },
    quiz: {
      progressLabel: 'Done',
      nudgeKicker: 'Easy mode',
      summaryKicker: 'Her taste already looks like this',
      summaryEmpty:
        'Nothing here yet. Pick a few cards and this space will turn into a quick taste snapshot.',
      nudges: [
        'Start with the practical thing first: what kind of floral gift is even right.',
        'The overall mood already narrows the field more than it seems.',
        'Color palette makes the final brief much sharper.',
        'Shape helps separate “cute” from “absolutely not”.',
        'Gesture size saves you from gifts that feel way too loud.',
        'Favorite flowers usually create the clearest recommendations.',
        'This follow-up is here to turn vague taste into usable detail.',
        'Another useful nuance pass, still based on visuals not jargon.',
        'This branch helps remove ambiguity before the final examples.',
        'Scent can easily make or break the whole gift.',
        'Greenery and wrapping matter more than most people expect.',
        'Now we use real examples and pure visual instinct.',
        'Final filter: what should never make it into the gift.',
      ],
      selectedLabel: 'Selected',
      minimumLabel: 'Minimum',
      canSkip: 'Can be skipped',
      ratedLabel: 'Rated',
      needAtLeast: 'Need at least',
      back: 'Back',
      next: 'Next',
      buildReport: 'Build report',
      reactionLegend:
        'React instinctively here. That is much more useful than trying to explain taste perfectly.',
    },
    report: {
      heroKicker: 'Ready flower passport',
      shareHint: 'The link keeps both the answers and the interface language.',
      copyLink: 'Copy link',
      copied: 'Link copied',
      print: 'Print / PDF',
      edit: 'Edit answers',
      safeKicker: 'Safe base',
      safeTitle: 'Picks that work well almost every time',
      occasionKicker: 'By occasion',
      occasionTitle: 'What to buy in different situations',
      noGoKicker: 'Red flags',
      noGoTitle: 'What not to buy',
      cheatKicker: 'Short cheat sheet for the boyfriend',
      cheatTitle: 'How not to mess this up',
      restart: 'Start again',
      shareReady: 'Share-ready',
    },
    toasts: {
      copied: 'Link copied.',
      copyFailed: 'Could not copy the link.',
      reactionPrefix: 'Marked',
    },
  },
} as const

export const localeButtonLabels: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
}

export function textOf(text: LocalizedText, locale: Locale) {
  return text[locale]
}

export function getCopy(locale: Locale) {
  return copy[locale]
}

export function getInitialLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const params = new URLSearchParams(window.location.search)
  const fromSearch = params.get('lang')

  if (fromSearch === 'en' || fromSearch === 'ru') {
    return fromSearch
  }

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'en' || stored === 'ru') {
      return stored
    }
  } catch {
    return DEFAULT_LOCALE
  }

  return DEFAULT_LOCALE
}

export function persistLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export function syncDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale
  document.title = copy[locale].metaTitle
}

export function buildAppUrl(locale: Locale, shareHash?: string) {
  const url = new URL(window.location.href)

  if (locale === DEFAULT_LOCALE) {
    url.searchParams.delete('lang')
  } else {
    url.searchParams.set('lang', locale)
  }

  url.hash = shareHash ? `#${shareHash}` : ''

  return `${url.pathname}${url.search}${url.hash}`
}

export function formatList(items: string[], locale: Locale) {
  return new Intl.ListFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'long',
    type: 'conjunction',
  }).format(items)
}

export function getSelectionSnapshot(tags: string[], locale: Locale) {
  if (tags.length > 0) {
    return tags
  }

  return locale === 'ru'
    ? ['Нежно', 'Собранно', 'Чуть романтично']
    : ['Soft', 'Curated', 'A bit romantic']
}
