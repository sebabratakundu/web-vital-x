import { AllowedMetrics, Record } from '@/actions/types'

export interface Metric {
  name: string
  description: string
  link: string
  value: string | number
  status: 'Good' | 'Needs Improvement' | 'Poor'
  distributions: {
    name: 'Good' | 'Needs Improvement' | 'Poor'
    percentage: number
  }[]
}

const LCP_THRESHOLDS = { good: 2500, poor: 4000 }
const INP_THRESHOLDS = { good: 200, poor: 500 }
const CLS_THRESHOLDS = { good: 0.1, poor: 0.25 }
const FCP_THRESHOLDS = { good: 1800, poor: 2000 }
const TTFB_THRESHOLDS = { good: 800, poor: 1200 }

const getStatus = (
  value: number,
  thresholds: { good: number; poor: number }
): 'Good' | 'Needs Improvement' | 'Poor' => {
  if (value <= thresholds.good) return 'Good'
  if (value <= thresholds.poor) return 'Needs Improvement'
  return 'Poor'
}

const formatDistributions = (
  distributions: any[]
): { name: 'Good' | 'Needs Improvement' | 'Poor'; percentage: number }[] => {
  const total = distributions.reduce((acc, bin) => acc + (bin.density || 0), 0)
  if (total === 0) {
    return [
      { name: 'Good', percentage: 0 },
      { name: 'Needs Improvement', percentage: 0 },
      { name: 'Poor', percentage: 0 },
    ]
  }
  return [
    {
      name: 'Good' as const,
      percentage: (distributions[0].density || 0) * 100,
    },
    {
      name: 'Needs Improvement' as const,
      percentage: (distributions[1].density || 0) * 100,
    },
    {
      name: 'Poor' as const,
      percentage: (distributions[2].density || 0) * 100,
    },
  ]
}

const getThresholds = (webVitalKey: string): { good: number; poor: number } => {
  switch (webVitalKey) {
    case 'largest_contentful_paint':
      return LCP_THRESHOLDS
    case 'interaction_to_next_paint':
      return INP_THRESHOLDS
    case 'cumulative_layout_shift':
      return CLS_THRESHOLDS
    case 'first_contentful_paint':
      return FCP_THRESHOLDS
    case 'experimental_time_to_first_byte':
      return TTFB_THRESHOLDS
    default:
      return { good: 0, poor: 0 }
  }
}

export const transformPageInsights = (record: Record): Metric[] => {
  if (!record || !record.metrics) return []

  const metrics = record.metrics

  const metricsArray: Metric[] = []
  for (const [webVitalKey, webVital] of Object.entries(metrics)) {
    if ('fractions' in webVital) continue

    console.log(webVitalKey)

    const value = parseFloat(String(webVital.percentiles.p75))
    const status = getStatus(value, getThresholds(webVitalKey))
    metricsArray.push({
      name: webVitalKey.replaceAll('_', ' ').replace('experimental_', ''),
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

  return metricsArray
}
