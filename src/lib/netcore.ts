
import { getConfig } from './config';

const NETCORE_API_ENDPOINT = 'https://api.netcorecloud.com/v5.2/mail/send';

type EmailPayload = {
    from: {
        email: string;
        name: string;
    };
    subject: string;
    content: {
        type: 'html';
        value: string;
    }[];
    personalizations: {
        to: {
            email: string;
        }[];
    }[];
};

/**
 * Sends an email using the Netcore Email API.
 * @param toEmail The recipient's email address.
 * @param subject The subject of the email.
 * @param htmlContent The HTML body of the email.
 * @returns The response from the Netcore API.
 */
export async function sendEmail({
    toEmail,
    subject,
    htmlContent,
}: {
    toEmail: string;
    subject: string;
    htmlContent: string;
}) {
    const config = await getConfig(true); // Get config with private key
    const apiKey = config.netcoreApiKey;

    if (!apiKey) {
        throw new Error('Netcore API key is not configured.');
    }

    const payload: EmailPayload = {
        from: {
            email: 'noreply@eventflow.com', // This should be a verified sender in your Netcore account
            name: 'EventFlow',
        },
        personalizations: [{ to: [{ email: toEmail }] }],
        subject: subject,
        content: [{ type: 'html', value: htmlContent }],
    };

    const response = await fetch(NETCORE_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api_key': apiKey,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Netcore API Error:', errorData);
        throw new Error(`Failed to send email: ${errorData.errors?.[0]?.message || response.statusText}`);
    }

    return response.json();
}
