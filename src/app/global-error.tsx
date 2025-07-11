'use client'

import { domAnimation, LazyMotion } from 'motion/react'
import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'
import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    // captureException(error)
  }, [error])
  return (
    <html>
      <head>
        <title>Access Denied or API Service Error</title>
      </head>
      <body>
        <NormalContainer>
          <h1 className="mb-4">Access Denied or API Service Error</h1>
          <div className="flex justify-center">
            <LazyMotion features={domAnimation}>
              <StyledButton onClick={() => location.reload()}>
                Retry
              </StyledButton>
            </LazyMotion>
          </div>
        </NormalContainer>
      </body>
    </html>
  )
}
