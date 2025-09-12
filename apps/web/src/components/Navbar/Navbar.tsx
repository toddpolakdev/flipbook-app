"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const match = pathname.match(/^\/flipbook\/([^/]+)$/);
  const currentSlug = match ? match[1] : null;

  const editMatch = pathname.match(/^\/flipbook\/([^/]+)\/edit$/);
  const editslug = editMatch ? editMatch[1] : null;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href={`/`} className={styles.logo}>
          Flipbook
        </Link>
        <div className={styles.links}>
          <Link href={`/`}>Home</Link>
          <Link href={`/flipbook/new`}>New Flipbook</Link>

          {currentSlug && currentSlug !== "new" && (
            <Link href={`/flipbook/${currentSlug}/edit`}>Edit</Link>
          )}

          {editslug && (
            <Link href={`/flipbook/${editslug}`} onClick={() => setOpen(false)}>
              View
            </Link>
          )}
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className={styles.mobileMenu}>
          <Link href={`/`} onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href={`/flipbook/new`} onClick={() => setOpen(false)}>
            New Flipbook
          </Link>
        </div>
      )}
    </nav>
  );
}
