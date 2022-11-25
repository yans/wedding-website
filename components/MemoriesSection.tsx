import React from 'react'
import styles from '../styles/memories.module.css'
import cx from 'classnames'

import { Date, Year } from './Date'
import { Text } from './Text'

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
    label: 'Our first date\nat Fort Mason',
    timestamp: 1503039600,
  },
  {
    id: 'timeline-2017-vacation',
    display: {
      date: "01",
      month: "12",
      year: "2017"
    },
    label: 'Our first vacation\ntogether in San Diego',
    timestamp: 1512115200,
  },
  {
    id: 'timeline-2018-valentine',
    display: {
      month: "02",
      date: "14",
      year: "2018"
    },
    label: 'Our first Valentine\'s Day\ntogether',
    timestamp: 1518595200,
  },
  {
    id: 'timeline-2023-wedding',
    display: {
      month: "12",
      date: "24",
      year: "2021"
    },
    label: 'Proposed at\nFort Mason',
    timestamp: 1518595200,
  },
  {
    id: 'timeline-2023-wedding',
    display: {
      month: "08",
      date: "18",
      year: "2023"
    },
    label: 'Our Wedding at\nFort Mason',
    timestamp: 1518595200,
  }
]


export function MemoriesSection() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null)
  const progressionRef = React.useRef<HTMLDivElement | null>(null)

  const [displayDate, setDisplayDate] = React.useState<string>("18")
  const [displayMonth, setDisplayMonth] = React.useState<string>("08")
  const [displayYear, setDisplayYear] = React.useState<string>("2017")
  const [offset, setOffset] = React.useState<number>(0)

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
      setOffset(index)
    }

    document.getElementById('')
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
          <Text className={styles.description}>
            <div className={styles.descriptionAnswer}>
              <ul
                className={styles.descriptionAnswersList}
                style={{ top: `calc(${offset} * -100%)` }}
              >
                {MEMORIES.map(memory => (
                  <li
                    className={styles.descriptionAnswersListItem}
                    key={memory.id}
                    id={memory.id}
                  >
                    {memory.label}
                  </li>
                ))}
              </ul>
            </div>
          </Text>
        </div>
      </div>
    </section>
  )
}
