import Airtable from 'airtable'
import React from 'react'

// Authenticate
Airtable.configure({ apiKey: 'key5uD7HYPdjh7opf' });

// Initialize a base
const base = Airtable.base('appeksC6RhXBoTBxz');

// Reference a table
const table = base('tblNG4sGuD9qqYnR7');

type Reservation = {
  Name: string
  Partner: string
  Email: string
  isAttending: boolean
}

export function useAirtableData() {
  const [data, setData] = React.useState<Array<Reservation> | null>(null);
  const getReservations = React.useCallback(() => {
    const p = table.select({}).firstPage()
    p.then(results => {
      // @ts-expect-error
      setData(results.map(result => result.fields))
    })
  }, [])
  const postReservation = React.useCallback(
    (newReservation: Reservation) =>
      table.create([{ fields: newReservation }]),
    []
  )
  return { data, getReservations, postReservation }
}
