export const websocketHandler = (str: string) => JSON.parse(str);

export const sendSocket = (category: string, data: unknown) =>
    JSON.stringify({ category, data });
