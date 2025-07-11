'use client'

import { useState } from 'react'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'

export const NotePasswordForm = () => {
  const [password, setPassword] = useState('')
  const handleSubmit: React.EventHandler<React.MouseEvent> = (e) => {
    e.preventDefault()
    window.location.href = `${window.location.href}?password=${password}`
  }
  return (
    <div className="center flex h-[calc(100vh-15rem)] flex-col space-y-4">
      Password required to view!
      <form className="center mt-8 flex flex-col space-y-4">
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter password to view"
          aria-label="Enter password to view"
        />
        <StyledButton
          disabled={!password}
          type="submit"
          variant="primary"
          onClick={handleSubmit}
        >
          Show me!
        </StyledButton>
      </form>
    </div>
  )
}
