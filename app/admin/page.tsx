"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // ✅ Added import

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Item {
  _id: string;
  title?: string;
  price?: string;
  imageUrl: string;
  description?: string;
  images?: string[];
  link?: string;
  linkText?: string;
  linkUrl?: string;
  collection?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [collections, setCollections] = useState<Item[]>([]);
  const [discounts, setDiscounts] = useState<Item[]>([]);
  const [styles, setStyles] = useState<Item[]>([]);
  const [trends, setTrends] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>("posts");
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    imageUrl: "",
    link: "",
    title: "",
    linkText: "",
    linkUrl: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    if (!session?.user?.isAdmin) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [
          usersRes,
          itemsRes,
          collectionsRes,
          discountsRes,
          stylesRes,
          trendsRes,
        ] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/items"),
          fetch("/api/collection"),
          fetch("/api/discount"),
          fetch("/api/style"),
          fetch("/api/trend"),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setItems(itemsData);
        }

        if (collectionsRes.ok) {
          const collectionsData = await collectionsRes.json();
          setCollections(collectionsData);
        }

        if (discountsRes.ok) {
          const discountsData = await discountsRes.json();
          setDiscounts(discountsData);
        }

        if (stylesRes.ok) {
          const stylesData = await stylesRes.json();
          setStyles(stylesData);
        }

        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setTrends(trendsData);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const handleDeleteUser = async (id: string) => {
    if (!session?.user) return;
    if (!confirm("Are you sure you want to delete this user?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: session?.user?.email ? { "x-admin-email": session.user.email } : {},
    });

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleDeleteItem = async (id: string) => {
    if (!session?.user) return;
    if (!confirm("Delete this item?")) return;

    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    try {
      const res = await fetch("/api/admin/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [...prev, newItem]);
        setFormData({
          description: "",
          price: "",
          imageUrl: "",
          link: "",
          title: "",
          linkText: "",
          linkUrl: "",
        });
        setShowAddForm(false);
      } else {
        alert("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    }
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setFormData({
      description: item.description || "",
      price: item.price || "",
      imageUrl: item.imageUrl,
      link: item.link || "",
      title: item.title || "",
      linkText: item.linkText || "",
      linkUrl: item.linkUrl || "",
    });
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !editingItem) return;

    try {
      const res = await fetch(`/api/admin/items/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? updatedItem : i))
        );
        setEditingItem(null);
        setFormData({
          description: "",
          price: "",
          imageUrl: "",
          link: "",
          title: "",
          linkText: "",
          linkUrl: "",
        });
      } else {
        alert("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      description: "",
      price: "",
      imageUrl: "",
      link: "",
      title: "",
      linkText: "",
      linkUrl: "",
    });
  };

  if (status === "loading" || loading)
    return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
        <p className="text-center mb-12 text-gray-600">
          Welcome, {session?.user?.email}
        </p>

        <div className="space-y-8">
          {/* Collection Selector */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Select Collection to Manage
            </h2>
            <div className="flex flex-wrap gap-4">
              {[
                { key: "posts", label: "Posts", data: items },
                { key: "collections", label: "Collections", data: collections },
                { key: "discounts", label: "Discounts", data: discounts },
                { key: "styles", label: "Styles", data: styles },
                { key: "trends", label: "Trends", data: trends },
              ].map(({ key, label, data }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCollection(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCollection === key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label} ({data.length})
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Users Section */}
            <div className="shadow-lg border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Users</h2>
              </div>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Items Section */}
            <div className="shadow-lg border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize">
                  {selectedCollection}
                </h2>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Item
                </button>
              </div>

              {(showAddForm || editingItem) && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3">
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </h3>
                  <form
                    onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                    className="space-y-3"
                  >
                    {(selectedCollection === "posts" ||
                      selectedCollection === "styles" ||
                      selectedCollection === "trends") && (
                      <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                      />
                    )}
                    {(selectedCollection === "posts" ||
                      selectedCollection === "styles" ||
                      selectedCollection === "trends") && (
                      <input
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        required
                      />
                    )}
                    {selectedCollection === "posts" && (
                      <input
                        type="text"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                      />
                    )}
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageUrl: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    {selectedCollection === "discounts" && (
                      <>
                        <input
                          type="text"
                          placeholder="Link Text"
                          value={formData.linkText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkText: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          required
                        />
                        <input
                          type="url"
                          placeholder="Link URL"
                          value={formData.linkUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkUrl: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </>
                    )}
                    {(selectedCollection === "posts" ||
                      selectedCollection === "collections" ||
                      selectedCollection === "styles" ||
                      selectedCollection === "trends") && (
                      <input
                        type="url"
                        placeholder="Link"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            link: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        required
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {editingItem ? "Update" : "Add"} Item
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {(() => {
                  const currentData = {
                    posts: items,
                    collections,
                    discounts,
                    styles,
                    trends,
                  }[selectedCollection] || [];

                  return currentData.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                       
                        <div className="relative w-12 h-12">
                          <Image
                            src={item.imageUrl}
                            alt={
                              item.title ||
                              item.description ||
                              item.linkText ||
                              "Item"
                            }
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.title ||
                              item.description ||
                              item.linkText ||
                              "Untitled"}
                          </p>
                          {item.price && (
                            <p className="text-gray-500 text-sm">
                              ${item.price}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
