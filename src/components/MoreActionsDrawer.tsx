import { UseDialogContext } from '@ark-ui/react';
import {
  Button,
  CloseButton,
  Drawer,
  Icon,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import ShareQrDialog from 'components/ShareQrDialog';
import { showToast } from 'components/ui/toaster';
import { useUser } from 'context/UserContext';
import { getErrorMessage } from 'lib/errors';
import { isStatsAdmin } from 'lib/permissions';
import { refreshAllCurrentLeaderboard } from 'lib/supabaseApi';
import { useState } from 'react';
import { IoIosMore, IoMdAddCircleOutline } from 'react-icons/io';
import { IoQrCodeOutline } from 'react-icons/io5';
import { MdLeaderboard } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

type MoreActionsDrawerProps = {
  isActive: boolean;
};

const APP_SHARE_URL = 'https://myhoopstats.netlify.app/';

export default function MoreActionsDrawer(props: MoreActionsDrawerProps) {
  const { isActive } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedUser } = useUser();
  const [isSubmittingLeaderboardRefresh, setIsSubmittingLeaderboardRefresh] =
    useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const handleNavigate = (store: UseDialogContext, path: string) => {
    store.setOpen(false);
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleRefreshLeaderboard = async (store: UseDialogContext) => {
    setIsSubmittingLeaderboardRefresh(true);
    try {
      await refreshAllCurrentLeaderboard();
      showToast('Leaderboard updated', 'success');
      store.setOpen(false);
    } catch (error) {
      showToast(
        getErrorMessage(error, 'Unable to update leaderboard.'),
        'error',
      );
    } finally {
      setIsSubmittingLeaderboardRefresh(false);
    }
  };

  const handleOpenQrDialog = (store: UseDialogContext) => {
    store.setOpen(false);
    setIsQrDialogOpen(true);
  };

  return (
    <>
      <Drawer.Root unmountOnExit placement="bottom">
        <Drawer.Trigger asChild>
          <button
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label="Open more actions"
          >
            <Icon size="md">
              <IoIosMore />
            </Icon>
            <Text className="label" fontSize="smaller">
              More
            </Text>
          </button>
        </Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content p={0}>
            <Drawer.Header>
              <Drawer.Title>More</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body p={1}>
              <Drawer.Context>
                {(store: UseDialogContext) => (
                  <Stack gap={1}>
                    <Button
                      variant="plain"
                      color="whiteAlpha.800"
                      justifyContent="flex-start"
                      onClick={() => handleNavigate(store, '/create-game')}
                    >
                      <IoMdAddCircleOutline />
                      Create Game
                    </Button>
                    <Button
                      variant="plain"
                      color="whiteAlpha.800"
                      justifyContent="flex-start"
                      onClick={() => handleOpenQrDialog(store)}
                    >
                      <IoQrCodeOutline />
                      Share QR Code
                    </Button>
                    {isStatsAdmin(selectedUser) && (
                      <>
                        <Separator />
                        <Text px={2} fontSize="sm" fontWeight={'medium'}>
                          Admin Actions
                        </Text>
                        <Button
                          variant="plain"
                          color="whiteAlpha.800"
                          justifyContent="flex-start"
                          loading={isSubmittingLeaderboardRefresh}
                          loadingText="Updating leaderboard"
                          onClick={() => handleRefreshLeaderboard(store)}
                        >
                          <MdLeaderboard />
                          Update Active Leaderboard
                        </Button>
                      </>
                    )}
                  </Stack>
                )}
              </Drawer.Context>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
      <ShareQrDialog
        open={isQrDialogOpen}
        onOpenChange={setIsQrDialogOpen}
        value={APP_SHARE_URL}
        title="Share Hoop Stats"
        description="Scan to open Hoop Stats"
      />
    </>
  );
}
