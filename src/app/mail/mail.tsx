'use client'

import React, { useEffect, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import AccountSwitcher from './account-switcher'
import Sidebar from './sidebar'

type Props = {
    defaultLayout: number[] | undefined,
    navCollapsedSize: number,
    defaultCollapsible: boolean
}

const Mail = ({ defaultLayout = [20, 32, 48], navCollapsedSize, defaultCollapsible }: Props) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsible);

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup direction='horizontal' onLayout={(sizes: number[]) => {
                console.log(sizes)
            }} className='items-stretch h-full min-h-screen'>
                <ResizablePanel defaultSize={defaultLayout[0]} collapsedSize={navCollapsedSize}
                    collapsible={true}
                    minSize={15}
                    maxSize={40}
                    onCollapse={() => {
                        setIsCollapsed(true);
                    }}
                    onResize={() => {
                        setIsCollapsed(false);
                    }}
                    className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
                >
                    <div className='flex flex-col h-full flex-1'>
                        <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px]' : 'px-2')}>
                            {/* Account Switcher */}
                            <AccountSwitcher isCollapsed={isCollapsed} />
                        </div>
                        <Separator />
                        {/* Sidebar */}
                        <Sidebar isCollapsed={isCollapsed} />
                        <div className='flex-1'></div>
                        {/* Ask AI */}
                        Ask AI
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    <Tabs defaultValue='inbox'>
                        <div className='flex items-center px-4 py-2'>
                            <h1 className='text-xl font-bold'>Inbox</h1>
                            <TabsList className='ml-auto'>
                                <TabsTrigger value='inbox' className='text-zinc-600 dark:text-zinc-200'>
                                    Inbox
                                </TabsTrigger>
                                <TabsTrigger value='done' className='text-zinc-600 dark:text-zinc-200'>
                                    Done
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <Separator/>
                        {/* Search Bar */}
                        Search Bar
                        <TabsContent value="inbox">
                            Inbox
                        </TabsContent>
                        <TabsContent value="done">
                            Done
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={48}>
                    thread display
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}

export default Mail