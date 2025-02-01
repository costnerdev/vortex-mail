import { Account } from "@/lib/account";
import { syncEmailToDatabase } from "@/lib/sync-to-db";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    const {accountId, userId} = await req.json();
    if (!accountId || !userId) {
        return NextResponse.json({error: 'Account ID or User ID is missing'}, {status: 400});
    }

    const dbAccount = await db.account.findUnique({
        where: {
            id: accountId,
            userId
        }
    })
    if (!dbAccount) return NextResponse.json({error: 'Account is not found'}, {status: 404});
    
    // Perform initial sync
    const account = new Account(dbAccount.accessToken);
    const response = await account.performInitialSync();
    if (!response) {
        return NextResponse.json({error: 'Failed to perform an initial sync'}, {status: 400});
    }

    const {emails, deltaToken} = response;

    syncEmailToDatabase(emails, accountId);

    return NextResponse.json({success: true}, {status: 200});
}