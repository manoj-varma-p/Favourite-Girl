import generalSettingsData from "@/content/settings/general.json";
import navigationSettingsData from "@/content/settings/navigation.json";

export interface GeneralSettings {
  siteTitle: string;
  logoText: string;
  logoImage?: string;
  supportEmail: string;
  supportPhone: string;
}

export interface NavigationSettings {
  bannerBadge: string;
  bannerText: string;
  bannerLinkText: string;
  bannerLinkHref: string;
}

export const generalSettings: GeneralSettings = generalSettingsData;
export const navigationSettings: NavigationSettings = navigationSettingsData;
