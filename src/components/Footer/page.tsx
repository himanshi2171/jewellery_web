import React from "react";

const footerLinks = [
  {
    title: "Customer Services",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Track your Order", href: "#" },
      { label: "Shipping & Returns", href: "#" },
      { label: "Frequently Asked Questions", href: "#" },
      { label: "Schedule an appointment", href: "#" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Origins", href: "#" },
      { label: "Our Purpose", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Giving Back", href: "#" },
    ],
  },
  {
    title: "Material Care",
    links: [
      { label: "Jewelry Repair", href: "#" },
      { label: "Ring Sizing", href: "#" },
      { label: "Metal Allergy Resources", href: "#" },
      { label: "Styling Tips", href: "#" },
    ],
  },
];

const locations = [
  "Chicago, IL",
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
];

const socialIcons = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <circle cx="17.5" cy="6.5" r="1" fill="#bfa06a" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M22 5.92a8.38 8.38 0 0 1-2.36.65A4.13 4.13 0 0 0 21.4 4.1a8.19 8.19 0 0 1-2.6.99A4.11 4.11 0 0 0 12 8.09c0 .32.04.64.1.94A11.65 11.65 0 0 1 3.1 4.6a4.07 4.07 0 0 0-.56 2.07c0 1.43.73 2.69 1.85 3.43a4.07 4.07 0 0 1-1.86-.52v.05c0 2 .1 3.95 2.7 4.36a4.1 4.1 0 0 1-1.85.07c.52 1.62 2.03 2.8 3.82 2.83A8.24 8.24 0 0 1 2 19.54a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.18 8.18 0 0 0 22 5.92Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <polygon points="10,8 16,12 10,16" fill="#bfa06a" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M8 11v5M8 8v.01M12 16v-5m0 0V8m0 3v5m4-5v5m0-5V8m0 3v5" />
      </svg>
    ),
  },
];

const legalLinks = [
  { label: "PRIVACY POLICY", href: "#" },
  { label: "TERMS OF USE", href: "#" },
  { label: "SITEMAP", href: "#" },
  { label: "DO NOT SELL MY INFORMATION", href: "#" },
  { label: "COOKIES", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#F6F1ED] text-[#222] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {footerLinks.map((group) => (
          <div key={group.title}>
          <h3 className="font-serif font-semibold mb-4 text-base tracking-wide uppercase text-sm md:text-base">
              {group.title}
          </h3>
          <ul className="space-y-2 text-xs md:text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:underline">
                    {link.label}
              </a>
            </li>
              ))}
          </ul>
        </div>
        ))}
        <div>
          <h3 className="font-serif font-semibold mb-4 text-base tracking-wide uppercase text-sm md:text-base">
            Main Locations
          </h3>
          <ul className="space-y-2 text-xs md:text-sm">
            {locations.map((loc) => (
              <li key={loc}>{loc}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between sm:col-span-2 lg:col-span-1 mt-8 sm:mt-0">
          <div>
            <h3 className="font-serif font-semibold text-base md:text-lg mb-2">
              You can be one step ahead.
            </h3>
            <p className="text-xs md:text-sm mb-4">
              Sign up to hear about our updates on the dot.
            </p>
            <form className="flex flex-col xs:flex-row gap-2 mb-4 w-full">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold bg-white text-xs md:text-sm"
              />
              <button
                type="submit"
                className="bg-white border border-gray-300 px-4 py-2 rounded text-xs font-semibold tracking-wide hover:bg-gold hover:text-red transition"
              >
                SIGN UP
              </button>
            </form>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 justify-center sm:justify-start">
            {socialIcons.map((icon) => (
              <a key={icon.label} href={icon.href} aria-label={icon.label} className="hover:text-gold">
                {icon.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center bg-[#F6F1ED] px-4 gap-2 md:gap-0">
        <div className="mb-2 md:mb-0">© APOLLONIAN, LLC</div>
        <div className="flex flex-wrap gap-2 md:gap-6 justify-center">
          {legalLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <a href={link.href} className="hover:underline">
                {link.label}
              </a>
              {idx < legalLinks.length - 1 && <span>•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}
