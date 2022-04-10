import Head from 'next/head'
import Header from '../components/Header'
import TopBanner from '../components/TopBanner'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <TopBanner />
    </div>
  )
}
