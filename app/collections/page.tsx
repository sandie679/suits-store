'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AddToCartButton from '../../components/AddToCartButton';

interface WeddingItem {
  _id: string;
  imageUrl: string;
  images?: string[];
  description: string;
  price: string;
  link: string;
  title: string;
}

interface WomenswareItem {
  _id: string;
  imageUrl: string;
  description: string;
  price: string;
  link: string;
  title: string;
}

interface MenswareItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface PostItem {
  _id: string;
  imageUrl: string;
  images?: string[];
  description: string;
  price: string;
  link: string;
  title: string;
}

interface Item {
  _id: string;
  title?: string;
  description: string;
  price?: string | number;
  imageUrl: string;
  category: string;
}

export default function CollectionsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const [weddingRes, womenswareRes, trendingRes, menswareRes] = await Promise.all([
          fetch('/api/wedding'),
          fetch('/api/womensware'),
          fetch('/api/post'),
          fetch('/api/mensware')
        ]);

        const weddingData: WeddingItem[] = await weddingRes.json();
        const womenswareData: WomenswareItem[] = await womenswareRes.json();
        const trendingData: PostItem[] = await trendingRes.json();
        const menswareData: MenswareItem[] = await menswareRes.json();

       
        const allItems = [
          ...weddingData.map((item: WeddingItem) => ({ ...item, category: 'Wedding' })),
          ...womenswareData.map((item: WomenswareItem) => ({ ...item, category: 'Womenswear' })),
          ...trendingData.map((item: PostItem) => ({ ...item, category: 'Trending', title: item.description, price: parseFloat(item.price.replace('$', '')) || 0 })),
          ...menswareData.map((item: MenswareItem) => ({ ...item, category: 'Menswear' }))
        ];

        setItems(allItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading collections...
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          All Collections
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white flex flex-col items-center text-center shadow-md rounded-lg"
              >
                <div className="relative w-full h-90 mb-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || item.description}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title || item.description}
                </h3>
                <p className="text-gray-600 mt-2 text-sm max-w-sm">
                  {item.description}
                </p>
                {item.price && (
                  <p className="mt-3 font-bold text-black">{item.price}</p>
                )}
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