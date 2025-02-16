import { Separator } from '@/components/ui/separator';
import useThreads from '@/hooks/use-threads'
import React from 'react'
import { Archive, ArchiveX, Trash2, Clock, MoreVertical, Reply, ReplyAll, Forward } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import EmailDisplay from './email-display';


type Props = {}

const ThreadDisplay = () => {
  const { threads, threadId } = useThreads();

  const thread = threads?.find((thread) => thread.id == threadId);

  if (!thread) return (
    <div className='flex h-full w-full flex-row items-center justify-center'>
      <span className='text-sm text-muted-foreground'>No message selected</span>
    </div>
  );

  return (
    <div>
      <div className='flex h-full flex-col'>
        <div className='flex items-center py-1 px-2'>
          <div className='flex items-center gap-2 py-1'>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <Archive className='size-4' />
            </button>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <ArchiveX className='size-4' />
            </button>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <Trash2 className='size-4' />
            </button>
            <Separator orientation="vertical" className='h-6' />
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <Clock className='size-4' />
            </button>
          </div>

          <div className='flex items-center ml-auto gap-2'>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <Reply className='size-4' />
            </button>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <ReplyAll className='size-4' />
            </button>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
              <Forward className='size-4' />
            </button>
            <Separator orientation="vertical" className='h-6' />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9'>
                  <MoreVertical className='size-4' />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Star thread</DropdownMenuItem>
                <DropdownMenuItem>Add label</DropdownMenuItem>
                <DropdownMenuItem>Mute thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Separator />
        <div className='flex flex-1 flex-col'>
          <div className='flex items-start p-4'>
            <div className='flex items-start gap-4 text-sm'>
              <Avatar>
                <AvatarImage alt='avatar' />
                <AvatarFallback>
                { thread.emails.at(-1)?.from.name?.split(' ').map((nameSplit) => nameSplit[0]).join('') }
                </AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <div className='flex flex-col'> 
                  <span className='font-medium text-sm line-clamp-1'>{ thread.emails.at(-1)?.from.name }</span>
                  <span className='font-normal text-xs line-clamp-1'>{ thread.emails.at(-1)?.subject }</span>
                  <span className='font-normal text-xs line-clamp-1'>
                    <span>Reply-To: </span>
                    { 
                      thread.emails.at(-1)?.replyTo.map((email) => (
                        <React.Fragment key={email.id}>
                          { email.address }
                        </React.Fragment>
                      )) 
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className='flex items-start gap-4 text-sm ml-auto'>
              { thread.emails[0]?.sentAt && (
                  <span className='text-muted-foreground text-xs'>
                    { format(new Date(thread.emails[0]?.sentAt), 'PPpp') }
                  </span>
              )}
            </div>

          </div>
          <Separator />

          <div className='max-h-[calc(100vh-400px)] overflow-scroll flex flex-col'>
              <div className='p-6 flex flex-col gap-4'>
                { thread.emails.map((email) => (
                  <EmailDisplay email={email} key={email?.id} />
                ))}
              </div>
          </div>

          <div className="flex-1"></div>
          <Separator className="mt-auto" />

        </div>
      </div>
    </div>
  )
}

export default ThreadDisplay