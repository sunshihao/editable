import { FC, useCallback, useMemo, useRef } from 'react'
import { Range } from 'slate'
import { useEditableStatic } from '../hooks/use-editable'
import { useFocused } from '../hooks/use-focused'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { IS_MOUSEDOWN } from '../utils/weak-maps'
import { ShadowRect } from './shadow'
import {
  useSelectionDrawingEnabled,
  useSelectionDrawingRects,
  useSelectionDrawingSelection,
  useSelectionDrawingStyle,
} from '../hooks/use-selection-drawing'

interface CaretProps {
  timeout?: number | false
}

const CaretComponent: FC<CaretProps> = ({ timeout = 530 }) => {
  const editor = useEditableStatic()

  const [focused] = useFocused()

  const timer = useRef<number>()

  const ref = useRef<HTMLDivElement>(null)

  const enabled = useSelectionDrawingEnabled()
  const selection = useSelectionDrawingSelection()
  const rects = useSelectionDrawingRects()
  const style = useSelectionDrawingStyle()

  const rect = useMemo(() => {
    if (!selection || rects.length === 0 || !focused || !Range.isCollapsed(selection)) return null
    return rects[0].toJSON()
  }, [focused, rects, selection])

  const clearActive = useCallback(() => {
    clearTimeout(timer.current)
  }, [])

  const setOpacity = (opacity?: number) => {
    const elRef = ref.current
    if (elRef) {
      elRef.style.opacity =
        opacity !== undefined ? String(opacity) : elRef.style.opacity === '1' ? '0' : '1'
    }
  }

  const active = useCallback(
    (opacity?: number) => {
      clearActive()
      if (!rect || timeout === false) return
      if (IS_MOUSEDOWN.get(editor)) {
        setOpacity(1)
      } else {
        setOpacity(opacity)
      }
      timer.current = setTimeout(() => {
        active()
      }, timeout)
    },
    [clearActive, editor, rect, timeout],
  )

  useIsomorphicLayoutEffect(() => {
    active(1)
    return () => clearActive()
  }, [editor, active, clearActive])

  if (!enabled) return null

  return (
    <ShadowRect
      rect={
        rect
          ? Object.assign({}, rect, { width: style.caretWidth, color: style.caretColor })
          : { width: 0, height: 0, top: 0, left: 0 }
      }
      ref={ref}
      style={{ willChange: 'opacity, transform', opacity: rect ? 1 : 0 }}
    />
  )
}

export { CaretComponent }
