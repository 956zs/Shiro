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
            toast.success('Post link copied')
          }}
          data-hide-print
          className="cursor-pointer select-none"
        >
          [Copy]
        </a>
      </p>
      <p>
        Last modified:{' '}
        {date ? dayjs(date).format('YYYY-MM-DD H:mm') : 'Never modified'}
      </p>
      <Divider />
      <div>
        <p>
          For commercial use, please contact the site owner for authorization.
          For non-commercial use, please indicate the source and link to this
          article. You are free to copy, distribute, and modify this work in any
          medium or format, but derivative works must be licensed under the same
          terms.
          <br />
          This article is licensed under
          <a
            className="shiro-link--underline"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          >
            CC BY-NC-SA 4.0 - NonCommercial - ShareAlike 4.0 International
          </a>
          .
        </p>
      </div>
    </section>
  )
}
