export const LCP_THRESHOLDS = { good: 2500, poor: 4000 }
export const INP_THRESHOLDS = { good: 200, poor: 500 }
export const CLS_THRESHOLDS = { good: 0.1, poor: 0.25 }
export const FCP_THRESHOLDS = { good: 1800, poor: 2000 }
export const TTFB_THRESHOLDS = { good: 800, poor: 1200 }

type Enum<T> = T[keyof T]

export const AllowedMetrics = {
  LARGEST_CONTENTFUL_PAINT: {
    name: 'largest_contentful_paint',
    description: `The time it takes for the largest contentful paint to occur. Good threshold is ${LCP_THRESHOLDS.good}ms, Poor threshold is ${LCP_THRESHOLDS.poor}ms`,
    link: 'https://web.dev/articles/lcp/',
  },
  INTERACTION_TO_NEXT_PAINT: {
    name: 'interaction_to_next_paint',
    description: `The time it takes for the next paint to occur after an interaction. Good threshold is ${INP_THRESHOLDS.good}ms, Poor threshold is ${INP_THRESHOLDS.poor}ms`,
    link: 'https://web.dev/articles/interaction-to-next-paint/',
  },
  CUMULATIVE_LAYOUT_SHIFT: {
    name: 'cumulative_layout_shift',
    description: `Measures visual stability by quantifying how much unexpected layout shifts occur during the lifespan of a page. Good threshold is ${CLS_THRESHOLDS.good}, Poor threshold is ${CLS_THRESHOLDS.poor}`,
    link: 'https://web.dev/articles/cls/',
  },
  FIRST_CONTENTFUL_PAINT: {
    name: 'first_contentful_paint',
    description: `The time it takes for the first contentful paint to occur. Good threshold is ${FCP_THRESHOLDS.good}ms, Poor threshold is ${FCP_THRESHOLDS.poor}ms`,
    link: 'https://web.dev/articles/fcp/',
  },
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: {
    name: 'experimental_time_to_first_byte',
    description: `The time it takes for the first byte to be received. Good threshold is ${TTFB_THRESHOLDS.good}ms, Poor threshold is ${TTFB_THRESHOLDS.poor}ms`,
    link: 'https://web.dev/articles/ttfb/',
  },
} as const

export type AllowedMetricsType = Enum<typeof AllowedMetrics>['name']

export type CrUXMetric =
  | {
      histogram: Bin[]
      percentiles: Percentiles
    }
  | {
      fractions: Fractions
    }

export type Bin = {
  start: number | string
  end: number | string
  density: number
}

export type Percentiles = {
  p75: number | string
}

export type Fractions = {
  [key: string]: number
}

export const FormFactor = {
  DESKTOP: 'DESKTOP',
  PHONE: 'PHONE',
  TABLET: 'TABLET',
} as const

export type FormFactorType = Enum<typeof FormFactor>

export type Key = {
  formFactor?: FormFactorType
  origin?: string
  url?: string
}

export type UrlNormalization = {
  originalUrl: string
  normalizedUrl: string
}

export type Record = {
  key: Key
  metrics: { [key in AllowedMetricsType]: CrUXMetric }
  collectionPeriod: {
    firstDate: {
      year: number
      month: number
      day: number
    }
    lastDate: {
      year: number
      month: number
      day: number
    }
  }
}

export type PageInsightsResponse = {
  record: Record
  urlNormalizationDetails?: UrlNormalization
}

export const Status = {
  GOOD: 'Good',
  NEEDS_IMPROVEMENT: 'Needs Improvement',
  POOR: 'Poor',
} as const

export const StatusWeightRank = {
  [Status.GOOD]: 1,
  [Status.NEEDS_IMPROVEMENT]: 2,
  [Status.POOR]: 3,
} as const

export type StatusType = Enum<typeof Status>

export type Metric = {
  name: string
  description: string
  link: string
  value: string | number
  status: StatusType
  distributions: {
    name: StatusType
    percentage: number
  }[]
}
