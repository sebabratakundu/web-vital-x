import { Metric } from '@/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import MetricCard from './MetricCard'

export const MetricTitle = ({ metric }: { metric: Metric }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer">
        {metric.name}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Details</AlertDialogTitle>
          <MetricCard metric={metric} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
