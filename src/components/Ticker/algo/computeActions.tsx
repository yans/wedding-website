// NOTE(omer.demirkan): this code is being duplicated in web/design/src/product/components/Ticker
// while we migrate the Ticker into bento. If you make any changes here
// please make the same change in the duplicate file and notify me.

import times from 'lodash/times'

import { Action, COPY, DELETE, INSERT, UPDATE } from './constants'

export function always<T extends unknown>(input: T) {
  return () => input
}

const always0 = always(0)

function computeLevenshteinMatrix(source: string, target: string) {
  const sourceLength = source.length
  const targetLength = target.length

  const numRows = sourceLength + 1
  const numCols = targetLength + 1

  const matrix = times(numRows, () => times(numCols, always0))

  for (let i = 0; i < numRows; i += 1) {
    matrix[i][0] = i
  }

  for (let j = 0; j < numCols; j += 1) {
    matrix[0][j] = j
  }

  let cost
  for (let j = 1; j < numCols; j += 1) {
    for (let i = 1; i < numRows; i += 1) {
      cost = source[i - 1] === target[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  return matrix
}

const getSameLengthActions = (source: string, target: string): Action[] => {
  const result: Action[] = []
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] === target[i]) {
      result.push(COPY)
    } else {
      result.push(UPDATE)
    }
  }
  return result
}

export function computeActions(source: string, target: string): Action[] {
  const sourceLength = source.length
  const targetLength = target.length

  if (sourceLength === targetLength) {
    return getSameLengthActions(source, target)
  }

  const matrix = computeLevenshteinMatrix(source, target)

  const numRows = matrix.length
  const numCols = matrix[0].length

  const result = []

  let row = numRows - 1
  let col = numCols - 1
  while (!(row === 0 && col === 0)) {
    const onFirstRow = row === 0
    const onFirstCol = col === 0

    const leftCost = onFirstCol ? Infinity : matrix[row][col - 1]

    const upCost = onFirstRow ? Infinity : matrix[row - 1][col]

    const upLeftCost =
      onFirstRow || onFirstCol ? Infinity : matrix[row - 1][col - 1]

    const cheapestCost = Math.min(leftCost, upCost, upLeftCost)
    if (upLeftCost === cheapestCost) {
      if (source[row - 1] === target[col - 1]) {
        result.unshift(COPY)
      } else {
        result.unshift(UPDATE)
      }
      row -= 1
      col -= 1
    } else if (upCost === cheapestCost) {
      result.unshift(DELETE)
      row -= 1
    } else {
      result.unshift(INSERT)
      col -= 1
    }
  }
  return result
}
