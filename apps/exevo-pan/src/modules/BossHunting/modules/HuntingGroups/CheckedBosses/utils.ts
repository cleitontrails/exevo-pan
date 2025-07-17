import { getDateRelativeToSS } from 'shared-utils/dist/time'
import { TrackedBossName } from 'data-dictionary/dist/dictionaries/bosses'

export const isFromSameServerSave = (a = new Date(), b = new Date()): boolean =>
  getDateRelativeToSS(a).toISOString() === getDateRelativeToSS(b).toISOString()

export const raidBossesNames: TrackedBossName[] = [
  'Chizzoron the Distorter',
  'Cublarc the Plunderer',
  'Feroxa',
  'Ferumbras',
  "Gaz'haragoth",
  'Ghazbaran',
  'Grand Mother Foulscale',
  'Morgaroth',
  'Morshabaal',
  'Orshabaal',
  'Rotrender',
  'The Abomination',
  'The Blightfather',
  'The Pale Count',
  'Willi Wasp',
  'Zomba',
  'Zulazza the Corruptor',
]

const raidBosses: Set<string> = new Set(raidBossesNames)

export const sharedSpawnBossesNames: TrackedBossName[] = [
  'Burster',
  'Dreadful Disruptor',
  'Mahatheb',
  'The Hungerer',
  'The Manhunter',
  'The Mean Masher',
]

const sharedSpawnBosses: Set<string> = new Set(sharedSpawnBossesNames)

export const checkIfBoss = {
  isSharedSpawn: ({ name }: CheckedBoss): boolean =>
    sharedSpawnBosses.has(name),
  appearOnlyOnRaids: ({ name }: CheckedBoss): boolean => raidBosses.has(name),
  hasNoChance: ({
    lastSpawned,
    daysLeftForPossibleSpawns,
    currentChance,
  }: CheckedBoss): boolean => {
    if (lastSpawned && isFromSameServerSave(lastSpawned)) {
      return true
    }

    if (daysLeftForPossibleSpawns) {
      return !daysLeftForPossibleSpawns.some((daysLeft) => daysLeft <= 0)
    }

    return currentChance === 0
  },
}
