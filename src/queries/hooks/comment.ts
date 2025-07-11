import type { CommentModel, PaginateResult } from '@mx-space/api-client'
import { CommentState } from '@mx-space/api-client'
import type { InfiniteData, MutationOptions } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useSearchParams } from 'next/navigation'

import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

import { commentAdmin } from '../definition/comment'

const useGetCurrentCommentStateFromQuery = () => {
  const search = useSearchParams()
  const state = search.get('tab') as any as CommentState
  return state || CommentState.Unread
}
export const useUpdateCommentStateMutation = (
  options?: MutationOptions<any>,
) => {
  const queryClient = useQueryClient()

  const state = useGetCurrentCommentStateFromQuery()
  return useMutation({
    mutationKey: ['comment', 'updateState'],
    mutationFn: async ({ id, state }: { id: string; state: CommentState }) => {
      return apiClient.proxy.comments(id).patch({ data: { state } })
    },
    onMutate: async ({ id }) => {
      queryClient.setQueryData<InfiniteData<PaginateResult<CommentModel>>>(
        commentAdmin.byState(state).queryKey,
        produce((draft) => {
          draft?.pages.forEach((page) => {
            page.data = page.data.filter((comment) => comment.id !== id)
          })
        }),
      )
    },
    onSuccess: (...rest) => {
      options?.onSuccess?.apply(null, rest as any)
      toast.success('Operation successful')
    },
    onError: () => {
      toast.error('Operation failed')
    },
  })
}

export const useDeleteCommentMutation = (options?: MutationOptions<any>) => {
  const queryClient = useQueryClient()
  const state = useGetCurrentCommentStateFromQuery()

  return useMutation({
    mutationKey: ['comment', 'delete'],
    mutationFn: async ({ id }: { id: string }) => {
      return apiClient.proxy.comments(id).delete()
    },
    onMutate: async ({ id }) => {
      queryClient.setQueryData<InfiniteData<PaginateResult<CommentModel>>>(
        commentAdmin.byState(state).queryKey,
        produce((draft) => {
          draft?.pages.forEach((page) => {
            page.data = page.data.filter((comment) => comment.id !== id)
          })
        }),
      )
    },
    onSuccess: (...rest) => {
      toast.success('Deleted successfully')
      options?.onSuccess?.apply(null, rest as any)
    },
    onError: () => {
      toast.error('Delete failed')
    },
  })
}

export const useReplyCommentMutation = () => {
  const queryClient = useQueryClient()
  const state = useGetCurrentCommentStateFromQuery()

  return useMutation({
    mutationKey: ['comment', 'reply'],
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      return apiClient.proxy.comments.master.reply(id).post({
        data: {
          text: content,
        },
      })
    },
    onMutate({ id }) {
      queryClient.setQueryData<InfiniteData<PaginateResult<CommentModel>>>(
        commentAdmin.byState(state).queryKey,
        produce((draft) => {
          draft?.pages.forEach((page) => {
            page.data = page.data.filter((comment) => comment.id !== id)
          })
        }),
      )
    },
    onSuccess: (_) => {
      toast.success('Replied successfully')
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: commentAdmin.byState(state).queryKey,
      })

      toast.error('Reply failed')
    },
  })
}
