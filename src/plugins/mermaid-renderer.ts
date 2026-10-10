import mermaid from 'mermaid'
import {
  MERMAID_CLASS,
  MERMAID_CONTROLS_CLASS,
  MERMAID_ERROR_CLASS,
} from '@/core/mermaid'
import { writeText } from '@/shared'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 5
const ZOOM_STEP = 1.25
const FULLSCREEN_CLASS = `${MERMAID_CLASS}--fullscreen`
const INTERACTIVE_CLASS = `${MERMAID_CLASS}--interactive`
const FULLSCREEN_BODY_CLASS = 'md-reader--mermaid-fullscreen'
const NODE_PALETTE = [
  '#e879f9',
  '#2dd4bf',
  '#fb923c',
  '#22d3ee',
  '#4ade80',
  '#a78bfa',
  '#f87171',
  '#facc15',
  '#818cf8',
  '#a3e635',
  '#38bdf8',
  '#fb7185',
]
const fullscreenLocations = new WeakMap<
  HTMLElement,
  { placeholder: Comment; parent: Node; nextSibling: Node | null }
>()

function isMermaidFullscreen(wrapper: HTMLElement) {
  return wrapper.classList.contains(FULLSCREEN_CLASS)
}

function canOperateCanvas(wrapper: HTMLElement) {
  const zoom = Number(wrapper.dataset.zoom) || 1

  return isMermaidFullscreen(wrapper) || zoom > 1
}

function getCanvasLayout(viewport: HTMLElement, svg: SVGSVGElement) {
  const viewBoxWidth = svg.viewBox.baseVal.width
  const viewBoxHeight = svg.viewBox.baseVal.height
  const viewportStyles = window.getComputedStyle(viewport)
  const paddingLeft = parseFloat(viewportStyles.paddingLeft)
  const paddingRight = parseFloat(viewportStyles.paddingRight)
  const paddingTop = parseFloat(viewportStyles.paddingTop)
  const paddingBottom = parseFloat(viewportStyles.paddingBottom)
  const availableWidth = Math.max(
    1,
    viewport.clientWidth - paddingLeft - paddingRight,
  )
  const availableHeight = Math.max(
    1,
    viewport.clientHeight - paddingTop - paddingBottom,
  )
  const fitWidth = Math.min(
    viewBoxWidth,
    availableWidth,
    (availableHeight * viewBoxWidth) / viewBoxHeight,
  )
  const fitHeight = (fitWidth * viewBoxHeight) / viewBoxWidth

  return {
    fitWidth,
    fitHeight,
    offsetX: Math.max(0, (availableWidth - fitWidth) / 2),
    offsetY: Math.max(0, (availableHeight - fitHeight) / 2),
    paddingLeft,
    paddingTop,
  }
}

function resetMermaidCanvas(wrapper: HTMLElement) {
  wrapper.dataset.zoom = '1'
  wrapper.dataset.panX = '0'
  wrapper.dataset.panY = '0'

  wrapper.querySelectorAll<HTMLElement>('svg, .mermaid').forEach(element => {
    element.style.removeProperty('zoom')
    element.style.removeProperty('transform')
    element.style.removeProperty('transform-origin')
  })
}

function setMermaidFullscreen(wrapper: HTMLElement, fullscreen: boolean) {
  if (fullscreen) {
    const placeholder = document.createComment('Mermaid diagram position')
    const parent = wrapper.parentNode
    if (!parent) {
      return
    }

    const nextSibling = wrapper.nextSibling
    wrapper.before(placeholder)
    fullscreenLocations.set(wrapper, { placeholder, parent, nextSibling })
    wrapper.classList.add(FULLSCREEN_CLASS)
    document.body.append(wrapper)
    document.documentElement.classList.add(FULLSCREEN_BODY_CLASS)
    document.body.classList.add(FULLSCREEN_BODY_CLASS)
  } else {
    const location = fullscreenLocations.get(wrapper)
    if (location?.placeholder.isConnected) {
      location.placeholder.replaceWith(wrapper)
    } else if (location?.parent.isConnected) {
      const nextSibling =
        location.nextSibling?.parentNode === location.parent
          ? location.nextSibling
          : null
      location.parent.insertBefore(wrapper, nextSibling)
    } else {
      document
        .querySelector<HTMLElement>('.md-reader__markdown-content')
        ?.append(wrapper)
    }
    fullscreenLocations.delete(wrapper)
    wrapper.classList.remove(FULLSCREEN_CLASS)
    resetMermaidCanvas(wrapper)
    document.documentElement.classList.remove(FULLSCREEN_BODY_CLASS)
    document.body.classList.remove(FULLSCREEN_BODY_CLASS)
  }

  syncMermaidZoom()
}

function syncMermaidZoom() {
  document
    .querySelectorAll<HTMLElement>(`.${MERMAID_CLASS}`)
    .forEach(wrapper => {
      const viewport = wrapper.querySelector<HTMLElement>(
        `.${MERMAID_CLASS}__viewport`,
      )
      const svg = viewport?.querySelector<SVGSVGElement>('svg')
      if (!viewport || !svg) {
        return
      }

      const viewBoxWidth = svg.viewBox.baseVal.width
      const viewBoxHeight = svg.viewBox.baseVal.height
      if (!viewBoxWidth || !viewBoxHeight) {
        return
      }

      const viewportStyles = window.getComputedStyle(viewport)
      const availableWidth = Math.max(
        1,
        viewport.clientWidth -
          parseFloat(viewportStyles.paddingLeft) -
          parseFloat(viewportStyles.paddingRight),
      )
      const verticalPadding =
        parseFloat(viewportStyles.paddingTop) +
        parseFloat(viewportStyles.paddingBottom)
      const maxViewportHeight = window.innerHeight * 0.75
      const maxDiagramHeight = Math.max(1, maxViewportHeight - verticalPadding)
      const baseFitWidth = Math.min(
        viewBoxWidth,
        availableWidth,
        (maxDiagramHeight * viewBoxWidth) / viewBoxHeight,
      )

      if (isMermaidFullscreen(wrapper)) {
        viewport.style.height = ''
      } else {
        const compactHeight = Math.max(
          160,
          Math.min(
            maxViewportHeight,
            (baseFitWidth * viewBoxHeight) / viewBoxWidth + verticalPadding,
          ),
        )
        viewport.style.height = `${compactHeight}px`
      }

      const layout = getCanvasLayout(viewport, svg)
      const zoom = Number(wrapper.dataset.zoom) || 1
      const panX = Number(wrapper.dataset.panX) || 0
      const panY = Number(wrapper.dataset.panY) || 0
      svg.style.maxWidth = 'none'
      svg.style.width = `${layout.fitWidth}px`
      svg.style.height = 'auto'
      svg.style.marginLeft = `${layout.offsetX}px`
      svg.style.marginTop = `${layout.offsetY}px`
      svg.style.transformOrigin = '0 0'
      svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`
      viewport.classList.toggle(INTERACTIVE_CLASS, canOperateCanvas(wrapper))

      const fullscreenButton = wrapper.querySelector<HTMLButtonElement>(
        '[data-panzoom-action="fullscreen"]',
      )
      const isFullscreen = isMermaidFullscreen(wrapper)
      fullscreenButton?.setAttribute(
        'aria-label',
        isFullscreen ? '退出全屏' : '全屏',
      )
      if (fullscreenButton) {
        fullscreenButton.setAttribute('aria-pressed', String(isFullscreen))
        fullscreenButton.title = isFullscreen ? '退出全屏' : '全屏'
      }
    })
}

window.addEventListener('resize', syncMermaidZoom)
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const wrapper = document.querySelector<HTMLElement>(`.${FULLSCREEN_CLASS}`)
    if (wrapper) {
      setMermaidFullscreen(wrapper, false)
    }
    return
  }

  if (event.altKey || event.ctrlKey || event.metaKey) {
    return
  }

  const wrapper = document.querySelector<HTMLElement>(`.${FULLSCREEN_CLASS}`)
  if (!wrapper) {
    return
  }

  const target = event.target
  if (
    target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable="true"]')
  ) {
    return
  }

  const zoomIn = ['ArrowUp', '+', 'w', 'W'].includes(event.key)
  const zoomOut = ['ArrowDown', '-', 's', 'S'].includes(event.key)
  if (!zoomIn && !zoomOut) {
    return
  }

  event.preventDefault()
  const currentZoom = Number(wrapper.dataset.zoom) || 1
  wrapper.dataset.zoom = String(
    Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, currentZoom * (zoomIn ? ZOOM_STEP : 1 / ZOOM_STEP)),
    ),
  )
  syncMermaidZoom()
})

function setupMermaidControls(wrapper: HTMLElement) {
  const svg = wrapper.querySelector<SVGSVGElement>(
    `.${MERMAID_CLASS}__viewport svg`,
  )
  if (!svg || wrapper.dataset.controlsReady === 'true') {
    return
  }

  wrapper.dataset.controlsReady = 'true'
  wrapper.dataset.zoom = '1'
  wrapper.dataset.panX = '0'
  wrapper.dataset.panY = '0'
  const viewport = wrapper.querySelector<HTMLElement>(
    `.${MERMAID_CLASS}__viewport`,
  )
  if (viewport) {
    wrapper.addEventListener(
      'wheel',
      event => {
        if (!canOperateCanvas(wrapper) || !(event.target instanceof Element)) {
          return
        }

        const overViewport = viewport.contains(event.target)
        const overControls = Boolean(
          event.target.closest(`.${MERMAID_CONTROLS_CLASS}`),
        )
        if (
          (isMermaidFullscreen(wrapper) || overViewport) &&
          event.cancelable
        ) {
          event.preventDefault()
        }
        if (!overViewport || overControls) {
          return
        }

        const currentZoom = Number(wrapper.dataset.zoom) || 1
        const nextZoom = Math.min(
          MAX_ZOOM,
          Math.max(
            MIN_ZOOM,
            currentZoom * (event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP),
          ),
        )
        if (nextZoom === currentZoom) {
          return
        }

        const layout = getCanvasLayout(viewport, svg)
        const viewportRect = viewport.getBoundingClientRect()
        const currentPanX = Number(wrapper.dataset.panX) || 0
        const currentPanY = Number(wrapper.dataset.panY) || 0
        const diagramX =
          (event.clientX -
            viewportRect.left -
            viewport.clientLeft -
            layout.paddingLeft -
            layout.offsetX -
            currentPanX) /
          currentZoom
        const diagramY =
          (event.clientY -
            viewportRect.top -
            viewport.clientTop -
            layout.paddingTop -
            layout.offsetY -
            currentPanY) /
          currentZoom
        wrapper.dataset.panX = String(
          event.clientX -
            viewportRect.left -
            viewport.clientLeft -
            layout.paddingLeft -
            layout.offsetX -
            diagramX * nextZoom,
        )
        wrapper.dataset.panY = String(
          event.clientY -
            viewportRect.top -
            viewport.clientTop -
            layout.paddingTop -
            layout.offsetY -
            diagramY * nextZoom,
        )
        wrapper.dataset.zoom = String(nextZoom)
        syncMermaidZoom()
      },
      { passive: false },
    )

    let drag: {
      pointerId: number
      x: number
      y: number
      panX: number
      panY: number
    } | null = null
    const stopDragging = () => {
      drag = null
      viewport.classList.remove('md-reader__mermaid--dragging')
    }

    viewport.addEventListener('pointerdown', event => {
      if (
        event.button !== 0 ||
        !canOperateCanvas(wrapper) ||
        !(event.target instanceof Element) ||
        event.target.closest(`.${MERMAID_CONTROLS_CLASS}`)
      ) {
        return
      }

      drag = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        panX: Number(wrapper.dataset.panX) || 0,
        panY: Number(wrapper.dataset.panY) || 0,
      }
      viewport.setPointerCapture(event.pointerId)
      viewport.classList.add('md-reader__mermaid--dragging')
      event.preventDefault()
    })
    viewport.addEventListener('pointermove', event => {
      if (!drag || drag.pointerId !== event.pointerId) {
        return
      }

      const panX = drag.panX + event.clientX - drag.x
      const panY = drag.panY + event.clientY - drag.y
      wrapper.dataset.panX = String(panX)
      wrapper.dataset.panY = String(panY)
      const zoom = Number(wrapper.dataset.zoom) || 1
      svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`
    })
    viewport.addEventListener('pointerup', stopDragging)
    viewport.addEventListener('pointercancel', stopDragging)
    viewport.addEventListener('lostpointercapture', stopDragging)
  }
  wrapper
    .querySelectorAll<HTMLButtonElement>('[data-panzoom-action]')
    .forEach(button => {
      button.addEventListener('click', () => {
        switch (button.dataset.panzoomAction) {
          case 'zoom-in':
            wrapper.dataset.zoom = String(
              Math.min(
                MAX_ZOOM,
                (Number(wrapper.dataset.zoom) || 1) * ZOOM_STEP,
              ),
            )
            syncMermaidZoom()
            break
          case 'zoom-out':
            wrapper.dataset.zoom = String(
              Math.max(
                MIN_ZOOM,
                (Number(wrapper.dataset.zoom) || 1) / ZOOM_STEP,
              ),
            )
            syncMermaidZoom()
            break
          case 'reset':
            wrapper.dataset.zoom = '1'
            wrapper.dataset.panX = '0'
            wrapper.dataset.panY = '0'
            syncMermaidZoom()
            break
          case 'fullscreen':
            setMermaidFullscreen(wrapper, !isMermaidFullscreen(wrapper))
            break
          case 'copy-source':
            void writeText(wrapper.dataset.mermaidSource || '')
              .then(() => {
                button.classList.add('copied')
                button.title = '已复制 Mermaid 源码'
                button.setAttribute('aria-label', '已复制 Mermaid 源码')
              })
              .catch(() => {
                button.title = '复制失败'
                button.setAttribute('aria-label', '复制失败')
              })
              .finally(() => {
                setTimeout(() => {
                  button.classList.remove('copied')
                  button.title = '复制 Mermaid 源码'
                  button.setAttribute('aria-label', '复制 Mermaid 源码')
                }, 1000)
              })
            break
        }
      })
    })

  syncMermaidZoom()
}

function appendRenderError(element: HTMLElement, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : error && typeof error === 'object'
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : String(error)
  const errorElement = document.createElement('div')
  errorElement.className = MERMAID_ERROR_CLASS
  errorElement.textContent = `Mermaid 渲染失败：${message}`
  element.appendChild(errorElement)
}

function applyMermaidNodePalette(wrapper: HTMLElement) {
  wrapper
    .querySelectorAll<SVGSVGElement>(`.${MERMAID_CLASS}__viewport svg`)
    .forEach(svg => {
      svg.querySelectorAll<SVGGElement>('g.node').forEach((node, index) => {
        const colorIndex = Number(node.dataset.colorId?.replace('color-', ''))
        const color =
          NODE_PALETTE[
            Number.isInteger(colorIndex) && colorIndex >= 0
              ? colorIndex % NODE_PALETTE.length
              : index % NODE_PALETTE.length
          ]
        const shapes = node.querySelectorAll<SVGElement>(
          'rect, path, polygon, ellipse, circle',
        )
        shapes.forEach(shape => {
          shape.style.setProperty('stroke', color, 'important')
          shape.style.setProperty('stroke-width', '1.5px', 'important')
        })
      })

      svg.querySelectorAll<SVGElement>('.entityBox').forEach((shape, index) => {
        const color = NODE_PALETTE[index % NODE_PALETTE.length]
        shape.style.setProperty('stroke', color, 'important')
        shape.style.setProperty('stroke-width', '1.5px', 'important')
      })
    })
}

export async function renderMermaid(container: ParentNode = document) {
  const wrappers = Array.from(
    container.querySelectorAll<HTMLElement>(`.${MERMAID_CLASS}`),
  )
  const diagrams = wrappers
    .map(wrapper => wrapper.querySelector<HTMLElement>('.mermaid'))
    .filter((diagram): diagram is HTMLElement => diagram !== null)

  if (!diagrams.length) {
    return
  }

  wrappers.forEach(wrapper => {
    wrapper.dataset.mermaidSource =
      wrapper.querySelector<HTMLElement>('.mermaid')?.textContent || ''
  })

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    look: 'neo',
    flowchart: {
      nodeSpacing: 28,
      rankSpacing: 32,
      diagramPadding: 8,
    },
    sequence: {
      actorMargin: 36,
      diagramMarginX: 20,
      diagramMarginY: 18,
      messageMargin: 20,
      noteMargin: 10,
    },
    er: {
      theme: 'redux-dark-color',
      look: 'neo',
      nodeSpacing: 28,
      rankSpacing: 24,
      diagramPadding: 8,
      entityPadding: 5,
      minEntityWidth: 82,
      minEntityHeight: 38,
    },
    themeVariables: {
      background: '#050b19',
      primaryColor: '#101b2d',
      primaryTextColor: '#e8edf7',
      primaryBorderColor: '#55d6d0',
      secondaryColor: '#171329',
      secondaryTextColor: '#e8edf7',
      secondaryBorderColor: '#bd70e8',
      tertiaryColor: '#111b2c',
      tertiaryTextColor: '#e8edf7',
      tertiaryBorderColor: '#f0b44d',
      lineColor: '#9aa8bf',
      textColor: '#e8edf7',
      mainBkg: '#101b2d',
      nodeBorder: '#55d6d0',
      clusterBkg: 'rgba(28, 25, 48, 0.72)',
      clusterBorder: '#746f8d',
      defaultLinkColor: '#aeb9ce',
      edgeLabelBackground: '#0b1120',
      titleColor: '#e8edf7',
      attributeBackgroundColorOdd: '#cbd8ed',
      attributeBackgroundColorEven: '#182943',
      attributeTextColorOdd: '#f4f7fc',
      attributeTextColorEven: '#e8edf7',
      actorBkg: '#101b2d',
      actorBorder: '#55d6d0',
      actorTextColor: '#e8edf7',
      signalColor: '#dce4f2',
      signalTextColor: '#e8edf7',
      labelBoxBkgColor: '#0b1120',
      labelBoxBorderColor: '#746f8d',
      labelTextColor: '#e8edf7',
      noteBkgColor: '#171329',
      noteBorderColor: '#bd70e8',
      noteTextColor: '#e8edf7',
      activationBkgColor: '#1c3850',
      activationBorderColor: '#55d6d0',
      cScale0: '#e879f9',
      cScale1: '#2dd4bf',
      cScale2: '#fb923c',
      cScale3: '#22d3ee',
      cScale4: '#4ade80',
      cScale5: '#a78bfa',
      cScale6: '#f87171',
      cScale7: '#facc15',
      cScale8: '#818cf8',
      cScale9: '#a3e635',
      cScale10: '#38bdf8',
      cScale11: '#fb7185',
      pie1: '#55d6d0',
      pie2: '#bd70e8',
      pie3: '#f0b44d',
      pie4: '#72a7ff',
      pie5: '#f07878',
      pie6: '#65d49a',
      pie7: '#e68bd7',
      pie8: '#a9c85c',
      pie9: '#42c6ee',
      pie10: '#ff9b60',
      pie11: '#9a83ff',
      pie12: '#f4d35e',
    },
  })

  try {
    await mermaid.run({ nodes: diagrams })
    wrappers.forEach(wrapper => {
      applyMermaidNodePalette(wrapper)
      setupMermaidControls(wrapper)
    })
  } catch (error) {
    wrappers.forEach(wrapper => appendRenderError(wrapper, error))
  }
}

export default function MermaidRendererPlugin({ event }) {
  event.on('contentRendered', (container: HTMLElement) => {
    void renderMermaid(container)
  })
}
