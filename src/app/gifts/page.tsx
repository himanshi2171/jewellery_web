import Image from "next/image";

const gifts = [
  { img: "gift1.jpg", label: "Gifts under $100" },
  { img: "gift2.jpg", label: "Gifts $100-$200" },
  { img: "gift3.jpg", label: "Gifts $200 and above" },
  { img: "gift4.jpg", label: "Gifts for him" },
  { img: "gift5.jpg", label: "Gifts for her" },
  { img: "gift6.jpg", label: "Gifts for friend" },
];

export default function GiftsPage() {
  return (
    <main className="min-h-screen[calc(100vh-80px)] bg-[#f8f7f4] text-[#222] pt-12 pb-0">
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2 text-center">
          Gifts
        </h1>
        <p className="text-center text-base text-gray-600 mb-10">
          Luxuriate in pieces ideal for all events.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {gifts.map((gift) => (
            <div
              key={gift.img}
              className="flex flex-col items-center bg-white rounded-xl shadow-sm p-4"
            >
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                <Image
                  src={`/assets/Image/Gifts/${gift.img}`}
                  alt={gift.label}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-lg text-center">
                {gift.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
