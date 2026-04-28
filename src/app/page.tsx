import { getPortfolio } from '@/lib/portfolio';
import { Nav } from '@/components/public/Nav';
import { Hero } from '@/components/public/Hero';
import { About } from '@/components/public/About';
import { Skills } from '@/components/public/Skills';
import { Projects } from '@/components/public/Projects';
import { Journey } from '@/components/public/Journey';
import { Achievements } from '@/components/public/Achievements';
import { Certificates } from '@/components/public/Certificates';
import { Contact } from '@/components/public/Contact';
import { Footer } from '@/components/public/Footer';
import { ScrollProgress } from '@/components/public/ScrollProgress';
import { CursorGlow } from '@/components/public/CursorGlow';
import { TechMarquee } from '@/components/public/TechMarquee';

export const revalidate = 0;

export default async function Page() {
  const data = await getPortfolio();
  return (
    <main className="relative overflow-hidden">
      <ScrollProgress />
      <CursorGlow />

      <Nav data={data} />
      <Hero data={data} />
      <TechMarquee data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Journey data={data} />
      <Certificates data={data} />
      <Achievements data={data} />
      <Contact data={data} />
      <Footer data={data} />
    </main>
  );
}
