import { useQuery } from '@tanstack/react-query'

import { MotionButtonBase } from '~/components/ui/button'
import { toast } from '~/lib/toast'

export const Hitokoto = () => {
  const {
    data: hitokoto,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['hitokoto'],
    queryFn: () =>
      fetchHitokoto([
        SentenceType.Animation,
        SentenceType.Original,
        SentenceType.Philosophy,
        SentenceType.Literature,
      ]),
    refetchInterval: 1000 * 60 * 60 * 24,
    staleTime: Infinity,
    select(data) {
      const postfix = Object.values({
        from: data.from,
        from_who: data.from_who,
        creator: data.creator,
      }).find(Boolean)
      if (!data.hitokoto) {
        return 'No quote information available.'
      } else {
        return data.hitokoto + (postfix ? ` —— ${postfix}` : '')
      }
    },
  })

  if (!hitokoto) return null
  if (isLoading) return <div className="loading loading-dots" />
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="leading-normal">{hitokoto}</span>
      <div className="ml-0 flex items-center space-x-2">
        <MotionButtonBase onClick={() => refetch()}>
          <i className="i-mingcute-refresh-2-line" />
        </MotionButtonBase>

        <MotionButtonBase
          onClick={() => {
            navigator.clipboard.writeText(hitokoto)
            toast.success('Copied')
            toast.info(hitokoto)
          }}
        >
          <i className="i-mingcute-copy-line" />
        </MotionButtonBase>
      </div>
    </div>
  )
}

export enum SentenceType {
  'Animation' = 'a', // Animation
  'Comic' = 'b', // Comic
  'Game' = 'c', // Game
  'Literature' = 'd', // Literature
  'Original' = 'e', // Original
  'From the Internet' = 'f', // From the Internet
  'Other' = 'g', // Other
  'Film/TV' = 'h', // Film/TV
  'Poetry' = 'i', // Poetry
  'NetEase Cloud' = 'j', // NetEase Cloud
  'Philosophy' = 'k', // Philosophy
  'Witty' = 'l', // Witty
}
export const fetchHitokoto = async (
  type: SentenceType[] | SentenceType = SentenceType.Literature,
) => {
  const json = await fetch(
    `https://v1.hitokoto.cn/${
      Array.isArray(type)
        ? `?${type.map((t) => `c=${t}`).join('&')}`
        : `?c=${type}`
    }`,
  )
  const data = (await (json.json() as unknown)) as {
    id: number
    hitokoto: string
    type: string
    from: string
    from_who: string
    creator: string
    creator_uid: number
    reviewer: number
    uuid: string
    created_at: string
  }

  return data
}
