import { CloseButton, Dialog, QrCode, Stack, Text } from '@chakra-ui/react';

type ShareQrDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  title?: string;
  description?: string;
};

export default function ShareQrDialog(props: ShareQrDialogProps) {
  const { open, onOpenChange, value, title, description } = props;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      unmountOnExit
      placement="center"
      size={{ smDown: 'full', md: 'xl' }}
      motionPreset="slide-in-bottom"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          m={{ base: 0, md: 6 }}
          minH={{ base: '100dvh', md: 'auto' }}
          maxH={{ md: 'calc(100dvh - 3rem)' }}
        >
          <Dialog.Header>
            <Dialog.Title>{title ?? 'Share QR Code'}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
            py={8}
          >
            <QrCode.Root value={value}>
              <QrCode.Frame
                bg="white"
                p={4}
                borderRadius="xl"
                boxSize={{ base: '320px' }}
              >
                <QrCode.Pattern color="black" />
              </QrCode.Frame>
            </QrCode.Root>
            <Stack gap={1} align="center">
              <Text fontWeight="medium">
                {description ?? 'Scan to open this link'}
              </Text>
              <Text fontSize="sm" color="fg.muted" textAlign="center">
                {value}
              </Text>
            </Stack>
          </Dialog.Body>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="md" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
