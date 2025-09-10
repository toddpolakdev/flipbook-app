/* eslint-disable @next/next/no-img-element */
"use client";
import HTMLFlipBook from "react-pageflip";

type PageFlipperProps = {
  images: string[];
  width?: number;
  height?: number;
  backgroundColor?: string;
  showPageNumbers?: boolean;
};

export default function PageFlipper({
  images,
  width = 400,
  height = 600,
  backgroundColor = "#8e1b1bff",
  showPageNumbers = true,
}: PageFlipperProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <HTMLFlipBook
        width={width}
        height={height}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1500}
        maxShadowOpacity={0.5}
        drawShadow={true}
        flippingTime={600}
        useMouseEvents={true}
        showCover={true}
        mobileScrollSupport={true}
        className=""
        style={{}}
        startPage={0}
        usePortrait={true}
        clickEventForward={true}
        startZIndex={0}
        autoSize={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}>
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              background: backgroundColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}>
            {src ? (
              <img
                src={src}
                alt={`Page ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  color: "#888",
                }}>
                Empty Page
              </div>
            )}

            {showPageNumbers && (
              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "12px",
                  fontSize: "0.8rem",
                  color: "#666",
                }}>
                {i + 1}
              </span>
            )}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
