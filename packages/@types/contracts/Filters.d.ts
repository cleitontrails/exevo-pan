declare type PaginationOptions = {
  pageIndex: number
  pageSize: number
}

declare type SortOptions = {
  sortingMode: number
  descendingOrder: boolean
}

declare type FilterBodyPayload = {
  paginationOptions: PaginationOptions
  sortOptions: SortOptions
  filterOptions: FilterOptions
}

type FilterOptionsPrimitives = Pick<
  FilterOptions,
  | 'nicknameFilter'
  | 'minLevel'
  | 'maxLevel'
  | 'minSkill'
  | 'maxSkill'
  | 'bossPoints'
  | 'tcInvested'
  | 'rareNick'
  | 'addon'
  | 'sex'
  | 'charmExpansion'
  | 'preySlot'
  | 'huntingSlot'
  | 'rewardShrine'
  | 'imbuementShrine'
  | 'dummy'
  | 'mailbox'
  | 'goldPouch'
  | 'hireling'
  | 'transferAvailable'
  | 'biddedOnly'
>

declare interface SerializedFilterOptions extends FilterOptionsPrimitives {
  auctionIds: number[]
  vocation: number[]
  pvp: string[]
  battleye: boolean[]
  location: string[]
  serverSet: string[]
  tags: string[]
  skillKey: string[]
  imbuementsSet: string[]
  charmsSet: string[]
  questSet: string[]
  outfitSet: string[]
  storeOutfitSet: string[]
  mountSet: string[]
  storeMountSet: string[]
  achievementSet: string[]
  rareItemSet: string[]
}

declare interface SerializedFilterBody {
  paginationOptions: PaginationOptions
  sortOptions: SortOptions
  filterOptions: SerializedFilterOptions
}

declare type FilterResponse = PaginatedData<CharacterObject>
