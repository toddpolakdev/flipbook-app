"use client";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import styles from "./admin.module.css";

export const ARTICLES = gql`
  query Articles {
    articles {
      id
      slug
      status
    }
  }
`;

export default function AdminPage() {
  const { data, loading, error } = useQuery(ARTICLES);

  if (loading) return <p className={styles.message}>Loading…</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <Link href="/admin/new" className={styles.createBtn}>
          ➕ Create New Article
        </Link>
      </header>

      <section className={styles.list}>
        {data.articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul>
            {data.articles.map((a: any) => (
              <li key={a.id} className={styles.listItem}>
                <Link
                  href={`/admin/edit/${a.id}`}
                  className={styles.articleLink}>
                  {a.slug}
                </Link>
                <span className={styles.status}>{a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
