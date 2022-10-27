/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Switch, Checkbox } from 'components/Atoms'
import clsx from 'clsx'
import { useFilters } from '../../../contexts/useFilters'
import styles from './styles.module.css'
import { OutfitControlsProps } from './types'

const OutfitControls = ({ disableAddons = false }: OutfitControlsProps) => {
  const { filterState, setFilters, toggleAddon } = useFilters()

  const firstAddonSelected = filterState.addon === 1 || filterState.addon === 3
  const secondAddonSelected = filterState.addon === 2 || filterState.addon === 3

  return (
    <div className="mt-1.5 mb-2 flex w-full flex-wrap items-center gap-3.5">
      <div
        onClick={() => setFilters({ sex: filterState.sex })}
        className={clsx(
          'text-tsm mr-4 flex w-full cursor-pointer items-center gap-2',
          styles.switchWrapper,
        )}
      >
        Male
        <Switch active={filterState.sex} />
        Female
      </div>

      <Checkbox
        label="Addon 1"
        disabled={disableAddons}
        checked={disableAddons || firstAddonSelected}
        onClick={() => toggleAddon(1)}
      />
      <Checkbox
        label="Addon 2"
        disabled={disableAddons}
        checked={disableAddons || secondAddonSelected}
        onClick={() => toggleAddon(2)}
      />
    </div>
  )
}

export default OutfitControls
