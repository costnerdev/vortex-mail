'use client'

import { ModeToggle } from '@/components/theme-toggle'
import dynamic from 'next/dynamic'
import React from 'react'

const Mail = dynamic(() => import('./mail'), {
  ssr: false,
})

const Page = () => {
  return (
    <>
      <div className='absolute bottom-10 left-5 z-10'>
        <ModeToggle />
      </div>
      <Mail 
        defaultLayout={[20, 32, 48]}
        defaultCollapsible={false}
        navCollapsedSize={4}
      />
    </>
  )
}

export default Page