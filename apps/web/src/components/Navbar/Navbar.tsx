"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // icons
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { locale } = useParams() as { locale?: string };
  const currentLocale = locale || "en";
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href={`/${currentLocale}`} className={styles.logo}>
          Flipbook
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          <Link href={`/${currentLocale}`}>Home</Link>
          <Link href={`/${currentLocale}/flipbook/new`}>New Flipbook</Link>
          <Link href={`/${currentLocale}/admin`}>Admin</Link>
        </div>

        {/* Mobile menu button */}
        <button
          className={styles.menuButton}
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className={styles.mobileMenu}>
          <Link href={`/${currentLocale}`} onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link
            href={`/${currentLocale}/flipbook/new`}
            onClick={() => setOpen(false)}>
            New Flipbook
          </Link>
          <Link href={`/${currentLocale}/admin`} onClick={() => setOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
