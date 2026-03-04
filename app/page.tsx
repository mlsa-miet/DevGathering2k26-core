import DevGathering from "@/components/devgathering";
import EventTimeline from '../components/eventplanner';
import LeadOrganizers from '../components/leadorganizer';
import GetInTouch from '../components/get-in-touch';
import PastEvents from '@/components/PastEvents';
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

export default function Home() {
  return (
    <>
      <IntroOverlay>
      <main className="relative z-10">
        <HeroSection /> 
        <AboutSection />
        <DevGathering />
        <ThemesSection/>
        <PrizePoolSection/>
        <EventTimelineDetails/>
        <EventTimeline />
        <LeadOrganizers />
        <OrganisersSection/> 
        <PastEventsSection/>
        <PastEvents />
        <Sponsors />
        <FAQ />
        <GetInTouch />
      </main>
      </IntroOverlay>
    </>
  );
}



