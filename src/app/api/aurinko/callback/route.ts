// /api/aurinko/callback

import { waitUntil } from '@vercel/functions';
import { exchangeAurinkoCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

export async function GET(req: NextRequest) {
    const { userId } = await auth(); // Check if user is logged in
    if (!userId) return new NextResponse('Unauthorized', {status: 401});

    const params = req.nextUrl.searchParams; // Get query params
    const status = params.get('status'); 
    if (status !== 'success') return new NextResponse('Failed to link account', {status: 400}); // Check if status is success

    // Get the code to exchange for an access token
    const code = params.get('code');
    if (!code) return new NextResponse('No code provided', {status: 400});

    const tokenResponse = await exchangeAurinkoCodeForAccessToken(code);
    if (!tokenResponse) return new NextResponse('Failed to exchange access token', {status: 400});

    const accountDetails = await getAccountDetails(tokenResponse.accessToken);

    await db.account.upsert({
        where: {
            id: tokenResponse.accountId.toString()
            // emailAddress: accountDetails.email
        },
        update: {
            accessToken: tokenResponse.accessToken
        },
        create: {
            id: tokenResponse.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: tokenResponse.accessToken,
        }
    });

    // trigger initial sync endpoint
    waitUntil(
        axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/initial-sync`, {
            accountId: tokenResponse.accountId.toString(),
            userId
        }).then(response => {
            console.log('Initial sync triggered', response.data);
        }).catch(error => {
            console.log('Initial sync failed', error);
        })
    );
 
    return NextResponse.redirect(new URL('/mail', req.url));
} 

