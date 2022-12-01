import Head from 'next/head'
import Image from 'next/image'

import { HeroSection } from '../components/HeroSection'
import { MemoriesSection } from '../components/MemoriesSection'
import { InviteSection } from '../components/InviteSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <MemoriesSection />
      <InviteSection />
    </>
  )
}
