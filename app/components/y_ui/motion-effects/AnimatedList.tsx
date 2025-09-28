import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../base/utils";
import "./AnimatedList.css";

interface AnimatedListProps {
  items: React.ReactNode[];
  onItemSelect?: (index: number) => void;
  selectedIndex?: number;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  displayScrollbar?: boolean;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  selectedIndex,
  showGradients = true,
  enableArrowNavigation = false,
  className,
  displayScrollbar = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex ?? (items.length ? 0 : -1));
  const [topOpacity, setTopOpacity] = useState(0);
  const [bottomOpacity, setBottomOpacity] = useState(0);

  useEffect(() => {
    if (typeof selectedIndex === "number") {
      setActiveIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setTopOpacity(Math.min(scrollTop / 40, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 40, 1));
  };

  useEffect(() => {
    handleScroll();
  }, [items.length]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onItemSelect?.(index);
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleSelect(Math.min(activeIndex + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleSelect(Math.max(activeIndex - 1, 0));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0) {
          onItemSelect?.(activeIndex);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, enableArrowNavigation, items.length, onItemSelect]);

  const content = useMemo(
    () =>
      items.map((item, index) => (
        <div
          key={index}
          data-index={index}
          className={cn(
            "animated-list-item",
            activeIndex === index && "animated-list-item--active",
          )}
          style={{ animationDelay: `${index * 0.05}s` }}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => handleSelect(index)}
        >
          {item}
        </div>
      )),
    [items, activeIndex],
  );

  return (
    <div className={cn("animated-list-container", className)}>
      <div
        ref={containerRef}
        className={cn("animated-list-scroll", !displayScrollbar && "no-scrollbar")}
        onScroll={handleScroll}
      >
        {content}
      </div>
      {showGradients && (
        <>
          <div className="animated-list-gradient animated-list-gradient--top" style={{ opacity: topOpacity }} />
          <div className="animated-list-gradient animated-list-gradient--bottom" style={{ opacity: bottomOpacity }} />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
