"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Link from "next/link";
import styles from "./new.module.css";
import { ARTICLES } from "../page";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: ArticleInput!) {
    createArticle(input: $input)
  }
`;

export default function NewArticlePage() {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    locale: "en",
  });

  const [createArticle, { loading, error, data }] = useMutation(CREATE_ARTICLE);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createArticle({
      variables: {
        input: {
          slug: form.slug,
          status: "draft",
          tags: [],
          translations: [
            {
              locale: form.locale,
              title: form.title,
              description: form.description,
              blocks: [
                {
                  kind: "hero",
                  title: form.title,
                  subtitle: form.description,
                },
              ],
            },
          ],
        },
      },
      refetchQueries: [{ query: ARTICLES }],
    });
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create New Article</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Slug
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Locale
          <input
            type="text"
            name="locale"
            value={form.locale}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Create"}
        </button>
      </form>

      {error && <p className={styles.error}>Error: {error.message}</p>}
      {data && (
        <p className={styles.success}>
          ✅ Article created! <Link href="/">View on homepage</Link>
        </p>
      )}
    </main>
  );
}
