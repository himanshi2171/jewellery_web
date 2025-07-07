"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const AuthStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Signed in as {user?.email}</span>
        <button
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <Link href="/auth/signin">
      <span className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">Sign In</span>
    </Link>
  );
};

export default AuthStatus; 