/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // نسخة عرض (Demo): لا نُفشل البناء بسبب تحذيرات الأنواع أو ESLint.
  // لعرض أخطاء الأنواع شغّل: npx tsc --noEmit
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
