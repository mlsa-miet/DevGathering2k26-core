import GetInTouch from '../components/get-in-touch';
import FAQ from '@/components/FAQ';
import Sponsors from "@/components/Sponsors";
import IntroOverlay from "../components/IntroOverlay";
import OrganisersSection from "@/components/Organisers";
import HeroSection from "@/components/Hero";
import AboutSection from "@/components/About";
import PastEventsSection from "@/components/PastEventsSection";
import EventTimelineDetails from "@/components/EventsTimeline";
import ThemesSection from "@/components/ThemeSection";
import PrizePoolSection from "@/components/PrizePool";
import BackgroundCanvas from '@/components/BackgroundCanvas';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
    <BackgroundCanvas />
    <div className='bg-white'>
      <IntroOverlay>
      <main className="relative z-10">
        <Header/>
        <HeroSection /> 
        <AboutSection />
        <ThemesSection/>
        <PrizePoolSection/>
        <EventTimelineDetails/>
        <OrganisersSection/> 
        <PastEventsSection/>
        <Sponsors />
        <FAQ />
        <GetInTouch />
      </main>
      </IntroOverlay>
      </div>
    </>
  );
}



