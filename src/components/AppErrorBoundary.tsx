import { Box, Button, Text } from '@chakra-ui/react';
import { useRouteError } from 'react-router-dom';

const isChunkLoadError = (message: string) => {
  return (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('not a valid JavaScript MIME type')
  );
};

if (!(window as any).__chunk_error_listener__) {
  (window as any).__chunk_error_listener__ = true;

  window.addEventListener('error', (event) => {
    const message = event.message || '';

    if (isChunkLoadError(message)) {
      if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        window.location.reload();
      }
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const message = String(event.reason?.message || event.reason || '');

    if (isChunkLoadError(message)) {
      if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        window.location.reload();
      }
    }
  });
}

// --- UI fallback ---
export const AppErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Box
      minH="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <Box maxW="sm" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          App updated
        </Text>

        <Text mt={3} color="gray.400">
          This tab was open during a new deployment. Refresh to load the latest
          version.
        </Text>

        <Button
          mt={5}
          colorPalette="cyan"
          onClick={() => window.location.reload()}
        >
          Refresh app
        </Button>
      </Box>
    </Box>
  );
};
