import { Plugin } from 'vite'

interface NWSZone {
  ids: string[]
  name: string
  state: string
  path: string
  category: string
}

const zonesCache = {
  path: <Record<string, Record<string, NWSZone>>>{},
  zones: <Record<string, NWSZone>>{},
  names: <Record<string, NWSZone>>{},
  categories: <string[]>[],
}

const hasCached = false

async function getNWSZones() {
  if (hasCached) return zonesCache
  const checkIds: string[] = []
  const zones: Record<string, NWSZone> = {}

  await fetch('https://api.weather.gov/zones/', { headers: { 'User-Agent': 'NWS Alerts Website' } })
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch NWS zones')
      return response.json()
    })
    .then((zoneData) => {
      for (const zone of (
        zoneData as { features: { properties: { id: string; name: string; state: string } }[] }
      ).features) {
        if (zone.properties.id && !checkIds.includes(zone.properties.id)) {
          checkIds.push(zone.properties.id)
          if (!zones[(zone.properties.name + ', ' + zone.properties.state).toLowerCase()]) {
            zones[(zone.properties.name + ', ' + zone.properties.state).toLowerCase()] = {
              ids: [zone.properties.id],
              name: zone.properties.name,
              state: zone.properties.state,
              path: (zone.properties.name as string).toLowerCase().replace(/ |\/|\\/g, '-'),
              category:
                zone.properties.state != null
                  ? zone.properties.state.toLowerCase()
                  : 'uncategorized',
            }
          } else {
            zones[(zone.properties.name + ', ' + zone.properties.state).toLowerCase()].ids.push(
              zone.properties.id,
            )
          }
          zonesCache!.zones[zone.properties.id] =
            zones[(zone.properties.name + ', ' + zone.properties.state).toLowerCase()]
        }
      }

      for (const zone of Object.values(zones)) {
        zonesCache!.names[
          zone.state != null
            ? (zone.name + ', ' + zone.state).toLowerCase()
            : zone.name.toLowerCase()
        ] = zone
        if (!zonesCache!.path[zone.category]) {
          zonesCache!.path[zone.category] = {}
          zonesCache!.categories.push(zone.category)
        }
        zonesCache!.path[zone.category][zone.path] = zone
      }
    })
    .catch((error) => {
      console.error('Error fetching NWS zones:', error)
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
      if (id.startsWith('virtual:nws-zones/')) {
        return '\0' + id
      }
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId && !id.startsWith('\0virtual:nws-zones/')) return

      console.log('Loading NWS zones data...')
      const zones = await getNWSZones()
      console.log(
        'NWS zones data loaded successfully, total zones:',
        Object.keys(zones.zones).length,
      )

      if (id.startsWith('\0virtual:nws-zones/')) {
        const type = id.replace('\0virtual:nws-zones/', '')
        if (type in zones) {
          return {
            code: `export default ${JSON.stringify(zones[type as keyof typeof zones])};`,
            map: null,
          }
        }
        return
      }

      return {
        code:
          (Object.keys(zones) as Array<keyof typeof zones>)
            .map((v) => `import ${String(v)} from "${virtualModuleId}/${v}";`)
            .join('\n') +
          '\nexport { ' +
          Object.keys(zones).join(', ') +
          ' };' +
          '\nexport default { ' +
          Object.keys(zones).join(', ') +
          ' };',
        map: null,
      }
    },
  }
}
