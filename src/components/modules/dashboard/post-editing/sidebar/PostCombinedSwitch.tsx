import { LabelSwitch } from '~/components/ui/switch'

import { usePostModelSingleFieldAtom } from '../data-provider'

export const PostCombinedSwitch = () => {
  const [copyright, setCopyright] = usePostModelSingleFieldAtom('copyright')
  const [pin, setPin] = usePostModelSingleFieldAtom('pin')

  const [allowComment, setAllowComment] =
    usePostModelSingleFieldAtom('allowComment')

  return (
    <>
      <LabelSwitch
        checked={copyright}
        label="Copyright Info"
        onCheckedChange={setCopyright}
      />

      <LabelSwitch
        checked={!!pin}
        onCheckedChange={(pin) => {
          setPin(pin ? new Date().toISOString() : null)
        }}
      >
        <span>Pin</span>
      </LabelSwitch>

      <LabelSwitch checked={allowComment} onCheckedChange={setAllowComment}>
        <span>Allow Comments</span>
      </LabelSwitch>
    </>
  )
}
