'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StyleItem {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}

const Shopping = () => {
  const router = useRouter();
  const [items, setItems] = useState<StyleItem[]>([]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await fetch("/api/style");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching styles:", error);
      }
    };
    fetchStyles();
  }, []);

  if (items.length === 0) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center">
        {items.map((item) => (
          <div
            key={item._id}
            className="w-full max-w-[600px] bg-white shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative w-full h-[500px]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 text-center bg-white">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-base mb-3">
                {item.description}
              </p>
              <span
                onClick={() => router.push(`/products?category=${item.link}`)}
                className="text-black font-bold underline cursor-pointer "
              >
                {item.link}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shopping;
