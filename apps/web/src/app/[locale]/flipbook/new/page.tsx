"use client";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import styles from "./new.module.css";
import PageFlipper from "@/components/PageFlipper";

const CREATE_FLIPBOOK = gql`
  mutation CreateFlipBook($input: FlipBookInput!) {
    createFlipBook(input: $input) {
      id
      slug
    }
  }
`;

export default function NewFlipBookPage() {
  const { locale } = useParams() as { locale: string };

  const [createFlipBook, { loading: saving, error, data: updated }] =
    useMutation(CREATE_FLIPBOOK);

  if (error) console.log("error: ", error);

  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    images: [] as string[],
    settings: {
      width: 400,
      height: 600,
      size: "fixed" as "fixed" | "stretch",
      minWidth: 315,
      maxWidth: 1000,
      minHeight: 400,
      maxHeight: 1500,
      drawShadow: true,
      flippingTime: 1000,
      usePortrait: true,
      startZIndex: 0,
      autoSize: true,
      maxShadowOpacity: 1,
      showCover: false,
      mobileScrollSupport: true,
      showPageNumbers: true,
      backgroundColor: "#fff",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;

    let newValue: string | number | boolean = value;

    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      newValue = Number(value);
    }

    if (name in form.settings) {
      setForm({
        ...form,
        settings: {
          ...form.settings,
          [name]: newValue,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addPage = () => {
    setForm({
      ...form,
      images: [
        ...form.images,
        "https://via.placeholder.com/400x600?text=New+Page",
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFlipBook({
      variables: {
        input: {
          slug: form.slug,
          translations: [
            {
              locale,
              title: form.title,
              description: form.description,
              images: form.images,
            },
          ],
          settings: form.settings,
        },
      },
    });
    alert("Flipbook created!");
  };

  return (
    <main className={styles.container}>
      <h1>Create New Flipbook</h1>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Slug:
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Title:
            <input name="title" value={form.title} onChange={handleChange} />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <h2>Settings</h2>
          <label>
            Width:{" "}
            <input
              type="number"
              name="width"
              value={form.settings.width}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Height:{" "}
            <input
              type="number"
              name="height"
              value={form.settings.height}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Size:
            <select
              name="size"
              value={form.settings.size}
              onChange={handleChange}>
              <option value="fixed">Fixed</option>
              <option value="stretch">Stretch</option>
            </select>
          </label>
          <label>
            Min Width:{" "}
            <input
              type="number"
              name="minWidth"
              value={form.settings.minWidth}
              onChange={handleChange}
            />
          </label>
          <label>
            Max Width:{" "}
            <input
              type="number"
              name="maxWidth"
              value={form.settings.maxWidth}
              onChange={handleChange}
            />
          </label>
          <label>
            Min Height:{" "}
            <input
              type="number"
              name="minHeight"
              value={form.settings.minHeight}
              onChange={handleChange}
            />
          </label>
          <label>
            Max Height:{" "}
            <input
              type="number"
              name="maxHeight"
              value={form.settings.maxHeight}
              onChange={handleChange}
            />
          </label>
          <label>
            Flipping Time (ms):
            <input
              type="number"
              name="flippingTime"
              value={form.settings.flippingTime}
              onChange={handleChange}
            />
          </label>
          <label>
            Max Shadow Opacity:
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              name="maxShadowOpacity"
              value={form.settings.maxShadowOpacity}
              onChange={handleChange}
            />
          </label>

          <label>
            <input
              type="checkbox"
              name="drawShadow"
              checked={form.settings.drawShadow}
              onChange={handleChange}
            />{" "}
            Draw Shadow
          </label>
          <label>
            <input
              type="checkbox"
              name="usePortrait"
              checked={form.settings.usePortrait}
              onChange={handleChange}
            />{" "}
            Use Portrait
          </label>
          <label>
            Start Z-Index:
            <input
              type="number"
              name="startZIndex"
              value={form.settings.startZIndex}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              type="checkbox"
              name="autoSize"
              checked={form.settings.autoSize}
              onChange={handleChange}
            />{" "}
            Auto Size
          </label>
          <label>
            <input
              type="checkbox"
              name="showCover"
              checked={form.settings.showCover}
              onChange={handleChange}
            />{" "}
            Show Cover
          </label>
          <label>
            <input
              type="checkbox"
              name="mobileScrollSupport"
              checked={form.settings.mobileScrollSupport}
              onChange={handleChange}
            />{" "}
            Mobile Scroll Support
          </label>

          <h2>Pages</h2>
          {form.images.map((img, idx) => (
            <label key={idx}>
              Page {idx + 1}:
              <input
                type="text"
                value={img}
                onChange={(e) => {
                  const images = [...form.images];
                  images[idx] = e.target.value;
                  setForm({ ...form, images });
                }}
              />
            </label>
          ))}
          <button type="button" onClick={addPage}>
            Add Page
          </button>

          <button type="submit">Create Flipbook</button>
        </form>

        <div className={styles.preview}>
          <PageFlipper
            images={form.images}
            width={form.settings.width}
            height={form.settings.height}
            backgroundColor={form.settings.backgroundColor}
            showPageNumbers={form.settings.showPageNumbers}
          />
        </div>
      </div>
    </main>
  );
}
