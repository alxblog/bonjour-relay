import axios from "axios";
import bonjour from "bonjour";
import os from "os";

// Config : à adapter si besoin
const SERVER_URL = process.env.BONJOUR_PROXY_URL || "http://adresse-ip-du-nas:8080/services";
const POLL_INTERVAL = 10_000; // en ms

const bonjourInstance = bonjour();
let activeServices = new Map();

async function syncServices() {
  try {
    const { data } = await axios.get(SERVER_URL);

    // Nettoyage des services obsolètes
    for (const [fqdn, info] of activeServices) {
      if (!data.find(s => s.fqdn === fqdn)) {
        bonjourInstance.unpublish(info);
        activeServices.delete(fqdn);
        console.log(`Unpublished ${fqdn}`);
      }
    }

    // Publication ou mise à jour
    for (const svc of data) {
      if (!svc.address || !svc.port) continue;

      if (!activeServices.has(svc.fqdn)) {
        const info = bonjourInstance.publish({
          name: svc.name,
          type: svc.type,
          port: svc.port,
          host: svc.fqdn,
          txt: svc.txt || {},
        });
        activeServices.set(svc.fqdn, info);
        console.log(`Published ${svc.name} (${svc.fqdn})`);
      }
    }
  } catch (err) {
    console.error("Failed to fetch services:", err.message);
  }
}

setInterval(syncServices, POLL_INTERVAL);
syncServices();
