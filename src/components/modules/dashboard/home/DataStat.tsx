import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { StyledButton } from '~/components/ui/button'
import { RelativeTime } from '~/components/ui/relative-time'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

import {
  CodeIcon,
  FluentGuest28Filled,
  IcBaselineFavoriteBorder,
  IcSharpPeopleOutline,
  MingcuteGame1Line,
  NotebookMinimalistic,
  PhAlignLeft,
  RedisIcon,
  SolarPieChartBroken,
  TablerActivityHeartbeat,
} from './icons'

interface CardProps {
  label: string
  value: number | string
  icon: ReactNode
  actions?: {
    name: string
    onClick: () => void
    primary?: boolean
    showBadage?: boolean
  }[]

  highlight?: boolean
}

export const DataStat = () => {
  const { data: stat, dataUpdatedAt } = useQuery({
    queryKey: ['stat'],
    queryFn: () => fetchStat(),

    refetchInterval: 1000 * 15,
  })

  const { data: counts } = useQuery({
    queryKey: ['readAndLikeCounts'],
    queryFn: () => fetchReadAndLikeCounts(),
    select(data) {
      if (!data) return
      return {
        readAndLikeCounts: data,
      }
    },
  })

  const { data: siteWordCount } = useQuery({
    queryKey: ['siteWordCount'],
    queryFn: () => fetchSiteWordCount(),
    select(data) {
      if (!data) return
      return data.data.length
    },
  })
  const { readAndLikeCounts } = counts || {}
  const navigate = useNavigate()

  const dataStat = useMemo<CardProps[]>(() => {
    if (!stat) return []
    return [
      {
        label: 'Articles',
        value: stat.posts,
        icon: <CodeIcon />,
        actions: [
          {
            name: 'Write',
            primary: true,
            onClick() {
              navigate('/dashboard/posts/edit')
            },
          },
          {
            name: 'Manage',
            onClick() {
              navigate('/dashboard/posts/list')
            },
          },
        ],
      },

      {
        label: 'Notes',
        value: stat.notes,
        icon: <i className="i-mingcute-quill-pen-line" />,
        actions: [
          {
            name: 'Write',
            primary: true,
            onClick() {
              navigate('/dashboard/notes/edit')
            },
          },
          {
            name: 'Manage',
            onClick() {
              navigate('/dashboard/notes/list')
            },
          },
        ],
      },

      {
        label: 'Pages',
        value: stat.pages,
        icon: <i className="i-mingcute-file-line" />,
        actions: [
          {
            primary: true,
            name: 'Manage',
            onClick() {
              navigate('/dashboard/pages')
            },
          },
        ],
      },

      {
        label: 'Categories',
        value: stat.categories,
        icon: <i className="i-mingcute-pen-line" />,
        actions: [
          {
            primary: true,
            name: 'Manage',
            onClick() {
              navigate('/dashboard/posts/category')
            },
          },
        ],
      },

      {
        label: 'Unread Comments',
        value: stat.unreadComments,
        icon: <i className="i-mingcute-comment-line" />,
        highlight: stat.unreadComments > 0,
        actions: [
          {
            primary: true,
            name: 'Manage',
            onClick() {
              navigate('/dashboard/comments')
            },
          },
        ],
      },

      {
        label: 'Cache',
        value: 'Redis',
        icon: <RedisIcon />,
        actions: [
          {
            primary: false,
            name: 'Clear API Cache',
            onClick() {
              apiClient.proxy.clean_catch.get().then(() => {
                toast.success('Cleared successfully')
              })
            },
          },
          {
            primary: false,
            name: 'Clear Data Cache',
            onClick() {
              apiClient.proxy.clean_redis.get().then(() => {
                toast.success('Cleared successfully')
              })
            },
          },
        ],
      },

      {
        label: 'Total API Calls',
        value: stat.callTime,
        icon: <TablerActivityHeartbeat />,
      },
      {
        label: "Today's IP Visits",
        value: stat.todayIpAccessCount,
        icon: <SolarPieChartBroken />,
      },
      {
        label: 'Total Site Characters',
        value: siteWordCount,
        icon: <PhAlignLeft />,
      },

      {
        label: 'Total Reads',
        value: readAndLikeCounts?.totalReads,
        icon: <NotebookMinimalistic />,
      },
      {
        label: 'Total Likes',
        value: readAndLikeCounts?.totalLikes,
        icon: <IcBaselineFavoriteBorder />,
      },

      {
        label: 'Current Online Visitors',
        value: stat.online,
        icon: <IcSharpPeopleOutline />,
      },
      {
        label: "Today's Visitors",
        value: stat.todayOnlineTotal,
        icon: <FluentGuest28Filled />,
      },
      {
        value: stat.todayMaxOnline,
        label: 'Today Max Concurrent Online',
        icon: <MingcuteGame1Line />,
      },
    ]
  }, [
    navigate,
    readAndLikeCounts?.totalLikes,
    readAndLikeCounts?.totalReads,
    siteWordCount,
    stat,
  ])

  return (
    <div className="relative @container">
      <h3 className="mb-4 text-xl font-light text-opacity-80">
        Data Board:
        <small className="text-sm">
          Data updated at: <RelativeTime date={new Date(dataUpdatedAt)} />
        </small>
      </h3>
      <div className="grid grid-cols-1 gap-6 @[550px]:grid-cols-2 @[900px]:grid-cols-3 @[1124px]:grid-cols-4 @[1200px]:grid-cols-5">
        {dataStat.map((stat) => (
          <div
            className={clsx(
              'relative rounded-md border p-4',
              stat.highlight && 'border-accent bg-accent/20',
            )}
            key={stat.label}
          >
            <div className="font-medium">{stat.label}</div>

            <div className="my-2 text-2xl font-medium">
              {formatNumber(stat.value)}
            </div>

            <div className="center absolute right-4 top-1/2 flex -translate-y-1/2 text-[30px]">
              {stat.icon}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {stat.actions?.map((action) => (
                <StyledButton
                  variant={action.primary ? 'primary' : 'secondary'}
                  key={action.name}
                  className="rounded-md shadow-none"
                  onClick={action.onClick}
                >
                  {action.name}
                </StyledButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const formatNumber = (num: string | number) => {
  const isNumber = !Number.isNaN(+num)
  if (!isNumber) return num
  return Intl.NumberFormat().format(+num)
}

const fetchStat = async () => {
  const counts = (await apiClient.aggregate.proxy.stat.get()) as any

  return counts
}

const fetchReadAndLikeCounts = async () =>
  await apiClient.aggregate.proxy.count_read_and_like.get<{
    totalLikes: number
    totalReads: number
  }>()

const fetchSiteWordCount = async () =>
  await apiClient.proxy.aggregate.count_site_words.get<{
    data: { length: number }
  }>()
