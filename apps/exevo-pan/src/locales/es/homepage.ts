export default {
  Meta: {
    title: 'Subastas',
    description:
      '¡Filtra y explora los caracteres de Tibia en el Char Bazaar oficial!',
  },
  AuctionsGrid: {
    filterButtonLabel: 'Abrir menú de filtros',
    sortingButtonLabel: 'Definir un criterio de ordenación',
    filter: 'filtro',
    filters: 'filtros',
    is: 'está',
    are: 'son',
    active: 'activo',
    noItemsPagination: 'Sin personajes',
    filterDrawerLabel: 'Formulario de filtro',
    descendingSwitchLabel: 'Ordenar en orden descendente',
    descending: 'Descendente',
    sortModes: {
      auctionEnd: 'Fin de la subasta',
      level: 'Level',
      price: 'Precio',
      priceBidded: 'Precio (solo con oferta)',
    },
    noAuctionFound: 'Disculpa, no se encontró ninguna subasta',
    changeFilters: 'Cambiar filtros',
  },
  FilterDrawer: {
    title: 'Filtros',
    labels: {
      searchNickname: 'Buscar nickname',
      vocation: 'Vocación',
      serverLocation: 'Ubicación del servidor',
      storeItems: 'Store items',
      minSkill: 'Skill level mínimo',
      /* @ ToDo: i18n */
      tcInvested: 'Tibia Coins invested',
      /* @ ToDo: i18n */
      biddedOnly: 'Bidded only',
      rareAchievements: 'Achievements raros',
      rareItems: 'Items raros',
      misc: 'Variados',
    },
    placeholders: {
      server: 'Elige un servidor',
      imbuements: 'Seleccione imbuements',
      charms: 'Seleccione charms',
      quests: 'Seleccione quests',
      achievements: 'Seleccione achievements',
      rareItems: 'Escoge un item',
    },
    tooltips: {
      rareItems:
        'Si un artículo raro no está en esta lista, actualmente no hay subasta para él.',
      rareNicknames:
        "Nicknames con caracteres especiales (äëïöüÿ'-.,), tamaño de 2-3 caracteres y letras mayúsculas consecutivas (e.g XVI)",
    },
    toggleAll: {
      imbuements: 'Todos los imbuements',
      charms: 'Todos los charms',
      items: 'Todos los items',
    },
    resetFilters: 'Resetar filtros',
    green: 'Verde',
    yellow: 'Amarillo',
    skullEmoji: 'cráneo',
    SpritePicker: {
      item: 'item está seleccionado',
      items: 'items estan seleccionados',
    },
  },
}
