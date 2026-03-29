import { useEffect, useMemo, useState, useTransition } from 'react'
import './App.css'
import {
  buildAppUrl,
  getCopy,
  getInitialLocale,
  localeButtonLabels,
  persistLocale,
  syncDocumentLocale,
  textOf,
} from './content'
import {
  bouquets,
  emptyAnswers,
  getLocaleData,
  getVisibleQuestions,
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
  Locale,
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
  locale: Locale
}

function getInitialState(): InitialState {
  const locale = getInitialLocale()

  if (typeof window === 'undefined') {
    return {
      answers: emptyAnswers(),
      view: 'intro',
      stepIndex: 0,
      hasDraft: false,
      locale,
    }
  }

  const sharedAnswers = decodeAnswers(window.location.hash)

  if (sharedAnswers) {
    const visibleQuestions = getVisibleQuestions(sharedAnswers)

    return {
      answers: sharedAnswers,
      view: 'report',
      stepIndex: Math.max(visibleQuestions.length - 1, 0),
      hasDraft: hasMeaningfulAnswers(sharedAnswers),
      locale,
    }
  }

  const storedAnswers = readStoredAnswers()

  return {
    answers: storedAnswers,
    view: 'intro',
    stepIndex: 0,
    hasDraft: hasMeaningfulAnswers(storedAnswers),
    locale,
  }
}

const bouquetPositions = [
  { top: '16%', left: '16%', size: 56 },
  { top: '12%', left: '42%', size: 68 },
  { top: '20%', left: '66%', size: 56 },
]

function getMultiValues(answers: AnswerState, field: MultiQuestion['field']) {
  return answers[field] as string[]
}

function getVisibleBouquetExamples(answers: AnswerState) {
  const pool =
    answers.giftFormat === 'cut'
      ? bouquets.filter((bouquet) => bouquet.giftKind === 'cut')
      : [...bouquets]

  if (answers.giftFormat !== 'potted') {
    return pool
  }

  return pool.sort((left, right) => {
    if (left.giftKind === right.giftKind) {
      return 0
    }

    return left.giftKind === 'potted' ? -1 : 1
  })
}

function buildSelectionTags(answers: AnswerState, locale: Locale) {
  const labels = getLocaleData(locale)

  return [
    answers.giftFormat ? labels.giftFormatLabelMap[answers.giftFormat] : null,
    answers.vibe ? labels.vibeLabelMap[answers.vibe] : null,
    answers.shape ? labels.shapeLabelMap[answers.shape] : null,
    answers.palette[0] ? labels.paletteLabelMap[answers.palette[0]] : null,
    answers.likedFlowers[0] ? labels.flowerLabelMap[answers.likedFlowers[0]] : null,
    answers.wrappingStyle ? labels.wrappingLabelMap[answers.wrappingStyle] : null,
  ].filter(Boolean).slice(0, 5) as string[]
}

function App() {
  const [initialState] = useState(getInitialState)
  const [answers, setAnswers] = useState(initialState.answers)
  const [view, setView] = useState<ViewMode>(initialState.view)
  const [stepIndex, setStepIndex] = useState(initialState.stepIndex)
  const [locale, setLocale] = useState<Locale>(initialState.locale)
  const [toast, setToast] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hasDraft, setHasDraft] = useState(initialState.hasDraft)
  const [isPending, startTransition] = useTransition()

  const copy = getCopy(locale)
  const localeData = getLocaleData(locale)
  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers])
  const report = generateReport(answers, locale)
  const currentQuestion = visibleQuestions[stepIndex]
  const progress = visibleQuestions.length ? ((stepIndex + 1) / visibleQuestions.length) * 100 : 0
  const progressRounded = Math.round(progress)
  const selectionTags = useMemo(() => buildSelectionTags(answers, locale), [answers, locale])
  const stepLabel =
    locale === 'ru'
      ? `Шаг ${Math.min(stepIndex + 1, visibleQuestions.length)} из ${visibleQuestions.length}`
      : `Step ${Math.min(stepIndex + 1, visibleQuestions.length)} of ${visibleQuestions.length}`

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    persistAnswers(answers)
    setHasDraft(hasMeaningfulAnswers(answers))
  }, [answers])

  useEffect(() => {
    persistLocale(locale)
    syncDocumentLocale(locale)
  }, [locale])

  useEffect(() => {
    const share = view === 'report' ? encodeAnswers(answers) : undefined
    window.history.replaceState(null, '', buildAppUrl(locale, share))
  }, [answers, locale, view])

  useEffect(() => {
    if (stepIndex < visibleQuestions.length) {
      return
    }

    setStepIndex(Math.max(visibleQuestions.length - 1, 0))
  }, [stepIndex, visibleQuestions.length])

  function pushToast(message: string) {
    setToast(message)
  }

  function handleSingleSelect(question: SingleQuestion, option: VisualOption) {
    setAnswers((current) => ({
      ...current,
      [question.field]: option.id,
    }))
    pushToast(textOf(option.celebration, locale))
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

    pushToast(textOf(option.celebration, locale))
  }

  function handleBouquetReaction(bouquetId: string, reaction: BouquetReaction) {
    setAnswers((current) => ({
      ...current,
      bouquetReactions: {
        ...current.bouquetReactions,
        [bouquetId]: reaction,
      },
    }))
    pushToast(
      `${copy.toasts.reactionPrefix}: ${localeData.reactionLabels[reaction].toLowerCase()}.`,
    )
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

    return (
      getVisibleBouquetExamples(answers).filter((bouquet) => answers.bouquetReactions[bouquet.id])
        .length >= question.minSelections
    )
  }

  function goNext() {
    if (!currentQuestion || !isCurrentStepValid(currentQuestion)) {
      return
    }

    if (stepIndex === visibleQuestions.length - 1) {
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
      setHasDraft(false)
    }

    setView('quiz')
    setStepIndex(0)
  }

  function editAnswers() {
    setView('quiz')
    setStepIndex(0)
  }

  function changeLocale(nextLocale: Locale) {
    startTransition(() => {
      setLocale(nextLocale)
    })
  }

  async function copyShareLink() {
    try {
      const share = `${window.location.origin}${buildAppUrl(locale, encodeAnswers(answers))}`
      await navigator.clipboard.writeText(share)
      setCopied(true)
      pushToast(copy.toasts.copied)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      pushToast(copy.toasts.copyFailed)
    }
  }

  function resetEverything() {
    const freshAnswers = emptyAnswers()
    setAnswers(freshAnswers)
    setStepIndex(0)
    setView('intro')
    setHasDraft(false)
    clearPersistedAnswers()
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar__brand">
          <p className="brand-kicker">{copy.topbar.kicker}</p>
          <h1>Flinder</h1>
        </div>

        <div className="topbar__aside">
          <div className="language-switch" aria-label={copy.localeLabel}>
            {(['ru', 'en'] as Locale[]).map((value) => (
              <button
                className={`language-switch__button${
                  locale === value ? ' language-switch__button--active' : ''
                }`}
                key={value}
                onClick={() => changeLocale(value)}
                type="button"
              >
                {localeButtonLabels[value]}
              </button>
            ))}
          </div>
          <p className="topbar-note">{copy.topbar.note}</p>
        </div>
      </header>

      {toast ? <div className="toast">{toast}</div> : null}

      {view === 'intro' ? (
        <main className="intro-layout">
          <section className="hero-card">
            <div className="hero-copy">
              <p className="section-kicker">{copy.intro.kicker}</p>
              <h2>{copy.intro.title}</h2>
              <p className="hero-text">{copy.intro.text}</p>

              <div className="hero-facts">
                {copy.intro.facts.map((fact) => (
                  <span className="hero-fact" key={fact}>
                    {fact}
                  </span>
                ))}
              </div>

              <div className="hero-actions">
                <button className="button button--primary" onClick={() => startQuiz(false)}>
                  {copy.intro.primaryCta}
                </button>
                {hasDraft ? (
                  <button className="button button--secondary" onClick={() => startQuiz(true)}>
                    {copy.intro.resumeCta}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-gallery">
                <BouquetArt bouquet={bouquets[0]} large locale={locale} />
                <div className="hero-gallery__stack">
                  <BouquetArt bouquet={bouquets[1]} locale={locale} />
                  <BouquetArt bouquet={bouquets[5]} locale={locale} />
                </div>
              </div>
              <div className="hero-chip hero-chip--top">{copy.intro.chips.top}</div>
              <div className="hero-chip hero-chip--bottom">{copy.intro.chips.bottom}</div>
            </div>
          </section>

          <section className="mini-grid">
            {copy.intro.cards.map((card) => (
              <article className="mini-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </section>

          <section className="preview-card">
            <div className="preview-copy">
              <p className="section-kicker">{copy.intro.preview.kicker}</p>
              <h2>{copy.intro.preview.title}</h2>
              <ul className="plain-list">
                {copy.intro.preview.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="preview-stack">
              {report.safeChoices.slice(0, 2).map((item) => (
                <article className="report-preview" key={item.bouquet.id}>
                  <BouquetArt bouquet={item.bouquet} locale={locale} />
                  <div>
                    <strong>{textOf(item.bouquet.title, locale)}</strong>
                    <p>{textOf(item.bouquet.subtitle, locale)}</p>
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
            <div className="progress-card__top">
              <div className="progress-copy">
                <p className="section-kicker">{`${textOf(currentQuestion.eyebrow, locale)} • ${stepLabel}`}</p>
                <h2>{textOf(currentQuestion.title, locale)}</h2>
                <p>{textOf(currentQuestion.subtitle, locale)}</p>
                {currentQuestion.helper ? (
                  <p className="helper-copy">{textOf(currentQuestion.helper, locale)}</p>
                ) : null}
              </div>
              <div className="progress-card__badge">
                <strong>{progressRounded}%</strong>
                <span>{copy.quiz.progressLabel}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="quiz-glance">
            <article className="quiz-glance__card">
              <p className="section-kicker">{copy.quiz.nudgeKicker}</p>
              <h3>{copy.quiz.nudges[Math.min(stepIndex, copy.quiz.nudges.length - 1)]}</h3>
              <p>{copy.quiz.reactionLegend}</p>
            </article>

            <article className="quiz-glance__card">
              <p className="section-kicker">{copy.quiz.summaryKicker}</p>
              {selectionTags.length > 0 ? (
                <div className="selection-tray">
                  {selectionTags.map((tag) => (
                    <span className="selection-pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p>{copy.quiz.summaryEmpty}</p>
              )}
            </article>
          </section>

          <section className="question-card">
            {currentQuestion.type === 'single' ? (
              <div className="option-grid">
                {currentQuestion.options.map((option) => (
                  <OptionCard
                    badgeLabel={copy.pickedBadge}
                    key={option.id}
                    locale={locale}
                    onClick={() => handleSingleSelect(currentQuestion, option)}
                    option={option}
                    selected={answers[currentQuestion.field] === option.id}
                  />
                ))}
              </div>
            ) : null}

            {currentQuestion.type === 'multi' ? (
              <>
                <div className="multi-summary">
                  <span>
                    {copy.quiz.selectedLabel}: {answers[currentQuestion.field].length}
                    {currentQuestion.maxSelections ? ` / ${currentQuestion.maxSelections}` : ''}
                  </span>
                  {currentQuestion.minSelections > 0 ? (
                    <span>
                      {copy.quiz.minimumLabel}: {currentQuestion.minSelections}
                    </span>
                  ) : (
                    <span>{copy.quiz.canSkip}</span>
                  )}
                </div>
                <div className="option-grid">
                  {currentQuestion.options.map((option) => (
                    <OptionCard
                      badgeLabel={copy.pickedBadge}
                      key={option.id}
                      locale={locale}
                      onClick={() => handleMultiToggle(currentQuestion, option)}
                      option={option}
                      selected={getMultiValues(answers, currentQuestion.field).includes(option.id)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {currentQuestion.type === 'bouquet' ? (
              <BouquetQuestionView
                answers={answers}
                locale={locale}
                onReact={handleBouquetReaction}
                question={currentQuestion}
              />
            ) : null}
          </section>

          <footer className="wizard-nav">
            <button className="button button--ghost" onClick={goBack} type="button">
              {copy.quiz.back}
            </button>
            <button
              className="button button--primary"
              disabled={!isCurrentStepValid(currentQuestion) || isPending}
              onClick={goNext}
              type="button"
            >
              {stepIndex === visibleQuestions.length - 1 ? copy.quiz.buildReport : copy.quiz.next}
            </button>
          </footer>
        </main>
      ) : null}

      {view === 'report' ? (
        <main className="report-layout">
          <section className="report-hero">
            <div className="report-hero__copy">
              <div className="report-hero__meta">
                <p className="section-kicker">{copy.report.heroKicker}</p>
                <span className="report-stamp">{copy.report.shareReady}</span>
              </div>
              <h2>{report.headline}</h2>
              <p>{report.summary}</p>
              <p className="report-hint">{copy.report.shareHint}</p>
              <div className="tag-row">
                {report.moodTags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="report-hero__actions">
              <button className="button button--primary" onClick={copyShareLink} type="button">
                {copied ? copy.report.copied : copy.report.copyLink}
              </button>
              <button
                className="button button--secondary"
                onClick={() => window.print()}
                type="button"
              >
                {copy.report.print}
              </button>
              <button className="button button--ghost" onClick={editAnswers} type="button">
                {copy.report.edit}
              </button>
            </div>
          </section>

          <section className="report-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{copy.report.safeKicker}</p>
                <h3>{copy.report.safeTitle}</h3>
              </div>
            </div>
            <div className="report-grid">
              {report.safeChoices.map((item) => (
                <article className="report-card" key={item.bouquet.id}>
                  <BouquetArt bouquet={item.bouquet} locale={locale} />
                  <div className="report-card__body">
                    <div>
                      <h4>{textOf(item.bouquet.title, locale)}</h4>
                      <p>{textOf(item.bouquet.subtitle, locale)}</p>
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
                <p className="section-kicker">{copy.report.occasionKicker}</p>
                <h3>{copy.report.occasionTitle}</h3>
              </div>
            </div>
            <div className="occasion-grid">
              {report.occasionChoices.map((entry) => (
                <article className="occasion-card" key={entry.occasion}>
                  <div className="occasion-card__header">
                    <span>{entry.label}</span>
                    <strong>{textOf(entry.pick.bouquet.title, locale)}</strong>
                  </div>
                  <BouquetArt bouquet={entry.pick.bouquet} locale={locale} />
                  <p>{textOf(entry.pick.bouquet.note, locale)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="report-section report-section--alert">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{copy.report.noGoKicker}</p>
                <h3>{copy.report.noGoTitle}</h3>
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
              <p className="section-kicker">{copy.report.cheatKicker}</p>
              <h3>{copy.report.cheatTitle}</h3>
            </div>
            <ul className="plain-list">
              {report.cheatSheet.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <footer className="report-footer">
            <button className="button button--ghost" onClick={resetEverything} type="button">
              {copy.report.restart}
            </button>
          </footer>
        </main>
      ) : null}
    </div>
  )
}

function OptionCard({
  option,
  locale,
  badgeLabel,
  selected,
  onClick,
}: {
  option: VisualOption
  locale: Locale
  badgeLabel: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`option-card${selected ? ' option-card--selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      {option.photoUrl ? (
        <div className="option-card__media">
          <img alt={textOf(option.label, locale)} className="option-card__image" src={option.photoUrl} />
        </div>
      ) : null}
      <div className="option-card__top">
        <span className="option-card__emoji">{option.emoji}</span>
        {selected ? <span className="option-card__badge">{badgeLabel}</span> : null}
      </div>
      <div className="option-card__body">
        <strong>{textOf(option.label, locale)}</strong>
        <p>{textOf(option.hint, locale)}</p>
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
  locale,
  onReact,
}: {
  question: BouquetQuestion
  answers: AnswerState
  locale: Locale
  onReact: (bouquetId: string, reaction: BouquetReaction) => void
}) {
  const localeData = getLocaleData(locale)
  const visibleBouquets = getVisibleBouquetExamples(answers)
  const ratedCount = visibleBouquets.filter((bouquet) => answers.bouquetReactions[bouquet.id]).length

  return (
    <>
      <div className="multi-summary">
        <span>
          {locale === 'ru' ? 'Оценено' : 'Rated'}: {ratedCount}
        </span>
        <span>
          {locale === 'ru' ? 'Нужно минимум' : 'Need at least'}: {question.minSelections}
        </span>
      </div>
      <div className="bouquet-grid">
        {visibleBouquets.map((bouquet) => (
          <article className="bouquet-card" key={bouquet.id}>
            <BouquetArt bouquet={bouquet} locale={locale} />
            <div className="bouquet-card__body">
              <div>
                <h3>{textOf(bouquet.title, locale)}</h3>
                <p>{textOf(bouquet.subtitle, locale)}</p>
              </div>
              <p className="bouquet-note">{textOf(bouquet.note, locale)}</p>
            </div>
            <div className="reaction-row">
              {(
                ['like', 'maybe', 'no'] as BouquetReaction[]
              ).map((reaction) => (
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
                  {localeData.reactionLabels[reaction]}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function BouquetArt({
  bouquet,
  locale,
  large = false,
}: {
  bouquet: BouquetCardData
  locale: Locale
  large?: boolean
}) {
  return (
    <div className={`bouquet-art${large ? ' bouquet-art--large' : ''}`}>
      <img
        alt={textOf(bouquet.title, locale)}
        className="bouquet-art__image"
        decoding="async"
        loading="eager"
        src={bouquet.photoUrl}
      />
      <div className="bouquet-art__overlay" />
      {large
        ? bouquetPositions.map((position, index) => (
            <span
              className="bouquet-art__bloom bouquet-art__bloom--accent"
              key={`${textOf(bouquet.title, locale)}-${index}`}
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
