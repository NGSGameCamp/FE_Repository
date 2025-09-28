import React, { useEffect, useMemo, useRef, useState } from "react";
import "./SplitText.css";

type SplitKind = "chars" | "words";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // ms between units
  duration?: number; // s
  splitType?: SplitKind;
  threshold?: number; // 0..1
  rootMargin?: string;
  fromY?: number; // px
  fromOpacity?: number; // 0..1
  tag?: keyof JSX.IntrinsicElements; // defaults to p
  textAlign?: React.CSSProperties["textAlign"];
}

export default function SplitText({
  text,
  className = "",
  delay = 60,
  duration = 0.6,
  splitType = "chars",
  threshold = 0.1,
  rootMargin = "-100px",
  fromY = 40,
  fromOpacity = 0,
  tag = "p",
  textAlign = "center",
}: SplitTextProps) {
  const parentRef = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, text]);

  const units = useMemo(() => {
    if (splitType === "words") {
      // Keep spaces as separate units so spacing remains
      const parts: string[] = [];
      text.split(/(\s+)/).forEach((p) => parts.push(p));
      return parts;
    }
    return Array.from(text);
  }, [text, splitType]);

  const styleParent: React.CSSProperties = {
    textAlign,
    // custom props for CSS
    ["--from-y" as any]: `${fromY}px`,
    ["--from-o" as any]: fromOpacity,
  };

  const Tag: any = tag || "p";

  return (
    <Tag
      ref={parentRef as any}
      style={styleParent}
      className={`split-parent ${className}`}
      data-animate={animate}
    >
      {units.map((u, i) => (
        <span
          key={i}
          className="split-unit"
          style={{ transitionDuration: `${duration}s`, transitionDelay: `${(i * delay) / 1000}s` }}
        >
          {u === " " ? "\u00A0" : u}
        </span>
      ))}
    </Tag>
  );
}

