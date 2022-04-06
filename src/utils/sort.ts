export const sortAlpha = (items: any[], key: string) => items.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0))
