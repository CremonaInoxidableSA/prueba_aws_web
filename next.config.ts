import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["192.168.20.150", "192.168.20.151"],
}

export default nextConfig
