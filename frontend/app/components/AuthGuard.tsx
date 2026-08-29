"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const publicPages = ["/login", "/register"];

    if (publicPages.includes(pathname)) {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem(
      "robosphere_token"
    );

    if (!token) {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080D18] text-white">
        <p className="text-gray-400">
          Loading RoboSphere...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}