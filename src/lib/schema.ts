import { sql } from './db';

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_singleton (
      id INT PRIMARY KEY DEFAULT 1,
      brand TEXT NOT NULL DEFAULT 'M.',
      photo_url TEXT NOT NULL DEFAULT '/profile.png',
      hero JSONB NOT NULL,
      about JSONB NOT NULL,
      stats JSONB NOT NULL,
      social JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT singleton_pk CHECK (id = 1)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skill_categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      skills JSONB NOT NULL DEFAULT '[]'::jsonb,
      position INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      link TEXT NOT NULL DEFAULT '',
      source TEXT,
      highlight BOOLEAN NOT NULL DEFAULT FALSE,
      year TEXT,
      role TEXT,
      position INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      org TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT NOT NULL,
      position INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS education (
      id TEXT PRIMARY KEY,
      degree TEXT NOT NULL,
      school TEXT NOT NULL,
      period TEXT NOT NULL,
      detail TEXT,
      position INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      icon TEXT,
      position INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date TEXT,
      credential_id TEXT,
      image_url TEXT NOT NULL,
      link TEXT,
      position INT NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      body TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}
