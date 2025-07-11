'use client'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'
import type { FC } from 'react'

import { MotionButtonBase } from '~/components/ui/button'

import { useIsEnableSubscribe, usePresentSubscribeModal } from './hooks'

type SubscribeType = keyof typeof SubscribeTypeToBitMap
interface SubscribeBellProps {
  defaultType: SubscribeType[] | SubscribeType
}
export const SubscribeBell: FC<SubscribeBellProps> = (props) => {
  const { defaultType } = props
  const canSubscribe = useIsEnableSubscribe()
  const { present } = usePresentSubscribeModal(
    ([] as SubscribeType[]).concat(defaultType),
  )

  if (!canSubscribe) {
    return null
  }

  return (
    <div
      className="mb-6 flex flex-col items-center justify-center p-4"
      data-hide-print
    >
      <p className="leading-8 opacity-80">
        Email subscription is enabled. Click the bell to subscribe to the latest
        posts!
      </p>
      <MotionButtonBase onClick={present}>
        <span className="sr-only">Subscribe</span>
        <i className="i-material-symbols-notifications-active-outline mt-4 scale-150 text-3xl text-accent opacity-50 transition-opacity hover:opacity-100" />
      </MotionButtonBase>
    </div>
  )
}
