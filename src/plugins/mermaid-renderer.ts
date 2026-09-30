import mermaid from 'mermaid'
import {
  MERMAID_CLASS,
  MERMAID_CONTROLS_CLASS,
  MERMAID_ERROR_CLASS,
} from '@/core/mermaid'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 5
const ZOOM_STEP = 1.25
const FULLSCREEN_CLASS = `${MERMAID_CLASS}--fullscreen`
const INTERACTIVE_CLASS = `${MERMAID_CLASS}--interactive`
const FULLSCREEN_BODY_CLASS = 'md-reader--mermaid-fullscreen'
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
  }
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

  const theme = wrappers[0].dataset.theme === 'dark' ? 'dark' : 'default'
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme })

  try {
    await mermaid.run({ nodes: diagrams })
    wrappers.forEach(setupMermaidControls)
  } catch (error) {
    wrappers.forEach(wrapper => appendRenderError(wrapper, error))
  }
}

export default function MermaidRendererPlugin({ event }) {
  event.on('contentRendered', (container: HTMLElement) => {
    void renderMermaid(container)
  })
}
