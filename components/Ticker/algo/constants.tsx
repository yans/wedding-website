// NOTE(omer.demirkan): this code is being duplicated in web/design/src/product/components/Ticker
// while we migrate the Ticker into bento. If you make any changes here
// please make the same change in the duplicate file and notify me.

export const COPY = Symbol('copy')
export const UPDATE = Symbol('update')
export const INSERT = Symbol('insert')
export const DELETE = Symbol('delete')

export type Action = typeof COPY | typeof UPDATE | typeof INSERT | typeof DELETE
