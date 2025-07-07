"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

const RouteChangeLoader = () => {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => showLoading("Loading page...");
    const handleStop = () => hideLoading();

    window.addEventListener("beforeunload", handleStart);
    router?.events?.on?.("routeChangeStart", handleStart);
    router.events?.on?.("routeChangeComplete", handleStop);
    router.events?.on?.("routeChangeError", handleStop);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      router.events?.off?.("routeChangeStart", handleStart);
      router.events?.off?.("routeChangeComplete", handleStop);
      router.events?.off?.("routeChangeError", handleStop);
    };
  }, [router, showLoading, hideLoading]);

  return null;
};

export default RouteChangeLoader;
