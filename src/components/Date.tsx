import React from 'react'
import styles from '../styles/date.module.css'
import cx from 'classnames'

import { Ticker } from './Ticker'

export function Date(
  {
    month,
    date,
    className,
  } : {
    month: string,
    date: string,
    className?: string
  }
) {
  return (
    <h2 id="hero-headline" className={cx(styles.headline, styles.header, className)}>
      <Ticker value={month} />
      <span className={styles.headlineSlashContainer}>
        <span className={styles.headlineSlash}>/</span>
      </span>
      <Ticker value={date} />
    </h2>
  )
}

export function Year(
  { className, year } : { className?: string, year: string }
) {
  return (
    <h3 className={cx(styles.headline, styles.body, className)}>
      <Ticker value={year} />
    </h3>
  )
}
