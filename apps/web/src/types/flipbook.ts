export interface FlipBookSettings {
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
  swipeDistance: number;
  showPageCorners: boolean;
  disableFlipByClick: boolean;
  useMouseEvents: boolean;
  __typename?: string;
}

export interface FlipBook {
  id: string;
  slug: string;
  title: string;
  description?: string;
  images: string[];
  order?: number;
  settings?: FlipBookSettings;
  createdAt?: string;
  updatedAt?: string;
}
