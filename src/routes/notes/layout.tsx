import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'

export { Outlet as Component } from 'react-router-dom'

export const config = defineRouteConfig({
  title: 'Notes',
  icon: <i className="i-mingcute-table-2-line" />,
  priority: 3,
  redirect: '/notes/list',
})
