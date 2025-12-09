import { EmailRecord, Urgency, Sentiment } from '../types';

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

if (!API_KEY || !BASE_ID || !TABLE_NAME) {
    console.error("Airtable environment variables are missing.");
}

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

export interface MappedEmail {
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    body: string;
    receivedAt: string;
    threadId: string;
    status: string;
    draftReplyBody?: string;
    urgency?: Urgency;
    sentiment?: Sentiment;
    language?: string;
}

export const fetchPendingEmails = async (): Promise<MappedEmail[]> => {
    try {
        const filterFormula = encodeURIComponent("{Status}='New'");
        const url = `${BASE_URL}?filterByFormula=${filterFormula}&sort%5B0%5D%5Bfield%5D=Received+At&sort%5B0%5D%5Bdirection%5D=desc`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching emails: ${response.statusText}`);
        }

        const data = await response.json();
        const records: EmailRecord[] = data.records;

        return records.map((record) => ({
            id: record.id,
            senderName: record.fields['Sender Name'] || 'Unknown',
            senderEmail: record.fields['Sender Email'] || '',
            subject: record.fields['Original Subject'] || '(No Subject)',
            body: record.fields['Original Body'] || '',
            receivedAt: record.fields['Received At'],
            threadId: record.fields['Thread ID'],
            status: record.fields['Status'],
            draftReplyBody: record.fields['Draft Reply Body'],
            urgency: record.fields['Urgency'],
            sentiment: record.fields['Sentiment'],
            language: record.fields['Language'],
        }));
    } catch (error) {
        console.error("Failed to fetch emails from Airtable:", error);
        throw error;
    }
};

export const updateEmailStatus = async (
    id: string,
    status: string,
    draftReplyBody?: string
): Promise<void> => {
    try {
        const fields: any = {
            Status: status,
        };

        if (draftReplyBody) {
            fields['Draft Reply Body'] = draftReplyBody;
        }

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields }),
        });

        if (!response.ok) {
            throw new Error(`Error updating email status: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Failed to update email in Airtable:", error);
        throw error;
    }
};
