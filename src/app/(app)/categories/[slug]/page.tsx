import Link from 'next/link'

import { BackToTopFAB } from '~/components/ui/fab'
import { TimelineList } from '~/components/ui/list/TimelineList'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { definePrerenderPage } from '~/lib/request.server'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { getData } from './api'

export default definePrerenderPage<{ slug: string }>()({
  fetcher(params) {
    return getData({ slug: params.slug })
  },

  Component: ({ data, params: { slug } }) => {
    const { name, children } = data

    return (
      <BottomToUpSoftScaleTransitionView>
        <header className="prose">
          <h1>Category - {name}</h1>

          <h3 className="font-light">
            {children.length > 0
              ? `There are currently ${children.length} articles. Keep it up!`
              : `There's nothing here yet. Stay tuned!`}
          </h3>
        </header>

        <main className="mt-10 text-zinc-950/80 dark:text-zinc-50/80">
          <TimelineList>
            {children.map((child, i) => {
              const date = new Date(child.created)

              return (
                <BottomToUpTransitionView
                  key={child.id}
                  delay={700 + 50 * i}
                  as="li"
                  className="flex min-w-0 items-center justify-between leading-loose"
                >
                  <Link
                    href={routeBuilder(Routes.Post, {
                      slug: child.slug,
                      category: slug as string,
                    })}
                    className="min-w-0 truncate"
                  >
                    {child.title}
                  </Link>
                  <span className="meta ml-2">
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </BottomToUpTransitionView>
              )
            })}
          </TimelineList>
        </main>
        <BackToTopFAB />
      </BottomToUpSoftScaleTransitionView>
    )
  },
})
