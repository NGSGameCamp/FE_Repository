import React, { ReactNode, useEffect, useRef } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number; // seconds
  ease?: string; // CSS easing
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number; // 0..1
  delay?: number; // seconds
  onComplete?: () => void;
}

export default function AnimatedContent({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "cubic-bezier(0.22, 1, 0.36, 1)", // easeOut
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === "horizontal" ? "X" : "Y";
    const offset = (reverse ? -1 : 1) * distance;

    // Set initial state
    el.style.willChange = "transform, opacity";
    el.style.transform = `translate${axis}(${offset}px) scale(${scale})`;
    if (animateOpacity) el.style.opacity = String(initialOpacity);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animation via CSS transition
            el.style.transition = `transform ${duration}s ${ease} ${delay}s, opacity ${duration}s ${ease} ${delay}s`;
            el.style.transform = `translate${axis}(0px) scale(1)`;
            if (animateOpacity) el.style.opacity = "1";
            // Fire once
            io.unobserve(el);
            if (onComplete) onComplete();
          }
        });
      },
      { threshold: Math.max(0, Math.min(1, threshold)) },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, threshold, delay, onComplete]);

  return <div ref={ref}>{children}</div>;
}

