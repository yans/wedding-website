import React from 'react'
import styles from '../styles/invite.module.css'
import cx from 'classnames'

import { Body, Pre } from './Text'
import { Button } from './Button'
import { Date, Year } from './Date'
import { InviteForm } from './InviteForm'

export function InviteSection() {
  const [rotated, setRotated] = React.useState(false)
  const handleRSVP = React.useCallback(() => {
    setRotated(true)
  }, [])

  return (
    <section className={cx(styles.section, 'clip')}>
      <div
        className={
          cx(
            styles.headerContainer,
            'force-hardware-acceleration',
          )
        }
      >
        <div className={styles.headerContent}>
          <div className={cx(styles.front, rotated && styles.frontRotated)}>
            <div className={styles.frontContent}>
              <div>
                <Pre className={cx(styles.textFront, styles.preAboveDate)}>kindly save the date</Pre>
                <div className={styles.header}>
                  <Date className={styles.textFront} month="08" date="18" />
                  <Year className={styles.textFront} year="2023" />
                </div>
              </div>
              <p className={cx(styles.textFront, styles.body)}>
                <Pre className={styles.pre}>for the wedding of</Pre>
                <Body>Kelly & Yan</Body>
              </p>
              <p className={cx(styles.textFront, styles.body)}>
                <Pre className={styles.pre}>located at</Pre>
                <Body>Fort Mason, SF</Body>
              </p>
            </div>
            <div className={styles.frontSpacer} />
            <Button
              onClick={handleRSVP}
              className={styles.buttonFront}
              label="RSVP"
            />
          </div>
          <div className={cx(styles.back, rotated && styles.backRotated)}>
            <Body className={styles.rsvp}>RSVP</Body>
            <InviteForm />
          </div>
        </div>
      </div>
    </section>
  )
}

// href="mailto:contact@yan.co?subject=hi&body=hello"
