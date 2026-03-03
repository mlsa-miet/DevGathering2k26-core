import DevGathering from "@/components/devgathering";
import EventTimeline from '../components/eventplanner';
import LeadOrganizers from '../components/leadorganizer';
import GetInTouch from '../components/get-in-touch';
import PastEvents from '@/components/PastEvents';
import FAQ from '@/components/FAQ';
import Sponsors from "@/components/Sponsors";
import IntroOverlay from "../components/IntroOverlay";
import OrganisersSection from "@/components/Organisers";

export default function Home() {
  return (
    <>
      <IntroOverlay>
      <main className="relative z-10"> 
        <DevGathering />
        <EventTimeline />
        <LeadOrganizers />
        <OrganisersSection/> 
        <PastEvents />
        <Sponsors />
        <FAQ />
        <GetInTouch />
      </main>
      </IntroOverlay>
    </>
  );
}



