import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, sanityConfig, urlFor } from '../../lib/sanity'
import { Post } from '../../model/typings'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import CommentForm from '../../components/CommentForm'

export interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface PostPageProps {
  post: Post
}

export default function PostPage(props: PostPageProps) {
  let post = props.post

  const [submitted, setSubmitted] = useState(false)

  const useFormReturn = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((result) => {
        console.log(`Submit status: ${result.status}`)
        if (result.ok) {
          setSubmitted(true)
        } else {
          setSubmitted(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />

      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={sanityConfig.dataset}
            projectId={sanityConfig.projectId}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          ></PortableText>
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      {(() => {
        if (submitted) {
          return (
            <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold">Thank you for submitting your comment!</h3>
              <p>Once it has been approved, it will appear below!</p>
            </div>
          )
        } else {
          return (
            <CommentForm
              post={post}
              onSubmit={onSubmit}
              useFormReturn={useFormReturn}
            />
          )
        }
      })()}
    </main>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
          current
        },
      }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  let params = context.params

  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
          name, 
          image
        },
        description,
        mainImage,
        slug {
          current
        },
        body
      }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    // enables ISR - after user loads the page, next loads will be from cache,
    // after this time next user will wait for a fresh page
    revalidate: 60,
  }
}
