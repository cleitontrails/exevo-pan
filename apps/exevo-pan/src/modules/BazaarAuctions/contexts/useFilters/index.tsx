import { createContext, useContext, useCallback, useMemo } from 'react'
import { useUrlParamsState } from 'hooks'
import { DEFAULT_FILTER_OPTIONS } from 'shared-utils/dist/contracts/Filters/defaults'
import { countActiveFilters, toggleSet } from './utils'
import { schema } from './schema'
import { FiltersContextValues } from './types'

const FiltersContext = createContext<FiltersContextValues>(
  {} as FiltersContextValues,
)

export const FiltersProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [filterState, setFilterState] = useUrlParamsState(schema)

  return (
    <FiltersContext.Provider
      value={{
        filterState,
        defaultValues: DEFAULT_FILTER_OPTIONS,
        activeFilterCount: useMemo(
          () => countActiveFilters(filterState, DEFAULT_FILTER_OPTIONS),
          [filterState],
        ),
        setFilters: useCallback(
          (newValues) =>
            setFilterState((currentValues) => ({
              ...currentValues,
              ...newValues,
            })),
          [],
        ),
        toggleFilterSet: useCallback(
          ({ key, value }) =>
            setFilterState((currentValues) => ({
              ...currentValues,
              key: toggleSet(currentValues[key], value),
            })),
          [],
        ),
        toggleAllFilterSetOptions: useCallback(
          (key, allOptions) =>
            setFilterState((currentValues) => ({
              ...currentValues,
              key:
                currentValues[key].size === allOptions.length
                  ? new Set([])
                  : new Set(allOptions.map(({ value }) => value)),
            })),
          [],
        ),
        toggleAddon: useCallback(
          (value) =>
            setFilterState((currentValues) => {
              const currentAddon = currentValues.addon
              return {
                ...currentValues,
                addon:
                  currentAddon === 3 || currentAddon === value
                    ? currentAddon - value
                    : currentAddon + value,
              }
            }),
          [],
        ),
        resetFilters: useCallback(
          () => setFilterState({ ...DEFAULT_FILTER_OPTIONS }),
          [],
        ),
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export const useFilters = (): FiltersContextValues => useContext(FiltersContext)
