'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AddToCartButton from '../../components/AddToCartButton';

interface WeddingItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function WeddingPage() {
  const [items, setItems] = useState<WeddingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeddingItems = async () => {
      try {
        const res = await fetch('/api/wedding');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching wedding items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeddingItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading wedding collection...
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Wedding Dresses & Suits Collection
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="   p-4 bg-white flex flex-col items-center text-center"
              >
                <div className="relative w-full h-90 mb-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover "
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm max-w-sm">
                  {item.description}
                </p>
                <p className="mt-3 font-bold text-black">{item.price}</p>
                <div className="mt-4">
                  <AddToCartButton productId={item._id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
