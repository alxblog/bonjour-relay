import express from "express";
import bonjour from "bonjour";

const app = express();
const port = process.env.PORT || 8080;

// Lancer la découverte Bonjour
const browser = bonjour().find(); // ipp = imprimante/scanner
let services = [];

browser.on("up", service => {
  services = services.filter(s => s.fqdn !== service.fqdn);
  services.push(service);
});

browser.on("down", service => {
  services = services.filter(s => s.fqdn !== service.fqdn);
});

// API : récupérer les services disponibles
app.get("/services", (req, res) => {
  const mapped = services.map(s => ({
    name: s.name,
    type: s.type,
    fqdn: s.fqdn,
    address: s.addresses?.[0] || null,
    port: s.port,
    txt: s.txt
  }));
  res.json(mapped);
});

app.listen(port, () => {
  console.log(`Bonjour proxy running on http://localhost:${port}`);
});
