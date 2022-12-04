import React from 'react'
import styles from '../styles/button.module.css'
import cx from 'classnames'

type Props = {
  className: string
  label: string
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export function Button({ className, label, ...props } : Props) {
  return <button className={cx(styles.button, className)} {...props}>{label}</button>
}
