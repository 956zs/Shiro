import type { FC, PropsWithChildren } from 'react'

import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { toast } from '~/lib/toast'

export const DeleteConfirmButton: FC<
  {
    onDelete: () => Promise<any>
    confirmText?: string
    deleteItemText?: string
  } & PropsWithChildren
> = (props) => {
  const { onDelete, confirmText, deleteItemText } = props

  const defaultButton = (
    <StyledButton
      variant="secondary"
      className="rounded-lg"
      onClick={() => {
        onDelete().then(() => {
          toast.success('Deleted successfully')
        })
      }}
    >
      Confirm
    </StyledButton>
  )

  return (
    <FloatPopover
      trigger="click"
      type="tooltip"
      triggerElement={
        <MotionButtonBase className="duration-200 hover:text-red-500">
          Delete
        </MotionButtonBase>
      }
    >
      <div className="flex p-2">
        <p className="text-center text-base font-bold text-error">
          {confirmText ??
            (deleteItemText
              ? `Are you sure you want to delete "${deleteItemText}"?`
              : 'Are you sure you want to delete this?')}
        </p>
      </div>
      <div className="text-right">{props.children || defaultButton}</div>
    </FloatPopover>
  )
}
