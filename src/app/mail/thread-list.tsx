import useThreads from '@/hooks/use-threads'
import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { format, formatDistance, formatDistanceToNow, subDays } from 'date-fns'
import { cn } from '@/lib/utils'

type Props = {}

const ThreadList = (props: Props) => {
  const { threads, threadId, setThreadId } = useThreads();

  // Accumulate all threads and group by date to return json object with array as value
  const threadGroup = threads?.reduce((acc, thread) => { 
    const lastMessageDate = format(thread.lastMessageDate, 'dd-MM-yyyy');
    (acc[lastMessageDate] = acc[lastMessageDate] || []).push(thread);
    return acc;
  }, {} as Record<string, typeof threads> )

  return (
    <div className='max-w-full overflow-y-scroll max-h-[calc(100vh-120px)]'>
      <div className='flex flex-col gap-2 p-4 pt-0'>
        {
          Object.entries(threadGroup || {}).map(([date, threads]) => {
              return(
                <React.Fragment key={date}>
                  <span className="text-xs font-medium mt-4 first:mt-0 text-muted-foreground">{date}</span>

                  {threads.map((thread, index) => (
                    <button key={thread.id} onClick={() => {
                      setThreadId(thread.id)
                    }} className={cn('flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all relative', 
                      { 'bg-accent': thread.id === threadId }
                    )}>
                      <div className='flex flex-row justify-between w-full'> 
                        <p className='font-semibold text-sm'>{ thread.emails[0]?.from.name }</p>
                        <p className='text-muted-foreground text-xs'>{ formatDistanceToNow(thread.emails[0]?.sentAt as Date, { addSuffix: true }) }</p>
                      </div>
                      <div className='flex flex-col justify-between w-full'> 
                        <p className='text-semibold text-xs'>{ thread.emails[0]?.subject }</p>
                        <div className='text-semibold text-xs text-muted-foreground mt-2'>
                          <div dangerouslySetInnerHTML={{ __html: thread.emails[0]?.bodySnippet ?? '' }} />
                        </div>
                      </div>
                      <div className='flex flex-row justify-start w-full pt-3'>
                        {
                          thread.emails[0]?.sysLabels.map((label, index) => (
                            <React.Fragment key={index}>
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{ label }</span>
                            </React.Fragment>
                          ))
                        }
                      </div>
                    </button>
                  ))}
                </React.Fragment>
              )})
            }
      </div>
    </div>
  )
}

export default ThreadList