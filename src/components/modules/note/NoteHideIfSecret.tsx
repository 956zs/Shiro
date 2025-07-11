'use client'

import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

import { useIsLogged } from '~/atoms/hooks'
import { toast } from '~/lib/toast'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

export const NoteHideIfSecret: Component = ({ children }) => {
  const noteSecret = useCurrentNoteDataSelector((data) => data?.data.publicAt)

  const noteId = useCurrentNoteDataSelector((data) => data?.data.nid)
  const secretDate = useMemo(() => new Date(noteSecret!), [noteSecret])
  const isSecret = noteSecret ? dayjs(noteSecret).isAfter(new Date()) : false

  const isLogged = useIsLogged()

  useEffect(() => {
    if (!noteId) return
    let timer: any
    const timeout = +secretDate - Date.now()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        toast.info('Refresh to view the unlocked article', { autoClose: false })
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate, noteId])

  if (!noteId) return null

  if (isSecret) {
    const dateFormat = noteSecret
      ? Intl.DateTimeFormat('zh-cn', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
          day: 'numeric',
          month: 'long',
        }).format(new Date(noteSecret))
      : ''

    if (isLogged) {
      return (
        <>
          <div className="my-6 text-center">
            <p>This is a private article. (Will be unlocked at {dateFormat})</p>
            <p>You are currently logged in, preview mode:</p>
          </div>
          {children}
        </>
      )
    }
    return (
      <div className="my-6 text-center">
        This article is not public yet. It will be unlocked at {dateFormat}.
        Please wait a bit longer.
      </div>
    )
  }
  return children
}
