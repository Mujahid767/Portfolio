import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getPortfolio } from '@/lib/portfolio';
import { AdminInline } from '@/components/admin/AdminInline';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const s = await getAdminSession();
  if (!s) redirect('/admin/login');
  const data = await getPortfolio();
  return <AdminInline initial={data} email={s.email as string} />;
}
