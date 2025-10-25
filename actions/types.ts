type Enum<T> = T[keyof T]

export const AllowedMetrics = {
  LARGEST_CONTENTFUL_PAINT: {
    name: 'largest_contentful_paint',
    description: 'The time it takes for the largest contentful paint to occur.',
    link: 'https://web.dev/articles/lcp/',
  },
  INTERACTION_TO_NEXT_PAINT: {
    name: 'interaction_to_next_paint',
    description:
      'The time it takes for the next paint to occur after an interaction.',
    link: 'https://web.dev/articles/interaction-to-next-paint/',
  },
  CUMULATIVE_LAYOUT_SHIFT: {
    name: 'cumulative_layout_shift',
    description: 'The cumulative layout shift of the page.',
    link: 'https://web.dev/articles/cls/',
  },
  FIRST_CONTENTFUL_PAINT: {
    name: 'first_contentful_paint',
    description: 'The time it takes for the first contentful paint to occur.',
    link: 'https://web.dev/articles/fcp/',
  },
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: {
    name: 'experimental_time_to_first_byte',
    description: 'The time it takes for the first byte to be received.',
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
