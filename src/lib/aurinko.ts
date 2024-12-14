'use server'

import { auth, getAuth } from "@clerk/nextjs/server"

export const getAurinkoAuthUrl = async (serviceType: 'Google' | 'Office365') => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID as string,
        serviceType: serviceType,
        scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
        responseType: 'code',
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/aurinko/callback`,
    });
    
    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
}

export const exchangeAurinkoCodeForAccessToken = async (code: string) => {
    try {
        const clientId = process.env.AURINKO_CLIENT_ID as string;
        const clientSecret = process.env.AURINKO_CLIENT_SECRET as string;
        const clientAuth = btoa(`${clientId}:${clientSecret}`);

        const response = await fetch(`https://api.aurinko.io/v1/auth/token/${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${clientAuth}`
            }
        });

        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.error(error);
    }
}


