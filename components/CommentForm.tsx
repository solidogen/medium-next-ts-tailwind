import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { Post } from '../model/typings'
import { IFormInput } from "../pages/post/[slug]"

interface CommentFormProps {
  post: Post
  onSubmit: SubmitHandler<IFormInput>
  errors: FieldErrors
  handleSubmit: UseFormHandleSubmit<IFormInput>
  register: UseFormRegister<IFormInput>
}

export default function CommentForm(props: CommentFormProps) {
  let post = props.post
  let onSubmit = props.onSubmit
  let errors = props.errors
  let handleSubmit = props.handleSubmit
  let register = props.register

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xml my-10 mx-auto mb-10 flex flex-col p-5"
    >
      <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
      <h4 className="text-3xl font-bold">Leave a comment below!</h4>
      <hr className="mt-2 py-3" />

      <input {...register('_id')} type="hidden" name="_id" value={post._id} />

      <label className="mb-5 block">
        <span className="text-gray-700">Name</span>
        <input
          {...register('name', { required: true })}
          className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
          placeholder="John Appleseed"
          type="text"
        />
      </label>
      <label className="mb-5 block">
        <span className="text-gray-700">E-mail</span>
        <input
          {...register('email', { required: true })}
          className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
          placeholder="John Appleseed"
          type="email"
        />
      </label>
      <label className="mb-5 block">
        <span className="text-gray-700">Comment</span>
        <textarea
          {...register('comment', { required: true })}
          className="form-text-area mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
          placeholder="John Appleseed"
          rows={8}
        />
      </label>

      {/* errors will show up when field validation fails */}
      <div className="flex flex-col p-5">
        {errors.name && (
          <span className="text-red-500">- The Name field is required</span>
        )}
        {errors.email && (
          <span className="text-red-500">- The E-mail field is required</span>
        )}
        {errors.comment && (
          <span className="text-red-500">- The Comment field is required</span>
        )}
      </div>

      <input
        className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
        type="submit"
        value="Submit"
      />
    </form>
  )
}
