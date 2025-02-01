import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts';
import { Plus } from 'lucide-react';
import { getAurinkoAuthUrl } from '@/lib/aurinko';



type Props = {
  isCollapsed: boolean
}

const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data: accounts } = api.account.getAccounts.useQuery()
  const [ accountId, setAccountId ] = useLocalStorage<string>('vortexAccountId', '');

  return (
    <>
      {/* {accounts?.map((account) => { 
        return <div key={account.id}>{account.emailAddress}</div>
      })} */}

      <Select defaultValue={accountId} onValueChange={
        (value) => {
          setAccountId(value);
        }
      }>
        <SelectTrigger className={cn(
            "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
            isCollapsed &&
            "mx-2 flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
          )}
          aria-label="Select account">
          <SelectValue placeholder="Select an account">
            <span className={cn({'hidden': !isCollapsed})}>
              { accounts?.find((account) => account.id === accountId)?.emailAddress[0] }
            </span>
            <span className={cn({'hidden': isCollapsed})}>
              { accounts?.find((account) => account.id === accountId)?.emailAddress }
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts?.map((account) => { 
            return <SelectItem key={account.id} value={account.id}>{account.emailAddress}</SelectItem>
          })}
          <div onClick={async() => {
            const url = await getAurinkoAuthUrl('Google');
            window.location.href = url;
          }} className='relative hover:bg-gray-50 flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
            <Plus className="size-4 mr-1"/> 
            Add account
          </div>
        </SelectContent>
      </Select>
    </>
  )
}

export default AccountSwitcher