'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface Post {
  _id: string;
  imageUrl: string;
  description: string;
  price: string;
  link: string;
}

export default function Trending() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const router = useRouter();

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post");
        const data = await res.json();
        setPosts(data.slice(0, 10));
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  // Set up GSAP scroll and calculate card width dynamically
  useEffect(() => {
    if (!containerRef.current || !sectionRef.current || posts.length === 0) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const gap = 24;

    // Calculate the width of the first card dynamically
    const firstCard = container.querySelector<HTMLDivElement>("div");
    const cardWidthCalculated = firstCard ? firstCard.offsetWidth + gap : 320 + gap;
    setCardWidth(cardWidthCalculated);

    const totalWidth = container.scrollWidth;
    const visibleWidth = section.offsetWidth;
    const correctedMax = Math.max(0, totalWidth - visibleWidth - gap);

    setMaxTranslate(correctedMax);

    gsap.to(container, {
      x: () => -correctedMax,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${correctedMax}`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [posts]);

  const handlePrev = () => {
    if (!containerRef.current || posts.length === 0) return;
    const currentX = gsap.getProperty(containerRef.current, "x") as number;
    const newX = Math.min(0, currentX + cardWidth);

    gsap.to(containerRef.current, {
      x: newX,
      duration: 0.6,
      ease: "power2.out",
    });
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (!containerRef.current || posts.length === 0) return;
    const currentX = gsap.getProperty(containerRef.current, "x") as number;
    const newX = Math.max(-maxTranslate, currentX - cardWidth);

    gsap.to(containerRef.current, {
      x: newX,
      duration: 0.6,
      ease: "power2.out",
    });
    setCurrentIndex((prev) => Math.min(prev + 1, posts.length - 1));
  };

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-left">
          Trending Styles
        </h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-20">
            Loading...
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div ref={containerRef} className="flex gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] bg-white rounded-lg overflow-hidden text-center"
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.description || "Trending image"}
                      width={800}
                      height={400}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <p className="text-lg font-medium text-gray-900">{post.description}</p>
                      <p className="text-gray-600 font-semibold">{post.price}</p>
                      <span
                        className="inline-block mt-3 text-black underline cursor-pointer font-semibold"
                        onClick={() => router.push(post.link)}
                      >
                        {post.link}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 border rounded-full shadow-md p-2 bg-white transition ${
                currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= posts.length - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 border rounded-full shadow-md p-2 bg-white transition ${
                currentIndex >= posts.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
