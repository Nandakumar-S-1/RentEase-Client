export const DocumentTypes = {
    PAN: 'PAN',
    AADHAAR: 'AADHAAR',
} as const;

export type DocumentTypes = typeof DocumentTypes[keyof typeof DocumentTypes];
