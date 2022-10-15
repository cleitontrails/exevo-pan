import cheerio, { CheerioAPI } from 'cheerio/lib/index'
import { PostData } from 'Helpers'
import { sanitizeHtmlString, parseDate, exitIfMaintenance } from 'utils'
import { totalCharacterInvestment } from 'shared-utils/dist/totalCharacterInvestment'
import { getCharacterTags } from 'shared-utils/dist/getCharacterTags'
import {
  quest as questDictionary,
  imbuement as imbuementDictionary,
  rareAchievement as achievementDictionary,
} from 'data-dictionary/dist/dictionaries'
import { vocation as vocationHelper } from 'shared-utils/dist/vocations'
import { filterListTable, stringToNumber } from '../utils'
import {
  getPagedData,
  getPageableAuctionData,
  loadCheerio,
  findNumber,
} from './utils'
import { HistoryCheck, RawCheck } from './types'

export default class AuctionPage {
  constructor(serverData: ServerObject[]) {
    this.loadServerData(serverData)
  }

  private servers: Map<string, ServerObject> = new Map()

  private postHelper = new PostData()

  private loadServerData(serverData: ServerObject[]): void {
    serverData.forEach((server) => {
      this.servers.set(server.serverName, server)
    })
  }

  maintenanceCheck($: CheerioAPI): boolean {
    const headingElement = $('h1')
    return headingElement.text() === 'Downtime'
  }

  errorCheck($: CheerioAPI): boolean {
    const errorText = $(
      '#currentcharactertrades .Text, #pastcharactertrades .Text',
    ).text()
    return errorText === 'Error'
  }

  id($: CheerioAPI): number {
    const buttonElement = $('.DisplayOptionsButton a.BigButtonText').first()
    const onClickHandler = buttonElement.attr('onclick')!
    const [, dirtyId] = onClickHandler?.split('auctionid=')
    const [stringId] = dirtyId.split('&')

    return +stringId
  }

  private isFinished($: CheerioAPI): boolean {
    return !$('.MyMaxBidLabel').length
  }

  private nickname($: CheerioAPI): string {
    return $('.Auction .AuctionCharacterName').text()
  }

  private auctionEnd($: CheerioAPI): number {
    const timestampElement = $('.AuctionTimer')

    if (timestampElement.length) {
      const timestamp = timestampElement.attr('data-timestamp')!
      return +timestamp
    }

    const auctionEndElement = $('.ShortAuctionDataValue').next().next()
    const sanitizedDateString = sanitizeHtmlString(auctionEndElement.text())

    return parseDate(sanitizedDateString)
  }

  private currentBid($: CheerioAPI): number {
    const currentBidText = $('.ShortAuctionDataValue b').text()
    return stringToNumber(currentBidText)
  }

  private hasBeenBidded($: CheerioAPI): boolean {
    const auctionStatus = $('.AuctionInfo').text()
    if (auctionStatus === 'cancelled') {
      return false
    }

    const bidElement = $('.ShortAuctionDataBidRow')
    const [bidText] = bidElement.text().split(':')

    const biddedTexts = ['Winning Bid', 'Current Bid']

    return biddedTexts.includes(bidText)
  }

  private outfitId($: CheerioAPI): string {
    const outfitElement = $('.AuctionOutfitImage')
    const src = outfitElement.attr('src')!
    const [, filename] = src.split('/outfits/')
    const [outfitId] = filename.split('.')

    return outfitId
  }

  private serverName($: CheerioAPI): string {
    return $('.AuctionHeader a').text()
  }

  private vocationId($: CheerioAPI): number {
    const headerText = $('.AuctionHeader').text()
    const [, vocation] = headerText.split(' | ')

    return vocationHelper.getIdByRegex(vocation)
  }

  private level($: CheerioAPI): number {
    const headerText = $('.AuctionHeader').text()
    const [characterInfo] = headerText.split(' | ')
    const [, level] = characterInfo.split(': ')

    return +level
  }

  private sex($: CheerioAPI): boolean {
    const headerText = $('.AuctionHeader').text()
    const [, , characterInfo] = headerText.split(' | ')

    return characterInfo.toLowerCase() === 'female'
  }

  private transfer($: CheerioAPI): boolean {
    const transferText = $('.LabelV:contains("Regular World Transfer:")')
      .siblings('div')
      .text()

    return transferText === 'can be purchased and used immediately'
  }

  private skills($: CheerioAPI): CharacterSkillsObject {
    const generalElement = $('#General .TableContentContainer tbody').children()

    const skillArray: number[] = []
    generalElement
      .find('.LevelColumn')
      .parent()
      .parent()
      .children()
      .each((_, element) => {
        const [, levelElement, percentageElement] = element.children

        const level = cheerio(levelElement).text()

        const [percentage] = cheerio('.PercentageString', percentageElement)
          .text()
          .split(' %')

        const roundedPercentage = Math.round(+percentage)
          .toString()
          .padStart(2, '0')

        const skillLevel = +`${level}.${roundedPercentage}`

        skillArray.push(skillLevel)
      })

    const [axe, club, distance, fishing, fist, magic, shielding, sword] =
      skillArray

    return {
      magic,
      club,
      fist,
      sword,
      fishing,
      axe,
      distance,
      shielding,
    }
  }

  private achievementPoints($: CheerioAPI): number {
    const achievPointsLabel = $('.LabelV:contains("Achievement Points:")')
    const pointsCountElement = achievPointsLabel.next()
    return stringToNumber(pointsCountElement.text())
  }

  private charmExpansion($: CheerioAPI): boolean {
    const charmExpansionText = $('.LabelV:contains("Charm Expansion:")')
      .next()
      .text()
      .trim()

    return charmExpansionText === 'yes'
  }

  private huntingSlot($: CheerioAPI): boolean {
    const huntingSlotText = $(
      '.LabelV:contains("Permanent Hunting Task Slots:")',
    )
      .next()
      .text()

    return huntingSlotText === '1'
  }

  private preySlot($: CheerioAPI): boolean {
    const huntingSlotText = $('.LabelV:contains("Permanent Prey Slots:")')
      .next()
      .text()

    return huntingSlotText === '1'
  }

  private allCharmPoints($: CheerioAPI): Pick<CharmInfo, 'total' | 'unspent'> {
    const unspent = stringToNumber(
      $('.LabelV:contains("Available Charm Points:")').next().text(),
    )

    const spentCharmPoints = stringToNumber(
      $('.LabelV:contains("Spent Charm Points:")').next().text(),
    )

    return {
      unspent,
      total: unspent + spentCharmPoints,
    }
  }

  private hirelings($: CheerioAPI): HirelingsInfo {
    const count = stringToNumber(
      $('.LabelV:contains("Hirelings:")').next().text(),
    )
    const jobs = stringToNumber(
      $('.LabelV:contains("Hireling Jobs:")').next().text(),
    )
    const outfits = stringToNumber(
      $('.LabelV:contains("Hireling Outfits:")').next().text(),
    )

    return { count, jobs, outfits }
  }

  private bossPoints($: CheerioAPI): number {
    const bossPointsLabel = $('.LabelV:contains("Boss Points:")')
    const bossPointsElement = bossPointsLabel.next()
    return stringToNumber(bossPointsElement.text())
  }

  private items($: CheerioAPI): number[] {
    const itemImages = $('.AuctionItemsViewBox > .CVIcon')

    const itemArray: number[] = []
    // eslint-disable-next-line array-callback-return
    itemImages.map((_, element) => {
      const [itemImg] = cheerio('img', element).toArray()
      if (!itemImg) return

      const [tierImg] = cheerio('.ObjectTier img', element).toArray()

      let tierNumber = 0
      if (tierImg) {
        /* eslint-disable-next-line */
        const [, tier] = cheerio(tierImg).attr('src')?.split('/tiers/')!
        const foundTier = findNumber(tier)
        if (foundTier > 0) {
          tierNumber = foundTier / 10
        }
      }

      /* eslint-disable-next-line */
      const [, src] = cheerio(itemImg).attr('src')?.split('/objects/')!

      const [itemId] = src.split('.')
      itemArray.push(+itemId + tierNumber)
    })

    return itemArray
  }

  private imbuements($: CheerioAPI): string[] {
    const imbuementElements = $('#Imbuements .TableContentContainer tbody td')

    const { scrapingTokens } = imbuementDictionary
    const imbuementArray: string[] = []
    imbuementElements.filter(filterListTable).each((_, element) => {
      const imbuement = cheerio(element).text().trim().toLowerCase()

      const imbuementName = scrapingTokens[imbuement]
      if (imbuementName) {
        imbuementArray.push(imbuementName)
      }
    })

    return imbuementArray.sort()
  }

  private charms($: CheerioAPI): string[] {
    const charmElements = $(
      '#Charms .TableContentContainer tbody td:last-child',
    )

    const charmArray: string[] = []
    charmElements.filter(filterListTable).each((_, element) => {
      const charm = cheerio(element).text()
      charmArray.push(charm)
    })

    return charmArray
  }

  private quests($: CheerioAPI): string[] {
    const { scrapingTokens } = questDictionary
    const questSet = new Set<string>([])

    const achievementsElement = $(
      '#Achievements .TableContentContainer tbody td',
    )

    achievementsElement.filter(filterListTable).each((_, element) => {
      const achievement = cheerio(element).text().trim().toLowerCase()
      const quest = scrapingTokens[achievement]
      if (quest) {
        questSet.add(quest)
      }
    })

    const questsElement = $(
      '#CompletedQuestLines .TableContentContainer tbody td',
    )

    questsElement.filter(filterListTable).each((_, element) => {
      const questText = cheerio(element).text().trim().toLowerCase()
      const quest = scrapingTokens[questText]
      if (quest) {
        questSet.add(quest)
      }
    })

    return [...questSet]
  }

  private rareAchievements($: CheerioAPI): string[] {
    const achievementsElement = $(
      '#Achievements .TableContentContainer tbody td',
    )

    const { scrapingTokens } = achievementDictionary
    const achievementSet = new Set<string>([])

    achievementsElement.filter(filterListTable).each((_, element) => {
      const achievement = cheerio(element).text().trim().toLowerCase()
      const rareAchievement = scrapingTokens[achievement]
      if (rareAchievement) {
        achievementSet.add(rareAchievement)
      }
    })

    return [...achievementSet]
  }

  storeFirstPage($: CheerioAPI): CharacterItem[] {
    const firstPage = $('#StoreItemSummary .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.items(html) : []
  }

  outfitFirstPage($: CheerioAPI): Outfit[] {
    const firstPage = $('#Outfits .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.outfits(html) : []
  }

  storeOutfitFirstPage($: CheerioAPI): Outfit[] {
    const firstPage = $('#StoreOutfits .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.outfits(html) : []
  }

  mountFirstPage($: CheerioAPI): string[] {
    const firstPage = $('#Mounts .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.mounts(html) : []
  }

  storeMountFirstPage($: CheerioAPI): string[] {
    const firstPage = $('#StoreMounts .TableContent tbody .BlockPage')
    const html = firstPage.html()
    return html ? this.postHelper.mounts(html) : []
  }

  boxSectionLastIndex(id: string, $: CheerioAPI): number {
    const lastPageLink = $(`#${id} .TableContent tbody .PageLink:last-child a`)

    let lastIndex = 1
    lastPageLink.each((_, element) => {
      const href = cheerio(element).attr('href') as string
      const [, lastPageIndex] = href.split('&currentpage=')
      lastIndex = +lastPageIndex
    })

    return lastIndex
  }

  async characterObject(
    content: CheerioAPI | string,
  ): Promise<CharacterObject> {
    const $ = loadCheerio(content)

    exitIfMaintenance(() => this.maintenanceCheck($))

    const serverName = this.serverName($)

    const serverData = this.servers.get(serverName)

    if (!serverData) {
      throw Error(`No data found for '${serverName}'.`)
    }

    const characterObject: CharacterObject = {
      id: this.id($),
      nickname: this.nickname($),
      auctionEnd: this.auctionEnd($),
      currentBid: this.currentBid($),
      hasBeenBidded: this.hasBeenBidded($),
      outfitId: this.outfitId($),
      vocationId: this.vocationId($),
      sex: this.sex($),
      level: this.level($),
      achievementPoints: this.achievementPoints($),
      bossPoints: this.bossPoints($),
      tcInvested: 0,
      tags: [],
      skills: this.skills($),
      items: this.items($),
      charms: this.charms($),
      transfer: this.transfer($),
      imbuements: this.imbuements($),
      quests: this.quests($),
      ...(await getPagedData($)),
      rareAchievements: this.rareAchievements($),
      hirelings: this.hirelings($),
      huntingSlot: this.huntingSlot($),
      preySlot: this.preySlot($),
      charmInfo: {
        ...this.allCharmPoints($),
        expansion: this.charmExpansion($),
      },
      server: serverData,
      serverName,
    }

    characterObject.tcInvested = totalCharacterInvestment(characterObject)
    characterObject.tags = getCharacterTags(characterObject)

    return characterObject
  }

  async checkHistoryAuction(content: string): Promise<HistoryCheck> {
    const $ = cheerio.load(content)

    exitIfMaintenance(() => this.maintenanceCheck($))

    if (this.errorCheck($)) {
      return {
        result: 'NOT_FOUND',
        data: null,
      }
    }

    if (!this.isFinished($)) {
      return {
        result: 'NOT_FINISHED',
        data: {
          id: this.id($),
          auctionEnd: this.auctionEnd($),
        },
      }
    }

    return {
      result: 'IS_FINISHED',
      data: await this.characterObject($),
    }
  }

  private async getPageableData(content: string): Promise<RawAuction> {
    const $ = cheerio.load(content)

    const auctionId = this.id($)

    return {
      id: this.id($),
      html: content,
      pageableData: await getPageableAuctionData(auctionId, $),
    }
  }

  async checkRawAuction(content: string): Promise<RawCheck> {
    const $ = cheerio.load(content)

    exitIfMaintenance(() => this.maintenanceCheck($))

    if (this.errorCheck($)) {
      return {
        result: 'NOT_FOUND',
        data: null,
      }
    }

    if (!this.isFinished($)) {
      return {
        result: 'NOT_FINISHED',
        data: {
          id: this.id($),
          auctionEnd: this.auctionEnd($),
        },
      }
    }

    return {
      result: 'IS_FINISHED',
      data: await this.getPageableData(content),
    }
  }
}
