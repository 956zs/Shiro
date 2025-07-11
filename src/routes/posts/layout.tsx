import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'

export { Outlet as Component } from 'react-router-dom'

export const config = defineRouteConfig({
  title: 'Posts',
  icon: <i className="i-mingcute-code-line" />,
  priority: 2,
  redirect: '/posts/list',
})
