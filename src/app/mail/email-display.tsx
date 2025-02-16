import useThreads from '@/hooks/use-threads'
import { cn } from '@/lib/utils'
import { RouterOutputs } from '@/trpc/react'
import { Email } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import Avatar from 'react-avatar'
import { Letter } from 'react-letter'


type Props = {
  email: RouterOutputs['account']['getThreads'][0]['emails'][0]
}

const EmailDisplay = ({email}: Props) => {
  const { account } = useThreads();
  const isMe = account?.emailAddress == email?.from.address;

  return (
    <div className={cn('w-full border rounded-md p-4 transition-all hover:translate-x-2', {
      'border-l-gray-900 border-l-4': isMe
    })}>

      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row gap-2'>
          <Avatar name={ email.from.name ?? email.from.address } size='35' round={true} textSizeRatio={2} />
          <span className='text-sm font-medium'>{ email.from?.address }</span>
        </div>
        <div className='flex ml-auto text-muted-foreground text-xs'>
          { formatDistanceToNow(email.sentAt as Date, { addSuffix: true }) }
        </div>
      </div>

      <div className="h-4"></div>
      <Letter className='bg-white rounded-md text-black overflow-auto' html={ email.body ?? '' } />

    </div>
  )
}

export default EmailDisplay