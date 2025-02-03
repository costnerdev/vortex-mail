import useThreads from '@/hooks/use-threads'
import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

type Props = {}

const ThreadList = (props: Props) => {
  const { threads } = useThreads();
    
  return (
    <div className='max-w-full overflow-y-scroll max-h-[calc(100vh-120px)]'>
      <div className='flex flex-col gap-2 p-4 pt-0'>
       
      </div>
    </div>
  )
}

export default ThreadList