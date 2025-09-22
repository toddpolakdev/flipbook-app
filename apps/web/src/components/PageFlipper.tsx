/* eslint-disable @next/next/no-img-element */
"use client";
import HTMLFlipBook from "react-pageflip";

type PageFlipperProps = {
  images: string[];
  width?: number;
  height?: number;
  backgroundColor?: string;
  showPageNumbers?: boolean;
  size?: "fixed" | "stretch";
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  drawShadow?: boolean;
  flippingTime?: number;
  usePortrait?: boolean;
  startZIndex?: number;
  autoSize?: boolean;
  maxShadowOpacity?: number;
  showCover?: boolean;
  mobileScrollSupport?: boolean;
  swipeDistance?: number;
  showPageCorners?: boolean;
  disableFlipByClick?: boolean;
  useMouseEvents?: boolean;
};

export default function PageFlipper({
  images,
  width = 400,
  height = 600,
  backgroundColor = "",
  showPageNumbers = true,
  size = "stretch",
  minWidth = 315,
  maxWidth = 1000,
  minHeight = 400,
  maxHeight = 1500,
  drawShadow = true,
  flippingTime = 600,
  usePortrait = true,
  startZIndex = 0,
  autoSize = true,
  maxShadowOpacity = 0.5,
  showCover = true,
  mobileScrollSupport = true,
  swipeDistance = 30,
  showPageCorners = true,
  disableFlipByClick = false,
  useMouseEvents = true,
}: PageFlipperProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <HTMLFlipBook
        width={width}
        height={height}
        size={size}
        minWidth={minWidth}
        maxWidth={maxWidth}
        minHeight={minHeight}
        maxHeight={maxHeight}
        maxShadowOpacity={maxShadowOpacity}
        drawShadow={drawShadow}
        flippingTime={flippingTime}
        useMouseEvents={useMouseEvents}
        showCover={showCover}
        mobileScrollSupport={mobileScrollSupport}
        className=""
        style={{}}
        startPage={0}
        usePortrait={usePortrait}
        clickEventForward={true}
        startZIndex={startZIndex}
        autoSize={autoSize}
        swipeDistance={swipeDistance}
        showPageCorners={showPageCorners}
        disableFlipByClick={disableFlipByClick}>
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
                  background: "rgba(255, 255, 255, 0.8)",
                  padding: "2px 6px",
                  borderRadius: "4px",
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
