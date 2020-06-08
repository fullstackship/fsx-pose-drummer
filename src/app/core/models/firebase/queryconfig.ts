export interface QueryConfig {
  path: string, //  path to collection
  field?: string, // field to orderBy
  startAt?: number,
  startAfter?: number,
  endAt?: number,
  endBefore?: number,
  limit?: number, // limit per query
  nextPage?: boolean, //false: prevPage
  pageMode: number, // 0: changePageSize, 1: nextPage, 2: prevPage
  reverse?: boolean, // reverse order?
  prepend?: boolean // prepend to source?
}
