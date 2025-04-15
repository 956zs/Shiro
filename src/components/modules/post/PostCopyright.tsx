'use client'

import dayjs from 'dayjs'
import type { FC } from 'react'

import { Divider } from '~/components/ui/divider'
import { toast } from '~/lib/toast'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const PostCopyright: FC = () => {
  const name = useAggregationSelector((data) => data.user.name)

  const webUrl = useAggregationSelector((data) => data.url.webUrl)
  const data = useCurrentPostDataSelector(
    (data) => {
      if (!webUrl) return null
      if (!data) return null
      return {
        title: data.title,
        link: `${webUrl}/posts/${data.category.slug}/${data.slug}`,
        date: data.modified,
      }
    },
    [webUrl],
  )
  if (!data) return null
  const { title, link, date } = data
  return (
    <section
      className="mt-4 text-sm leading-loose text-gray-600 dark:text-neutral-400"
      id="copyright"
    >
      <p>Title: {title}</p>
      <p>Author: {name}</p>
      <p>
        Link: <span>{link}</span>{' '}
        <a
          onClick={() => {
            navigator.clipboard.writeText(link)
            toast.success('Copied the post link')
          }}
          data-hide-print
          className="cursor-pointer select-none"
        >
          [Copy]
        </a>
      </p>
      <p>
        Last modified:{' '}
        {date
          ? dayjs(date).format('YYYY 年 MM 月 DD 日 H:mm')
          : 'No modification yet'}
      </p>
      <Divider />
      <div>
        <p>
          Please contact the author for commercial use.
          <br />
          Please note the source and link of this article, you can freely copy
          and distribute the work in any media, modify and create, but when
          distributing derivative works, you must use the same license
          agreement.
          <br />
          This work is licensed under
          <a
            className="shiro-link--underline"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          >
            CC BY-NC-SA 4.0 - Non-commercial use - Same license 4.0
            International
          </a>
          license.
        </p>
      </div>
    </section>
  )
}
