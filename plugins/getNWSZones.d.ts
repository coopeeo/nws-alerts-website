declare module 'virtual:nws-zones' {
  interface Zone {
    ids: string[]
    name: string
    state: string
    path: string
    category: string
  }
  const zones: {
    path: Record<string, Record<string, Zone>>
    zones: Record<string, Zone>
    names: Record<string, Zone>
  }
  export default zones
}
