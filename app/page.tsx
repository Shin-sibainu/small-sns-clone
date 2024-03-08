import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./components/AuthButtonServer";
import { redirect } from "next/navigation";
import NewPost from "./components/NewPost";
import Likes from "./components/Likes";
import Post from "./components/Post";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*), likes(user_id)");

  const posts =
    data?.map((post) => ({
      ...post,
      author: Array.isArray(post.author) ? post.author[0] : post.author,
      user_has_liked_post: !!post.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: post.likes.length,
    })) ?? [];

  return (
    <div className="mx-auto max-w-xl text-white">
      <div className="flex justify-between px-4 py-6 border-slate-800 border">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewPost user={session.user} />
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
      <Post posts={posts} />
    </div>
  );
}
