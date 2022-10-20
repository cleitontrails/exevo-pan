/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BossStatistics } from 'Data'
import { coloredText, TrackETA } from 'logging'
import { dayDiffBetween } from 'utils'

const RELEVANT_FREQUENCY = 0.01

const getAppearencesIntervals = (appearences: number[]): number[] => {
  const intervals: number[] = []

  if (appearences.length < 2) return intervals

  appearences.forEach((currentTimestamp, currentIndex) => {
    const nextTimestamp = appearences[currentIndex + 1]

    if (!nextTimestamp) return

    intervals.push(Math.round(dayDiffBetween(currentTimestamp, nextTimestamp)))
  })

  return intervals
}

const calculateDistribution = (intervals: number[]): Distribution => {
  const min = Math.min(...intervals)
  const max = Math.max(...intervals)
  const dataSize = intervals.length

  const distribution: Distribution = new Map()
  for (
    let currentInterval = min;
    currentInterval <= max;
    currentInterval += 1
  ) {
    const occurrences = intervals.filter(
      (interval) => interval === currentInterval,
    ).length

    const frequency = occurrences / dataSize

    distribution.set(currentInterval, +frequency.toFixed(4))
  }

  return distribution
}

const denoiseDistribution = (distribution: Distribution): Distribution => {
  const denoisedDistribution: Distribution = new Map()

  for (const [interval, frequency] of distribution.entries()) {
    if (frequency >= RELEVANT_FREQUENCY) {
      const parsedInterval = +interval
      denoisedDistribution.set(parsedInterval, frequency)
    }
  }

  return denoisedDistribution
}

const apply1DayRule = (distribution: Distribution): Distribution => {
  if (distribution.get(1) && !distribution.get(2)) {
    distribution.delete(1)
  }

  return distribution
}

export const generateBossDistributions = async (): Promise<
  Record<string, Distribution>
> => {
  const file = new BossStatistics()

  const serverList = await file.readAllServerNames()

  const taskSize = serverList.length
  const taskTracking = new TrackETA(
    taskSize,
    coloredText(
      'Generating distributions for each boss across all servers..',
      'highlight',
    ),
  )

  const bossIntervals: Record<string, number[]> = {}

  for (const server of serverList) {
    await file.load(server)

    const bossStatistics = file.getBossStatistics()

    Object.values(bossStatistics.bosses).forEach(({ name, appearences }) => {
      const intervals = getAppearencesIntervals(appearences)

      bossIntervals[name] = [...(bossIntervals[name] ?? []), ...intervals]
    })

    taskTracking.incTask()
  }

  taskTracking.finish()

  const bossDistributions: Record<string, Distribution> = {}

  Object.entries(bossIntervals).forEach(([bossName, intervals]) => {
    bossDistributions[bossName] = apply1DayRule(
      denoiseDistribution(calculateDistribution(intervals)),
    )
  })

  return bossDistributions
}
