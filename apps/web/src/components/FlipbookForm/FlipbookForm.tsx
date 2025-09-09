"use client";
import { useState } from "react";
import PageFlipper from "../PageFlipper";
import styles from "./FlipbookForm.module.css";

export interface FlipbookFormValues {
  slug: string;
  title: string;
  description: string;
  images: string[];
  settings: {
    width: number;
    height: number;
    size: "fixed" | "stretch";
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    backgroundColor: string;
    showPageNumbers: boolean;
  };
}

interface Props {
  initialValues: FlipbookFormValues;
  onSubmit: (values: FlipbookFormValues) => Promise<void>;
}

export default function FlipbookForm({ initialValues, onSubmit }: Props) {
  const [form, setForm] = useState<FlipbookFormValues>(initialValues);

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
    await onSubmit(form);
  };

  return (
    <div className={styles.layout}>
      {/* Left: Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Details</h2>
        <label>
          Slug
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <h2>Settings</h2>
        <label>
          Width
          <input
            type="number"
            name="width"
            value={form.settings.width}
            onChange={handleChange}
          />
        </label>
        <label>
          Height
          <input
            type="number"
            name="height"
            value={form.settings.height}
            onChange={handleChange}
          />
        </label>
        <label>
          Background Color
          <input
            type="color"
            name="backgroundColor"
            value={form.settings.backgroundColor}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            type="checkbox"
            name="showPageNumbers"
            checked={form.settings.showPageNumbers}
            onChange={handleChange}
          />
          Show Page Numbers
        </label>

        <h2>Pages</h2>
        {form.images.map((img, idx) => (
          <label key={idx}>
            Page {idx + 1}
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

        <button type="submit">Save Flipbook</button>
      </form>

      {/* Right: Preview */}
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
  );
}

export const defaultFlipbookValues: FlipbookFormValues = {
  slug: "",
  title: "",
  description: "",
  images: [],
  settings: {
    width: 400,
    height: 600,
    size: "fixed",
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
    backgroundColor: "#ffffff",
    showPageNumbers: true,
  },
};
