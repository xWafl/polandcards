export const genGameKey = (length: number = 16) =>
    Math.random()
        .toString(36)
        .substr(2, length);
