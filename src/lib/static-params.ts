// `output: 'export'` fails the build when a dynamic route's generateStaticParams() returns no
// params (e.g. before the first TIL is published). While a list is empty, emit one placeholder
// that the page turns into a 404 via notFound(). It is never linked or listed in the sitemap.
export const EMPTY_PARAM = '__none__'

export function staticParams<K extends string>(key: K, values: string[]): Record<K, string>[] {
  const list = values.length > 0 ? values : [EMPTY_PARAM]
  return list.map((value) => ({ [key]: value }) as Record<K, string>)
}
