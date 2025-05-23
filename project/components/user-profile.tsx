import useSWR from 'swr';

export default function UserProfile({ userId }: { userId: number }) {
  const { data: user, error } = useSWR(`/api/users/${userId}`, (url) => fetch(url).then(res => res.json()));
  const isLoading = !user && !error;

  if (isLoading) return <div>Kullanıcı yükleniyor...</div>;
  if (error || !user) return <div>Kullanıcı bulunamadı.</div>;

  return (
    <div className="border rounded-lg p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-2">Profil</h2>
      <div className="mb-2"><b>Ad:</b> {user.name}</div>
      <div className="mb-2"><b>Email:</b> {user.email}</div>
      <div className="text-muted-foreground text-sm">Kullanıcı ID: {user.id}</div>
    </div>
  );
} 