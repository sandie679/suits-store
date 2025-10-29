import Image from "next/image";

export default function Works() {
  const steps = [
    {
      number: 1,
      title: 'Select Your Fabric',
      description:
        'Choose from premium wool, linen, cotton, or stretch-made to match your style and season.',
      image: 'https://res.cloudinary.com/dnnvicccf/image/upload/v1761549868/353c73f64291ad0d09c7d5bf9b7c_1_cwpdiw.avif',
    },
    {
      number: 2,
      title: 'Pick Customizations',
      description:
        'Select your lapel style, buttons, pocket style, lining, monogram, and more.',
      image: 'https://res.cloudinary.com/dnnvicccf/image/upload/v1761549731/913b89b040b98e85dc870abf6991_1_yty4ci.webp',
    },
    {
      number: 3,
      title: 'Get Measured',
      description:
        'Get measured at your nearest showroom or input your measurements online at checkout.',
      image: 'https://res.cloudinary.com/dnnvicccf/image/upload/v1761549839/9c0a07fb4efcb75ecd1e41d9b4b2_kjqmsu.avif',
    },
    {
      number: 4,
      title: 'Experience Superior Fit',
      description:
        'With adjustments made to fit your body shape, enjoy the greater comfort and ease of movement.',
      image: 'https://res.cloudinary.com/dnnvicccf/image/upload/v1761141311/photo-1617127365659-c47fa864d8bc_yy79ly.jpg',
    },
  ];

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-semibold mb-10">
        Get The Perfect Custom Fit in 4 Easy Steps
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-full h-80 overflow-hidden rounded-lg shadow-md">
              <Image
                src={step.image}
                alt={step.title}
                width={400}
                height={340}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-800 font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>

      <button className="mt-12 px-8 py-3 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white rounded-md transition">
        LEARN MORE
      </button>
    </section>
  );
}
