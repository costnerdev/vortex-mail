import React from 'react'
import Nav from './nav'
import {
    AlertCircle,
    Archive,
    ArchiveX,
    File,
    Inbox,
    MessagesSquare,
    Send,
    ShoppingCart,
    Trash2,
    Users2,
} from "lucide-react"
import { api } from '@/trpc/react'
import { useLocalStorage } from 'usehooks-ts'

type Props = {
    isCollapsed: boolean
}

const Sidebar = ({ isCollapsed }: Props) => {
  const [accountId] = useLocalStorage('vortexAccountId', "");
  const [vortextTab] = useLocalStorage('vortextTab', "inbox");
  
  const { data: inboxCount } = api.account.getTabCount.useQuery({ accountId, tab: 'inbox'});
  const { data: draftCount } = api.account.getTabCount.useQuery({ accountId, tab: 'draft'});
  const { data: sentCount } = api.account.getTabCount.useQuery({ accountId, tab: 'sent'});

  return (
    <>
        <Nav isCollapsed={isCollapsed}
            links={[
                {
                    title: "Inbox",
                    label: inboxCount?.toString() ?? "0",
                    icon: Inbox,
                    variant: vortextTab === "inbox" ? "default" : "ghost"
                },
                {
                    title: "Draft",
                    label: draftCount?.toString() ?? "0",
                    icon: File,
                    variant: vortextTab === "draft" ? "default" : "ghost"
                },
                {
                    title: "Sent",
                    label: sentCount?.toString() ?? "0",
                    icon: Send,
                    variant: vortextTab === "sent" ? "default" : "ghost"
                }
            ]}
        />
    </>
  )
}

export default Sidebar