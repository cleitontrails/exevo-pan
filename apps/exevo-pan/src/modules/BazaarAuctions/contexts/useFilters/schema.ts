import { DEFAULT_FILTER_OPTIONS } from 'shared-utils/dist/contracts/Filters/defaults'
import { SchemaCodec, codecs } from 'hooks/useUrlParamsState'

export const schema: SchemaCodec<FilterOptions> = {
  auctionIds: {
    urlKey: 'auctionIds',
    defaultValue: DEFAULT_FILTER_OPTIONS.auctionIds,
    encode: codecs.encode.NumberSet,
    decode: codecs.decode.NumberSet,
  },
  nicknameFilter: {
    urlKey: 'nicknameFilter',
    defaultValue: DEFAULT_FILTER_OPTIONS.nicknameFilter,
  },
  vocation: {
    urlKey: 'vocation',
    defaultValue: DEFAULT_FILTER_OPTIONS.vocation,
    encode: codecs.encode.NumberSet,
    decode: codecs.decode.NumberSet,
  },
  pvp: {
    urlKey: 'pvp',
    defaultValue: DEFAULT_FILTER_OPTIONS.pvp,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  battleye: {
    urlKey: 'battleye',
    defaultValue: DEFAULT_FILTER_OPTIONS.battleye,
    encode: codecs.encode.BooleanSet,
    decode: codecs.decode.BooleanSet,
  },
  location: {
    urlKey: 'location',
    defaultValue: DEFAULT_FILTER_OPTIONS.location,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  serverSet: {
    urlKey: 'serverSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.serverSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  tags: {
    urlKey: 'tags',
    defaultValue: DEFAULT_FILTER_OPTIONS.tags,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  minLevel: {
    urlKey: 'minLevel',
    defaultValue: DEFAULT_FILTER_OPTIONS.minLevel,
    decode: codecs.decode.Number,
  },
  maxLevel: {
    urlKey: 'maxLevel',
    defaultValue: DEFAULT_FILTER_OPTIONS.maxLevel,
    decode: codecs.decode.Number,
  },
  minSkill: {
    urlKey: 'minSkill',
    defaultValue: DEFAULT_FILTER_OPTIONS.minSkill,
    decode: codecs.decode.Number,
  },
  maxSkill: {
    urlKey: 'maxSkill',
    defaultValue: DEFAULT_FILTER_OPTIONS.maxSkill,
    decode: codecs.decode.Number,
  },
  bossPoints: {
    urlKey: 'bossPoints',
    defaultValue: DEFAULT_FILTER_OPTIONS.bossPoints,
    decode: codecs.decode.Number,
  },
  tcInvested: {
    urlKey: 'tcInvested',
    defaultValue: DEFAULT_FILTER_OPTIONS.tcInvested,
    decode: codecs.decode.Number,
  },
  addon: {
    urlKey: 'addon',
    defaultValue: DEFAULT_FILTER_OPTIONS.addon,
    decode: codecs.decode.Number,
  },
  sex: {
    urlKey: 'sex',
    defaultValue: DEFAULT_FILTER_OPTIONS.sex,
    decode: codecs.decode.Boolean,
  },
  skillKey: {
    urlKey: 'skillKey',
    defaultValue: DEFAULT_FILTER_OPTIONS.skillKey,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  imbuementsSet: {
    urlKey: 'imbuementsSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.imbuementsSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  charmsSet: {
    urlKey: 'charmSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.charmsSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  rareNick: {
    urlKey: 'rareNick',
    defaultValue: DEFAULT_FILTER_OPTIONS.rareNick,
    decode: codecs.decode.Boolean,
  },
  questSet: {
    urlKey: 'questSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.questSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  outfitSet: {
    urlKey: 'outfitSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.outfitSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  storeOutfitSet: {
    urlKey: 'storeOutfitSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.storeOutfitSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  mountSet: {
    urlKey: 'mountSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.mountSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  storeMountSet: {
    urlKey: 'storeMountSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.storeMountSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  achievementSet: {
    urlKey: 'achievementSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.achievementSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
  charmExpansion: {
    urlKey: 'charmExpansion',
    defaultValue: DEFAULT_FILTER_OPTIONS.charmExpansion,
    decode: codecs.decode.Boolean,
  },
  preySlot: {
    urlKey: 'preySlot',
    defaultValue: DEFAULT_FILTER_OPTIONS.preySlot,
    decode: codecs.decode.Boolean,
  },
  huntingSlot: {
    urlKey: 'huntingSlot',
    defaultValue: DEFAULT_FILTER_OPTIONS.huntingSlot,
    decode: codecs.decode.Boolean,
  },
  rewardShrine: {
    urlKey: 'rewardShrine',
    defaultValue: DEFAULT_FILTER_OPTIONS.rewardShrine,
    decode: codecs.decode.Boolean,
  },
  imbuementShrine: {
    urlKey: 'imbuementShrine',
    defaultValue: DEFAULT_FILTER_OPTIONS.imbuementShrine,
    decode: codecs.decode.Boolean,
  },
  dummy: {
    urlKey: 'dummy',
    defaultValue: DEFAULT_FILTER_OPTIONS.dummy,
    decode: codecs.decode.Boolean,
  },
  mailbox: {
    urlKey: 'mailbox',
    defaultValue: DEFAULT_FILTER_OPTIONS.mailbox,
    decode: codecs.decode.Boolean,
  },
  goldPouch: {
    urlKey: 'goldPouch',
    defaultValue: DEFAULT_FILTER_OPTIONS.goldPouch,
    decode: codecs.decode.Boolean,
  },
  hireling: {
    urlKey: 'hireling',
    defaultValue: DEFAULT_FILTER_OPTIONS.hireling,
    decode: codecs.decode.Boolean,
  },
  transferAvailable: {
    urlKey: 'transferAvailable',
    defaultValue: DEFAULT_FILTER_OPTIONS.transferAvailable,
    decode: codecs.decode.Boolean,
  },
  biddedOnly: {
    urlKey: 'biddedOnly',
    defaultValue: DEFAULT_FILTER_OPTIONS.biddedOnly,
    decode: codecs.decode.Boolean,
  },
  rareItemSet: {
    urlKey: 'rareItemSet',
    defaultValue: DEFAULT_FILTER_OPTIONS.rareItemSet,
    encode: codecs.encode.StringSet,
    decode: codecs.decode.StringSet,
  },
}
