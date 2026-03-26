export interface ApiError {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    const apiError = error as ApiError;
    const fieldErrors = apiError?.response?.data?.errors;

    if (fieldErrors) {
        const messages = Object.values(fieldErrors).flat();
        if (messages.length > 0) {
            return messages[0];
        }
    }

    return apiError?.response?.data?.message || fallback;
};