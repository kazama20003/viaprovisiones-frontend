"use client";

import { useEffect } from "react";

type LenisInstance = { destroy: () => void };
type LenisConstructor = new (options: {
  autoRaf: boolean;
  anchors: boolean;
  allowNestedScroll: boolean;
  stopInertiaOnNavigate: boolean;
  wrapper?: HTMLElement;
  content?: HTMLElement;
}) => LenisInstance;

declare global {
  interface Window { Lenis?: LenisConstructor; }
}

export default function LenisScroll() {
  useEffect(() => {
    let instance: LenisInstance | undefined;
    let disposed = false;
    const start = () => {
      if (!disposed && window.Lenis && !instance) {
        instance = new window.Lenis({ autoRaf: true, anchors: true, allowNestedScroll: true, stopInertiaOnNavigate: true });
        window.dispatchEvent(new Event("via-lenis-ready"));
      }
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-lenis-loader]");
    if (window.Lenis) start();
    else if (existing) existing.addEventListener("load", start, { once: true });
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/lenis@1.3.27/dist/lenis.min.js";
      script.dataset.lenisLoader = "true";
      script.onload = start;
      document.head.appendChild(script);
    }
    return () => { disposed = true; instance?.destroy(); };
  }, []);
  return null;
}

