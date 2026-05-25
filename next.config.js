/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "assets.pokemon.com" },
    ],
  },
};

module.exports = nextConfig;
