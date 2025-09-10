"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    try {
      await onSubmit(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
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

        <h2>Pages</h2>
        <div className={styles.fullwidth}>
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;
              const newImages = Array.from(form.images);
              const [moved] = newImages.splice(result.source.index, 1);
              newImages.splice(result.destination.index, 0, moved);
              setForm({ ...form, images: newImages });
            }}>
            <Droppable droppableId="pages">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {form.images.map((img, idx) => (
                    <Draggable key={idx} draggableId={String(idx)} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={styles.pageRow}>
                          <div className={styles.thumbWrapper}>
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt={`Page ${idx + 1}`}
                                className={styles.thumbnail}
                              />
                            ) : (
                              <div className={styles.placeholder}>No image</div>
                            )}
                          </div>

                          <div className={styles.inputWrapper}>
                            <label>
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
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

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
          Size
          <select
            name="size"
            value={form.settings.size}
            onChange={handleChange}>
            <option value="fixed">Fixed</option>
            <option value="stretch">Stretch</option>
          </select>
        </label>
        <label>
          Min Width
          <input
            type="number"
            name="minWidth"
            value={form.settings.minWidth}
            onChange={handleChange}
          />
        </label>
        <label>
          Max Width
          <input
            type="number"
            name="maxWidth"
            value={form.settings.maxWidth}
            onChange={handleChange}
          />
        </label>
        <label>
          Min Height
          <input
            type="number"
            name="minHeight"
            value={form.settings.minHeight}
            onChange={handleChange}
          />
        </label>
        <label>
          Max Height
          <input
            type="number"
            name="maxHeight"
            value={form.settings.maxHeight}
            onChange={handleChange}
          />
        </label>
        <label>
          Flipping Time (ms)
          <input
            type="number"
            name="flippingTime"
            value={form.settings.flippingTime}
            onChange={handleChange}
          />
        </label>
        <label>
          Max Shadow Opacity
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
          <div className={styles.checkboxWrapper}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                name="drawShadow"
                checked={form.settings.drawShadow}
                onChange={handleChange}
              />
              <span className={styles.slider}></span>
            </label>
            <span>Draw Shadow</span>
          </div>
        </label>

        <label>
          <div className={styles.checkboxWrapper}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                name="usePortrait"
                checked={form.settings.usePortrait}
                onChange={handleChange}
              />
              <span className={styles.slider}></span>
            </label>
            <span>Use Portrait</span>
          </div>
        </label>

        <label>
          Start Z-Index
          <input
            type="number"
            name="startZIndex"
            value={form.settings.startZIndex}
            onChange={handleChange}
          />
        </label>
        <label>
          <div className={styles.checkboxWrapper}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                name="autoSize"
                checked={form.settings.autoSize}
                onChange={handleChange}
              />
              <span className={styles.slider}></span>
            </label>
            <span>Auto Size</span>
          </div>
        </label>

        <div className={styles.checkboxWrapper}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              name="showCover"
              checked={form.settings.showCover}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
          <span>Show Cover</span>
        </div>

        <div className={styles.checkboxWrapper}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              name="mobileScrollSupport"
              checked={form.settings.mobileScrollSupport}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
          <span>Mobile Scroll Support</span>
        </div>

        <label>
          Background Color
          <input
            type="color"
            name="backgroundColor"
            value={form.settings.backgroundColor}
            onChange={handleChange}
          />
        </label>

        <div className={styles.checkboxWrapper}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              name="showPageNumbers"
              checked={form.settings.showPageNumbers}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
          <span>Show Page Numbers</span>
        </div>

        <button type="button" onClick={addPage}>
          Add Page
        </button>

        <button type="submit">{saving ? "Saving…" : "Save Flipbook"}</button>
        {saved && <span className={styles.savedMessage}>✅ Saved!</span>}
      </form>

      <div className={styles.preview}>
        {form.images.length > 0 ? (
          <PageFlipper
            images={form.images}
            width={form.settings.width}
            height={form.settings.height}
            backgroundColor={form.settings.backgroundColor}
            showPageNumbers={form.settings.showPageNumbers}
          />
        ) : (
          <div className={styles.placeholder}>
            <p>No pages yet</p>
            <p>
              Add one using the <strong>Add Page</strong> button
            </p>
          </div>
        )}
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
