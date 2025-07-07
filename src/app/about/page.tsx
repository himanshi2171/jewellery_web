import Image from "next/image";
import Footer from "@/components/Footer/page";

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f8f7f4] text-[#222] pb-0">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/assets/Image/LandingPage/about.jpg"
            alt="Elegant woman wearing gold earring"
            fill
            className="object-cover object-center opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 md:px-24 max-w-xl py-24">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white drop-shadow-lg">About Us</h1>
          <p className="mb-4 text-lg md:text-xl leading-relaxed text-white/90 drop-shadow">
            Discover the story behind our minimalist jewelry brand. We blend timeless elegance with modern simplicity, crafting pieces that celebrate individuality and beauty in every detail.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 md:px-0 bg-[#f8f7f4]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-[#a58c3d]">Our Story</h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            Founded with a passion for artistry and a love for detail, our brand is dedicated to creating jewelry that inspires confidence and joy. Each piece is thoughtfully designed and meticulously crafted, reflecting our commitment to quality and timeless style.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            We believe in the power of simplicity and the beauty of subtlety. Our collections are inspired by nature, architecture, and the stories of those who wear them. Whether it's a gift for a loved one or a treat for yourself, our jewelry is made to be cherished for years to come.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-10 text-[#a58c3d]">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#faf7ef] rounded-xl shadow p-8 flex flex-col items-center text-center">
              <svg className="w-12 h-12 mb-4 text-[#a58c3d]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.91z" /></svg>
              <h3 className="font-semibold text-lg mb-2">Timeless Craftsmanship</h3>
              <p className="text-gray-600">Every piece is crafted with care, blending traditional techniques with modern design for lasting beauty.</p>
            </div>
            <div className="bg-[#faf7ef] rounded-xl shadow p-8 flex flex-col items-center text-center">
              <svg className="w-12 h-12 mb-4 text-[#a58c3d]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              <h3 className="font-semibold text-lg mb-2">Inspired by You</h3>
              <p className="text-gray-600">Our collections are inspired by the stories and individuality of those who wear them.</p>
            </div>
            <div className="bg-[#faf7ef] rounded-xl shadow p-8 flex flex-col items-center text-center">
              <svg className="w-12 h-12 mb-4 text-[#a58c3d]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /></svg>
              <h3 className="font-semibold text-lg mb-2">Exceptional Service</h3>
              <p className="text-gray-600">We are committed to providing a seamless shopping experience and outstanding customer care.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
