import { Suspense } from "react";
import { notFound } from "next/navigation";
import ViewFrame from "../../view-frame";
import { viewForPath } from "../../view-map";

type Props = { params: Promise<{ section: string[] }> };

async function DashboardSection({ params }: Props) {
  const { section } = await params;
  const view = viewForPath(`/dashboard/${section.join("/")}`);
  if (!view) notFound();
  return <ViewFrame file={view.file} />;
}

export default function DashboardSectionPage({ params }: Props) {
  return <Suspense fallback={<main className="design-frame-shell" aria-busy="true" />}>
    <DashboardSection params={params} />
  </Suspense>;
}
