import Image from 'next/image';

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#222] pt-12 pb-0">
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-2">
              ARTICLE • OCTOBER 2024
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              During the golden hour.
            </h1>
            <p className="mb-4 text-base leading-relaxed">
              In this photographer jewelry editorial, we look at artists
              visualizing what's beyond the lens. The golden hour is a time of
              day when the world is bathed in a warm, soft light, creating a
              magical atmosphere that enhances the beauty of everything it
              touches. Jewelry, with its reflective surfaces and intricate
              designs, comes alive in this light, revealing new facets and
              depths.
            </p>
            <p className="mb-4 text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Quisquam, voluptatum. The interplay of light and shadow, the glint
              of gold, and the sparkle of gemstones all contribute to a visual
              symphony that captivates the viewer.
            </p>
            <p className="mb-4 text-base leading-relaxed">
              This editorial celebrates the artistry of makers, the vision of
              photographers, and the timeless allure of jewelry. Each piece
              tells a story, capturing a moment in time that is both fleeting
              and eternal.
            </p>
          </div>
          <div className="flex-1 w-full max-w-xs md:max-w-sm">
            <div className="relative w-full h-full md:h-full rounded-xl overflow-hidden shadow-md">
              <Image
                src="/assets/Image/LandingPage/article1.jpg"
                alt="Golden hour"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <blockquote className="italic text-lg text-center text-gray-700 border-l-4 border-[#bfa06a] pl-4 my-8">
          "This is a quote by the collaborator featured in this article."
        </blockquote>
        <div className="flex flex-col md:flex-row gap-8 items-center mt-12">
          <div className="relative w-full h-48 md:w-64 md:h-40 rounded-xl overflow-hidden shadow-md mb-4 md:mb-0">
            <Image
              src="/assets/Image/LandingPage/article2.jpg"
              alt="Jewelry closeup"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-base leading-relaxed mb-2">
              Curator Editorial by Apollonian Studio. Brought to you by makers,
              stylists and artists who believe in the power of beauty and craft.
              This is a space to share stories, inspiration, and the creative
              process behind each collection.
            </div>
            <div className="text-sm text-gray-500 mt-4">Jane Doe</div>
          </div>
        </div>
      </div>
    </main>
  );
} 