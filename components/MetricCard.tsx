import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Metric } from '@/types'
import { Info } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const statusColors: {
  [key: string]: {
    text: string
    border: string
  }
} = {
  Good: {
    text: 'text-green-500',
    border: 'border-green-500',
  },
  'Needs Improvement': {
    text: 'text-yellow-500',
    border: 'border-yellow-500',
  },
  Poor: {
    text: 'text-red-500',
    border: 'border-red-500',
  },
}

const distributionColors: { [key: string]: string } = {
  Good: 'bg-green-500',
  'Needs Improvement': 'bg-yellow-500',
  Poor: 'bg-red-500',
}

interface MetricCardProps {
  metric: Metric
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className={`border-2 ${statusColors[metric.status].border}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-xl font-medium capitalize text-wrap">
              {metric.name}
            </CardTitle>
            <CardDescription>{metric.description}</CardDescription>
          </div>
          <Link href={metric.link} target="_blank">
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-4xl font-bold">{metric.value}ms</p>
          <p
            className={`font-semibold text-lg ${statusColors[metric.status].text}`}
          >
            {metric.status}
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2.5 flex overflow-hidden">
            {metric.distributions.map((dist, index) => (
              <div
                key={index}
                className={`${distributionColors[dist.name]} h-2.5`}
                style={{ width: `${dist.percentage}%` }}
                title={`${dist.name}: ${dist.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>Good</span>
            <span>Needs Improvement</span>
            <span>Poor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
