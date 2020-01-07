export const isFunc = (v: any): boolean => typeof v === 'function';
export const isPromise = (v: any): boolean => typeof v === 'object' && v.__proto__.hasOwnProperty('then');