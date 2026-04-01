export const ErrorCodes = {
    ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
    ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
} as const;

export type ErrorCodes = typeof ErrorCodes[keyof typeof ErrorCodes];
