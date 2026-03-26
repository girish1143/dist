'use client'

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
      <SignUp
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={
          {
            signUp: {
              showOptionalFields: false,
            },
          } as any
        }
      />
    </>
  )
}
