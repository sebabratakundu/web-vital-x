import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Metric } from '@/types'
import { Folder, Info } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const statusColorMap: Record<Metric['status'], string> = {
  Good: 'bg-green-100 dark:bg-green-900',
  'Needs Improvement': 'bg-yellow-100 dark:bg-yellow-900',
  Poor: 'bg-red-100 dark:bg-red-900',
}

interface DataTableProps {
  metrics: Metric[]
}

export default function DataTable({ metrics }: DataTableProps) {
  return (
    <Table border={1}>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead className="flex items-center gap-2">
            <span>p75</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64 text-pretty">
                <p>
                  A historical view of the 75th percentile of user experiences
                  over the last 28 days. A good score means 75% of visits to
                  your site experienced that value or better.
                </p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.length === 0 && (
          <TableRow>
            <TableCell colSpan={3}>
              <div className="flex flex-col items-center justify-center py-10">
                <Folder className="h-12 w-12" />
                <p>No metrics found.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
        {metrics.map((metric) => (
          <TableRow key={metric.name} className={statusColorMap[metric.status]}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="capitalize">{metric.name}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={metric.link} target="_blank">
                      <Info className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-64 text-pretty">
                    <p>{metric.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
            <TableCell>{metric.value}</TableCell>
            <TableCell>{metric.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
