/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import styles from "./page.module.css";

const FLIPBOOKS = gql`
  query FlipBooks {
    flipBooks {
      id
      slug
      status
    }
  }
`;

export default function HomePage() {
  const { data, loading, error } = useQuery(FLIPBOOKS);

  if (loading) return <p className={styles.message}>Loading…</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Flipbooks</h1>
        <p className={styles.subtitle}>Browse your interactive flipbooks</p>
      </header>

      <section className={styles.grid}>
        {data.flipBooks.map((fb: any) => (
          <Link
            key={fb.id}
            href={`/en/flipbook/${fb.slug}`}
            className={styles.card}>
            <h2 className={styles.cardTitle}>{fb.slug}</h2>
            <p className={styles.cardMeta}>Status: {fb.status}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
