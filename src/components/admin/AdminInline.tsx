'use client';

import type { Portfolio } from '@/lib/types';
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
import { AdminProvider, useRequireAdmin } from './inline/AdminContext';
import { EditableSection } from './inline/EditableSection';
import { AddItemButton } from './inline/AddItemButton';
import { EditDrawer } from './inline/EditDrawer';
import { AdminBar, AdminToast } from './inline/AdminBar';

/**
 * Admin overlay root. Renders the same public components a visitor sees, but
 * each section is wrapped in <EditableSection> so the admin can hover and click
 * to edit. Lists also get a "+ Add" button below them.
 */
export function AdminInline({
  initial,
  email,
}: {
  initial: Portfolio;
  email: string;
}) {
  return (
    <AdminProvider initial={initial} email={email}>
      <AdminBar />
      <AdminCanvas />
      <EditDrawer />
      <AdminToast />
    </AdminProvider>
  );
}

function AdminCanvas() {
  const admin = useRequireAdmin();
  const data = admin.data;

  return (
    <main className="relative overflow-hidden">
      <ScrollProgress />
      <CursorGlow />

      <Nav data={data} />

      <EditableSection slot="hero" label="Hero · photo & text">
        <Hero data={data} />
      </EditableSection>

      <TechMarquee data={data} />

      <EditableSection slot="about" label="About">
        <About data={data} />
      </EditableSection>

      <EditableSection slot="skills" label="Skills">
        <Skills data={data} />
        <AddItemButton slot="skills" label="Add Skill Category" />
      </EditableSection>

      <EditableSection slot="projects" label="Projects">
        <Projects data={data} />
        <AddItemButton slot="projects" label="Add Project" />
      </EditableSection>

      <EditableSection slot="experience" label="Journey">
        <Journey data={data} />
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 -mt-4">
            <AddItemButton slot="experience" label="Add Experience" className="!mt-2" />
            <AddItemButton slot="education" label="Add Education" className="!mt-2" />
          </div>
        </div>
      </EditableSection>

      <EditableSection slot="certificates" label="Certificates">
        <Certificates data={data} />
        <AddItemButton slot="certificates" label="Add Certificate" />
      </EditableSection>

      <EditableSection slot="achievements" label="Achievements">
        <Achievements data={data} />
        <AddItemButton slot="achievements" label="Add Achievement" />
      </EditableSection>

      <EditableSection slot="social" label="Contact & Social">
        <Contact data={data} />
      </EditableSection>

      <Footer data={data} />
    </main>
  );
}
