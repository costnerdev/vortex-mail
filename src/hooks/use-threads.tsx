import { api } from '@/trpc/react';
import React from 'react'
import { useLocalStorage } from 'usehooks-ts';
import { atom, useAtom } from 'jotai'

type Props = {}

const threadAtom = atom<string | null>('');

const useThreads = () => {
  const [accountId] = useLocalStorage("vortexAccountId", "");
  const [tab] = useLocalStorage("vortextTab", "inbox");
  const [done] = useLocalStorage("vortexDone", false);
  const [threadId, setThreadId] = useAtom(threadAtom);

  const { data: accounts } = api.account.getAccounts.useQuery()

  const { data: threads, isFetching, isFetched } = api.account.getThreads.useQuery({
    accountId,
    tab,
    done
  }, {
    enabled: !!accountId && !!tab, placeholderData: previousData => previousData, refetchInterval: 5000
  })
  
  return {
    threads,
    isFetching,
    isFetched,
    account: accounts?.find((account) => account.id == accountId),
    accountId,
    threadId,
    setThreadId
  }
}

export default useThreads