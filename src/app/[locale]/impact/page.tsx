import {
  ComingSoon,
  comingSoonMetadata,
} from "@/components/sections/ComingSoon";

export function generateMetadata() {
  return comingSoonMetadata("impact");
}

export default function ImpactPage() {
  return <ComingSoon kind="impact" tone="violet" />;
}
