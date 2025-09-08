"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Link from "next/link";
import styles from "./new.module.css";

const CREATE_FLIPBOOK = gql`
  mutation CreateFlipBook($input: FlipBookInput!) {
    createFlipBook(input: $input)
  }
`;

export default function NewFlipBookPage() {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    locale: "en",
    images: "",
    width: 400,
    height: 600,
    backgroundColor: "#ffffff",
    showPageNumbers: true,
  });

  const [createFlipBook, { loading, error, data }] =
    useMutation(CREATE_FLIPBOOK);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedSlug = form.slug.trim().toLowerCase().replace(/\s+/g, "-");
    const imageArray = form.images.split("\n").map((line) => line.trim());

    await createFlipBook({
      variables: {
        input: {
          slug: normalizedSlug,
          status: "draft",
          tags: [],
          translations: [
            {
              locale: form.locale,
              title: form.title,
              description: form.description,
              images: imageArray,
            },
          ],
          settings: {
            width: form.width,
            height: form.height,
            backgroundColor: form.backgroundColor,
            showPageNumbers: form.showPageNumbers,
          },
        },
      },
      refetchQueries: ["FlipBooks"],
    });
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create New Flipbook</h1>

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

        <label>
          Images (one URL per line)
          <textarea
            name="images"
            value={form.images}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Width (px)
          <input
            type="number"
            name="width"
            value={form.width}
            onChange={handleChange}
          />
        </label>

        <label>
          Height (px)
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
          />
        </label>

        <label>
          Background Color
          <input
            type="color"
            name="backgroundColor"
            value={form.backgroundColor}
            onChange={handleChange}
          />
        </label>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="showPageNumbers"
            checked={form.showPageNumbers}
            onChange={(e) =>
              setForm({ ...form, showPageNumbers: e.target.checked })
            }
          />
          Show Page Numbers
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Create Flipbook"}
        </button>
      </form>

      {error && <p className={styles.error}>Error: {error.message}</p>}
      {data && (
        <p className={styles.success}>
          ✅ Flipbook created! <Link href="/">View on homepage</Link>
        </p>
      )}
    </main>
  );
}
