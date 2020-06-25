export const TypeGuard = <T, U extends T>(val: T, bool: boolean): val is U => bool;
