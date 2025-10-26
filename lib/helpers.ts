import {
  AllowedMetrics,
  Record,
  Metric,
  Status,
  StatusType,
  LCP_THRESHOLDS,
  INP_THRESHOLDS,
  CLS_THRESHOLDS,
  FCP_THRESHOLDS,
  TTFB_THRESHOLDS,
  FormFactorType,
  FormFactor,
  CollectionPeriod,
} from '@/types'

const getStatus = (
  value: number,
  thresholds: { good: number; poor: number }
): StatusType => {
  if (value <= thresholds.good) return Status.GOOD
  if (value <= thresholds.poor) return Status.NEEDS_IMPROVEMENT
  return Status.POOR
}

const formatDistributions = (
  distributions: any[]
): { name: StatusType; percentage: number }[] => {
  const total = distributions.reduce((acc, bin) => acc + (bin.density || 0), 0)
  if (total === 0) {
    return [
      { name: Status.GOOD, percentage: 0 },
      { name: Status.NEEDS_IMPROVEMENT, percentage: 0 },
      { name: Status.POOR, percentage: 0 },
    ]
  }
  return [
    {
      name: Status.GOOD,
      percentage: (distributions[0].density || 0) * 100,
    },
    {
      name: Status.NEEDS_IMPROVEMENT,
      percentage: (distributions[1].density || 0) * 100,
    },
    {
      name: Status.POOR,
      percentage: (distributions[2].density || 0) * 100,
    },
  ]
}

const getThresholds = (webVitalKey: string): { good: number; poor: number } => {
  switch (webVitalKey) {
    case AllowedMetrics.LARGEST_CONTENTFUL_PAINT.value:
      return LCP_THRESHOLDS
    case AllowedMetrics.INTERACTION_TO_NEXT_PAINT.value:
      return INP_THRESHOLDS
    case AllowedMetrics.CUMULATIVE_LAYOUT_SHIFT.value:
      return CLS_THRESHOLDS
    case AllowedMetrics.FIRST_CONTENTFUL_PAINT.value:
      return FCP_THRESHOLDS
    case AllowedMetrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.value:
      return TTFB_THRESHOLDS
    default:
      return { good: 0, poor: 0 }
  }
}

export const transformPageInsights = (
  record: Record
): { metrics: Metric[]; collectionPeriod: CollectionPeriod } | null => {
  if (!record || !record.metrics) return null

  const metrics = record.metrics

  const metricsArray: Metric[] = []
  for (const [webVitalKey, webVital] of Object.entries(metrics)) {
    if ('fractions' in webVital) continue

    const value = parseFloat(String(webVital.percentiles.p75))
    const status = getStatus(value, getThresholds(webVitalKey))
    metricsArray.push({
      id: webVitalKey,
      name: AllowedMetrics[
        webVitalKey.toUpperCase() as keyof typeof AllowedMetrics
      ].name,
      description:
        AllowedMetrics[webVitalKey.toUpperCase() as keyof typeof AllowedMetrics]
          .description,
      link: AllowedMetrics[
        webVitalKey.toUpperCase() as keyof typeof AllowedMetrics
      ].link,
      value,
      status,
      distributions: formatDistributions(webVital.histogram || []),
    })
  }

  return { metrics: metricsArray, collectionPeriod: record.collectionPeriod }
}

export const getValidUrls = (urls: string) => {
  return urls
    .split(',')
    .map((url) => url.trim().replace(/[^a-zA-Z0-9/:.]/g, ''))
    .filter((url) => url.startsWith('http') || url.startsWith('https'))
}

export const getValidFormFactor = (formFactor: string): FormFactorType => {
  if (Object.values(FormFactor).includes(formFactor as FormFactorType)) {
    return formFactor as FormFactorType
  }

  return FormFactor.DESKTOP
}

export const getHumanReadableDate = (date: {
  year: number
  month: number
  day: number
}) =>
  Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date.year, date.month - 1, date.day))
