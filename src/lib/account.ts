import axios from "axios";
import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "./types";
import { syncEmailToDatabase } from "./sync-to-db";

export class Account {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async startSync() {
        try {
            const response = await axios.post<SyncResponse>('https://api.aurinko.io/v1/email/sync', {}, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
                params: {
                    daysWithin: 7,
                    bodyType: 'html'
                }
            });

            return response.data;
        } catch(error) {
            console.log('Error when start sync', error);
            throw error;
        }
    }

    private async getUpdatedEmails({deltaToken, pageToken}: {deltaToken?: string, pageToken?: string}) {
        let params: Record<string, string> = {}
        if (deltaToken) params.deltaToken = deltaToken
        if (pageToken) params.pageToken = pageToken

        const response = await axios.get<SyncUpdatedResponse>('https://api.aurinko.io/v1/email/sync/updated', {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            params
        });

        return response.data;
    }

    async performInitialSync() {
        try {
            // start the sync process
            let syncResponse = await this.startSync();
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                syncResponse = await this.startSync();
            }

            // Get the bookmark delta token
            let storedDeltaToken: string = syncResponse.syncUpdatedToken;

            let updatedResponse = await this.getUpdatedEmails({deltaToken: storedDeltaToken});

            if (updatedResponse.nextDeltaToken) { 
                // Sync has completed
                storedDeltaToken = updatedResponse.nextDeltaToken;
            }
            let allEmails: EmailMessage[] = updatedResponse.records;

            // fetch all pages if there are more pages
            while (updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({pageToken: updatedResponse.nextPageToken});
                allEmails = allEmails.concat(updatedResponse.records);
                if (updatedResponse.nextDeltaToken) {
                    // Sync has ended
                    storedDeltaToken = updatedResponse.nextDeltaToken;
                }
            }

            console.log(`Initial sync completed. We have synced ${allEmails.length} emails`);

            // Store the latest token and sync for future incremental emails
            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}