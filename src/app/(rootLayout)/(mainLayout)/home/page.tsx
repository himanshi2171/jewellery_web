"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import products from "@/data/products.json";
import { useRouter } from "next/navigation";
import { WishlistButton } from "@/components/WishlistButton/page";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPES } from "@/redux/action/ActionType";
import { RootState } from "@/types/page";
import Link from "next/link";
import Head from "next/head";
import Footer from "@/components/Footer/page";
import { listAction } from "@/redux/action/listAction";

const Home = () => {
  const cartItems = useSelector((state: RootState) => state.listReducer.list);
  const router = useRouter();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    dispatch(
      listAction({
        onSuccess: (res) => {
          if (res.status === 200 && Array.isArray(res.data)) {
            setProducts(res.data);
          }
        },
        onFailure: () => {
          console.log("Failure!");
        },
      })
    );
  }, [dispatch]);

  // Redirect authenticated users away from auth pages if they're on them
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (
      currentPath.includes("/auth/signin") ||
      currentPath.includes("/auth/signup")
    ) {
      router.push("/home");
    }
  }, [router]);

  const handleTopBrands = (id: number) => {
    router.push(`/topBrandProduct/${id}`);
  };

  const handleAddToCart = (item: {
    id: number;
    name: string;
    price: number;
    image: string;
    title?: string;
  }) => {
    const existingCartItem = cartItems?.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity,
      };
      dispatch({
        type: ACTION_TYPES.UPDATE_LIST,
        payload: updatedItem,
      });
    } else {
      const cartItem = {
        ...item,
        quantity: 1,
      };
      dispatch({ type: ACTION_TYPES.ADD_LIST, payload: cartItem });
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(
      `/home/products/new-collection?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="bg-off-white text-soft-black min-h-screen font-sans">
        <section className="relative w-full min-h-[55vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <Image
              src="/assets/Image/Home/home.png"
              alt="Hero"
              fill
              className="object-contain object-right md:object-center opacity-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 md:px-24 max-w-xl py-24">
            <h1 className="text-5xl md:text-6xl font-serif font-normal mb-4 tracking-wide text-white lowercase">
              the autumn equinox
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-xl text-white/90">
              Golden warmth, radiant elegance.
            </p>
            <Link href="/home/products/new-collection">
              <button className="border border-white text-white px-10 py-3 rounded-full font-semibold text-lg bg-transparent hover:bg-white hover:text-soft-black transition-all duration-300">
                Shop now
              </button>
            </Link>
          </div>
        </section>
        <section className="py-20 px-4 md:px-0 bg-white text-soft-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-semibold text-center mb-2 tracking-tight">
              Shop by category
            </h2>
            <div className="flex justify-center">
              <span className="block w-16 h-1 bg-gold rounded-full mb-4"></span>
            </div>
            <div className="text-center mb-12">
              <span
                className="italic text-gray-500 text-lg"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                Indulge in what we offer.
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
              {products?.map((cat) => {
                const tag = cat.title
                  ? cat.title.toLowerCase().replace(/s$/, "")
                  : "";
                const topBrandCollection = products.find(
                  (collection) =>
                    collection.data &&
                    collection.data.some((item) => item.tagName === tag)
                );
                const handleClick = () => {
                  if (topBrandCollection) {
                    handleTopBrands(topBrandCollection.id);
                  } else {
                    // Optionally, show an alert or do nothing if not found
                    // alert(`No collection found for ${cat.name}`);
                  }
                };
                return (
                  <div
                    key={cat.image}
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => handleCategoryClick(cat.title || cat.name)}
                  >
                    <div className="w-full aspect-square relative mb-5 rounded-xl overflow-hidden shadow-md bg-white transition-transform duration-300 group-hover:scale-105 group-hover:shadow-gold/40">
                      <Image
                        src={cat.image}
                        alt={cat.title || cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-serif text-lg text-center mt-2 transition-colors duration-200 group-hover:text-gold">
                      {cat.title || cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="flex flex-col md:flex-row items-stretch bg-black">
          <div className="flex-1 min-h-[500px] relative">
            <Image
              src="/assets/Image/Home/home1.png"
              alt="Golden hour hand"
              fill
              className="object-cover "
            />
          </div>
          <div className="flex-1 bg-soft-black text-white flex flex-col justify-center px-8 py-12 md:py-0">
            <div className="text-xs text-gray-400 mb-2">
              ARTICLE • OCTOBER 2024
            </div>
            <h3 className="text-2xl font-serif font-semibold mb-4">
              During the golden hour.
            </h3>
            <p className="mb-6 text-base leading-relaxed text-gray-200">
              In this photographer jewellery editorial, we look at artists
              visualizing what's beyond the lens. The golden hour is a time of
              day when the world is bathed in a warm, soft light, creating a
              magical atmosphere that enhances the beauty of everything it
              touches. Jewellery, with its reflective surfaces and intricate
              designs, comes alive in this light, revealing new facets and
              depths.
            </p>
            <Link href="/article">
              <button className="border border-white text-white px-6 py-2 rounded-full font-medium bg-transparent hover:bg-white hover:text-soft-black transition hover:text-black">
                Read more
              </button>
            </Link>
          </div>
        </section>
        <div className="flex flex-col md:flex-row items-center md:items-stretch h-10 bg-white" />
        <section className="flex flex-col md:flex-row items-center md:items-stretch  bg-[#F6F1ED]">
          <div className="flex-1 flex flex-col justify-center px-8 py-12">
            <h3 className="text-2xl font-serif font-semibold mb-4">
              Gifts of the season
            </h3>
            <p className="mb-6 text-base leading-relaxed text-gray-700">
              Luxuriate in pieces ideal as a gesture of affection, self-love,
              and celebration. Discover our curated selection of timeless gifts,
              perfect for every occasion and every loved one.
            </p>
            <Link href="/gifts">
              <button className="border border-gold text-gold px-6 py-2 rounded-full font-medium bg-transparent hover:bg-gold hover:text-black transition">
                Shop gifts
              </button>
            </Link>
          </div>
          <div className="flex-1 min-h-[400px] relative">
            <Image
              src="/assets/Image/Home/home2.png"
              alt="Gifts"
              fill
              className="object-fill"
            />
          </div>
        </section>
        <div className="flex flex-col md:flex-row items-center md:items-stretch h-10 bg-white" />
        <section className="flex flex-col md:flex-row items-stretch bg-black">
          <div className="flex-1 min-h-[500px] relative">
            <Image
              src="/assets/Image/Home/home3.png"
              alt="Sunset"
              fill
              className="object-fill object-center"
            />
          </div>
          <div className="flex-1 bg-soft-black text-white flex flex-col justify-center px-8 py-12 md:py-0">
            <h3 className="text-2xl font-serif font-semibold mb-4">
              What were we made for?
            </h3>
            <p className="mb-6 text-base leading-relaxed text-gray-200">
              Luxury means more than materials. Jewellery is about artistry,
              aspiration, and the stories we tell. Discover the inspiration
              behind our collections and the values that shape our craft.
            </p>
            <Link href="/about">
              <button className="border border-white text-white px-6 py-2 rounded-full font-medium bg-transparent hover:bg-white hover:text-soft-black transition hover:text-black">
                Read more
              </button>
            </Link>
          </div>
        </section>
        <div className="flex flex-col md:flex-row items-center md:items-stretch h-10 bg-white" />
        <section className="py-20 px-4 md:px-0 bg-white text-soft-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-semibold text-center mb-2 tracking-tight">
              Best Selling
            </h2>
            <div className="flex justify-center">
              <span className="block w-16 h-1 bg-gold rounded-full mb-4"></span>
            </div>
            <div className="text-center mb-12">
              <span
                className="italic text-gray-500 text-lg"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                Our most loved pieces.
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <WishlistButton
                        product={{ ...item, price: Number(item.price) }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{item.title}</p>
                    <p className="text-lg font-semibold text-gold mb-3">
                      ${item.price}
                    </p>
                    <button
                      onClick={() =>
                        handleAddToCart({ ...item, price: Number(item.price) })
                      }
                      className="w-full bg-soft-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/home/products?all=true">
                <button className="border border-gold text-gold px-8 py-3 rounded-full font-semibold bg-transparent hover:bg-gold hover:text-red transition-all duration-300">
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;
