declare module 'virtual:nws-zones' {
  interface Zone {
    ids: string[]
    name: string
    state: string
    path: string
    category: string
  }

  export const path: Record<string, Record<string, Zone>>
  export const zones: Record<string, Zone>
  export const names: Record<string, Zone>
  export const categories: string[]
  export default {
    path,
    zones,
    names,
    categories,
  }
}
