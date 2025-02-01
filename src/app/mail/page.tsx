'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Mail = dynamic(() => import('./mail'), {
  ssr: false,
})

const Page = () => {
  return (
    <Mail 
      defaultLayout={[20, 32, 48]}
      defaultCollapsible={false}
      navCollapsedSize={4}
    />
  )
}

export default Page