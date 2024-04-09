import { noop } from '@/lib/noop'
import { ref, provide, inject, type Ref, type InjectionKey } from 'vue'

export interface Tab {
  id: string
  title: string
  onTabSelected: (tab: Tab) => void
}

const TABS_KEY = Symbol('tabs') as InjectionKey<Ref<Tab[]>>
const SELECTED_TAB_KEY = Symbol('selected-tab') as InjectionKey<Ref<Tab | undefined>>
const ADD_TAB_KEY = Symbol('add-tab') as InjectionKey<(tab: Tab) => void>
const REMOVE_TAB_KEY = Symbol('remove-tab') as InjectionKey<(tab: Tab) => void>
const SELECT_TAB_KEY = Symbol('select-tab') as InjectionKey<(tab: Tab | undefined) => void>

// eslint-disable-next-line max-lines-per-function
export function provideTabs(
  onTabSelected: (tab: Tab | undefined) => void,
) {
  const tabs = ref<Tab[]>([])
  const selectedTab = ref<Tab>()

  function selectTab(tab: Tab | undefined) {
    selectedTab.value = tab
    tab?.onTabSelected(tab)
    onTabSelected(tab)
  }

  function addTab(tab: Tab) {
    tabs.value.push(tab)

    if (!selectedTab.value) {
      selectedTab.value = tab
    }
  }

  function removeTab(tab: Tab) {
    tabs.value = tabs.value.filter(item => item.id !== tab.id)
  }

  provide(TABS_KEY, tabs)
  provide(SELECTED_TAB_KEY, selectedTab)
  provide(ADD_TAB_KEY, addTab)
  provide(REMOVE_TAB_KEY, removeTab)
  provide(SELECT_TAB_KEY, selectTab)

  return {
    selectTab,
    addTab,
  }
}

// eslint-disable-next-line complexity
export function useTabs() {
  const tabs = inject(TABS_KEY) || ref<Tab[]>()
  const selectedTab = inject(SELECTED_TAB_KEY) || ref<Tab>()
  const addTab = inject(ADD_TAB_KEY) || noop
  const removeTab = inject(REMOVE_TAB_KEY) || noop
  const selectTab = inject(SELECT_TAB_KEY) || noop

  return {
    tabs,
    selectedTab,
    addTab,
    removeTab,
    selectTab,
  }
}
