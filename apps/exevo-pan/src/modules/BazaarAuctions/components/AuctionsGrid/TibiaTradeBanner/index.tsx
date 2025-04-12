/* eslint-disable react/jsx-no-target-blank */
import clsx from 'clsx'
import { links } from 'Constants'
import { templateMessage, useTranslations } from 'contexts/useTranslation'
import { loadRawSrc } from 'utils'
import { Chip, SpritePortrait, Text } from 'components/Atoms'

const greenSrc = loadRawSrc('/assets/greenbattleye.png')
const yellowSrc = loadRawSrc('/assets/yellowbattleye.png')

const { TIBIA_TRADE: TIBIA_TRADE_URL } = links

type TibiaTradeBannerProps = {
  items: TibiaTradeHighlightedItem[]
} & React.ComponentPropsWithoutRef<'section'>

export const Item = ({ item }: { item: TibiaTradeHighlightedItem }) => {
  const { homepage } = useTranslations()
  const i18n = homepage.AuctionsGrid.TibiaTradeBanner

  return (
    <a
      className="card group flex items-center gap-4"
      href={item.url}
      target="_blank"
      rel="noopener external nofollow"
    >
      <SpritePortrait
        src={item.imgSrc}
        alt={item.name}
        width={32}
        height={32}
        counter={item.tier > 0 ? item.tier : undefined}
        className="relative top-0 transition-all group-hover:-top-0.5"
      />

      <div className="grid gap-2">
        <strong className="text-tsm tracking-wide">{item.name}</strong>

        <div className="flex items-center gap-2">
          <Chip>{item.offer === 'buy' ? i18n.buying : i18n.selling}</Chip>
          <Chip>
            <img
              role="none"
              alt={item.greenBattleye ? 'Green BattlEye' : 'Yellow BattlEye'}
              src={item.greenBattleye ? greenSrc : yellowSrc}
              className="pixelated"
            />{' '}
            {item.serverName}
          </Chip>
          {item.value !== null && (
            <Chip>
              {item.value.currency === 'tc' && (
                <Text.TibiaCoin value={item.value.price} />
              )}
              {item.value.currency === 'gp' && (
                <Text.GoldCoin value={item.value.price} />
              )}
            </Chip>
          )}
        </div>
      </div>
    </a>
  )
}

export const TibiaTradeBanner = ({
  items,
  className,
  ...props
}: TibiaTradeBannerProps) => {
  const { homepage } = useTranslations()
  const i18n = homepage.AuctionsGrid.TibiaTradeBanner

  return (
    <section className={clsx('relative grid gap-2', className)} {...props}>
      <div className="z-1 from-background pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l to-transparent" />

      <p className="text-tsm font-light">
        {templateMessage(i18n.heading, {
          link: (
            <a
              href={TIBIA_TRADE_URL}
              target="_blank"
              rel="noopener external nofollow"
              className="text-primaryHighlight font-bold tracking-wide"
            >
              TibiaTrade
            </a>
          ),
        })}
      </p>

      <div className="hidden-scrollbar flex w-full gap-4 overflow-auto pr-8 pb-2">
        {items.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Item key={idx} item={item} />
        ))}
      </div>
    </section>
  )
}
