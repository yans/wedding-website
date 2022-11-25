import React from 'react'
import styles from '../styles/invite.module.css'
import cx from 'classnames'

import { Date, Year } from './Date'
import { Text } from './Text'

export function InviteSection() {
  return (
    <section className={styles.section}>
      <div
        className={
          cx(
            styles.headerContainer,
            'force-hardware-acceleration',
          )
        }
      >
        <div className={styles.headerContent}>
          <div className={styles.header}>
            <Date className={styles.text} month="08" date="18" />
            <Year className={styles.text} year="2023" />
          </div>
          <Text className={cx(styles.text, styles.location)}>
            Our Wedding at<br/>
            Fort Mason
          </Text>
        </div>
      </div>
    </section>
  )
}
