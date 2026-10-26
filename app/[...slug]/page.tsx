import { Suspense } from "react";
import { notFound } from "next/navigation";
import ViewFrame from "../view-frame";
import { viewForPath } from "../view-map";

type Props = { params: Promise<{ slug: string[] }> };

async function RoutedView({ params }: Props) {
  const { slug } = await params;
  const view = viewForPath(`/${slug.join("/")}`);
  if (!view) notFound();
  return <ViewFrame file={view.file} />;
}

export default function RoutedDesignPage({ params }: Props) {
  return <Suspense fallback={<main className="design-frame-shell" aria-busy="true" />}>
    <RoutedView params={params} />
  </Suspense>;
}
