import { Center, Spinner } from '@chakra-ui/react';
import FooterNav from 'components/FooterNav';
import { Toaster } from 'components/ui/toaster';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div>
      <main>
        <Suspense
          fallback={
            <Center h="100vh">
              <Spinner size="xl" />
            </Center>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <FooterNav />
      <Toaster />
    </div>
  );
}
