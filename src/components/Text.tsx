import React from 'react'

import styles from '../styles/text.module.css'
import cx from 'classnames'


export function Body(
  {
    className,
    children,
  } : {
    className?: string
    children: React.ReactNode
  }
) {
  return (
    <span className={cx(styles.body, className)}>
      {children}
    </span>
  )
}

export function Pre(
  {
    className,
    children,
    variant = 'default',
  } : {
    className?: string
    children: React.ReactNode
    variant?: 'default' | 'compact'
  }
) {
  return (
    <pre className={cx(styles.pre, variant === 'compact' && styles.preCompact, className)}>
      {children}
    </pre>
  )
}
