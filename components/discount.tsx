'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface Post {
  _id: string;
  imageUrl: string;
  linkText: string; // text to display and use as filter
}

const Discount = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/discount");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <h1 className="col-span-full text-3xl font-bold mb-6 text-left">
        Get your 30% discount
      </h1>

      {posts.map((post) => (
        <div key={post._id} className="shadow-lg overflow-hidden">
          <div className="relative w-full h-80">
            <Image
              src={post.imageUrl}
              alt={post.linkText}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-2 text-center">
            <span
              className="text-black font-bold text-xl underline cursor-pointer"
              onClick={() => router.push(`/products?category=${post.linkText}`)}
            >
              {post.linkText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Discount;
