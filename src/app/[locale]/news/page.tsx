import {
  ComingSoon,
  comingSoonMetadata,
} from "@/components/sections/ComingSoon";

export function generateMetadata() {
  return comingSoonMetadata("news");
}

export default function NewsPage() {
  return <ComingSoon kind="news" tone="mint" />;
}
