"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "@/components/Footer/page";
import { AppDispatch } from "@/types/page";

export default function mainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <main className="flex-1 overflow-auto">{children}</main>
      <Footer />
    </div>
  );
}
