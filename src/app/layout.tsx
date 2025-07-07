import "./globals.css";
import { ReactNode } from "react";
import ReduxProvider from "./reduxProvider";
import Header from "./(rootLayout)/(mainLayout)/header/page";
import { LoadingProvider } from "@/context/LoadingContext";
import { SearchProvider } from "@/context/SearchContext";
import GlobalLoader from "@/components/GlobalLoader/page";
import RouteChangeLoader from "@/components/RouteChangeLoader";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Apollonian - Luxury Jewelry Collection",
  description:
    "Discover timeless elegance with our curated collection of fine jewelry. From necklaces and earrings to bracelets and rings, find the perfect piece for every occasion.",
  keywords:
    "jewelry, luxury jewelry, necklaces, earrings, bracelets, rings, fine jewelry, gold jewelry, silver jewelry, diamond jewelry",
  authors: [{ name: "Apollonian" }],
  openGraph: {
    title: "Apollonian - Luxury Jewelry Collection",
    description:
      "Discover timeless elegance with our curated collection of fine jewelry.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <LoadingProvider>
          <ReduxProvider>
            <SearchProvider>
              <Header />
              <RouteChangeLoader />
              {children}
              <Toaster position="top-right" />
            </SearchProvider>
          </ReduxProvider>
          <GlobalLoader />
        </LoadingProvider>
      </body>
    </html>
  );
}
