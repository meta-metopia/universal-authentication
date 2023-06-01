"use client";

import React, { useEffect, useState } from "react";
import { classNames } from "./classnames";
import { useHeadsObserver } from "@/hooks/useHeadsObserver";

export default function TableOfContent() {
  const [elements, setElements] = useState<
    {
      id: string;
      text: string;
      level: number;
      link: string;
    }[]
  >([]);

  const { activeId } = useHeadsObserver();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3, h4")).map(
      (elem: any) => ({
        id: elem.id,
        text: elem.innerText,
        level: Number(elem.nodeName.charAt(1)),
        link: elem.parentElement.href.split("#")[1],
      })
    );
    setElements(elements);
  }, []);

  return (
    <ul className="space-y-2 p-4">
      {elements.map((elem) => (
        <li
          key={elem.id}
          className={classNames(
            "px-4 py-2 rounded-xl",
            activeId === elem.link ? "bg-indigo-600 text-white" : "text-black"
          )}
        >
          <a href={`#${elem.link}`}>{elem.text}</a>
        </li>
      ))}
    </ul>
  );
}
