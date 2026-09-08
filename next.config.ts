import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows loading the dev server from this machine's LAN address, so the
  // site can be opened on a phone for the touch interactions.
  allowedDevOrigins: ["192.168.29.90"],
};

export default nextConfig;
