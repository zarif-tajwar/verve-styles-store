'use client';
import { Button } from '@/components/UI/Button';

const LogoutButton = ({
  handleLogout,
}: {
  handleLogout: () => Promise<void>;
}) => {
  return (
    <Button
      onClick={async () => {
        await handleLogout();
      }}
    >
      Logout
    </Button>
  );
};
export default LogoutButton;
