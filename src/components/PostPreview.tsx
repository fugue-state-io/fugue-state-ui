import Link from "next/link";
import { PostMetadata } from "../models/PostMetadata";

const PostPreview = (props: PostMetadata) => {
  return (
    <article className="relative group text-white">
      <div className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-2xl group-hover:bg-slate-800/70"></div>
      <svg
        viewBox="0 0 9 9"
        className="hidden absolute right-full mr-6 top-2 text-slate-200 md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block"
      >
        <circle
          cx="4.5"
          cy="4.5"
          r="4.5"
          stroke="currentColor"
          className="fill-white"
          strokeWidth="2"
        ></circle>
      </svg>
      <div className="relative">
        <h3 className="text-base font-semibold tracking-tight text-white pt-8 lg:pt-0">
          {props.title}
        </h3>
        <div className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 text-white  line-clamp-2">
          <p>{props.subtitle}</p>
        </div>
        <dl className="absolute left-0 top-0 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]">
          <dt className="sr-only">Date</dt>
          <dd className="whitespace-nowrap text-sm leading-6 ">
            <time>{props.date}</time>
          </dd>
        </dl>
        <a
          className="flex items-center text-sm text-sky-500 font-medium"
          href={`/blog/posts/${props.slug}`}
        >
          <span className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-2xl"></span>
          <span className="relative">
            Read more
            <span className="sr-only">
              , Tailwind CSS v3.4: Dynamic viewport units, :has() support,
              balanced headlines, subgrid, and more
            </span>
          </span>
          <svg
            className="relative mt-px overflow-visible ml-2.5 text-sky-300"
            width="3"
            height="6"
            viewBox="0 0 3 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 0L3 3L0 6"></path>
          </svg>
        </a>
      </div>
    </article>
  );
};

export default PostPreview;
