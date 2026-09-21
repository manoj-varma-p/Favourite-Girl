import AnnouncementBanner from "@/components/header/AnnouncementBanner";
import MobileHeader from "@/components/header/MobileHeader";
import Logo from "@/components/header/Logo";
import Container from "@/components/ui/Container";
import Hero from "@/components/home/Hero";
import KeywordsTicker from "@/components/home/KeywordsTicker";
import LearningSystem from "@/components/home/LearningSystem";
import WhyTreqqo from "@/components/home/WhyTreqqo";
import ExecutionProof from "@/components/home/ExecutionProof";
import TaughtBy from "@/components/home/TaughtBy";
import Certifications from "@/components/home/Certifications";
import SixDecisions from "@/components/home/SixDecisions";
import GovCertSection from "@/components/home/GovCertSection";
import FaqSection from "@/components/home/FaqSection";
import FinalCta from "@/components/home/FinalCta";
import Footer from "@/components/footer/Footer";
import InstagramVideoPopup from "@/components/common/InstagramVideoPopup";
import { getHomePageContent, getGeneralSettings, getTutors, getCourses } from "@/lib/cms";
import { getPageSeoByPath } from "@/lib/content-db";
import type { Metadata } from "next";

const DEFAULT_HOME_KEYWORDS = [
  "digital marketing course near me",
  "digital marketing courses in Hyderabad",
  "Online marketing classes",
  "Best Digital marketing course in Hyderabad",
  "Digital marketing course fee",
  "online digital marketing course with certificate",
  "learn digital marketing online",
  "new age digital marketing course",
  "performance marketing course",
  "digital marketing course with placement",
];

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/");
  return {
    ...(pageSeo?.title ? { title: pageSeo.title } : {}),
    ...(pageSeo?.metaDescription ? { description: pageSeo.metaDescription } : {}),
    keywords:
      pageSeo?.metaKeywords && pageSeo.metaKeywords.length > 0
        ? pageSeo.metaKeywords
        : DEFAULT_HOME_KEYWORDS,
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [homeContent, generalSettings, tutors, courses] = await Promise.all([
    getHomePageContent(),
    getGeneralSettings(),
    getTutors(),
    getCourses(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFAF6] text-[#1A0A1A]">
      {/* Top Announcement Banner */}
      <AnnouncementBanner />

      {/* Mobile Top Header (Sticky on mobile) */}
      <div className="lg:hidden sticky top-0 inset-x-0 z-50 bg-[#FDFAF6]/95 backdrop-blur-md border-b border-[#F5EDE0] shadow-xs text-[#1A0A1A]">
        <Container>
          <MobileHeader variant="standard" theme="light" />
        </Container>
      </div>

      <main className="flex-1">
        <Hero />
        <KeywordsTicker />
        <LearningSystem initialPrograms={courses} />
        <GovCertSection content={homeContent.govCerts} />
        <WhyTreqqo content={homeContent.whyTreqqo} />
        <ExecutionProof content={homeContent.executionProof} />
        <TaughtBy tutors={tutors} sectionContent={homeContent.mentors} />
        <Certifications />
        <SixDecisions content={homeContent.sixDecisions} />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer settings={generalSettings} />
      <InstagramVideoPopup />
    </div>
  );
}
