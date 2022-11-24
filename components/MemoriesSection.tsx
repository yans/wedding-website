import React from 'react'
import styles from '../styles/memories.module.css'
import cx from 'classnames'

import { Date, Year } from './Date'

const MEMORIES: Array<{
  id: string
  display: {
    date: string
    month: string
    year: string
  }
  label: string
  timestamp: number
}> = [
  {
    id: 'timeline-2017-date',
    display: {
      date: "18",
      month: "08",
      year: "2017"
    },
    label: 'first date',
    timestamp: 1503039600,
  },
  {
    id: 'timeline-2017-vacation',
    display: {
      date: "01",
      month: "12",
      year: "2017"
    },
    label: 'first vacation together',
    timestamp: 1512115200,
  },
  {
    id: 'timeline-2018-valentine',
    display: {
      month: "02",
      date: "14",
      year: "2018"
    },
    label: 'valentine together',
    timestamp: 1518595200,
  }
]


export function MemoriesSection() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null)
  const progressionRef = React.useRef<HTMLDivElement | null>(null)

  const [displayDate, setDisplayDate] = React.useState<string>("18")
  const [displayMonth, setDisplayMonth] = React.useState<string>("08")
  const [displayYear, setDisplayYear] = React.useState<string>("2017")

  const handleScroll = React.useCallback(() => {
    if (!sectionRef.current || !progressionRef.current) {
      return
    }
    const sectionHeight = sectionRef.current.offsetHeight
    const progressionTrackerOffsetTop = progressionRef.current.offsetTop
    const progressionTrackerHeight = progressionRef.current.offsetHeight

    const progression = progressionTrackerOffsetTop / (sectionHeight - progressionTrackerHeight)

    const index = Math.min(Math.floor(progression * MEMORIES.length), MEMORIES.length - 1)
    const currentMemory = MEMORIES[index]

    if (currentMemory) {
      setDisplayDate(currentMemory.display.date)
      setDisplayMonth(currentMemory.display.month)
      setDisplayYear(currentMemory.display.year)
    }

    console.log(
      'sectionHeight =', sectionHeight,
      'progressionTrackerHeight =', progressionTrackerHeight,
      'progressionTrackerOffsetTop =', progressionTrackerOffsetTop,
      'progression = ', progression
    )
  }, [])

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.progressionTracker} ref={progressionRef} />
      <div className={cx(styles.overlayContainer, "force-hardware-acceleration")}>
        <div className={styles.overlayContent}>
          <header className={styles.header}>
            <Date
              className={styles.date}
              month={displayMonth}
              date={displayDate}
            />
            <Year year={displayYear} />
          </header>
          <h4 className={styles.description}>
            <div className={styles.descriptionPrompt}>
              first
            </div>
            <div className={styles.descriptionAnswer}>
              <ul className={styles.descriptionAnswersList}>
                {MEMORIES.map(memory => (
                  <li key={memory.id} id={memory.id}>{memory.label}</li>
                ))}
              </ul>
            </div>
          </h4>
        </div>
      </div>
    </section>
  )
}
