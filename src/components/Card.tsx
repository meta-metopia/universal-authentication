import React from "react";

interface Props {
  children?: React.ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-slate-50 shadow">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
