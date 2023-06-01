import React, { useMemo } from "react";
import { classNames } from "./classnames";

interface Props {
  title: string;
  className?: string;
  level?: number;
}

export default function Headline({ title, className, level }: Props) {
  const link = title.toLowerCase().replace(/ /g, "-");

  const children = useMemo(() => {
    switch (level) {
      case 1:
        return (
          <h1 className={className} id={link}>
            {title}
          </h1>
        );
      case 2:
        return (
          <h2 className={className} id={link}>
            {title}
          </h2>
        );
      case 3:
        return (
          <h3 className={className} id={link}>
            {title}
          </h3>
        );
      case 4:
        return (
          <h4 className={className} id={link}>
            {title}
          </h4>
        );
      case 5:
        return (
          <h5 className={className} id={link}>
            {title}
          </h5>
        );
      case 6:
        return (
          <h6 className={className} id={link}>
            {title}
          </h6>
        );
      default:
        return (
          <h1 className={className} id={link}>
            {title}
          </h1>
        );
    }
  }, []);

  return (
    <HeadlineLink link={`#${link}`} className={className}>
      {children}
    </HeadlineLink>
  );
}

function HeadlineLink({
  children,
  link,
  className,
}: {
  children: any;
  link: string;
  className?: string;
}) {
  return (
    <a
      id={link}
      href={link}
      className={classNames("no-underline hover:underline", className || "")}
    >
      {children}
    </a>
  );
}
