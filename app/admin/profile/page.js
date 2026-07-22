import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileSettings from './ProfileSettings';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (adminSession !== 'active') {
    redirect('/admin/login');
  }

  return <ProfileSettings />;
}
