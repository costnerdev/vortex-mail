import { User } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";

/**
 * Validate if the accountId is owned by the passed user
 * @param userId 
 * @param accountId 
 */
const validateAccountId = async( userId: string, accountId: string ) => {
  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId
    }, select: {
      id: true, emailAddress: true, name: true, accessToken: true
    }
  })

  if (!account) throw new Error('Account not found');
  return account;
}

export const accountRouter = createTRPCRouter({
  getAccounts: privateProcedure.query(async({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId
      },
      select: {
        id: true,
        name: true,
        emailAddress: true
      }
    })
  }),
  getTabCount: privateProcedure
    .input(z.object({ 
      accountId: z.string(),
      tab: z.string()
    }))
    .query(async({ input, ctx }) => {
      const account = await validateAccountId( ctx.auth.userId, input.accountId );
      
      let filter: Prisma.ThreadWhereInput = {}
      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      }
      
      return await ctx.db.thread.count({
          where: {
              accountId: account.id,
              ...filter
          }
      })
  }),
  getThreads: privateProcedure
    .input(z.object({
      accountId: z.string(),
      tab: z.string(),
      done: z.boolean()
    }))
    .query(async({ input, ctx }) => {
      const account = await validateAccountId(ctx.auth.userId, input.accountId);

      let filter: Prisma.ThreadWhereInput = {}
      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      }
      
      filter.done = {
        equals: input.done
      };

      filter.accountId = input.accountId;

      return await ctx.db.thread.findMany({
        where: filter,
        include: {
          emails: {
            orderBy: {
              sentAt: 'asc'
            },
            select: {
              from: true,
              body: true,
              sentAt: true,
              bodySnippet: true,
              subject: true,
              sysLabels: true,
              id: true,
              emailLabel: true,
              replyTo: true
            }
          }
        },
        take: 15,
        orderBy: {
          lastMessageDate: 'desc'
        }
      })
    })
});