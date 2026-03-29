export type Locale = 'ru' | 'en'
export type LocalizedText = Record<Locale, string>

export type GiftFormatId = 'cut' | 'potted' | 'both'
export type VibeId = 'soft' | 'bright' | 'elegant' | 'dramatic'
export type PaletteId =
  | 'blush'
  | 'cream'
  | 'peach'
  | 'berry'
  | 'yellow'
  | 'red'
  | 'lilac'
  | 'green'
export type ShapeId = 'airy' | 'neat' | 'mono' | 'lush'
export type GestureLevelId = 'quiet' | 'balanced' | 'grand'
export type ScentLevelId = 'low' | 'soft' | 'strong'
export type GreeneryLevelId = 'minimal' | 'balanced' | 'lush'
export type WrappingStyleId = 'bare' | 'paper' | 'decorative'
export type RoseStyleId = 'classic' | 'spray' | 'garden'
export type TulipStyleId = 'mono' | 'bright' | 'natural'
export type PlantStyleId = 'flowering' | 'green' | 'petite'
export type GiftKindId = 'cut' | 'potted'
export type FlowerFamilyId =
  | 'peonies'
  | 'tulips'
  | 'ranunculus'
  | 'roses'
  | 'hydrangeas'
  | 'wildflowers'
  | 'lilies'
  | 'chrysanthemums'
export type OccasionId = 'everyday' | 'birthday' | 'apology' | 'achievement'
export type BouquetReaction = 'like' | 'maybe' | 'no'

export interface VisualOption<T extends string = string> {
  id: T
  label: LocalizedText
  hint: LocalizedText
  emoji: string
  celebration: LocalizedText
  photoUrl?: string
  swatch?: string[]
}

export interface BaseQuestion {
  id: string
  eyebrow: LocalizedText
  title: LocalizedText
  subtitle: LocalizedText
  helper?: LocalizedText
  showWhen?: (answers: AnswerState) => boolean
}

export interface SingleQuestion extends BaseQuestion {
  type: 'single'
  field:
    | 'giftFormat'
    | 'vibe'
    | 'shape'
    | 'gestureLevel'
    | 'scentLevel'
    | 'greeneryLevel'
    | 'wrappingStyle'
    | 'roseStyle'
    | 'tulipStyle'
    | 'plantStyle'
  options: VisualOption[]
}

export interface MultiQuestion extends BaseQuestion {
  type: 'multi'
  field: 'palette' | 'likedFlowers' | 'avoidFlowers'
  options: VisualOption[]
  minSelections: number
  maxSelections?: number
}

export interface BouquetQuestion extends BaseQuestion {
  type: 'bouquet'
  field: 'bouquetReactions'
  bouquetIds: string[]
  minSelections: number
}

export type Question = SingleQuestion | MultiQuestion | BouquetQuestion

export interface BouquetCardData {
  id: string
  title: LocalizedText
  subtitle: LocalizedText
  note: LocalizedText
  colors: string[]
  photoUrl: string
  emoji: string
  giftKind: GiftKindId
  vibes: VibeId[]
  shapes: ShapeId[]
  flowerFamilies: FlowerFamilyId[]
  occasions: OccasionId[]
  intensity: GestureLevelId
  scentLevel: ScentLevelId
  greeneryLevel: GreeneryLevelId
  wrappingStyle: WrappingStyleId
  roseStyle?: RoseStyleId
  tulipStyle?: TulipStyleId
  plantStyle?: PlantStyleId
  universal: boolean
  caution?: LocalizedText
}

export interface AnswerState {
  giftFormat?: GiftFormatId
  vibe?: VibeId
  palette: PaletteId[]
  shape?: ShapeId
  gestureLevel?: GestureLevelId
  scentLevel?: ScentLevelId
  greeneryLevel?: GreeneryLevelId
  wrappingStyle?: WrappingStyleId
  likedFlowers: FlowerFamilyId[]
  roseStyle?: RoseStyleId
  tulipStyle?: TulipStyleId
  plantStyle?: PlantStyleId
  avoidFlowers: FlowerFamilyId[]
  bouquetReactions: Record<string, BouquetReaction>
}

export interface RankedBouquet {
  bouquet: BouquetCardData
  score: number
  reasons: string[]
  concerns: string[]
}

export interface ReportNoGoItem {
  title: string
  reason: string
  colors: string[]
  emoji: string
}

export interface ReportData {
  headline: string
  summary: string
  moodTags: string[]
  safeChoices: RankedBouquet[]
  occasionChoices: Array<{
    occasion: OccasionId
    label: string
    pick: RankedBouquet
  }>
  noGoItems: ReportNoGoItem[]
  cheatSheet: string[]
}
