import React from 'react'
import styles from '../styles/hero.module.css'
import cx from 'classnames'
import bg from '../../public/background-corrected.jpeg'

import { Date } from './Date'

export function HeroSection() {
  const sectionRef = React.useRef<HTMLDivElement | null>(null)
  const imageContainerRef = React.useRef<HTMLDivElement | null>(null)
  const imageRef = React.useRef<HTMLDivElement | null>(null)

  const handleScroll = React.useCallback(() => {
    if (!sectionRef.current || !imageContainerRef.current || !imageRef.current) {
      return
    }
    const imageContainerOffsetTop = imageContainerRef.current.offsetTop
    const imageContainerHeight = imageContainerRef.current.offsetHeight
    const sectionHeight = sectionRef.current.offsetHeight

    const progression = imageContainerOffsetTop / (sectionHeight - imageContainerHeight)

    // color the image
    const grayscale = 100 * (1 - progression)
    imageRef.current.style.setProperty('filter', `grayscale(${grayscale}%)`)

    // zoom in on the image
    const dimension = 100 + progression * 75
    imageRef.current.style.setProperty('left', `${progression * -37.5}%`) // 0% -> -37.5% (-50%)
    imageRef.current.style.setProperty('top', `${progression * -67.5}%`) // 0% -> -67.5% (-90%)
    imageRef.current.style.setProperty('width', `${dimension}%`) // 100% -> 175% (-200%)
    imageRef.current.style.setProperty('height', `${dimension}%`) // 100% -> 175% (-200%)
  }, [])

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className={cx(styles.section, 'clip')}>
      <div
        ref={imageContainerRef}
        className={
          cx(
            styles.imageContainer,
            'force-hardware-acceleration'
          )
        }
      >
        <div
          ref={imageRef}
          className={
            cx(
              styles.image,
              'force-hardware-acceleration'
            )
          }
          style={
            {
              filter: 'grayscale(100%)',
              backgroundImage: `url(${bg.src})`,
            }
          }
        />
      </div>
      <header
        className={
          cx(
            styles.headerContainer,
            'force-hardware-acceleration',
          )
        }
      >
        <div
          className={styles.headerContent}
        >
          <Date className={styles.date} month="08" date="18" />
        </div>
      </header>
    </section>
  )
}
