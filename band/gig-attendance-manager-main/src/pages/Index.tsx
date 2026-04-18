import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/landing/Hero';
import { About } from '@/components/landing/About';
import { Members } from '@/components/landing/Members';
import { Gallery } from '@/components/landing/Gallery';
import { Schedule } from '@/components/landing/Schedule';
import { Contact } from '@/components/landing/Contact';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Members />
        <Gallery />
        <Schedule />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
