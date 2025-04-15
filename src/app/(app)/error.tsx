'use client'

import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'
import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default ({ error, reset }: any) => {
  useEffect(() => {
    console.error('error', error)
    // captureException(error)
  }, [error])

  return (
    <NormalContainer>
      <div className="center flex min-h-[calc(100vh-10rem)] flex-col">
        <h2 className="mb-5 text-center">
          <p>An error occurred while rendering the page</p>
          <p>
            If the error persists, please contact the developer{' '}
            <a href="mailto:i@innei.in">Innei</a>, thank you!
          </p>
        </h2>
        <StyledButton onClick={() => window.location.reload()}>
          Refresh
        </StyledButton>
      </div>
    </NormalContainer>
  )
}
