import { memo } from 'react'
import clsx from 'clsx'
import { vocation } from 'data-dictionary/dist/dictionaries/vocations'
import CharacterMiniCard from '../../../CharacterMiniCard'
import { HeadProps } from './types'

export const HeadWrapper = ({
  className,
  ...props
}: JSX.IntrinsicElements['div']) => (
  <div
    className={clsx('mb-4 flex items-start gap-1.5', className)}
    {...props}
  />
)

const Head = ({
  highlighted = false,
  id,
  nickname,
  outfitId,
  level,
  vocationId,
  serverName,
  permalink,
  children,
}: HeadProps) => (
  <HeadWrapper>
    <CharacterMiniCard
      className="mr-auto"
      highlighted={highlighted}
      outfitSrc={`https://static.tibia.com/images/charactertrade/outfits/${outfitId}.gif`}
      characterData={{
        name: nickname,
        level,
        vocation: vocation.getPromotedName({ vocationId, level }),
        world: serverName,
      }}
      linkUrl={`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${id}`}
      permalink={permalink}
    />

    {children}
  </HeadWrapper>
)

export default memo(Head)
