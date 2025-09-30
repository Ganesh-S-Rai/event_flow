
const ALLOWED_DOMAIN = 'netcorecloud.com';

// Add the email addresses of the users who should have access.
const WHITELISTED_USERS: string[] = [
    'event.manager@netcorecloud.com',
    'marketing.lead@netcorecloud.com',
    'ganesh.rai@netcorecloud.com',
];

/**
 * Checks if a user's email is whitelisted.
 * @param email The user's email address.
 * @returns True if the user is allowed, false otherwise.
 */
export function isUserWhitelisted(email: string): boolean {
    if (!email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
        return false;
    }
    
    return WHITELISTED_USERS.includes(email.toLowerCase());
}
