'use client'


import React from 'react'
import { Button } from './ui/button'
import { getAurinkoAuthUrl } from '@/lib/aurinko'

const LinkAccountButton = () => {
  return (
    <Button onClick={async() => {
        const url = await getAurinkoAuthUrl('Google');
        window.location.href = url;
    }}>Link Account</Button>
  )
}

export default LinkAccountButton