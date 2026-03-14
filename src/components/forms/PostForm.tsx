import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import * as z from "zod"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { postValidation } from "@/lib/validation"
import type { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "sonner"
import { useCreatePost } from "@/lib/react-query/queriesAndMutation"

type PostFormProps = {
  post?: Models.Document
}

const PostForm = ({ post }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost()
  const { user } = useUserContext()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  })

  async function onSubmit(values: z.infer<typeof postValidation>) {
    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if (!newPost) {
      toast.error("Please try again")
    }

    navigate("/")
  }
console.log("Current User Context:", user);
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img className="" src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h2-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-9 w-full max-w-5xl"
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea
                    className="shad-textarea custom-scrollbar"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Location</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Add Tags (separated by comma " , ")
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Art, Coding, Love"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-end">
            <Button type="button" className="shad-button_dark_4">
              Cancel
            </Button>
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default PostForm
