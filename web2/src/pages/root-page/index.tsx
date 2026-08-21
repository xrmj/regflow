import { useAuth } from '@/hooks/auth-hooks';
import { RootLayoutContainer } from '@/layouts/root-layout';
import Home from '@/pages/home';
import Landing from '@/pages/landing';

export default function RootPage() {
  const { isLogin } = useAuth();

  if (isLogin === null) return null;
  if (isLogin === false) return <Landing />;

  return (
    <RootLayoutContainer>
      <Home />
    </RootLayoutContainer>
  );
}
