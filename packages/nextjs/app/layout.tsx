import { headers } from "next/headers";
import { Providers } from "./providers";
import { cookieToInitialState } from "@account-kit/core";
import { config } from "~~/account.config";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-alchemy/getMetadata";

export const metadata = getMetadata({
  title: "EarthPay",
  description: "Built with 🌎 Scaffold-Alchemy",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  // This will allow us to persist state across page boundaries (read more here: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state)
  const initialState = cookieToInitialState(config, headers().get("cookie") ?? undefined);

  return (
    <html suppressHydrationWarning className="font-sans tracking-tighter">
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
