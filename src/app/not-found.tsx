import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <Image
            src="/images/brand/logo-synapgeek.png"
            alt="Synapgeek logo"
            width={80}
            height={80}
            className="mb-8"
          />
          <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Page not found. The page you are looking for does not exist or has been moved.
          </p>
          <Button href="/" size="lg" className="mt-8">
            Back to home
          </Button>
        </div>
      </body>
    </html>
  );
}
