import React from 'react'
import styles from '../styles/invite.module.css'
import cx from 'classnames'

import { Date, Year } from './Date'
import { Body, Pre } from './Text'
import { useAirtableData } from './useAirtableData'

export function InviteSection() {
  const { data, getReservations, postReservation } = useAirtableData()
  React.useEffect(() => {
    getReservations()
  }, [])

  const [name, setName] = React.useState<string>('')
  const handleNameOnChange = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }, [])

  const [partner, setPartner] = React.useState<string>('')
  const handlePartnerOnChange = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setPartner(e.currentTarget.value)
  }, [])

  const [email, setEmail] = React.useState<string>('')
  const handleEmailOnChange = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }, [])

  const [isAttending, setAttending] = React.useState<boolean>(false)
  const handleAttendingOnChange = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setAttending(value => !value)
  }, [])

  const handleRSVP = React.useCallback(() => {
    setRotated(true)
  }, [])

  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    postReservation({
      Name: name,
      Partner: partner,
      Email: email,
      isAttending,
    })
  }, [name, partner, email, isAttending])
  const [rotated, setRotated] = React.useState(false)
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
            <button
              onClick={handleRSVP}
              className={cx(styles.button, styles.buttonFront)}
            >
              RSVP
            </button>
          </div>
          <div className={cx(styles.back, rotated && styles.backRotated)}>
            <Body className={styles.rsvp}>RSVP</Body>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label}>
                <Pre className={styles.labelText} variant="compact">Name</Pre>
                <input
                  className={styles.input}
                  onChange={handleNameOnChange}
                  placeholder=""
                  type="text"
                  value={name}
                />
              </label>
              <label className={styles.label}>
                <Pre className={styles.labelText} variant="compact">Name of Plus One</Pre>
                <input
                  className={styles.input}
                  onChange={handlePartnerOnChange}
                  placeholder=""
                  type="text"
                  value={partner}
                />
              </label>
              <label className={styles.label}>
                <Pre className={styles.labelText} variant="compact">Email</Pre>
                <input
                  className={styles.input}
                  onChange={handleEmailOnChange}
                  placeholder=""
                  type="text"
                  value={email}
                />
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  className={styles.checkbox}
                  onChange={handleAttendingOnChange}
                  type="checkbox"
                  checked={isAttending}
                />
                <Pre className={styles.labelText} variant="compact">Attending?</Pre>
              </label>
              <div className={styles.spacer} />
              <div className={styles.buttonWrapper}>
                <button className={cx(styles.button, styles.buttonBack)}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// href="mailto:contact@yan.co?subject=hi&body=hello"
