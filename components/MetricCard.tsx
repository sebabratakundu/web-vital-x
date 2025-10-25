import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metric } from '@/lib/helpers'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const statusColors = {
  Good: 'border-green-500',
  'Needs Improvement': 'border-yellow-500',
  Poor: 'border-red-500',
}

const distributionColors = {
  Good: 'bg-green-500',
  'Needs Improvement': 'bg-yellow-500',
  Poor: 'bg-red-500',
}

interface MetricCardProps {
  metric: Metric
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className={`border-2 ${statusColors[metric.status]}`}>
      <div className="flex items-center justify-around">
        <CardTitle className="text-xl font-medium capitalize text-wrap">
          {metric.name}
        </CardTitle>
        <Link href={metric.link} target="_blank">
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-4xl font-bold">p75: {metric.value}</p>
          <p
            className={`font-semibold text-lg ${statusColors[metric.status].replace('border-', 'text-')}`}
          >
            {metric.status}
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 flex overflow-hidden">
            {metric.distributions.map((dist, index) => (
              <div
                key={index}
                className={`${distributionColors[dist.name]} h-4`}
                style={{ width: `${dist.percentage}%` }}
                title={`${dist.name}: ${dist.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
            <span>Good</span>
            <span>Poor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
