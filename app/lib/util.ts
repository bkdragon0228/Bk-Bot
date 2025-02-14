const getApiUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return process.env.NEXT_PUBLIC_API_URL_DEV;
    }
    return process.env.NEXT_PUBLIC_API_URL_PROD;
};

export { getApiUrl };
