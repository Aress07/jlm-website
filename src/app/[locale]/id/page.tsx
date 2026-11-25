import {
  ComingSoon,
  comingSoonMetadata,
} from "@/components/sections/ComingSoon";

export function generateMetadata() {
  return comingSoonMetadata("id");
}

export default function IdPage() {
  return <ComingSoon kind="id" tone="pink" />;
}
