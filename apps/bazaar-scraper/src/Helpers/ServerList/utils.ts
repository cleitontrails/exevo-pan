import { servers } from 'data-dictionary/dist/dictionaries/servers'

const { SERVER_LOCATIONS, PVP_TYPES } = servers

const LOCATIONS: Record<string, string> = {
  Europe: SERVER_LOCATIONS.EUROPE,
  'North America': SERVER_LOCATIONS.NORTH_AMERICA,
  'South America': SERVER_LOCATIONS.SOUTH_AMERICA,
}

const PVPS: Record<string, string> = {
  'Optional PvP': PVP_TYPES.OPTIONAL,
  'Open PvP': PVP_TYPES.OPEN,
  'Retro Open PvP': PVP_TYPES.RETRO,
  'Hardcore PvP': PVP_TYPES.HARDCORE,
  'Retro Hardcore PvP': PVP_TYPES.RETRO_HARDCORE,
}

export const parse = {
  serverLocation: (location: string): string => {
    const parsedLocation = LOCATIONS[location]

    if (!parsedLocation) throw Error(`Unknown server location: ${location}`)
    return parsedLocation
  },
  pvpType: (pvpType: string): string => {
    const parsedPvpType = PVPS[pvpType]

    if (!parsedPvpType) throw Error(`Unknown PvP type: ${pvpType}`)
    return parsedPvpType
  },
}
