import React from 'react'
import styles from '../styles/invite-form.module.css'
import cx from 'classnames'

import { Body, Pre } from './Text'
import { Button } from './Button'
import { useAirtableData } from './useAirtableData'

export function InviteForm() {
  const { data, getReservations, postReservation } = useAirtableData()
  React.useEffect(() => {
    getReservations()
  }, [])

  const [formState, setFormState] = React.useState<'default' | 'done' | 'incomplete' | 'error'>('default')

  const [name, setName] = React.useState<string>('')
  const handleNameOnChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setName(e.currentTarget.value)
    }, [])

  const [partner, setPartner] = React.useState<string>('')
  const handlePartnerOnChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setPartner(e.currentTarget.value)
    }, [])

  const [email, setEmail] = React.useState<string>('')
  const handleEmailOnChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setEmail(e.currentTarget.value)
    }, [])

  const [isAttending, setAttending] = React.useState<boolean>(false)
  const handleAttendingOnChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAttending(value => !value)
    }, [])

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!name || !email) {
        setFormState('incomplete')
        return
      }

      postReservation({
        Name: name,
        Partner: partner,
        Email: email,
        isAttending,
      }).then(result => {
        console.log('result = ', result)
        setFormState('done')
      }).catch(() => {
        setFormState('error')
      })
    }, [name, partner, email, isAttending])

  return (
    <div className={styles.formContainer}>
      {
        formState === 'done' ? (
          <div className={styles.formSuccess}>
            <Body>
              <p>Excited to have you!</p>
              <p>See you soon</p>
            </Body>
          </div>
        ):(
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              <Pre className={styles.labelText} variant="compact">Name</Pre>
              <input
                className={
                  cx(
                    styles.input,
                    formState === 'incomplete' && !name && styles.inputError
                  )
                }
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
                className={
                  cx(
                    styles.input,
                    formState === 'incomplete' && !email && styles.inputError
                  )
                }
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
              <Button className={styles.buttonBack} label="Submit" />
            </div>
          </form>

        )
      }
    </div>
  )
}

// href="mailto:contact@yan.co?subject=hi&body=hello"
