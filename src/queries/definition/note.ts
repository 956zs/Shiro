import type {
  NoteModel,
  NoteWrappedPayload,
  NoteWrappedWithLikedPayload,
} from '@mx-space/api-client'
import { useMutation } from '@tanstack/react-query'

import { useResetAutoSaverData } from '~/components/modules/dashboard/writing/BaseWritingProvider'
import { cloneDeep } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import type { NoteDto } from '~/models/writing'

import { defineQuery } from '../helper'

const LATEST_KEY = 'latest'
export const note = {
  byNid: (nid: string, password?: string | null, token?: string) =>
    defineQuery({
      queryKey: ['note', nid, token],

      queryFn: async ({ queryKey }) => {
        const [, id] = queryKey

        if (id === LATEST_KEY) {
          return (await apiClient.note.getLatest()).$serialized
        }
        // const data = await apiClient.note.getNoteById(+queryKey[1], password!)
        const data = await apiClient.note.proxy
          .nid(id)
          .get<NoteWrappedWithLikedPayload>({
            params: {
              password,
              token,
            },
          })

        return { ...data } as NoteWrappedPayload
      },
    }),
}

export const noteAdmin = {
  paginate: (page?: number) =>
    defineQuery({
      queryKey: ['noteAdmin', 'paginate', page],
      queryFn: async ({ pageParam }: any) => {
        const data = await apiClient.note.getList(pageParam ?? page)

        return data.$serialized
      },
    }),

  allTopic: () =>
    defineQuery({
      queryKey: ['noteAdmin', 'allTopic'],
      queryFn: async () => {
        const data = await apiClient.topic.getAll()

        return data.$serialized.data
      },
    }),

  getNote: (id: string) =>
    defineQuery({
      queryKey: ['noteAdmin', 'getNote', id],
      queryFn: async () => {
        const data = await apiClient.note.getNoteById(id)

        const dto = data.$serialized as NoteDto

        return dto
      },
    }),
}

export const useCreateNote = () => {
  const resetAutoSaver = useResetAutoSaverData()
  return useMutation({
    mutationFn: (data: NoteDto) => {
      const readonlyKeys = [
        'id',
        'nid',
        'modified',
        'topic',
      ] as (keyof NoteModel)[]
      const nextData = cloneDeep(data) as any
      for (const key of readonlyKeys) {
        delete nextData[key]
      }
      return apiClient.note.proxy.post<{
        id: string
      }>({
        data: nextData,
      })
    },
    onSuccess: () => {
      toast.success('Created successfully')
      resetAutoSaver('note')
    },
  })
}

export const useUpdateNote = () => {
  const resetAutoSaver = useResetAutoSaverData()
  return useMutation({
    mutationFn: (data: NoteDto) => {
      const { id } = data
      const readonlyKeys = [
        'id',
        'nid',
        'modified',
        'topic',
      ] as (keyof NoteModel)[]
      const nextData = cloneDeep(data) as any
      for (const key of readonlyKeys) {
        delete nextData[key]
      }
      return apiClient.note.proxy(id).put<{
        id: string
      }>({
        data: nextData,
      })
    },
    onSuccess: ({ id }) => {
      toast.success('Updated successfully')
      resetAutoSaver('note', id)
    },
  })
}
