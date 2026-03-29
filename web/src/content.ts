import type { Locale, LocalizedText } from './types'

export const DEFAULT_LOCALE: Locale = 'ru'
export const LOCALE_STORAGE_KEY = 'flinder.locale.v1'
export const SUPPORTED_LOCALES: Locale[] = ['ru', 'en']

const copy = {
  ru: {
    metaTitle: 'Flinder',
    topbar: {
      kicker: 'Flower passport builder',
      note: 'Визуальный квиз, который превращает вкусы в понятный отчет.',
    },
    localeLabel: 'Язык',
    pickedBadge: 'твое',
    intro: {
      kicker: 'Формат, который подойдет лучше всего',
      title: 'Не чистый Tinder, а гибрид: быстрый квиз + визуальные реакции на букеты',
      text:
        'Так девушке не нужно знать названия цветов, а тебе потом не придется расшифровывать полуслово про “вот такие нежные, но не перегруженные”.',
      primaryCta: 'Собрать flower-passport',
      resumeCta: 'Продолжить черновик',
      facts: ['3 минуты', 'без ботанического жаргона', 'готовая ссылка для шаринга'],
      chips: {
        top: 'меньше слов',
        bottom: 'больше примеров',
      },
      cards: [
        {
          title: 'Вместо “объясни словами”',
          text: 'Девушка выбирает карточки, а не вспоминает названия цветов.',
        },
        {
          title: 'Мини Flinder внутри',
          text: 'Есть визуальный этап с лайк / может быть / нет по букетам.',
        },
        {
          title: 'Итог без ботаники',
          text: 'Ты получаешь понятный отчет с безопасными вариантами и красными флагами.',
        },
      ],
      preview: {
        kicker: 'Что будет в финале',
        title: 'Отчет, которым реально можно пользоваться в цветочном магазине',
        bullets: [
          '3 безопасных букета “если сомневаюсь, беру это”',
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
        'Начинаем с самого простого: общего ощущения.',
        'Палитра уже делает отчет гораздо точнее.',
        'Форма помогает отличить “мило” от “совсем не то”.',
        'Масштаб жеста спасает от слишком громких букетов.',
        'Любимые цветы почти всегда дают самые полезные подсказки.',
        'Здесь срабатывает визуальная интуиция, а не знания терминов.',
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
      reactionLegend: 'Выбирай сердцем: это намного полезнее, чем пытаться вспомнить названия цветов.',
    },
    report: {
      heroKicker: 'Готовый flower-passport',
      shareHint: 'Ссылка сохраняет и ответы, и язык интерфейса.',
      copyLink: 'Скопировать ссылку',
      copied: 'Ссылка скопирована',
      print: 'Печать / PDF',
      edit: 'Подправить ответы',
      safeKicker: 'Безопасная база',
      safeTitle: 'Букеты, которые хорошо работают почти всегда',
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
      note: 'A visual quiz that turns taste into a practical bouquet brief.',
    },
    localeLabel: 'Language',
    pickedBadge: 'picked',
    intro: {
      kicker: 'The best format for this problem',
      title: 'Not pure Tinder, but a hybrid: a quick quiz + visual bouquet reactions',
      text:
        'She does not need to remember flower names, and you do not have to decode vague phrases like “soft, but not too busy, while still not boring.”',
      primaryCta: 'Build the flower passport',
      resumeCta: 'Resume draft',
      facts: ['3-minute flow', 'no florist jargon', 'shareable result'],
      chips: {
        top: 'less explaining',
        bottom: 'more examples',
      },
      cards: [
        {
          title: 'Instead of “explain it in words”',
          text: 'She picks cards and examples instead of naming flower varieties.',
        },
        {
          title: 'Mini Flinder inside',
          text: 'There is a visual like / maybe / no round for actual bouquet examples.',
        },
        {
          title: 'A report without flower jargon',
          text: 'You get safe picks, context picks, and clear red flags.',
        },
      ],
      preview: {
        kicker: 'What you get in the end',
        title: 'A report you can actually use inside a flower shop',
        bullets: [
          '3 safe bouquets for the “I am not sure, I will take this” moment',
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
        'Start with the easiest thing: the overall feeling.',
        'Color palette already makes the final brief much sharper.',
        'Shape helps separate “cute” from “absolutely not”.',
        'Gesture size saves you from bouquets that feel way too loud.',
        'Favorite flowers usually create the clearest recommendations.',
        'This is the visual instinct round, not a terminology test.',
        'Final filter: what should never make it into the bouquet.',
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
        'React instinctively here. That is much more useful than trying to name flowers correctly.',
    },
    report: {
      heroKicker: 'Ready flower passport',
      shareHint: 'The link keeps both the answers and the interface language.',
      copyLink: 'Copy link',
      copied: 'Link copied',
      print: 'Print / PDF',
      edit: 'Edit answers',
      safeKicker: 'Safe base',
      safeTitle: 'Bouquets that work well almost every time',
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
