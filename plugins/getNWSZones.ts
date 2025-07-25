import { Plugin } from 'vite'

let zonesCache: {
  path: Record<string, any>
  zones: Record<string, any>
  names: Record<string, any>
} | null = null

function getNWSZones() {
  if (zonesCache) return zonesCache
  const checkIds: string[] = []
  const zones: Record<string, any> = {}
  zonesCache = { path: {}, zones: {}, names: {} }
  fetch('https://api.weather.gov/zones/')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch NWS zones')
      return response.json()
    })
    .then((data) => {
      for (const zone of data.features) {
        if (zone.id && !checkIds.includes(zone.id)) {
          checkIds.push(zone.id)
          if (!zones[(zone.name + ', ' + zone.state).toLowerCase()]) {
            zones[(zone.name + ', ' + zone.state).toLowerCase()] = {
              ids: [zone.id],
              name: zone.name,
              state: zone.state,
              path: zone.name.toLowerCase().replace(/ /g, '-'),
              category: zone.state != null ? zone.state.toLowerCase() : 'uncategorized',
            }
          } else {
            zones[(zone.name + ', ' + zone.state).toLowerCase()].ids.push(zone.id)
          }
          zonesCache!.zones[zone.id] = zones[(zone.name + ', ' + zone.state).toLowerCase()]
        }
      }

      for (const zone of Object.values(zones)) {
        zonesCache!.names[
          zone.state != null
            ? (zone.name + ', ' + zone.state).toLowerCase()
            : zone.name.toLowerCase()
        ] = zone
        zonesCache!.path[zone.path] = [zone]
      }
    })
  return zonesCache
}

export const nwsZonesPlugin = (): Plugin => {
  const virtualModuleId = 'virtual:nws-zones'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'zones-handler',
    enforce: 'pre',
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return

      return {
        code: `export default ${JSON.stringify(getNWSZones())}`,
        map: null,
      }
    },
  }
}
