import Link from "next/link";

// Keep external URLs, document anchors and downloads as ordinary browser links.
export default function DesignLink({ href, ...props }) {
  const isInternal = typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
  if (isInternal && !props.download) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}
