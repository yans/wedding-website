import React from 'react'

import styles from '../styles/text.module.css'
import cx from 'classnames'


export function Text(
  {
    className,
    children,
  } : {
    className?: string
    children: React.ReactNode
  }
) {
  return (
    <h3 className={cx(styles.text, className)}>
      {children}
    </h3>
  )
}
