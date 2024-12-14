// /api/aurinko/callback

import { exchangeAurinkoCodeForAccessToken } from "@/lib/aurinko";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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

    return new Response('test', {status: 200});
} 

