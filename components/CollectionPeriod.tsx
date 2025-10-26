import { Alert, AlertDescription } from './ui/alert'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Info } from 'lucide-react'
import { getHumanReadableDate } from '@/lib/helpers'
import { CollectionPeriod as CollectionPeriodType } from '@/types'

export const CollectionPeriod = ({
  collectionPeriod,
}: {
  collectionPeriod: { [key: string]: CollectionPeriodType }
}) => {
  if (Object.keys(collectionPeriod).length === 0) {
    return null
  }

  return (
    <Alert variant="info" className="flex items-center space-x-2 mb-4">
      <AlertDescription>Latest 28 days collections period</AlertDescription>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Collection periods are:</p>
          {Object.entries(collectionPeriod).map(([key, value]) => (
            <p key={key}>
              {key}: {getHumanReadableDate(value.firstDate)} to &nbsp;
              {getHumanReadableDate(value.lastDate)}
            </p>
          ))}
        </TooltipContent>
      </Tooltip>
    </Alert>
  )
}
