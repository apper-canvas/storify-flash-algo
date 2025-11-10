import Button from "@/components/atoms/Button";
import { useAuth } from "@/layouts/Root";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant="outline"
      size="sm"
      icon="LogOut"
      className="hidden sm:flex"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;