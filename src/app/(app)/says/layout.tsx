import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { WiderContainer } from '~/components/layout/container/Wider'

export const metadata: Metadata = {
  title: 'Words',
}
export default async function Layout(props: PropsWithChildren) {
  return <WiderContainer>{props.children}</WiderContainer>
}
