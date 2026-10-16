import { useEffect, useRef } from "react";

/**
 * First-view reveal: when the element comes into view, it and every `.lab-reveal` inside
 * it get `data-shown`, which fades and lifts them in (brand.css). Under reduced motion
 * the CSS shows them at once without a transition.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;

    if (!root) return;
    const show = () => {
      root.setAttribute("data-shown", "");
      root
        .querySelectorAll(".lab-reveal")
        .forEach((el) => el.setAttribute("data-shown", ""));
    };

    if (typeof IntersectionObserver === "undefined") {
      show();

      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        show();
      },
      { threshold: 0.25 },
    );

    io.observe(root);

    return () => io.disconnect();
  }, []);

  return ref;
}

export function useReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
