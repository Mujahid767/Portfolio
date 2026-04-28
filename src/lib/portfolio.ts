import { sql } from './db';
import { ensureSchema } from './schema';
import { defaultPortfolio } from './defaults';
import type {
  Achievement,
  Certificate,
  Education,
  Experience,
  Portfolio,
  Project,
  SkillCategory,
} from './types';

let initPromise: Promise<void> | null = null;
async function init() {
  if (!initPromise) {
    initPromise = (async () => {
      await ensureSchema();
      await seedIfEmpty();
    })();
  }
  return initPromise;
}

async function seedIfEmpty() {
  const p = defaultPortfolio;

  const meta = (await sql`SELECT id FROM portfolio_singleton WHERE id = 1`) as any[];
  if (meta.length === 0) {
    await sql`
      INSERT INTO portfolio_singleton (id, brand, photo_url, hero, about, stats, social)
      VALUES (1, ${p.brand}, ${p.photoUrl},
              ${JSON.stringify(p.hero)}::jsonb,
              ${JSON.stringify(p.about)}::jsonb,
              ${JSON.stringify(p.stats)}::jsonb,
              ${JSON.stringify(p.social)}::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  const sc = (await sql`SELECT 1 FROM skill_categories LIMIT 1`) as any[];
  if (sc.length === 0) {
    for (const s of p.skillCategories) {
      await sql`
        INSERT INTO skill_categories (id, title, skills, position)
        VALUES (${s.id}, ${s.title}, ${JSON.stringify(s.skills)}::jsonb, ${s.position})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const pj = (await sql`SELECT 1 FROM projects LIMIT 1`) as any[];
  if (pj.length === 0) {
    for (const pr of p.projects) {
      await sql`
        INSERT INTO projects (id, title, description, tags, link, source, highlight, year, role, position)
        VALUES (${pr.id}, ${pr.title}, ${pr.description}, ${JSON.stringify(pr.tags)}::jsonb,
                ${pr.link}, ${pr.source ?? null}, ${pr.highlight ?? false},
                ${pr.year ?? null}, ${pr.role ?? null}, ${pr.position})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const ex = (await sql`SELECT 1 FROM experiences LIMIT 1`) as any[];
  if (ex.length === 0) {
    for (const e of p.experiences) {
      await sql`
        INSERT INTO experiences (id, title, org, period, description, position)
        VALUES (${e.id}, ${e.title}, ${e.org}, ${e.period}, ${e.description}, ${e.position})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const ed = (await sql`SELECT 1 FROM education LIMIT 1`) as any[];
  if (ed.length === 0) {
    for (const e of p.education) {
      await sql`
        INSERT INTO education (id, degree, school, period, detail, position)
        VALUES (${e.id}, ${e.degree}, ${e.school}, ${e.period}, ${e.detail ?? null}, ${e.position})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const ach = (await sql`SELECT 1 FROM achievements LIMIT 1`) as any[];
  if (ach.length === 0) {
    for (const a of p.achievements) {
      await sql`
        INSERT INTO achievements (id, title, detail, icon, position)
        VALUES (${a.id}, ${a.title}, ${a.detail}, ${a.icon ?? null}, ${a.position})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  const cert = (await sql`SELECT 1 FROM certificates LIMIT 1`) as any[];
  if (cert.length === 0) {
    for (const c of p.certificates) {
      await sql`
        INSERT INTO certificates (id, title, issuer, date, credential_id, image_url, link, position)
        VALUES (${c.id}, ${c.title}, ${c.issuer}, ${c.date ?? null}, ${c.credentialId ?? null},
                ${c.imageUrl}, ${c.link ?? null}, ${c.position})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }
}

export async function getPortfolio(): Promise<Portfolio> {
  await init();
  const [meta] = (await sql`SELECT * FROM portfolio_singleton WHERE id = 1`) as any[];
  const skills = (await sql`SELECT * FROM skill_categories ORDER BY position ASC`) as any[];
  const projects = (await sql`SELECT * FROM projects ORDER BY position ASC`) as any[];
  const experiences = (await sql`SELECT * FROM experiences ORDER BY position ASC`) as any[];
  const education = (await sql`SELECT * FROM education ORDER BY position ASC`) as any[];
  const achievements = (await sql`SELECT * FROM achievements ORDER BY position ASC`) as any[];
  const certificates = (await sql`SELECT * FROM certificates ORDER BY position ASC`) as any[];

  return {
    brand: meta.brand,
    photoUrl: meta.photo_url,
    hero: meta.hero,
    about: meta.about,
    stats: meta.stats,
    social: meta.social,
    skillCategories: skills.map((r) => ({
      id: r.id,
      title: r.title,
      skills: r.skills,
      position: r.position,
    })) as SkillCategory[],
    projects: projects.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      tags: r.tags,
      link: r.link,
      source: r.source ?? undefined,
      highlight: r.highlight,
      year: r.year ?? undefined,
      role: r.role ?? undefined,
      position: r.position,
    })) as Project[],
    experiences: experiences.map((r) => ({
      id: r.id,
      title: r.title,
      org: r.org,
      period: r.period,
      description: r.description,
      position: r.position,
    })) as Experience[],
    education: education.map((r) => ({
      id: r.id,
      degree: r.degree,
      school: r.school,
      period: r.period,
      detail: r.detail ?? undefined,
      position: r.position,
    })) as Education[],
    achievements: achievements.map((r) => ({
      id: r.id,
      title: r.title,
      detail: r.detail,
      icon: r.icon ?? undefined,
      position: r.position,
    })) as Achievement[],
    certificates: certificates.map((r) => ({
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      date: r.date ?? undefined,
      credentialId: r.credential_id ?? undefined,
      imageUrl: r.image_url,
      link: r.link ?? undefined,
      position: r.position,
    })) as Certificate[],
  };
}

export async function updateMeta(patch: Partial<Pick<Portfolio, 'brand' | 'photoUrl' | 'hero' | 'about' | 'stats' | 'social'>>) {
  await init();
  const current = await getPortfolio();
  const next = {
    brand: patch.brand ?? current.brand,
    photoUrl: patch.photoUrl ?? current.photoUrl,
    hero: patch.hero ?? current.hero,
    about: patch.about ?? current.about,
    stats: patch.stats ?? current.stats,
    social: patch.social ?? current.social,
  };
  await sql`
    UPDATE portfolio_singleton
    SET brand = ${next.brand},
        photo_url = ${next.photoUrl},
        hero = ${JSON.stringify(next.hero)}::jsonb,
        about = ${JSON.stringify(next.about)}::jsonb,
        stats = ${JSON.stringify(next.stats)}::jsonb,
        social = ${JSON.stringify(next.social)}::jsonb,
        updated_at = NOW()
    WHERE id = 1;
  `;
}

export async function upsertSkillCategory(s: SkillCategory) {
  await init();
  await sql`
    INSERT INTO skill_categories (id, title, skills, position)
    VALUES (${s.id}, ${s.title}, ${JSON.stringify(s.skills)}::jsonb, ${s.position})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      skills = EXCLUDED.skills,
      position = EXCLUDED.position;
  `;
}
export async function deleteSkillCategory(id: string) {
  await init();
  await sql`DELETE FROM skill_categories WHERE id = ${id}`;
}

export async function upsertProject(p: Project) {
  await init();
  await sql`
    INSERT INTO projects (id, title, description, tags, link, source, highlight, year, role, position)
    VALUES (${p.id}, ${p.title}, ${p.description}, ${JSON.stringify(p.tags)}::jsonb,
            ${p.link}, ${p.source ?? null}, ${p.highlight ?? false},
            ${p.year ?? null}, ${p.role ?? null}, ${p.position})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      tags = EXCLUDED.tags,
      link = EXCLUDED.link,
      source = EXCLUDED.source,
      highlight = EXCLUDED.highlight,
      year = EXCLUDED.year,
      role = EXCLUDED.role,
      position = EXCLUDED.position;
  `;
}
export async function deleteProject(id: string) {
  await init();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}

export async function upsertExperience(e: Experience) {
  await init();
  await sql`
    INSERT INTO experiences (id, title, org, period, description, position)
    VALUES (${e.id}, ${e.title}, ${e.org}, ${e.period}, ${e.description}, ${e.position})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      org = EXCLUDED.org,
      period = EXCLUDED.period,
      description = EXCLUDED.description,
      position = EXCLUDED.position;
  `;
}
export async function deleteExperience(id: string) {
  await init();
  await sql`DELETE FROM experiences WHERE id = ${id}`;
}

export async function upsertEducation(e: Education) {
  await init();
  await sql`
    INSERT INTO education (id, degree, school, period, detail, position)
    VALUES (${e.id}, ${e.degree}, ${e.school}, ${e.period}, ${e.detail ?? null}, ${e.position})
    ON CONFLICT (id) DO UPDATE SET
      degree = EXCLUDED.degree,
      school = EXCLUDED.school,
      period = EXCLUDED.period,
      detail = EXCLUDED.detail,
      position = EXCLUDED.position;
  `;
}
export async function deleteEducation(id: string) {
  await init();
  await sql`DELETE FROM education WHERE id = ${id}`;
}

export async function upsertAchievement(a: Achievement) {
  await init();
  await sql`
    INSERT INTO achievements (id, title, detail, icon, position)
    VALUES (${a.id}, ${a.title}, ${a.detail}, ${a.icon ?? null}, ${a.position})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      detail = EXCLUDED.detail,
      icon = EXCLUDED.icon,
      position = EXCLUDED.position;
  `;
}
export async function deleteAchievement(id: string) {
  await init();
  await sql`DELETE FROM achievements WHERE id = ${id}`;
}

export async function upsertCertificate(c: Certificate) {
  await init();
  await sql`
    INSERT INTO certificates (id, title, issuer, date, credential_id, image_url, link, position)
    VALUES (${c.id}, ${c.title}, ${c.issuer}, ${c.date ?? null}, ${c.credentialId ?? null},
            ${c.imageUrl}, ${c.link ?? null}, ${c.position})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      issuer = EXCLUDED.issuer,
      date = EXCLUDED.date,
      credential_id = EXCLUDED.credential_id,
      image_url = EXCLUDED.image_url,
      link = EXCLUDED.link,
      position = EXCLUDED.position;
  `;
}
export async function deleteCertificate(id: string) {
  await init();
  await sql`DELETE FROM certificates WHERE id = ${id}`;
}

export async function saveMessage(m: { name: string; email: string; subject?: string; body: string }) {
  await init();
  await sql`
    INSERT INTO messages (name, email, subject, body)
    VALUES (${m.name}, ${m.email}, ${m.subject ?? null}, ${m.body});
  `;
}

export async function listMessages() {
  await init();
  return (await sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 200`) as any[];
}

export async function deleteMessage(id: number) {
  await init();
  await sql`DELETE FROM messages WHERE id = ${id}`;
}
