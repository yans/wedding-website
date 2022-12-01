// NOTE(omer.demirkan): this code is being duplicated in web/design/src/product/components/Ticker
// while we migrate the Ticker into bento. If you make any changes here
// please make the same change in the duplicate file and notify me.

import { computeActions } from './computeActions'
import { COPY, DELETE, INSERT, UPDATE } from './constants'

export type ColumnType = {
  changed: boolean
  id: number
  target: string
}

export type ActionTargets = {
  [COPY]: string[]
  [DELETE]: string[]
  [INSERT]: string[]
  [UPDATE]: string[]
}

export function computeNextColumns(
  currentColumns: ColumnType[],
  nextValue: string,
  generateId: () => number
): { actionTargets: ActionTargets; columns: ColumnType[] } {
  const currentValue = currentColumns.map(col => col.target).join('')
  const actions = computeActions(currentValue, nextValue)
  const nextColumns: ColumnType[] = []
  let nextValueIndex = 0
  let currValueIndex = 0

  const actionTargets: ActionTargets = {
    [COPY]: [],
    [DELETE]: [],
    [INSERT]: [],
    [UPDATE]: [],
  }
  actions.forEach(action => {
    switch (action) {
      case INSERT: {
        const target = nextValue[nextValueIndex]
        nextColumns.push({
          changed: true,
          id: generateId(),
          target,
        })
        actionTargets[INSERT].push(target)
        nextValueIndex += 1
        break
      }
      case UPDATE:
      case COPY: {
        const target = nextValue[nextValueIndex]
        const currentId = currentColumns[currValueIndex].id
        nextColumns.push({
          changed: action !== COPY,
          id: currentId,
          target,
        })
        actionTargets[action].push(target)
        currValueIndex += 1
        nextValueIndex += 1
        break
      }
      case DELETE:
        actionTargets[DELETE].push(currentValue[currValueIndex])
        currValueIndex += 1
        break
      default:
        throw new Error(`unexpected action '${action}'`)
    }
  })
  return {
    actionTargets: actionTargets,
    columns: nextColumns,
  }
}
