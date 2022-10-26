import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, randomDataset } from 'utils/test'
import { formatNumberWithCommas } from 'utils'
import * as imbuement from 'data-dictionary/dist/dictionaries/imbuement'
import * as charm from 'data-dictionary/dist/dictionaries/charm'
import * as quest from 'data-dictionary/dist/dictionaries/quest'
import { vocation } from 'shared-utils/dist/vocations'
import { routes } from 'Constants'
import CharacterCard, { BOSS_SLOT_POINTS } from '..'

const { characterData } = randomDataset()
const characterList = characterData.slice(0, 10)

describe('<CharacterCard />', () => {
  test.each(characterList)('should write every info correctly', (character) => {
    renderWithProviders(<CharacterCard characterData={character} />)

    expect(screen.getByText(character.nickname)).toBeInTheDocument()

    expect(
      screen.getByText(
        `Level ${character.level} - ${vocation.getFullName(
          character.vocationId,
          character.level,
        )}`,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByAltText(character.server.serverLocation),
    ).toBeInTheDocument()

    expect(screen.getByText(character.server.serverName)).toBeInTheDocument()

    expect(
      screen.getByLabelText(
        character.transfer
          ? 'Regular World Transfer available'
          : 'Regular World Transfer NOT available',
      ),
    ).toBeInTheDocument()

    expect(screen.getByText(character.server.pvpType)).toBeInTheDocument()

    expect(
      screen.getByText(character.hasBeenBidded ? 'Current Bid' : 'Minimum Bid'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(formatNumberWithCommas(character.currentBid)),
    ).toBeInTheDocument()

    expect(screen.queryAllByAltText('Featured item')).toHaveLength(
      character.items.length,
    )

    character.items.forEach((itemId) => {
      const [, tier] = itemId.toString().split('.')
      if (tier) {
        const [first] = screen.queryAllByTitle(`tier ${tier}`)
        expect(first).toBeInTheDocument()
      }
    })

    expect(
      screen.getByText(
        `Imbuements: ${character.imbuements.length}/${imbuement.tokens.length}`,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `Charms: ${character.charms.length}/${charm.tokens.length}`,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `Quests: ${character.quests.length}/${quest.tokens.length}`,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `Boss points: ${formatNumberWithCommas(character.bossPoints)}`,
      ),
    ).toBeInTheDocument()

    const charmCheckbox = screen.getByRole('checkbox', {
      name: 'Charm Expansion',
    })
    if (character.charmInfo.expansion) {
      expect(charmCheckbox).toBeChecked()
    } else {
      expect(charmCheckbox).not.toBeChecked()
    }

    const preyCheckbox = screen.getByRole('checkbox', {
      name: 'Prey Slot',
    })
    if (character.preySlot) {
      expect(preyCheckbox).toBeChecked()
    } else {
      expect(preyCheckbox).not.toBeChecked()
    }

    const bossSlotCheckbox = screen.getByRole('checkbox', {
      name: 'Boss Slot',
    })
    if (character.bossPoints >= BOSS_SLOT_POINTS) {
      expect(bossSlotCheckbox).toBeChecked()
    } else {
      expect(bossSlotCheckbox).not.toBeChecked()
    }

    const totalInvestment = formatNumberWithCommas(character.tcInvested)

    if (totalInvestment === '0') {
      expect(screen.queryByText(totalInvestment)).not.toBeInTheDocument()
    } else {
      expect(
        screen.getByText(totalInvestment, { exact: false }),
      ).toBeInTheDocument()
    }
  })

  test.each(characterList)(
    `should render a different bid label for ${routes.BAZAAR_HISTORY} route`,
    (character) => {
      renderWithProviders(<CharacterCard characterData={character} past />)
      expect(
        screen.getByText(
          character.hasBeenBidded ? 'Auction Successful' : 'Auction Failed',
        ),
      ).toBeInTheDocument()
    },
  )

  test.each(characterList)(
    `should render highlighted card correctly`,
    (character) => {
      renderWithProviders(
        <CharacterCard characterData={character} highlighted />,
      )

      expect(screen.getByText('Highlight your auction!')).toBeInTheDocument()
    },
  )

  test('the character card should be able to be expanded', () => {
    const [character] = characterList
    renderWithProviders(<CharacterCard characterData={character} expandable />)

    const expandButton = screen.getByRole('button', {
      name: 'Expand for full auction details',
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    userEvent.click(expandButton)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
