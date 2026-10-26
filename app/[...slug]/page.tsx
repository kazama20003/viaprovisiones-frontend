import { Suspense } from "react";
import { notFound } from "next/navigation";
import NativeView from "../native-view";
import { viewForPath } from "../view-map";

type Props = { params: Promise<{ slug: string[] }> };

async function RoutedView({ params }: Props) {
  const { slug } = await params;
  const view = viewForPath(`/${slug.join("/")}`);
  if (!view) notFound();
  return <NativeView name={view.name} />;
}

export default function RoutedDesignPage({ params }: Props) {
  return <Suspense fallback={<main className="design-frame-shell" aria-busy="true" />}>
    <RoutedView params={params} />
  </Suspense>;
}
