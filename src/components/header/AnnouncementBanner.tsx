import Link from "next/link";
import { getNavigationSettingsFromDb } from "@/lib/content-db";
import { announcementBannerData } from "@/data/navigation";

export default async function AnnouncementBanner() {
  const navSettings = await getNavigationSettingsFromDb();
  const badge = navSettings.bannerBadge || announcementBannerData.badge;
  const text = navSettings.bannerText || announcementBannerData.text;
  const linkText = navSettings.bannerLinkText || announcementBannerData.linkText;
  const linkHref = navSettings.bannerLinkHref || announcementBannerData.linkHref;

  return (
    <div className="hidden sm:block w-full bg-[#0B0B0F] border-b border-[#5A2A5A]/30 py-2 px-4 text-center text-xs sm:text-sm text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="inline-flex items-center rounded-md bg-[#3B0D3B] border border-[#8C6A8C]/40 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#FAF5EE] shadow-2xs">
          {badge}
        </span>
        <span className="font-medium text-white/90">
          {text}
        </span>
        <Link
          href={linkHref}
          className="font-bold text-[#FAF5EE] underline decoration-[#8C6A8C]/60 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
