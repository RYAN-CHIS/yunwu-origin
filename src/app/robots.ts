import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.yunwuorigin.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
