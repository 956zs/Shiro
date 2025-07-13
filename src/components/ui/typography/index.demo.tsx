import type { DocumentComponent, DocumentPageMeta } from 'storybook/typings'

import { EllipsisHorizontalTextWithTooltip } from './EllipsisWithTooltip'

export const EllipsisTextWithTooltipDemo: DocumentComponent = () => {
  return (
    <EllipsisHorizontalTextWithTooltip width="12rem">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
    </EllipsisHorizontalTextWithTooltip>
  )
}

EllipsisTextWithTooltipDemo.meta = {
  title: 'Ellipsis Text with Tooltip',
  description:
    'If the text overflows, it will be omitted, and a Tooltip will be displayed when omitted',
}

export const metadata: DocumentPageMeta = {
  title: 'Text Overflow',
  description: 'A simple component to handle text overflow ellipsis',
}
