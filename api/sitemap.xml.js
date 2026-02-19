// Vercel API route to serve sitemap.xml with proper headers
export default function handler(req, res) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

<!-- Homepage - Highest Priority -->
<url>
  <loc>https://ainiseflow.com/</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>

<!-- Private Physio Clinic Automation - Primary Service Page -->
<url>
  <loc>https://ainiseflow.com/ai-physio-clinic-automation.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>

<!-- Main AI Solutions Page -->
<url>
  <loc>https://ainiseflow.com/ai-automation-services.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.85</priority>
</url>

<!-- Industry-Specific Solutions -->
<url>
  <loc>https://ainiseflow.com/ai-restaurant-solutions.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://ainiseflow.com/ai-healthcare-solutions.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://ainiseflow.com/ai-professional-services.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://ainiseflow.com/ai-retail-solutions.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<!-- Web Design Add-on Service -->
<url>
  <loc>https://ainiseflow.com/web-design-addon.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>

<!-- Blog Section -->
<url>
  <loc>https://ainiseflow.com/blog.html</loc>
  <lastmod>2026-02-19</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.6</priority>
</url>

</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(sitemap);
}
