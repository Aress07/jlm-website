/**
 * Placeholder photography (Wikimedia Commons) — none of it shows JLM
 * activities. TODO(board): replace with real JLM photos once consent forms
 * exist (docs/OPEN_QUESTIONS.md #7). Keep public/images/site/CREDITS.md in
 * sync with this file.
 */
export type SiteImageKey =
  "hero" | "solidarity" | "environment" | "entrepreneurship";

export type SiteImage = {
  src: string;
  author: string;
  license: "CC BY-SA 4.0" | "CC0";
  licenseUrl: string;
  sourceUrl: string;
};

const CC_BY_SA = "https://creativecommons.org/licenses/by-sa/4.0/";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";
const COMMONS = "https://commons.wikimedia.org/wiki/File:";

export const siteImages: Record<SiteImageKey, SiteImage> = {
  hero: {
    src: "/images/site/hero-casablanca.jpg",
    author: "SpreeTom",
    license: "CC BY-SA 4.0",
    licenseUrl: CC_BY_SA,
    sourceUrl: `${COMMONS}Sunrise_in_Casablanca_with_Hassan_II_Mosque.jpg`,
  },
  solidarity: {
    src: "/images/site/haouz-atlas.jpg",
    author: "Timothy A. Gonsalves",
    license: "CC BY-SA 4.0",
    licenseUrl: CC_BY_SA,
    sourceUrl: `${COMMONS}Arhbalou_High_Atlas_Al_Haouz_Morocco_Oct25_A7CR_08381.jpg`,
  },
  environment: {
    src: "/images/site/imlil.jpg",
    author: "Mounir Neddi",
    license: "CC BY-SA 4.0",
    licenseUrl: CC_BY_SA,
    sourceUrl: `${COMMONS}Imlil_village,_High_Atlas_Mountains.jpg`,
  },
  entrepreneurship: {
    src: "/images/site/craft-ceramics.jpg",
    author: "AdilElouarti",
    license: "CC0",
    licenseUrl: CC0,
    sourceUrl: `${COMMONS}Intricately_decorated_Moroccan_ceramics_and_Zellige_pottery_in_Fes_Medina.jpg`,
  },
};

export const poleImageKey: Record<string, SiteImageKey> = {
  solidarity: "solidarity",
  environment: "environment",
  "social-entrepreneurship": "entrepreneurship",
};

export const poleTint: Record<string, string> = {
  solidarity: "bg-tint-pink",
  environment: "bg-tint-mint",
  "social-entrepreneurship": "bg-tint-violet",
};
