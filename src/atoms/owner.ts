import { atom } from 'jotai'

import { getToken, removeToken, setToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'
import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'

import { refreshToken } from './hooks/owner'
import { fetchAppUrl } from './url'

export const ownerAtom = atom((get) => {
  return get(aggregationDataAtom)?.user
})
export const isLoggedAtom = atom(false)

export const login = async (username?: string, password?: string) => {
  if (username && password) {
    const user = await apiClient.user.login(username, password).catch((err) => {
      console.error(err)
      toast.error('Please try again')
      throw err
    })
    if (user) {
      const { token } = user
      setToken(token)
      jotaiStore.set(isLoggedAtom, true)

      await fetchAppUrl()
      toast.success(`Welcome back, ${jotaiStore.get(ownerAtom)?.name}`)
    }

    return true
  }

  const token = getToken()
  if (!token) {
    return
  }
  // const outdateToast = () => toast.warn('Login session expired, please log in again!')
  const validated = await apiClient.user
    .checkTokenValid(token)
    .then((res) => !!res.ok)

    .catch(() => {
      removeToken()
      // outdateToast()
      return false
    })

  if (!validated) {
    // outdateToast()
    removeToken()
    return
  }

  await refreshToken()

  return true
}

export const isLogged = () => jotaiStore.get(isLoggedAtom)
