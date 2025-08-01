import { useQuery } from '@tanstack/react-query'

import { DataStat } from '~/components/modules/dashboard/home/DataStat'
import { ShiJu } from '~/components/modules/dashboard/home/Shiju'
import { Version } from '~/components/modules/dashboard/home/Version'
import { IpInfoPopover } from '~/components/modules/dashboard/ip'
import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'
import { Hitokoto } from '~/components/modules/shared/Hitokoto'
import { parseDate } from '~/lib/datetime'
import { apiClient } from '~/lib/request'

export const config = defineRouteConfig({
  title: 'Home',
  icon: <i className="i-mingcute-dashboard-line" />,
  priority: 1,
})

export function Component() {
  return (
    <div className="mx-auto w-full max-w-[1500px] p-4">
      <h1 className="text-3xl font-light">Welcome back</h1>

      <div className="mt-8 flex flex-col gap-4 lg:grid lg:grid-cols-2">
        <div>
          <h3 className="my-[10px] font-light text-opacity-80">Hitokoto</h3>

          <Hitokoto />
        </div>
        <div>
          <h3 className="my-[10px] font-light text-opacity-80">Today's Poem</h3>
          <ShiJu />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        <UserLoginStat />

        <DataStat />

        <Version />
      </div>
    </div>
  )
}

const UserLoginStat = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.user.getMasterInfo(),
  })
  if (isLoading) return <div className="loading loading-dots" />
  if (!user) return null
  return (
    <div>
      <h3 className="mb-4 text-xl font-light text-opacity-80">Login Records</h3>
      <p className="relative -mt-2 mb-3 text-gray-500">
        <span className="flex items-center">
          <span>Last login IP: </span>
          {user.lastLoginIp ? <IpInfoPopover ip={user.lastLoginIp} /> : 'N/A'}
        </span>
        <div className="pt-[.5rem]" />
        <span>
          Last login time:{' '}
          {user.lastLoginTime ? (
            <time>{parseDate(user.lastLoginTime, 'YYYY-MM-DD dddd')}</time>
          ) : (
            'N/A'
          )}
        </span>
      </p>
    </div>
  )
}
