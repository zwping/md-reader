import MD_PLUGINS from '@/config/md-plugins'
import PAGE_THEMES from '@/config/page-themes'
import { MERMAID_MAX_ZOOM_DEFAULT } from '@/config/mermaid'
import i18n from '@/config/i18n'

export interface Data {
  enable?: boolean
  refresh?: boolean
  language?: string
  centered?: boolean
  mdPlugins?: typeof MD_PLUGINS
  pageTheme?: typeof PAGE_THEMES[0]
  hiddenSide?: boolean
  mermaidMaxZoom?: number
}

export function getDefaultData(mergeData: Data = {}): Data {
  return {
    enable: true,
    refresh: false,
    centered: true,
    hiddenSide: false,
    language: i18n().locale,
    mdPlugins: [...MD_PLUGINS],
    pageTheme: 'auto',
    mermaidMaxZoom: MERMAID_MAX_ZOOM_DEFAULT,
    ...mergeData,
  }
}
