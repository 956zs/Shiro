'use client'

import type { LinkModel } from '@mx-space/api-client'
import { LinkState, LinkType, RequestError } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import Markdown from 'markdown-to-jsx'
import { m } from 'motion/react'
import type { FC } from 'react'
import { memo, useCallback, useRef, useState } from 'react'

import { NotSupport } from '~/components/common/NotSupport'
import { Avatar } from '~/components/ui/avatar'
import { StyledButton } from '~/components/ui/button'
import { Collapse } from '~/components/ui/collapse'
import { BackToTopFAB } from '~/components/ui/fab'
import type { FormContextType } from '~/components/ui/form'
import { Form, FormInput } from '~/components/ui/form'
import { FullPageLoading } from '~/components/ui/loading'
import { useModalStack } from '~/components/ui/modal'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { shuffle } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { getErrorMessageFromRequestError } from '~/lib/request.shared'
import { toast } from '~/lib/toast'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

const renderTitle = (text: string) => {
  return <h1 className="!my-12 !text-xl font-bold">{text}</h1>
}

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data } = await apiClient.link.getAll()
      return data
    },
    select: useCallback((data: LinkModel[]) => {
      const friends: LinkModel[] = []
      const collections: LinkModel[] = []
      const outdated: LinkModel[] = []
      const banned: LinkModel[] = []

      for (const link of data) {
        if (link.hide) {
          continue
        }

        switch (link.state) {
          case LinkState.Banned: {
            banned.push(link)
            continue
          }
          case LinkState.Outdate: {
            outdated.push(link)
            continue
          }
        }

        switch (link.type) {
          case LinkType.Friend: {
            friends.push(link)
            break
          }
          case LinkType.Collection: {
            collections.push(link)
          }
        }
      }

      return { friends: shuffle(friends), collections, outdated, banned }
    }, []),
  })

  if (isLoading) return <FullPageLoading />
  if (!data) return null
  const { banned, collections, friends, outdated } = data
  return (
    <div>
      <header className="prose prose-p:my-2">
        <h1>Friends</h1>
        <h3>海內存知己，天涯若比鄰</h3>
      </header>

      <main className="mt-10 flex w-full flex-col">
        {friends.length > 0 && (
          <>
            {collections.length > 0 && renderTitle('My friends / 我的朋友')}
            <FriendSection data={friends} />
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length > 0 && renderTitle('My favorites / 我的收藏')}
            <FavoriteSection data={collections} />
          </>
        )}

        {outdated.length > 0 && (
          <>
            <Collapse
              title={
                <div className="mt-8 font-bold">
                  The following sites cannot be accessed, have been disconnected
                  / 以下站點無法訪問，已失聯
                </div>
              }
            >
              <OutdateSection data={outdated} />
            </Collapse>
          </>
        )}
        {banned.length > 0 && (
          <>
            <Collapse
              title={
                <div className="mt-8 font-bold">
                  The following sites are not compliant and have been banned /
                  以下站點不合規，已被禁止
                </div>
              }
            >
              <BannedSection data={banned} />
            </Collapse>
          </>
        )}
      </main>

      <ApplyLinkInfo />
      <BackToTopFAB />
    </div>
  )
}
type FriendSectionProps = {
  data: LinkModel[]
}

const FriendSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <section className="grid grid-cols-2 gap-6 md:grid-cols-3 2xl:grid-cols-3">
      {data.map((link) => {
        return (
          <BottomToUpTransitionView key={link.id} duration={50}>
            <Card link={link} />
          </BottomToUpTransitionView>
        )
      })}
    </section>
  )
}

const LayoutBg = memo(() => {
  return (
    <m.span
      layoutId="bg"
      className="absolute -inset-2 z-[-1] rounded-md bg-slate-200/80 dark:bg-neutral-600/80"
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.2 } }}
    />
  )
})
LayoutBg.displayName = 'LayoutBg'

const Card: FC<{ link: LinkModel }> = ({ link }) => {
  const [enter, setEnter] = useState(false)

  return (
    <m.a
      layoutId={link.id}
      href={link.url}
      target="_blank"
      role="link"
      aria-label={`Go to ${link.name}'s website`}
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
      rel="noreferrer"
    >
      {enter && <LayoutBg />}

      <Avatar
        randomColor
        imageUrl={link.avatar}
        lazy
        radius={8}
        text={link.name[0]}
        alt={`Avatar of ${link.name}`}
        size={64}
        className="ring-2 ring-gray-400/30 dark:ring-zinc-50"
      />
      <span className="flex h-full flex-col items-center justify-center space-y-2 py-3">
        <span className="text-lg font-medium">{link.name}</span>
        <span className="line-clamp-2 text-balance break-all text-center text-sm text-base-content/80">
          {link.description}
        </span>
      </span>
    </m.a>
  )
}

const FavoriteSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul className="relative flex w-full grow flex-col gap-4">
      {data.map((link) => {
        return (
          <li key={link.id} className="flex w-full items-end">
            <a
              href={link.url}
              target="_blank"
              className="shrink-0 text-base leading-none"
              rel="noreferrer"
            >
              {link.name}
            </a>

            <span className="ml-2 h-[12px] max-w-full truncate break-all text-xs leading-none text-base-content/80">
              {link.description || ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

const OutdateSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul className="space-y-1 p-4 opacity-80">
      {data.map((link) => {
        return (
          <li key={link.id}>
            <span className="cursor-not-allowed font-medium">{link.name}</span>
            <span className="ml-2 text-sm">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

const BannedSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul className="space-y-1 p-4 opacity-40">
      {data.map((link) => {
        return (
          <li key={link.id}>
            <span className="cursor-not-allowed">{link.name}</span>
          </li>
        )
      })}
    </ul>
  )
}

const ApplyLinkInfo: FC = () => {
  const {
    seo,
    user: { avatar, name },
  } = useAggregationSelector((a) => ({
    seo: a.seo!,
    user: a.user!,
  }))!

  const { data: canApply } = useQuery({
    queryKey: ['can-apply'],
    queryFn: () => apiClient.link.canApplyLink(),
    initialData: true,
    refetchOnMount: 'always',
  })
  const { present } = useModalStack()
  if (!canApply) {
    return (
      <NotSupport
        className="mt-20"
        text="The owner has banned the application for a friend link. / 站長禁止了申請友鏈。"
      />
    )
  }
  return (
    <>
      <div className="prose mt-20">
        <Markdown>
          {[
            `- Please ensure that your site has a link to mine before applying for approval. If the approval is passed, I will remove the link from my site, and add you to the blacklist.`,
            `- If your site is inaccessible for a long time, I will remove your link, and you can apply again after recovery.`,
            `- Ensure your site does not contain politically sensitive issues or illegal content. No excessive ads, no malware, no scripts. And reprinted articles must indicate the source.`,
            `- Ensure your site globally enables HTTPS`,
            `- You need to have your own independent domain, and for now, I don't agree to friend link applications from public subdomains or free domains (such as github.io, vercel.app, eu.org, js.cool, .tk, .ml, .cf, etc.)`,
            `- For now, I don't agree to friend link applications from commercial and non-personal websites`,
          ].join('\n\n')}
        </Markdown>
        <Markdown className="[&_p]:!my-1">
          {[
            '',
            `**Website title**: [${
              seo.title
            }](${`${location.protocol}//${location.host}`})`,
            `**Website description**: ${seo.description}`,
            `**My avatar**: [Click to download](${avatar})`,
            `**My name**: ${name}`,
          ].join('\n\n')}
        </Markdown>
      </div>

      <StyledButton
        variant="primary"
        className="mt-5"
        onClick={() => {
          present({
            title: 'I want to be friends with you! / 我想和你交朋友！',

            content: () => <FormModal />,
          })
        }}
      >
        Be friends with me!
      </StyledButton>
    </>
  )
}

const FormModal = () => {
  const { dismissTop } = useModalStack()
  const [inputs] = useState(() => [
    {
      name: 'author',
      placeholder: 'Nickname *',
      rules: [
        {
          validator: (value: string) => !!value,
          message: 'Nickname cannot be empty / 暱稱不能為空',
        },
        {
          validator: (value: string) => value.length <= 20,
          message:
            'Nickname cannot exceed 20 characters / 暱稱不能超過20個字符',
        },
      ],
    },
    {
      name: 'name',
      placeholder: 'Site Title *',
      rules: [
        {
          validator: (value: string) => !!value,
          message: 'Site title cannot be empty / 站點標題不能為空',
        },
        {
          validator: (value: string) => value.length <= 20,
          message:
            'Site title cannot exceed 20 characters / 站點標題不能超過20個字符',
        },
      ],
    },
    {
      name: 'url',
      placeholder: 'Website * https://',
      rules: [
        {
          validator: isHttpsUrl,
          message: 'Please enter a valid website link https://',
        },
      ],
    },
    {
      name: 'avatar',
      placeholder: 'Avatar Link * https://',
      rules: [
        {
          validator: isHttpsUrl,
          message: 'Please enter a valid avatar link https://',
        },
      ],
    },
    {
      name: 'email',
      placeholder: 'Leave your email *',

      rules: [
        {
          validator: isEmail,
          message: 'Please enter a valid email',
        },
      ],
    },
    {
      name: 'description',
      placeholder: 'Describe yourself in one sentence *',

      rules: [
        {
          validator: (value: string) => !!value,
          message: 'Please describe yourself in one sentence',
        },
        {
          validator: (value: string) => value.length <= 50,
          message: 'Description should not exceed 50 characters',
        },
      ],
    },
  ])

  const formRef = useRef<FormContextType>(null)

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault()
      const currentValues = formRef.current?.getCurrentValues()
      if (!currentValues) return

      apiClient.link
        .applyLink({ ...(currentValues as any) })
        .then(() => {
          dismissTop()
          toast.success('Great!')
        })
        .catch((err) => {
          if (err instanceof RequestError)
            toast.error(getErrorMessageFromRequestError(err))
          else {
            toast.error(err.message)
          }
        })
    },
    [dismissTop],
  )

  return (
    <Form
      ref={formRef}
      className="w-full space-y-4 text-center lg:w-[300px]"
      onSubmit={handleSubmit}
    >
      {inputs.map((input) => (
        <FormInput key={input.name} {...input} />
      ))}

      <StyledButton variant="primary" type="submit">
        Great!
      </StyledButton>
    </Form>
  )
}

const isHttpsUrl = (value: string) => {
  return (
    /^https?:\/\/.*/.test(value) &&
    (() => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    })()
  )
}

const isEmail = (value: string) => {
  return /^.+@.+\..+$/.test(value)
}
