import { useEffect } from 'react'

import { useModalStack } from '~/components/ui/modal/stacked/provider'

/**
 *
 * @param enable
 * @param comparedFn true: 不提示，false: 提示
 */
export const useSaveConfirm = (
  enable: boolean,
  comparedFn: () => boolean,
  message = 'Are you sure you want to leave?',
): void => {
  const beforeUnloadHandler = (event: any) => {
    if (comparedFn()) {
      return
    }
    event.preventDefault()

    // Chrome requires returnValue to be set.
    event.returnValue = message
    return false
  }

  useEffect(() => {
    if (enable) {
      window.addEventListener('beforeunload', beforeUnloadHandler)
    }

    return () => {
      if (enable) {
        window.removeEventListener('beforeunload', beforeUnloadHandler)
      }
    }
  }, [])

  const { present } = useModalStack()
}
