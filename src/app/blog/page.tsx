import getPostMetadata from "../../lib/getPostMetadata";
import PostPreview from "../../components/PostPreview";
export default function BlogPage() {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div className="max-w-[52rem] mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 lg:max-w-6xl py">
      <div className="py-16 sm:text-center">
        <h1 className="mb-4 text-3xl sm:text-4xl tracking-tight text-white font-extrabold">
          Latest Updates
        </h1>
        <p className="text-lg text-white">
          Sign up for the newsletter!
        </p>

        <div className="mt-3 max-w-sm sm:mx-auto sm:px-4">
          <h2 className="sr-only">Sign up for our newsletter</h2>
          <form
            action="https://app.convertkit.com/forms/3181837/subscriptions"
            method="post"
            className="flex flex-wrap -mx-2"
            data-np-intersection-state="visible"
            data-np-autofill-form-type="subscribe"
            data-np-checked="1"
            data-np-watching="1"
          >
            <div className="px-2 grow-[9999] basis-64 mt-3">
              <div className="group relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-6 h-full absolute inset-y-0 left-3 text-slate-400 pointer-events-none group-focus-within:text-sky-500"
                >
                  <path d="M5 7.92C5 6.86 5.865 6 6.931 6h10.138C18.135 6 19 6.86 19 7.92v8.16c0 1.06-.865 1.92-1.931 1.92H6.931A1.926 1.926 0 0 1 5 16.08V7.92Z"></path>
                  <path d="m6 7 6 5 6-5"></path>
                </svg>
                <input
                  name="email_address"
                  type="email"
                  autoComplete="off"
                  aria-label="Email address"
                  className="appearance-none shadow rounded-md ring-1 ring-slate-900/5 leading-5 sm:text-sm border border-transparent py-2 placeholder:text-slate-400 pl-12 pr-3 block w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="Subscribe via email"
                  data-np-intersection-state="observed"
                  data-np-autofill-field-type="email"
                  data-np-uid="144e781f-bb82-4e1f-8420-f23637750ec4"
                />
              </div>
            </div>
            <div className="px-2 grow flex mt-3">
              <button
                type="submit"
                className="bg-sky-500 flex-auto shadow text-white rounded-md text-sm border-y border-transparent py-2 font-semibold px-3 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="relative sm:pb-12 sm:ml-[calc(2rem+1px)] md:ml-[calc(3.5rem+1px)] lg:ml-[max(calc(14.5rem+1px),calc(100%-48rem))]">
        <div className="hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 sm:block"></div>
        <div className="space-y-16">{postPreviews}</div>
      </div>
    </div>
  );
}
