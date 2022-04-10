import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import TopBanner from '../components/TopBanner'
import { sanityClient, urlFor } from '../lib/sanity'
import { Post } from '../model/typings'

interface HomeProps {
  posts: [Post]
}

export default function Home(props: HomeProps) {
  const posts = props.posts
  console.log(posts)
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <TopBanner />

      {/* Posts */}
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div>
              <img src={urlFor(post.mainImage).url()!} alt="" />
              <div className="flex justify-between bg-white p-5">
                <div>
                  <p>{post.title}</p>
                  <p>
                    {post.description} by {post.author.name}
                  </p>
                </div>

                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const postsQuery = `*[_type == "post"]{
    _id,
    title,
    slug,
    author -> {
      name, 
      image
    },
    description,
    mainImage,
  }`
  const posts = await sanityClient.fetch(postsQuery)
  return {
    props: { posts },
  }
}
