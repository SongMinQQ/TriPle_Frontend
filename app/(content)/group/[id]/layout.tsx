import React from "react";
import { notFound } from "next/navigation";
import { GroupSidebar } from "@/widgets/group/layout/group-sidebar";

const parseRouteGroupId = (id: string): number | null => {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const numericGroupId = Number(id);
  return Number.isSafeInteger(numericGroupId) && numericGroupId > 0
    ? numericGroupId
    : null;
};

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericGroupId = parseRouteGroupId(id);

  if (numericGroupId === null) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
      <div className="hidden lg:block">
        <GroupSidebar groupId={id} />
      </div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
