import type { ReactNode } from "react";
import { notFound } from "next/navigation";

const parseRouteGroupId = (id: string): number | null => {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const numericGroupId = Number(id);
  return Number.isSafeInteger(numericGroupId) && numericGroupId > 0
    ? numericGroupId
    : null;
};

interface GroupEditLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function GroupEditLayout({
  children,
  params,
}: GroupEditLayoutProps) {
  const { id } = await params;
  const numericGroupId = parseRouteGroupId(id);

  if (numericGroupId === null) {
    notFound();
  }

  return <>{children}</>;
}
