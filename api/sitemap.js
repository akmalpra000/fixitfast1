// Builds sitemap.xml automatically: only articles that are already live are listed.
const fs = require("fs"), path = require("path");
module.exports = (req, res) => {
  const src = fs.readFileSync(path.join(process.cwd(), "articles.js"), "utf8");
  const arts = JSON.parse(src.slice(src.indexOf("["), src.lastIndexOf("]") + 1));
  const today = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10); // Pakistan time
  const base = "https://" + req.headers.host;
  const urls = ["", "about.html", "contact.html", "privacy.html"].map(p => "<url><loc>" + base + "/" + p + "</loc></url>")
    .concat(arts.filter(a => a.date <= today).map(a => "<url><loc>" + base + "/article.html?id=" + a.id + "</loc><lastmod>" + a.date + "</lastmod></url>"));
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600");
  res.end('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join("") + "</urlset>");
};
