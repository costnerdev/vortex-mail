import { api } from '@/trpc/react';
import React from 'react'
import { useLocalStorage } from 'usehooks-ts';

type Props = {}

const useThreads = () => {
  const [accountId]= useLocalStorage("vortexAccountId", "");
  const [tab] = useLocalStorage("vortextTab", "inbox");
  const [done] = useLocalStorage("vortexDone", false);

  const { data: threads, isFetching, isFetched } = api.account.getThread.useQuery({
    accountId,
    tab,
    done
  }, {
    enabled: !!accountId && !!tab, placeholderData: e => e, refetchInterval: 5000
  })
  
  return {
    threads,
    isFetching,
    isFetched,
    accountId
  }
}

export default useThreads