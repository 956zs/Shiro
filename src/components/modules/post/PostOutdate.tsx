'use client'

import dayjs from 'dayjs'

import { Banner } from '~/components/ui/banner'
import { RelativeTime } from '~/components/ui/relative-time'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const PostOutdate = () => {
  const time = useCurrentPostDataSelector((s) => s?.modified)
  if (!time) {
    return null
  }
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <Banner type="warning" className="my-10">
      <span className="leading-[1.8]">
        This post was last updated <RelativeTime date={time} /> and may be
        outdated. If you have questions, please contact the author.
      </span>
    </Banner>
  ) : null
}
