import { useEffect, useState, useTransition } from 'react'
import './App.css'
import {
  bouquets,
  emptyAnswers,
  questions,
  reactionLabels,
} from './data'
import {
  clearPersistedAnswers,
  decodeAnswers,
  encodeAnswers,
  generateReport,
  hasMeaningfulAnswers,
  persistAnswers,
  readStoredAnswers,
} from './report'
import type {
  AnswerState,
  BouquetCardData,
  BouquetQuestion,
  BouquetReaction,
  MultiQuestion,
  Question,
  SingleQuestion,
  VisualOption,
} from './types'

type ViewMode = 'intro' | 'quiz' | 'report'

interface InitialState {
  answers: AnswerState
  view: ViewMode
  stepIndex: number
  hasDraft: boolean
}

function getInitialState(): InitialState {
  if (typeof window === 'undefined') {
    return {
      answers: emptyAnswers(),
      view: 'intro',
      stepIndex: 0,
      hasDraft: false,
    }
  }

  const sharedAnswers = decodeAnswers(window.location.hash)

  if (sharedAnswers) {
    return {
      answers: sharedAnswers,
      view: 'report',
      stepIndex: questions.length - 1,
      hasDraft: hasMeaningfulAnswers(sharedAnswers),
    }
  }

  const storedAnswers = readStoredAnswers()

  return {
    answers: storedAnswers,
    view: 'intro',
    stepIndex: 0,
    hasDraft: hasMeaningfulAnswers(storedAnswers),
  }
}

const introCards = [
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
]

const bouquetPositions = [
  { top: '16%', left: '16%', size: 56 },
  { top: '12%', left: '42%', size: 68 },
  { top: '20%', left: '66%', size: 56 },
  { top: '40%', left: '26%', size: 60 },
  { top: '36%', left: '54%', size: 72 },
  { top: '54%', left: '72%', size: 50 },
]

function getMultiValues(answers: AnswerState, field: MultiQuestion['field']) {
  return answers[field] as string[]
}

function App() {
  const [initialState] = useState(getInitialState)
  const [answers, setAnswers] = useState(initialState.answers)
  const [view, setView] = useState<ViewMode>(initialState.view)
  const [stepIndex, setStepIndex] = useState(initialState.stepIndex)
  const [toast, setToast] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hasDraft, setHasDraft] = useState(initialState.hasDraft)
  const [isPending, startTransition] = useTransition()

  const report = generateReport(answers)
  const currentQuestion = questions[stepIndex]
  const progress = ((stepIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    persistAnswers(answers)
    setHasDraft(hasMeaningfulAnswers(answers))
  }, [answers])

  useEffect(() => {
    if (view !== 'report') {
      return
    }

    const share = encodeAnswers(answers)
    window.history.replaceState(null, '', `${window.location.pathname}#${share}`)
  }, [answers, view])

  function pushToast(message: string) {
    setToast(message)
  }

  function handleSingleSelect(question: SingleQuestion, option: VisualOption) {
    setAnswers((current) => ({
      ...current,
      [question.field]: option.id,
    }))
    pushToast(option.celebration)
  }

  function handleMultiToggle(question: MultiQuestion, option: VisualOption) {
    setAnswers((current) => {
      const currentValues = getMultiValues(current, question.field)
      const hasOption = currentValues.includes(option.id)
      const nextValues = hasOption
        ? currentValues.filter((value) => value !== option.id)
        : question.maxSelections && currentValues.length >= question.maxSelections
          ? [...currentValues.slice(1), option.id]
          : [...currentValues, option.id]

      return {
        ...current,
        [question.field]: nextValues,
      }
    })

    pushToast(option.celebration)
  }

  function handleBouquetReaction(bouquetId: string, reaction: BouquetReaction) {
    setAnswers((current) => ({
      ...current,
      bouquetReactions: {
        ...current.bouquetReactions,
        [bouquetId]: reaction,
      },
    }))
    pushToast(`Отмечено: ${reactionLabels[reaction].toLowerCase()}.`)
  }

  function isCurrentStepValid(question: Question | undefined) {
    if (!question) {
      return false
    }

    if (question.type === 'single') {
      return Boolean(answers[question.field])
    }

    if (question.type === 'multi') {
      return answers[question.field].length >= question.minSelections
    }

    return Object.keys(answers.bouquetReactions).length >= question.minSelections
  }

  function goNext() {
    if (!currentQuestion || !isCurrentStepValid(currentQuestion)) {
      return
    }

    if (stepIndex === questions.length - 1) {
      startTransition(() => {
        setView('report')
      })
      return
    }

    setStepIndex((current) => current + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    if (stepIndex === 0) {
      setView('intro')
      return
    }

    setStepIndex((current) => current - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startQuiz(useDraft: boolean) {
    if (!useDraft) {
      const freshAnswers = emptyAnswers()
      setAnswers(freshAnswers)
      clearPersistedAnswers()
      window.history.replaceState(null, '', window.location.pathname)
      setHasDraft(false)
    }

    setView('quiz')
    setStepIndex(0)
  }

  function editAnswers() {
    setView('quiz')
    setStepIndex(0)
  }

  async function copyShareLink() {
    try {
      const share = `${window.location.origin}${window.location.pathname}#${encodeAnswers(
        answers,
      )}`
      await navigator.clipboard.writeText(share)
      setCopied(true)
      pushToast('Ссылка скопирована.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      pushToast('Не вышло скопировать ссылку.')
    }
  }

  function resetEverything() {
    const freshAnswers = emptyAnswers()
    setAnswers(freshAnswers)
    setStepIndex(0)
    setView('intro')
    setHasDraft(false)
    clearPersistedAnswers()
    window.history.replaceState(null, '', window.location.pathname)
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Flower passport builder</p>
          <h1>Flinder</h1>
        </div>
        <p className="topbar-note">
          Визуальный квиз, который превращает вкусы в понятный отчет.
        </p>
      </header>

      {toast ? <div className="toast">{toast}</div> : null}

      {view === 'intro' ? (
        <main className="intro-layout">
          <section className="hero-card">
            <div className="hero-copy">
              <p className="section-kicker">Формат, который подойдет лучше всего</p>
              <h2>Не чистый Tinder, а гибрид: быстрый квиз + визуальные реакции на букеты</h2>
              <p className="hero-text">
                Так девушке не нужно знать названия цветов, а тебе потом не придется
                расшифровывать полуслово про “вот такие нежные, но не слишком плотные”.
              </p>
              <div className="hero-actions">
                <button className="button button--primary" onClick={() => startQuiz(false)}>
                  Собрать flower-passport
                </button>
                {hasDraft ? (
                  <button className="button button--secondary" onClick={() => startQuiz(true)}>
                    Продолжить черновик
                  </button>
                ) : null}
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-gallery">
                <BouquetArt bouquet={bouquets[0]} large />
                <div className="hero-gallery__stack">
                  <BouquetArt bouquet={bouquets[1]} />
                  <BouquetArt bouquet={bouquets[5]} />
                </div>
              </div>
              <div className="hero-chip hero-chip--top">меньше слов</div>
              <div className="hero-chip hero-chip--bottom">больше примеров</div>
            </div>
          </section>

          <section className="mini-grid">
            {introCards.map((card) => (
              <article className="mini-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </section>

          <section className="preview-card">
            <div className="preview-copy">
              <p className="section-kicker">Что будет в финале</p>
              <h2>Отчет, которым реально можно пользоваться в цветочном магазине</h2>
              <ul className="plain-list">
                <li>3 безопасных букета “если сомневаюсь, беру это”</li>
                <li>Подходящие варианты на обычный день, день рождения, извинение и повод</li>
                <li>Отдельная секция “не дарить ни в коем случае”</li>
                <li>Ссылка, которую можно переслать без регистрации и бэкенда</li>
              </ul>
            </div>
            <div className="preview-stack">
              {report.safeChoices.slice(0, 2).map((item) => (
                <article className="report-preview" key={item.bouquet.id}>
                  <BouquetArt bouquet={item.bouquet} />
                  <div>
                    <strong>{item.bouquet.title}</strong>
                    <p>{item.bouquet.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : null}

      {view === 'quiz' ? (
        <main className="quiz-layout">
          <section className="progress-card">
            <div className="progress-copy">
              <p className="section-kicker">
                {currentQuestion.eyebrow} из {questions.length}
              </p>
              <h2>{currentQuestion.title}</h2>
              <p>{currentQuestion.subtitle}</p>
              {currentQuestion.helper ? (
                <p className="helper-copy">{currentQuestion.helper}</p>
              ) : null}
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="question-card">
            {currentQuestion.type === 'single' ? (
              <div className="option-grid">
                {currentQuestion.options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={answers[currentQuestion.field] === option.id}
                    onClick={() => handleSingleSelect(currentQuestion, option)}
                  />
                ))}
              </div>
            ) : null}

            {currentQuestion.type === 'multi' ? (
              <>
                <div className="multi-summary">
                  <span>
                    Выбрано: {answers[currentQuestion.field].length}
                    {currentQuestion.maxSelections ? ` / ${currentQuestion.maxSelections}` : ''}
                  </span>
                  {currentQuestion.minSelections > 0 ? (
                    <span>Минимум: {currentQuestion.minSelections}</span>
                  ) : (
                    <span>Можно пропустить</span>
                  )}
                </div>
                <div className="option-grid">
                  {currentQuestion.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={option}
                      selected={getMultiValues(answers, currentQuestion.field).includes(
                        option.id,
                      )}
                      onClick={() => handleMultiToggle(currentQuestion, option)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {currentQuestion.type === 'bouquet' ? (
              <BouquetQuestionView
                question={currentQuestion}
                answers={answers}
                onReact={handleBouquetReaction}
              />
            ) : null}
          </section>

          <footer className="wizard-nav">
            <button className="button button--ghost" onClick={goBack}>
              Назад
            </button>
            <button
              className="button button--primary"
              disabled={!isCurrentStepValid(currentQuestion) || isPending}
              onClick={goNext}
            >
              {stepIndex === questions.length - 1 ? 'Собрать отчет' : 'Дальше'}
            </button>
          </footer>
        </main>
      ) : null}

      {view === 'report' ? (
        <main className="report-layout">
          <section className="report-hero">
            <div className="report-hero__copy">
              <p className="section-kicker">Готовый flower-passport</p>
              <h2>{report.headline}</h2>
              <p>{report.summary}</p>
              <div className="tag-row">
                {report.moodTags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="report-hero__actions">
              <button className="button button--primary" onClick={copyShareLink}>
                {copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
              </button>
              <button className="button button--secondary" onClick={() => window.print()}>
                Печать / PDF
              </button>
              <button className="button button--ghost" onClick={editAnswers}>
                Подправить ответы
              </button>
            </div>
          </section>

          <section className="report-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Безопасная база</p>
                <h3>Букеты, которые хорошо работают почти всегда</h3>
              </div>
            </div>
            <div className="report-grid">
              {report.safeChoices.map((item) => (
                <article className="report-card" key={item.bouquet.id}>
                  <BouquetArt bouquet={item.bouquet} />
                  <div className="report-card__body">
                    <div>
                      <h4>{item.bouquet.title}</h4>
                      <p>{item.bouquet.subtitle}</p>
                    </div>
                    <ul className="plain-list">
                      {item.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="report-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">По случаям</p>
                <h3>Что дарить в разном контексте</h3>
              </div>
            </div>
            <div className="occasion-grid">
              {report.occasionChoices.map((entry) => (
                <article className="occasion-card" key={entry.occasion}>
                  <div className="occasion-card__header">
                    <span>{entry.label}</span>
                    <strong>{entry.pick.bouquet.title}</strong>
                  </div>
                  <BouquetArt bouquet={entry.pick.bouquet} />
                  <p>{entry.pick.bouquet.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="report-section report-section--alert">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Красные флаги</p>
                <h3>Что не стоит дарить</h3>
              </div>
            </div>
            <div className="no-go-grid">
              {report.noGoItems.map((item) => (
                <article className="no-go-card" key={item.title}>
                  <div className="no-go-card__top">
                    <div className="swatch-row">
                      {item.colors.map((color) => (
                        <span
                          className="swatch"
                          key={`${item.title}-${color}`}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <span className="no-go-icon">{item.emoji}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.reason}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="cheat-sheet">
            <div>
              <p className="section-kicker">Короткая шпаргалка для парня</p>
              <h3>Как не ошибиться с выбором</h3>
            </div>
            <ul className="plain-list">
              {report.cheatSheet.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <footer className="report-footer">
            <button className="button button--ghost" onClick={resetEverything}>
              Пройти заново
            </button>
          </footer>
        </main>
      ) : null}
    </div>
  )
}

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: VisualOption
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`option-card${selected ? ' option-card--selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="option-card__top">
        <span className="option-card__emoji">{option.emoji}</span>
        {selected ? <span className="option-card__badge">твое</span> : null}
      </div>
      <div className="option-card__body">
        <strong>{option.label}</strong>
        <p>{option.hint}</p>
      </div>
      {option.swatch ? (
        <div className="swatch-row">
          {option.swatch.map((color) => (
            <span className="swatch" key={color} style={{ background: color }} />
          ))}
        </div>
      ) : null}
    </button>
  )
}

function BouquetQuestionView({
  question,
  answers,
  onReact,
}: {
  question: BouquetQuestion
  answers: AnswerState
  onReact: (bouquetId: string, reaction: BouquetReaction) => void
}) {
  const ratedCount = Object.keys(answers.bouquetReactions).length

  return (
    <>
      <div className="multi-summary">
        <span>Оценено: {ratedCount}</span>
        <span>Нужно минимум: {question.minSelections}</span>
      </div>
      <div className="bouquet-grid">
        {question.bouquetIds.map((bouquetId) => {
          const bouquet = bouquets.find((item) => item.id === bouquetId)
          if (!bouquet) {
            return null
          }

          return (
            <article className="bouquet-card" key={bouquet.id}>
              <BouquetArt bouquet={bouquet} />
              <div className="bouquet-card__body">
                <div>
                  <h3>{bouquet.title}</h3>
                  <p>{bouquet.subtitle}</p>
                </div>
                <p className="bouquet-note">{bouquet.note}</p>
              </div>
              <div className="reaction-row">
                {(
                  [
                    ['like', 'Очень да'],
                    ['maybe', 'Норм'],
                    ['no', 'Нет'],
                  ] as Array<[BouquetReaction, string]>
                ).map(([reaction, label]) => (
                  <button
                    className={`reaction-button${
                      answers.bouquetReactions[bouquet.id] === reaction
                        ? ' reaction-button--active'
                        : ''
                    }`}
                    key={reaction}
                    onClick={() => onReact(bouquet.id, reaction)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

function BouquetArt({
  bouquet,
  large = false,
}: {
  bouquet: BouquetCardData
  large?: boolean
}) {
  return (
    <div className={`bouquet-art${large ? ' bouquet-art--large' : ''}`}>
      <img
        alt={bouquet.title}
        className="bouquet-art__image"
        decoding="async"
        loading="eager"
        src={bouquet.photoUrl}
      />
      <div className="bouquet-art__overlay" />
      {large
        ? bouquetPositions.slice(0, 3).map((position, index) => (
            <span
              className="bouquet-art__bloom bouquet-art__bloom--accent"
              key={`${bouquet.id}-${index}`}
              style={{
                top: position.top,
                left: position.left,
                width: position.size,
                height: position.size,
                background: `radial-gradient(circle at 35% 35%, ${
                  bouquet.colors[index % bouquet.colors.length]
                }, rgba(255, 255, 255, 0.2))`,
              }}
            />
          ))
        : null}
      <div className="bouquet-art__label">{bouquet.emoji}</div>
    </div>
  )
}

export default App
