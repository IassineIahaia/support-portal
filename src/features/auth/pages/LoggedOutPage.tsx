import { useAuth } from "react-oidc-context";
import { Button } from "@/shared/ui/Button";

export function LoggedOutPage() {
  const auth = useAuth();

  const handleSignInAgain = () => {
    void auth.signinRedirect();
  };

  const handleSwitchAccount = () => {

    void auth.signinRedirect({
      extraQueryParams: { prompt: "login" },
    });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="bg-white border border-outline/30 rounded-container p-8 text-center max-w-sm">
        <h1 className="font-headline text-xl text-secondary mb-2">
          You have been signed out
        </h1>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          Thanks for using Support Portal.
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="primary" onClick={handleSignInAgain}>
            Sign in again
          </Button>
          <Button variant="outlined" onClick={handleSwitchAccount}>
            Use a different account
          </Button>
        </div>
      </div>
    </div>
  );
}