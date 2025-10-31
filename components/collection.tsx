'use client';

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollectionItem {
  _id: string;
  imageUrl: string;
  link: string;
}

const Collection = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collection");
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 350;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (collections.length === 0) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      <h2 className="text-3xl font-bold text-left mb-8">Shop Our Collection</h2>

      
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 scrollbar-hide scroll-smooth px-2"
      >
        {collections.map((item) => (
          <div
            key={item._id}
            className="min-w-[300px] flex-shrink-0 shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative w-full h-[350px]">
              <Image
                src={item.imageUrl}
                alt="Collection image"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 text-center">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline font-bold"
              >
                {item.link}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
