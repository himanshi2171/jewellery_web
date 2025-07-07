"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();

  return <>{children}</>;
} 