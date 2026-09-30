"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** Catalog is hidden — soft redirect for old bookmarks. */
export default function CatalogPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <main className="main" style={{ padding: "48px 16px", textAlign: "center" }}>
      <p>
        Раздел «Каталог» временно скрыт.{" "}
        <Link href="/">Перейти на главную</Link>
      </p>
    </main>
  );
}
