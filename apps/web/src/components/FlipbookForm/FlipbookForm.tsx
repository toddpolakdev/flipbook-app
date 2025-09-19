"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useMemo } from "react";
import {
  Accordion,
  Group,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Textarea,
  Card,
  Stack,
} from "@mantine/core";
import { Button } from "@mantine/core";
import PageFlipper from "../PageFlipper";
import { toast } from "sonner";

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
    showPageNumbers: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
    useMouseEvents: boolean;
  };
}

interface Props {
  initialValues: FlipbookFormValues;
  onSubmit: (values: FlipbookFormValues) => Promise<void>;
}

export default function FlipbookForm({ initialValues, onSubmit }: Props) {
  const [form, setForm] = useState<FlipbookFormValues>(initialValues);
  const [saving, setSaving] = useState(false);

  const flipbookKey = useMemo(() => {
    const {
      width,
      height,
      size,
      flippingTime,
      usePortrait,
      autoSize,
      showCover,
    } = form.settings;
    return `${width}-${height}-${size}-${flippingTime}-${usePortrait}-${autoSize}-${showCover}`;
  }, [form.settings]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (name: string, value: any) => {
    if (name in form.settings) {
      setForm({
        ...form,
        settings: {
          ...form.settings,
          [name]: value,
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
        "https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQe",
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      toast.success("Flipbook saved!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "2rem auto",
        padding: "1rem",
        display: "grid",
        gridTemplateColumns: "1fr 500px",
        gap: "2rem",
      }}>
      <form onSubmit={handleSubmit}>
        <Accordion multiple defaultValue={["details", "pages", "settings"]}>
          {/* Details */}
          <Accordion.Item value="details">
            <Accordion.Control>Details</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <TextInput
                  label="Slug"
                  required
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.currentTarget.value)}
                />
                <TextInput
                  label="Title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.currentTarget.value)}
                />
                <Textarea
                  label="Description"
                  minRows={3}
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.currentTarget.value)
                  }
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Pages */}
          <Accordion.Item value="pages">
            <Accordion.Control>Pages</Accordion.Control>
            <Accordion.Panel>
              <Stack>
                <Button variant="light" onClick={addPage}>
                  Add Page
                </Button>
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
                          <Draggable
                            key={idx}
                            draggableId={String(idx)}
                            index={idx}>
                            {(provided) => (
                              <Card
                                shadow="sm"
                                padding="sm"
                                mb="sm"
                                withBorder
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <Group>
                                  <div
                                    style={{
                                      width: 60,
                                      height: 90,
                                      border: "1px solid #ddd",
                                      borderRadius: 4,
                                      overflow: "hidden",
                                    }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={img}
                                      alt={`Page ${idx + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                  <TextInput
                                    label={`Page ${idx + 1}`}
                                    value={img}
                                    onChange={(e) => {
                                      const images = [...form.images];
                                      images[idx] = e.currentTarget.value;
                                      setForm({ ...form, images });
                                    }}
                                  />
                                </Group>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Settings */}
          <Accordion.Item value="settings">
            <Accordion.Control>Settings</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Group grow>
                  <NumberInput
                    label="Width"
                    value={form.settings.width}
                    onChange={(val) => handleChange("width", val)}
                  />
                  <NumberInput
                    label="Height"
                    value={form.settings.height}
                    onChange={(val) => handleChange("height", val)}
                  />
                </Group>

                <Select
                  label="Size"
                  data={[
                    { value: "fixed", label: "Fixed" },
                    { value: "stretch", label: "Stretch" },
                  ]}
                  value={form.settings.size}
                  onChange={(val) => handleChange("size", val)}
                />

                <Group grow>
                  <NumberInput
                    label="Min Width"
                    value={form.settings.minWidth}
                    onChange={(val) => handleChange("minWidth", val)}
                  />
                  <NumberInput
                    label="Max Width"
                    value={form.settings.maxWidth}
                    onChange={(val) => handleChange("maxWidth", val)}
                  />
                </Group>

                <Group grow>
                  <NumberInput
                    label="Min Height"
                    value={form.settings.minHeight}
                    onChange={(val) => handleChange("minHeight", val)}
                  />
                  <NumberInput
                    label="Max Height"
                    value={form.settings.maxHeight}
                    onChange={(val) => handleChange("maxHeight", val)}
                  />
                </Group>

                <NumberInput
                  label="Flipping Time (ms)"
                  min={100}
                  max={2000}
                  step={100}
                  value={form.settings.flippingTime}
                  onChange={(val) => handleChange("flippingTime", val)}
                />

                <NumberInput
                  label="Max Shadow Opacity"
                  min={0}
                  max={1}
                  step={0.1}
                  // precision={1}
                  value={form.settings.maxShadowOpacity}
                  onChange={(val) => handleChange("maxShadowOpacity", val)}
                />

                <NumberInput
                  label="Swipe Distance"
                  min={10}
                  max={100}
                  value={form.settings.swipeDistance}
                  onChange={(val) => handleChange("swipeDistance", val)}
                />

                <NumberInput
                  label="Start Z-Index"
                  value={form.settings.startZIndex}
                  onChange={(val) => handleChange("startZIndex", val)}
                />

                {/* Switches */}
                <Group grow>
                  <Switch
                    label="Draw Shadow"
                    checked={form.settings.drawShadow}
                    onChange={(e) =>
                      handleChange("drawShadow", e.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Use Portrait"
                    checked={form.settings.usePortrait}
                    onChange={(e) =>
                      handleChange("usePortrait", e.currentTarget.checked)
                    }
                  />
                </Group>

                <Group grow>
                  <Switch
                    label="Auto Size"
                    checked={form.settings.autoSize}
                    onChange={(e) =>
                      handleChange("autoSize", e.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Show Cover"
                    checked={form.settings.showCover}
                    onChange={(e) =>
                      handleChange("showCover", e.currentTarget.checked)
                    }
                  />
                </Group>

                <Group grow>
                  <Switch
                    label="Mobile Scroll Support"
                    checked={form.settings.mobileScrollSupport}
                    onChange={(e) =>
                      handleChange(
                        "mobileScrollSupport",
                        e.currentTarget.checked
                      )
                    }
                  />
                  <Switch
                    label="Show Page Numbers"
                    checked={form.settings.showPageNumbers}
                    onChange={(e) =>
                      handleChange("showPageNumbers", e.currentTarget.checked)
                    }
                  />
                </Group>

                <Group grow>
                  <Switch
                    label="Show Page Corners"
                    checked={form.settings.showPageCorners}
                    onChange={(e) =>
                      handleChange("showPageCorners", e.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Disable Flip By Click"
                    checked={form.settings.disableFlipByClick}
                    onChange={(e) =>
                      handleChange(
                        "disableFlipByClick",
                        e.currentTarget.checked
                      )
                    }
                  />
                </Group>

                <Switch
                  label="Use Mouse Events"
                  checked={form.settings.useMouseEvents}
                  onChange={(e) =>
                    handleChange("useMouseEvents", e.currentTarget.checked)
                  }
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Button type="submit" mt="lg" loading={saving} fullWidth>
          Save Flipbook
        </Button>
      </form>

      {/* Preview */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "1rem",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          minHeight: 650,
          position: "sticky",
          top: "1rem",
        }}>
        {form.images.length > 0 ? (
          <PageFlipper
            key={flipbookKey}
            images={form.images}
            {...form.settings}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
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
    size: "stretch",
    minWidth: 315,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1500,
    drawShadow: true,
    flippingTime: 600,
    usePortrait: true,
    startZIndex: 0,
    autoSize: true,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: true,
    showPageNumbers: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
    useMouseEvents: true,
  },
};
