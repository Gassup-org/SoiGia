import type { PropsWithChildren } from "react";

export function SectionCard({
  title,
  children
}: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
