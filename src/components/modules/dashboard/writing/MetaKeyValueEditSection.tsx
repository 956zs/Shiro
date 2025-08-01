import { Label } from '@radix-ui/react-label'
import type { FC } from 'react'
import { useMemo, useRef } from 'react'

import { StyledButton } from '~/components/ui/button'
import { CodeEditor } from '~/components/ui/code-editor'
import { HighLighterPrismCdn } from '~/components/ui/code-highlighter'
import { useModalStack } from '~/components/ui/modal'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { toast } from '~/lib/toast'

type KeyValueString = string
interface MetaKeyValueEditSectionProps {
  keyValue: object | KeyValueString
  onChange: (keyValue: object) => void
}

const safeParse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const TAB_SIZE = 2

export const MetaKeyValueEditSection: FC<MetaKeyValueEditSectionProps> = (
  props,
) => {
  const { keyValue, onChange } = props
  const objectValue = useMemo(
    () => (typeof keyValue === 'string' ? safeParse(keyValue) : keyValue),
    [keyValue],
  )
  const { present } = useModalStack()
  const handlePresentModal = useEventCallback(() => {
    present({
      title: `Edit Metadata`,
      clickOutsideToDismiss: false,
      content: ({ dismiss }) => (
        <EditorModal
          value={JSON.stringify(objectValue, null, TAB_SIZE)}
          onChange={onChange}
          dismiss={dismiss}
        />
      ),
    })
  })

  const jsonString = JSON.stringify(objectValue, null, TAB_SIZE)
  return (
    <div className="relative flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Label>Meta</Label>

        <StyledButton variant="secondary" onClick={handlePresentModal}>
          Edit
        </StyledButton>
      </div>
      <HighLighterPrismCdn key={jsonString} lang="json" content={jsonString} />
    </div>
  )
}

const isValidJSONString = (value: string) => {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

const EditorModal: FC<{
  value: string
  dismiss: () => void
  onChange: (value: object) => void
}> = ({ value, onChange, dismiss }) => {
  const currentEditValueRef = useRef(value)

  const handleSave = () => {
    if (!isValidJSONString(currentEditValueRef.current)) {
      toast.error('Invalid JSON format, please check and try again')
      return
    }
    onChange(JSON.parse(currentEditValueRef.current) as Record<string, unknown>)

    dismiss()
  }

  return (
    <div className="relative flex w-full grow flex-col lg:w-[600px]">
      <div className="relative max-h-[450px] w-full overflow-auto">
        <CodeEditor
          minHeight="350px"
          content={value}
          language="json"
          onChange={(value) => {
            currentEditValueRef.current = value
          }}
        />
      </div>
      <div className="flex shrink-0 justify-end p-2">
        <StyledButton onClick={handleSave}>Save</StyledButton>
      </div>
    </div>
  )
}
