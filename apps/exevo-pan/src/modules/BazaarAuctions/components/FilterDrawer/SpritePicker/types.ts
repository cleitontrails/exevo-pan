type ExtractFilterByType<Type> = keyof FilterProperties<FilterOptions, Type>

export type SpritePickerProps = {
  title: string
  spriteDirectory: string
  directorySuffix?: string
  filterKey: ExtractFilterByType<Set<string>>
  options: string[]
  children?: React.ReactNode
}
