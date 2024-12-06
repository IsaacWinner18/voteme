import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProgressSpinner } from "primereact/progressspinner";

import { format } from "timeago.js";

interface Post {
  _id: string;
  content: string;
  createdAt: Date;
  __v: number;
}

export default function AnonymousPostCard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  const anon_server_url = "https://voteme-production.up.railway.app/anon";

  const postContent = async () => {
    const post_fetch = await fetch(anon_server_url, {
      method: "POST",
      body: JSON.stringify({
        content: newPost,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data: post_data } = await post_fetch.json();
    setPosts((next) => [post_data, ...next]);
  };

  const fetchContent = async () => {
    const data = await fetch(anon_server_url);
    // console.log(data)
    const response = await data.json();
    setPosts(response.data as Post[]);
    // console.log(response);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.length == 0) return;
    // if (newPost.trim()) {
    //   setPosts([{ content: newPost, createdAt: new Date() }, ...posts]);
    setLoading(true);
    await postContent();
    setNewPost("");
    setLoading(false);
    // }
  };

  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
            <h2 className="text-2xl font-bold text-white">Anonymous Posts</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              className="text-black w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Write your anonymous post here..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 w-full bg-purple-500 text-white py-2 rounded-md transition-colors duration-300 hover:bg-purple-600"
              type="submit"
              disabled={loading}
            >
              {!loading && "Post"}
              {loading && (
                <div className="card flex justify-content-center">
                  <ProgressSpinner
                    style={{ width: "30px", height: "30px" }}
                    fill="white"
                    strokeWidth="8"
                    animationDuration="0.3s"
                  />
                </div>
              )}
            </motion.button>
          </form>
        </div>
      </div>
      <div className="mt-8 flex flex-row flex-wrap gap-x-4 gap-y-3 justify-center">
        {posts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md max-w-[500px] h-fit md:min-w-[400px] overflow-x-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white">
                Anonymous Post #{posts.length - index}
              </h3>
              <span className="text-xs text-white opacity-75">
                &nbsp; {format(post.createdAt)}
              </span>
            </div>
            <div className="p-4 ">
              <p className="text-red-800 break-words">{post.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
