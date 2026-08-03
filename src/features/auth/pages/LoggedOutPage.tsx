import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";

export function LoggedOutPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="bg-white border border-outline/30 rounded-container p-8 text-center max-w-sm">
        <h1 className="font-headline text-xl text-secondary mb-2">
          You have been signed out
        </h1>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          Thanks for using Support Portal.
        </p>
        <Link to="/requests">
          <Button variant="primary">Sign in again</Button>
        </Link>
      </div>
    </div>
  );
}