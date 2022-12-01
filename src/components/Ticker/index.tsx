import cx from 'classnames'
import Measure, { ContentRect } from 'react-measure'
import React from 'react'
import throttle from 'lodash/throttle'
import Transition, { TransitionProps } from 'react-transition-group/Transition'
import { TransitionGroup } from 'react-transition-group'

import styles from '../../styles/ticker.module.css'

import {
  ActionTargets,
  ColumnType,
  computeNextColumns,
} from './algo/computeNextColumns'
import { DELETE, INSERT, UPDATE } from './algo/constants'

type CharacterProps = {
  value: string
  transitionColor?: string
  isTransitioning?: boolean
  innerRef?: React.Ref<HTMLSpanElement>
}

function Character({
  innerRef,
  isTransitioning,
  transitionColor,
  value,
}: CharacterProps) {
  return (
    <span
      ref={innerRef}
      className={styles.character}
      style={{ color: isTransitioning ? transitionColor : undefined }}
    >
      {value}
    </span>
  )
}

type ColumnProps = {
  characterRenderer?: (char: string) => React.ReactNode
  characterSet: string
  offset?: number
  isTransitioning?: boolean
  transitionColor?: string
}

const Column = React.memo(
  function ColumnImplementation({
    characterRenderer,
    characterSet,
    isTransitioning,
    offset = 0,
    transitionColor,
  }: ColumnProps) {
    return (
      <div>
        <div
          className="force-hardware-acceleration"
          style={{
            display: 'inline-block',
            transform: `translate(0, ${-offset}px)`,
            transition: isTransitioning
              ? `transform 300ms cubic-bezier(0.65, 0.05, 0.36, 1)`
              : undefined,
          }}
        >
          {characterSet.split('').map(char => (
            <div key={char}>
              {characterRenderer ? (
                characterRenderer(char)
              ) : (
                <Character
                  isTransitioning={isTransitioning}
                  transitionColor={transitionColor}
                  value={char}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

type ColumnTransitionWrapperProps = {
  children: React.ReactNode
  left: number
  isTransitioning?: boolean
} & Omit<TransitionProps, 'timeout'>

const ColumnTransitionWrapper = React.memo(
  function ColumnTransitionWrapperImplementation({
    children,
    isTransitioning,
    left,
    ...props
  }: ColumnTransitionWrapperProps) {
    return (
      <Transition timeout={SLIDE_DURATION} {...props}>
        {state => (
          <div
            className={cx(styles.columnTransitionWrapper, "force-hardware-acceleration") }
            style={{
              opacity: state === 'entering' || state === 'entered' ? 1 : 0,
              transform: `translate(${left}px, 0)`,
            }}
          >
            {children}
          </div>
        )}
      </Transition>
    )
  }
)

type DimensionMap = Map<string, number | undefined>
// type DimensionMap = any

type Offset = {
  x: number
  y: number
}

type MeasureColumnsProps = {
  children: (offsets: Offset[]) => React.ReactNode
  columns: ColumnType[]
  characterSet: string
}

const MeasureColumns = React.memo(
  function MeasureColumnsImplementation({ characterSet, children, columns }: MeasureColumnsProps) {
    // Widths and heights have both states and refs.
    // - States to trigger a render after all characters in the domain
    //   are measured
    // - Refs are to collect the widths and heights while react-measure
    //   is calling onResize until all are measured.
    // This was a solution to React batching state updates so that only
    // the last onResize call would remain after; an issue I encountered
    // when migrating this to Bento. See the original here:
    // https://github.com/robinhoodmarkets/rh/blob/9f38317e47e9308ef0828fcd245d8212ba253348/web/web-app/src/silk/Ticker/AnimatedColumns/MeasureColumns.tsx#L81
    const widthsRef = React.useRef<{ [char: string]: number }>({})
    const [widths, setWidths] = React.useState<DimensionMap>(new Map<string, number>())
    const heightsRef = React.useRef<{ [char: string]: number }>({})
    const [heights, setHeights] = React.useState<DimensionMap>(new Map<string, number>())
    const handleMeasureCharacter = React.useCallback(
      (char: string) => {
        return (contentRect: ContentRect) => {
          widthsRef.current[char] = contentRect.bounds?.width as number
          heightsRef.current[char] = contentRect.bounds?.height as number

          if (Object.keys(widthsRef.current).length === characterSet.length) {
            setWidths(new Map<string, number>(Object.entries(widthsRef.current)))
            setHeights(new Map<string, number>(Object.entries(heightsRef.current)))
            widthsRef.current = {}
            heightsRef.current = {}
          }
        }
      },
      [characterSet]
    )

    const characterRenderer = React.useCallback(
      (char: string) => (
        <Measure bounds onResize={handleMeasureCharacter(char)}>
          {({ measureRef }) => (
            <Character innerRef={measureRef} value={char} />
          )}
        </Measure>
      ),
      [handleMeasureCharacter]
    )

    const offsets = getColumnOffsets(characterSet, columns, widths, heights)

    return (
      <div>
        <div className={styles.measureColumnsRoot}>
          <Column
            characterRenderer={characterRenderer}
            characterSet={characterSet}
          />
        </div>
        {children(offsets)}
      </div>
    )
  }
)

function getColumnOffsets(
  domain: string,
  columns: ColumnType[],
  widths: DimensionMap,
  heights: DimensionMap
) {
  const offsets: Offset[] = []
  if (columns.length) {
    const domainOffsets = getDomainOffsets(domain, heights)
    offsets.push({ x: 0, y: Number(domainOffsets.get(columns[0].target)) })
    for (let i = 1; i < columns.length; i += 1) {
      const col = columns[i]
      const prev = columns[i - 1]
      const prevX = offsets[i - 1].x
      offsets.push({
        x: prevX + Number(widths.get(prev.target)),
        y: Number(domainOffsets.get(col.target)),
      })
    }
  }
  return offsets
}

function getDomainOffsets(domain: string, heights: DimensionMap) {
  const domainOffsets = new Map<string, number>()
  if (domain.length) {
    const first = domain[0]
    domainOffsets.set(first, 0)
    for (let i = 1; i < domain.length; i += 1) {
      const current = domain[i]
      const prev = domain[i - 1]
      domainOffsets.set(
        current,
        Number(domainOffsets.get(prev)) + Number(heights.get(prev))
      )
    }
  }
  return domainOffsets
}


type StaticValueProps = {
  columns: ColumnType[]
  isTransitioning: boolean
  transitionColor?: string
}

const StaticValue = React.memo(
  function StaticValueImplementation({ columns, isTransitioning, transitionColor }: StaticValueProps) {
    return (
      <div className={isTransitioning ? styles.staticValueTransitioning : styles.staticValue}>
        {columns.map(column => (
          <Character
            key={column.id}
            isTransitioning={column.changed}
            transitionColor={transitionColor}
            value={column.target}
          />
        ))}
      </div>
    )
  }
)

type AnimatedColumnsProps = {
  columns: ColumnType[]
  characterSet: string
  isTransitioning: boolean
  transitionColor?: string
}

const AnimatedColumns = React.memo(
  function AnimatedColumnsImplementation({
    characterSet,
    columns,
    isTransitioning,
    transitionColor,
  }: AnimatedColumnsProps) {
    const columnsRenderer = React.useCallback(
      (offsets: Offset[]) => {
        return (
          <TransitionGroup>
            {columns.map((column, index) => {
              const { x, y } = offsets[index]
              return (
                <ColumnTransitionWrapper key={column.id} left={x}>
                  <Column
                    characterSet={characterSet}
                    isTransitioning={column.changed}
                    offset={y}
                    transitionColor={transitionColor}
                  />
                </ColumnTransitionWrapper>
              )
            })}
          </TransitionGroup>
        )
      },
      [columns, characterSet, transitionColor]
    )

    return (
      <div
        aria-hidden
        className={isTransitioning ? styles.animatedColumnTransitioning : styles.animatedColumn}
      >
        <MeasureColumns characterSet={characterSet} columns={columns}>
          {columnsRenderer}
        </MeasureColumns>
      </div>
    )
  }
)

type Props = {
  transitionColor?: string | undefined

  /**
   * The string of the number to display. Number(value) must
   * not give NaN.
   */
  value: string
}

type State = {
  columns: ColumnType[]
  transitionTime: number | null
}

/**
 * The list of characters that the value may contain.
 * Keep in mind that the order will change behavior,
 * earlier characters in the set will be higher in
 * the "wheel" of characters, and changing to it will
 * scroll the character wheel up.
 */
const CHARACTER_SET = '0123456789-,.'

const UnthrottledTicker = React.memo(
  function UnthrottledTickerImplementation({
    transitionColor,
    value,
  }: Props) {
    const columnCounterRef = React.useRef<number>(0)
    const generateId = React.useCallback(() => {
      const nextId = columnCounterRef.current
      columnCounterRef.current += 1
      return nextId
    }, [])

    // NOTE(omer.demirkan): columns and transitionTime haven't had their
    // state separated since migrating from a class component since they
    // are always updated together, to avoid needlessly causing two
    // renders when one is sufficient.
    const [{ columns, transitionTime }, setState] = React.useState<State>({
      columns: computeNextColumns([], value, generateId).columns.map(
        column => ({
          ...column,
          changed: false,
        })
      ),
      transitionTime: 0,
    })

    React.useEffect(() => {
      if (typeof transitionTime !== 'number' || transitionTime <= 0) {
        return
      }

      function clearTransitioningState() {
        setState(prev => ({
          columns: prev.columns.map(column => ({ ...column, changed: false })),
          transitionTime: null,
        }))
      }
      const transitionTimeout = setTimeout(
        clearTransitioningState,
        transitionTime
      )

      return () => clearTimeout(transitionTimeout)
    }, [columns, transitionTime])

    const getTransitionDuration = React.useCallback(
      (actionTargets: ActionTargets) => {
        let duration = 0
        const updateActions = actionTargets[UPDATE]
        for (let i = 0; i < updateActions.length; i += 1) {
          const target = updateActions[i]
          const spinTime = SPIN_DURATION
          duration = Math.max(duration, spinTime)
        }

        if (actionTargets[INSERT].length || actionTargets[DELETE].length) {
          duration = Math.max(duration, SLIDE_DURATION)
        }
        return duration
      },
      []
    )

    React.useEffect(() => {
      setState(prev => {
        const { actionTargets, columns: nextColumns } = computeNextColumns(
          prev.columns,
          value,
          generateId
        )
        const nextTransitionTime = document.hidden
          ? 0
          : getTransitionDuration(actionTargets)
        return {
          columns: nextColumns,
          transitionTime: nextTransitionTime,
        }
      })
    }, [value, generateId, getTransitionDuration])

    const isTransitioning =
      typeof transitionTime === 'number' && transitionTime > 0

    return (
      <div className={styles.tickerRoot}>
        <StaticValue
          columns={columns}
          isTransitioning={isTransitioning}
          transitionColor={transitionColor}
        />
        <AnimatedColumns
          characterSet={CHARACTER_SET}
          columns={columns}
          isTransitioning={isTransitioning}
          transitionColor={transitionColor}
        />
      </div>
    )
  }
)

const SLIDE_DURATION = 300
const SPIN_DURATION = 300

function useThrottleValue<T>(value: T, intervalMs: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)

  // NOTE(omer.demirkan): eslint is expecting an inline
  // function to understand the dependencies. Creating an
  // inline function () => throttle()() wouldn't allow for
  // throttling, so I've muted it.

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateThrottledValue = React.useCallback(
    throttle(setThrottledValue, intervalMs),
    [intervalMs]
  )
  const isMountedRef = React.useRef(false)
  React.useEffect(() => {
    // NOTE(omer.demirkan): To avoid an unnecessary call to
    // updateThrottledValue on mount. This is so updateThrottledValue
    // is interactive immediately for the first call instead of
    // being throttled with an unnecessary call on mount.
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    updateThrottledValue(value)
  }, [value, updateThrottledValue])

  return throttledValue
}


export function Ticker({
  // shouldFlashOnTransition,
  value,
  ...props
}: Props) {
  const throttledValue = useThrottleValue(value, 150)

  const prevValueRef = React.useRef(throttledValue)
  const currValueRef = React.useRef(throttledValue)
  if (currValueRef.current !== throttledValue) {
    prevValueRef.current = currValueRef.current
    currValueRef.current = throttledValue
  }

  const currNum = parseInt(currValueRef.current)
  const prevNum = parseInt(prevValueRef.current)
  const isLastChangeIncrease = currNum > prevNum

  // let transitionColor: string | undefined
  // if (shouldFlashOnTransition) {
  //   transitionColor = isLastChangeIncrease
  //     ? CssVars.semantic.positive.base
  //     : CssVars.semantic.negative.base
  // }

  return (
    <UnthrottledTicker
      {...props}
      // transitionColor={transitionColor}
      value={value}
    />
  )
}
