import { useRef, useState, useEffect } from "react";

export function useHeadsObserver() {
  const observer = useRef();
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleObsever = (entries: any[]) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    (observer as any).current = new IntersectionObserver(handleObsever, {
      rootMargin: "-20% 0% -35% 0px",
    });

    // @ts-ignore
    const elements = document.querySelectorAll("h2, h3", "h4");
    elements.forEach((elem) => (observer as any).current.observe(elem));
    return () => (observer.current as any)?.disconnect();
  }, []);

  return { activeId };
}
