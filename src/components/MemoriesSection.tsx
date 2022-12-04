import React from 'react'
import styles from '../styles/memories.module.css'
import cx from 'classnames'
import throttle from 'lodash/throttle'

import image01 from '../../public/2017-08-18-15-56.jpeg'
import image02 from '../../public/2017-08-18-17-07.jpeg'
import image03 from '../../public/2017-08-18-19-13.jpeg'
import image04 from '../../public/2017-08-18-20-54.jpeg'
import image05 from '../../public/2017-11-15-21-26.jpeg'
import image06 from '../../public/2017-11-17-07-35.jpeg'
import image07 from '../../public/2017-11-18-13-32.jpeg'
import image08 from '../../public/2017-12-03-15-04.jpeg'
import image09 from '../../public/2017-12-03-17-01.jpeg'
import image10 from '../../public/2017-12-23-14-14.jpeg'
import image11 from '../../public/2018-08-04-16-03.jpeg'
import image12 from '../../public/2018-11-01-19-58.jpeg'
import image13 from '../../public/2018-11-02-00-39.jpeg'
import image14 from '../../public/2018-11-02-11-08.jpeg'
import image15 from '../../public/2018-11-02-11-51.jpeg'
import image16 from '../../public/2018-12-24-10-41.jpeg'
import image17 from '../../public/2019-06-16-11-59.jpeg'
import image18 from '../../public/2019-12-27-13-00.jpeg'
import image19 from '../../public/2020-02-13-14-38.jpeg'
import image20 from '../../public/2020-02-14-15-41.jpeg'
import image21 from '../../public/2021-05-28-12-10.jpeg'
import image22 from '../../public/2021-05-30-10-28.jpeg'
import image23 from '../../public/2021-09-21-11-27.jpeg'
import image24 from '../../public/2021-12-24-09-19.jpeg'
import image25 from '../../public/2021-12-24-10-29.jpeg'
import image26 from '../../public/2021-12-24-11-45.jpeg'
import image27 from '../../public/2021-12-24-16-17.jpeg'

import { Date, Year } from './Date'
import { Body } from './Text'

type Date = {
  column: number
  id: string
  date: string
  month: string
  year: string
}

const DATES: Array<Date> = [
  {
    column: 1,
    id: "2017-08-18",
    date: "18",
    month: "08",
    year: "2017"
  },
  {
    column: 4,
    id: "2017-11-15",
    date: "15",
    month: "11",
    year: "2017"
  },
  {
    column: 5,
    id: "2017-12-03",
    date: "03",
    month: "12",
    year: "2017"
  },
  {
    column: 6,
    id: "2017-12-22",
    date: "22",
    month: "12",
    year: "2017"
  },
  {
    column: 7,
    id: "2018-08-03",
    date: "03",
    month: "08",
    year: "2018"
  },
  {
    column: 8,
    id: "2018-11-01",
    date: "01",
    month: "11",
    year: "2018"
  },
  {
    column: 11,
    id: "2019-06-16",
    date: "16",
    month: "06",
    year: "2019"
  },
  {
    column: 12,
    id: "2019-12-25",
    date: "25",
    month: "12",
    year: "2019"
  },
  {
    column: 13,
    id: "2020-02-14",
    date: "14",
    month: "02",
    year: "2020"
  },
  {
    column: 14,
    id: "2021-05-28",
    date: "28",
    month: "05",
    year: "2021"
  },
  {
    column: 15,
    id: "2021-09-21",
    date: "21",
    month: "09",
    year: "2021"
  },
  {
    column: 17,
    id: "2021-12-24",
    date: "24",
    month: "12",
    year: "2021"
  },
  {
    column: 20,
    id: "2023-08-18",
    date: "18",
    month: "08",
    year: "2023"
  },
]

type Memory = { label: string, column: number }

const MEMORIES: Array<Memory> = [
  { label: 'from our first date\nat Fort Mason', column: 1 },
  { label: 'followed by many more\nin SF', column: 4 },
  { label: 'to our many trips\nacross the world', column: 6 },
  { label: 'then our engagement\nat Fort Mason', column: 17 },
  { label: 'finally our wedding,\nback where it all started', column: 20 }
]

export function MemoriesSection() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null)
  const progressionRef = React.useRef<HTMLDivElement | null>(null)
  const picturesFrontRef = React.useRef<HTMLDivElement | null>(null)
  const picturesBackRef = React.useRef<HTMLDivElement | null>(null)
  const columnMeasurerRef = React.useRef<HTMLDivElement | null>(null)

  const [displayDate, setDisplayDate] = React.useState<string>("18")
  const [displayMonth, setDisplayMonth] = React.useState<string>("08")
  const [displayYear, setDisplayYear] = React.useState<string>("2017")
  const [memoryIndex, setMemoryIndex] = React.useState<number>(0)

  const handleGetPicturesOffset = React.useCallback(() => {
    if (
      !sectionRef.current
      || !progressionRef.current
      || !picturesFrontRef.current
    ) {
      return 0
    }
    const sectionHeight = sectionRef.current.offsetHeight
    const sectionWidth = sectionRef.current.offsetWidth
    const picturesWidth = picturesFrontRef.current.offsetWidth
    const progressionTrackerOffsetTop = progressionRef.current.offsetTop
    const progressionTrackerHeight = progressionRef.current.offsetHeight

    const progression = progressionTrackerOffsetTop / (sectionHeight - progressionTrackerHeight)
    const clampedProgression = Math.max(Math.min(progression, 0.90), 0.05)
    const adjustedProgression = (clampedProgression - 0.05) / (0.90 - 0.05)

    return adjustedProgression * (picturesWidth - sectionWidth)
  }, [])

  const handleUpdateStyles = React.useCallback((picturesOffset: number) => {
    if (
      !sectionRef.current
      || !picturesFrontRef.current
      || !picturesBackRef.current) {
      return
    }
    const sectionWidth = sectionRef.current.offsetWidth

    picturesFrontRef.current.style.setProperty('--pictures-offset', picturesOffset.toString())
    picturesFrontRef.current.style.setProperty('--section-width', sectionWidth.toString())
    picturesBackRef.current.style.setProperty('--pictures-offset', picturesOffset.toString())
    picturesBackRef.current.style.setProperty('--section-width', sectionWidth.toString())
  }, [])

  const handleUpdateDate = React.useCallback(
    throttle(
      (date: Date) => {
        setDisplayDate(date.date)
        setDisplayMonth(date.month)
        setDisplayYear(date.year)
      }, 50
    ), [])

  const handleUpdateMemory = React.useCallback(
    throttle(
      (index: number) => {
        setMemoryIndex(index)
      }, 50
    ), [])

  const handleUpdateDateAndMemory = React.useCallback((picturesOffset: number) => {
    if (!sectionRef.current || !columnMeasurerRef.current) {
      return
    }
    const sectionWidth = sectionRef.current.offsetWidth
    const picturesLeadingSpace = columnMeasurerRef.current.offsetLeft
    const columnWidth = columnMeasurerRef.current.offsetWidth

    const columnsMidPointX = picturesOffset + sectionWidth / 2 - picturesLeadingSpace
    // offset by 0.5 so that it counts the current column when it is halfway through it
    const currentColumn = Math.floor(Math.max(columnsMidPointX / columnWidth + 0.5, 0))

    const currentDateIndex = DATES.findIndex(date => currentColumn < date.column)
    const currentDate = DATES[(currentDateIndex === -1 ? DATES.length : currentDateIndex) - 1]
    const currentMemoryIndex = MEMORIES.findIndex(memory => currentColumn < memory.column)
    const adjustedMemoryIndex = (currentMemoryIndex === -1 ? MEMORIES.length : currentMemoryIndex) - 1

    if (currentDate) {
      handleUpdateDate(currentDate)
    }
    if (MEMORIES[adjustedMemoryIndex]) {
      handleUpdateMemory(adjustedMemoryIndex)
    }
  }, [handleUpdateDate, handleUpdateMemory])

  React.useLayoutEffect(() => {
    const picturesOffset = handleGetPicturesOffset()
    handleUpdateStyles(picturesOffset)
    handleUpdateDateAndMemory(picturesOffset)
  }, [])

  const handleScroll = React.useCallback(() => {
    const picturesOffset = handleGetPicturesOffset()
    handleUpdateStyles(picturesOffset)
    handleUpdateDateAndMemory(picturesOffset)
  }, [handleUpdateDateAndMemory, handleUpdateStyles])

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <section className={cx(styles.section, 'clip')} ref={sectionRef}>
      <div className={cx(styles.picturesGridContainer, styles.picturesGridContainerFront)}>
        <div
          className={cx(styles.picturesGrid, 'force-hardware-acceleration', 'clip')}
          ref={picturesFrontRef}
        >
          <div ref={columnMeasurerRef} className={styles.columnMeasurer} />

          {/* 08/18 2017 from our first date at fort mason */}
          {/*<Image col="1" position="front" row="1" src={image01.src} />*/}
          <Image col="2 / 4" position="front" row="2" src={image02.src} />
          {/*<Image col="3" position="front" row="4" src={image03.src} />*/}
          {/*<Image col="1 / 3" position="front" row="3 / 5" src={image04.src} />*/}

          {/* 11/11 2017 followed by many more in SF */}
          {/*<Image col="4" position="front" row="2 / 4" src={image05.src} />*/}
          {/*<Image col="4" position="front" row="5" src={image06.src} />*/}

          {/* 12/03 2017 followed by many more in SF */}
          {/*<Image col="5" position="front" row="4" src={image07.src} />*/}
          {/*<Image col="5" position="front" row="5" src={image08.src} />*/}
          {/*<Image col="5" position="front" row="1 / 3" src={image09.src} />*/}

          {/* 2017-12-22 to our many trips across the world */}
          {/*<Image col="6 / 8" position="front" row="2 / 4" src={image10.src} />*/}

          {/* 2018-08-03 to our many trips across the world */}
          <Image col="7 / 9" position="front" row="4 / 6" src={image11.src} />

          {/* 2018-11-01 to our many trips across the world */}
          {/*<Image col="8" position="front" row="3" src={image12.src} />*/}
          {/*<Image col="9" position="front" row="3" src={image13.src} />*/}
          {/*<Image col="8 / 10" position="front" row="1 / 3" src={image14.src} />*/}
          {/*<Image col="10" position="front" row="2 / 4" src={image15.src} />*/}
          {/*<Image col="10" position="front" row="4" src={image16.src} />*/}

          {/* 2019-06-16 to our many trips across the world */}
          {/*<Image col="11 / 13" position="front" row="2 / 5" src={image17.src} />*/}

          {/* 2019-12-25 to our many trips across the world */}
          <Image col="12" position="front" row="5" src={image18.src} />

          {/* 2020-02-14 to our many trips across the world */}
          <Image col="13" position="front" row="2" src={image19.src} />
          {/*<Image col="13" position="front" row="4" src={image20.src} />*/}

          {/* 2021-05-28 to our many trips across the world */}
          <Image col="14" position="front" row="3 / 5" src={image21.src} />
          {/*<Image col="14" position="front" row="1" src={image22.src} />*/}

          {/* 2021-09-21 to our many trips across the world */}
          {/*<Image col="15 / 17" position="front" row="2 / 5" src={image23.src} />*/}

          {/* 2021-12-24 then our engagement at fort mason */}
          <Image col="18" position="front" row="2 / 4" src={image24.src} />
          {/*<Image col="18" position="front" row="4" src={image25.src} />*/}
          {/*<Image col="17" position="front" row="1 / 3" src={image26.src} />*/}
          {/*<Image col="17" position="front" row="3" src={image27.src} />*/}
        </div>
      </div>
      <div className={styles.picturesGridContainer}>
        <div
          className={cx(styles.picturesGrid, 'force-hardware-acceleration', 'clip')}
          ref={picturesBackRef}
        >
          {/* 08/18 2017 from our first date at fort mason */}
          <Image col="1" position="back" row="1" src={image01.src} />
          {/*<Image col="2 / 4" position="back" row="2" src={image02.src} />*/}
          <Image col="3" position="back" row="4" src={image03.src} />
          <Image col="1 / 3" position="back" row="3 / 5" src={image04.src} />

          {/* 11/11 2017 followed by many more in SF */}
          <Image col="4" position="back" row="2 / 4" src={image05.src} />
          <Image col="4" position="back" row="5" src={image06.src} />

          {/* 12/03 2017 followed by many more in SF */}
          <Image col="5" position="back" row="4" src={image07.src} />
          <Image col="5" position="back" row="5" src={image08.src} />
          <Image col="5" position="back" row="1 / 3" src={image09.src} />

          {/* 2017-12-22 to our many trips across the world */}
          <Image col="6 / 8" position="back" row="2 / 4" src={image10.src} />

          {/* 2018-08-03 to our many trips across the world */}
          {/*<Image col="7 / 9" position="back" row="4 / 6" src={image11.src} />*/}

          {/* 2018-11-01 to our many trips across the world */}
          <Image col="8" position="back" row="3" src={image12.src} />
          <Image col="9" position="back" row="3" src={image13.src} />
          <Image col="8 / 10" position="back" row="1 / 3" src={image14.src} />
          <Image col="10" position="back" row="2 / 4" src={image15.src} />
          <Image col="10" position="back" row="4" src={image16.src} />

          {/* 2019-06-16 to our many trips across the world */}
          <Image col="11 / 13" position="back" row="2 / 5" src={image17.src} />

          {/* 2019-12-25 to our many trips across the world */}
          {/*<Image col="12" position="back" row="5" src={image18.src} />*/}

          {/* 2020-02-14 to our many trips across the world */}
          {/*<Image col="13" position="back" row="2" src={image19.src} />*/}
          <Image col="13" position="back" row="4" src={image20.src} />

          {/* 2021-05-28 to our many trips across the world */}
          {/*<Image col="14" position="back" row="3 / 5" src={image21.src} />*/}
          <Image col="14" position="back" row="1" src={image22.src} />

          {/* 2021-09-21 to our many trips across the world */}
          <Image col="15 / 17" position="back" row="2 / 5" src={image23.src} />

          {/* 2021-12-24 then our engagement at fort mason */}
          {/*<Image col="18" position="back" row="2 / 4" src={image24.src} />*/}
          <Image col="18" position="back" row="4" src={image25.src} />
          <Image col="17" position="back" row="1 / 3" src={image26.src} />
          <Image col="17" position="back" row="3" src={image27.src} />
        </div>
      </div>
      <div className={cx(styles.overlayContainer, "force-hardware-acceleration")}>
        <div className={styles.overlayContent}>
          <header className={styles.header}>
            <Date
              className={styles.text}
              month={displayMonth}
              date={displayDate}
            />
            <Year className={styles.text} year={displayYear} />
          </header>
          <Body className={styles.description}>
            <div className={cx(styles.descriptionAnswer, styles.text)}>
              <ul
                className={styles.descriptionAnswersList}
                style={{ top: `calc(${memoryIndex} * -100%)` }}
              >
                {MEMORIES.map(memory => (
                  <li
                    className={styles.descriptionAnswersListItem}
                    key={memory.label}
                    id={memory.label}
                  >
                    {memory.label}
                  </li>
                ))}
              </ul>
            </div>
          </Body>
        </div>
      </div>
      <div className={styles.progressionTracker} ref={progressionRef} />
    </section>
  )
}


function Image(
  {
    col,
    row,
    src,
  } : {
    col : string
    position: 'front' | 'back'
    row : string
    src : string
  }
) {
  const pictureContainerRef = React.useRef<HTMLDivElement | null>(null)
  const pictureRef = React.useRef<HTMLImageElement | null>(null)
  const variantRef = React.useRef<number>(Math.random() * 0.5 + 0.75) // range: 0.75 – 1.25
  React.useEffect(() => {
    if (!pictureContainerRef.current) {
      return
    }
    const pictureOffset = pictureContainerRef.current?.offsetLeft
    const pictureWidth = pictureContainerRef.current?.offsetWidth
    pictureContainerRef.current.style.setProperty('--picture-offset', pictureOffset.toString())
    pictureContainerRef.current.style.setProperty('--variance', variantRef.current.toString())
  }, [pictureContainerRef.current])
  return (
    <div
      className={cx(
        styles.pictureContainer,
        // position === 'front' ? styles.pictureFront : styles.pictureBack,
        'force-hardware-acceleration'
      )}
      style={{ gridColumn: col, gridRow: row }}
      ref={pictureContainerRef}
    >
      <div className={styles.pictureWash} />
      <img
        className={cx(styles.picture, 'force-hardware-acceleration')}
        ref={pictureRef}
        src={src}
      />
      <div className={cx(styles.pictureWash, styles.pictureWashOverlay)} />
    </div>
  )
}
