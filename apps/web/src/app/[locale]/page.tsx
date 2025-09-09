/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./home.module.css";

const FLIPBOOKS = gql`
  query FlipBooks {
    flipBooks {
      id
      slug
      translations {
        locale
        title
        description
        images
      }
    }
  }
`;

export default function HomePage() {
  const { locale } = useParams() as { locale: string };
  const { data, loading, error } = useQuery(FLIPBOOKS);

  if (loading) return <p>Loading flipbooks…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>My Flipbooks</h1>
      <div className={styles.grid}>
        {data.flipBooks.map((fb: any, i: number) => {
          const t =
            fb.translations.find((t: any) => t.locale === locale) ||
            fb.translations[0];

          return (
            <motion.div
              key={fb.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              {t.images?.[0] ? (
                <img
                  src={t.images[0]}
                  alt={t.title}
                  className={styles.thumbnail}
                />
              ) : (
                <div className={styles.placeholder}>No image</div>
              )}

              <h2>{t.title || fb.slug}</h2>
              <p>{t.description || "No description available."}</p>

              <div className={styles.actions}>
                <Link href={`/${locale}/flipbook/${fb.slug}`}>View</Link>
                <Link href={`/${locale}/flipbook/${fb.slug}/edit`}>Edit</Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
