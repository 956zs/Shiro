import { EmptyIcon } from '~/components/icons/empty'
import { NormalContainer } from '~/components/layout/container/Normal'

export const NothingFound: Component = () => {
  return (
    <NormalContainer className="center flex h-[500px] flex-col space-y-4 [&_p]:my-4">
      <EmptyIcon />
      <p>Nothing here</p>
      <p>Check back later!</p>
    </NormalContainer>
  )
}
