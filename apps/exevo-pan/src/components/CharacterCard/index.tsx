import { templateMessage, useTranslations } from 'contexts/useTranslation'
import { memo } from 'react'
import { formatNumberWithCommas } from 'utils'
import { routes } from 'Constants'
import { useLocalizedHref } from 'hooks/useLocalizedHref'
import {
  BossPoints,
  CharacterItems,
  CharacterSkills,
  CharmsTooltip,
  GemsTooltip,
  Head,
  ImbuementsTooltip,
  QuestsTooltip,
  SpecialTags,
  TagButton,
  Textbox,
} from './Parts'
import * as S from './atoms'
import { getTCState } from './utils'
import { CharacterCardProps } from './types'

const CharacterCard = ({
  characterData,
  highlighted = false,
  lazyRender = false,
  past = false,
  cornerElement,
  ...props
}: CharacterCardProps) => {
  const { common } = useTranslations()

  const {
    id,
    nickname,
    outfitId,
    level,
    vocationId,
    serverData,
    transfer,
    auctionEnd,
    hasBeenBidded,
    currentBid,
    items,
    skills,
    imbuements,
    quests,
    charmInfo,
    preySlot,
    bossPoints,
    gems,
    greaterGems,
  } = characterData

  const tcInvested = formatNumberWithCommas(characterData.tcInvested)
  const tcState = getTCState(characterData.tcInvested)

  const localizedExevoProHref = useLocalizedHref(routes.EXEVOPRO)

  return (
    <S.Wrapper highlighted={highlighted} {...props}>
      <Head
        id={id}
        outfitId={outfitId}
        nickname={nickname}
        level={level}
        vocationId={vocationId}
        serverName={serverData.serverName}
        highlighted={highlighted}
      >
        {highlighted && <TagButton />}
        {cornerElement}
      </Head>

      <S.Body lazy={lazyRender}>
        <S.InfoGrid>
          <Textbox.Server
            serverData={serverData}
            nickname={nickname}
            transfer={transfer}
          />
          <Textbox.Pvp serverData={serverData} />
          <Textbox.AuctionEnd auctionEnd={auctionEnd} past={past} />
          <Textbox.AuctionBid
            hasBeenBidded={hasBeenBidded}
            currentBid={currentBid}
            past={past}
          />
        </S.InfoGrid>

        <CharacterItems items={items} />

        <CharacterSkills skills={skills} />

        <S.FlexFooter>
          <S.FlexColumn>
            <ImbuementsTooltip items={imbuements} />
            <CharmsTooltip charmPoints={charmInfo.total} />
            <QuestsTooltip items={quests} />
            <BossPoints bossPoints={bossPoints} />
          </S.FlexColumn>

          <S.FlexColumn storeColumn>
            <S.Checkbox label="Charm Expansion" checked={charmInfo.expansion} />

            <S.Checkbox label="Prey Slot" checked={preySlot} />

            <div className="block">
              <GemsTooltip gems={gems} greaterGems={greaterGems} />
            </div>

            {
              {
                INVESTED: (
                  <div
                    className="flex items-center gap-1.5"
                    title={`${common.CharacterCard.tcInvested.prefix} ${tcInvested} ${common.CharacterCard.tcInvested.suffix}`}
                  >
                    <S.CheckboxContainer>
                      <S.Icons.TibiaCoin />
                    </S.CheckboxContainer>
                    <S.Strong>
                      {tcInvested} {common.CharacterCard.tcInvested.invested}
                    </S.Strong>
                  </div>
                ),
                HIDDEN: (
                  <a
                    href={localizedExevoProHref}
                    className="text-onSurface text-tsm mt-auto flex flex-wrap items-center gap-1.5"
                    style={{ height: 'unset' }}
                  >
                    <S.CheckboxContainer>
                      <S.Icons.TibiaCoin />
                    </S.CheckboxContainer>
                    <S.Strong>
                      ??? {common.CharacterCard.tcInvested.invested}{' '}
                    </S.Strong>
                    <small className="w-full font-light tracking-wider">
                      {templateMessage(
                        common.CharacterCard.tcInvested.exclusive,
                        {
                          exevopro: (
                            <strong className="rare-gradient-text font-bold">
                              Exevo Pro{' '}
                              <span className="text-onSurface">🚀</span>
                            </strong>
                          ),
                        },
                      )}
                    </small>
                  </a>
                ),
                NO_TC: null,
              }[tcState]
            }
          </S.FlexColumn>
        </S.FlexFooter>
      </S.Body>

      <SpecialTags character={characterData} />
    </S.Wrapper>
  )
}

export default memo(CharacterCard)
export { default as CardSkeleton } from './Skeleton'
