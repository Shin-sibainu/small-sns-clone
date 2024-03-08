"use client";

import { useEffect, useOptimistic } from "react";
import Likes from "./Likes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Post({ posts }: { posts: PostWithAuthor[] }) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic<
    PostWithAuthor[],
    PostWithAuthor
  >(posts, (currentOptimisticPosts, newPost) => {
    const newOptimisticPosts = [...currentOptimisticPosts];
    const index = newOptimisticPosts.findIndex(
      (post) => post.id === newPost.id
    );
    newOptimisticPosts[index] = newPost;
    return newOptimisticPosts;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          // console.log({ payload });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <>
      {optimisticPosts?.map((post) => (
        <div key={post.id} className="border-gray-900 py-4 px-8 flex">
          <div className="h-12 w-12">
            <Image
              src={post.author.avatar_url}
              alt="user icon"
              width={48}
              height={48}
              className="rounded-s-full"
            />
          </div>
          <div className="ml-4">
            <p>
              <span className="font-bold">{post.author?.name}</span>
              <span className="text-gray-400 text-sm">
                {post.author?.username}
              </span>
            </p>
            <p>{post.title}</p>
            <Likes post={post} addOptimisticPost={addOptimisticPost} />
          </div>
        </div>
      ))}
    </>
  );
}
