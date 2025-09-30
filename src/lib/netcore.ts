
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
 */
export async function sendEmail({
    fromName,
    fromEmail,
    toEmail,
    subject,
    htmlContent,
}: {
    fromName: string;
    fromEmail: string;
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
            email: fromEmail,
            name: fromName,
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
