import type MarkdownIt from 'markdown-it'
import { renderMermaidPlaceholder } from '@/core/mermaid'

type MermaidOptions = { theme?: 'dark' | 'default' }

export default function MermaidBlockPlugin(
  md: MarkdownIt,
  { theme = 'default' }: MermaidOptions = {},
) {
  const fallbackFence = md.renderer.rules.fence?.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    if (token.info.trim() === 'mermaid') {
      return renderMermaidPlaceholder(token.content.trim(), theme)
    }

    if (fallbackFence) {
      return fallbackFence(tokens, idx, options, env, self)
    }

    return self.renderToken(tokens, idx, options)
  }
}
