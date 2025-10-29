import Works from "@/components/works";
import Trending from "@/components/trending";
import Discount from "@/components/discount";
import Shopping from "@/components/shopping";
import Card from "@/components/card";
import Collection from "@/components/collection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-[Inter]">
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dnnvicccf/video/upload/v1761219508/db7728e09c09bff656d6e7cc03a4b29d_slhe6t.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        <div className="relative z-10 text-center px-6 sm:px-8 max-w-5xl mx-auto mt-20">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-xl uppercase">
            Sandra Luxe Suits
          </h1>

          <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed font-light max-w-3xl mx-auto drop-shadow-lg">
            Elevate your style with perfectly tailored suits, where confidence
            meets craftsmanship.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/product"
              className="px-6 py-2 text-lg md:text-xl font-medium rounded-full bg-black text-white hover:bg-gray-800 shadow-xl transition-all duration-300"
            >
              Shop Now
            </Link>

            <Link
              href="/about"
              className="px-6 py-2 text-lg md:text-xl font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      <Works />
      <div className="-mt-20">
        <Trending />
      </div>
      <Discount />

      <div
        className="relative flex items-center justify-center mt-10"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnnvicccf/image/upload/v1761651684/a773fb1c427e71647a1d7c971adf2172_bsegd4.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "600px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

        <div className="relative z-10 text-white text-center">
          <h1 className="text-4xl font-bold">
            Celebrate Love with Our Exclusive Collection
          </h1>
          <p className="mt-2 text-xl">
            Explore our exclusive wedding collection: elegant gowns, <br /> stylish
            suits, and accessories to make your day unforgettable.
          </p>
        </div>
      </div>

      <Shopping />

      <div className="-mt-20">
        <Card />
      </div>

      <div className="-mt-16">
        <Collection />
      </div>
    </div>
  );
}
