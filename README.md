# Bonjour Relay – Proxy Bonjour pour VPN Cisco Meraki

Ce projet permet de découvrir des services Bonjour (comme des imprimantes/scanners HP) sur un réseau d'entreprise, puis de les rendre accessibles à distance via VPN, même si le protocole mDNS (Bonjour) est bloqué.

## 📁 Structure du dépôt

```
bonjour-relay/
├── client/   # À déployer en local (chez vous)
│   └── docker-compose.yml
├── server/   # À déployer au bureau sur le NAS
│   └── docker-compose.yml
```

---

## 🔧 Prérequis

- Accès à un **Portainer** sur deux hôtes :
  - Serveur NAS (réseau distant, bureau)
  - Serveur local (chez vous)
- Un **VPN** actif entre les deux (ex : Cisco Meraki)
- GitHub (ou autre) avec ce dépôt

---

## 🖥️ Déploiement de la partie `server` (sur le NAS au bureau)

### 1. Connectez-vous à Portainer (NAS distant)
### 2. Allez dans **Stacks > Add Stack**
### 3. Choisissez **Git Repository**
Remplissez les champs comme suit :

| Champ                 | Valeur                                                        |
|----------------------|---------------------------------------------------------------|
| Name                 | `bonjour-server`                                              |
| Git repository       | `https://github.com/<TON-UTILISATEUR>/bonjour-relay.git`     |
| Repository reference | `main` (ou la branche utilisée)                              |
| Compose path         | `server/docker-compose.yml`                                  |

### 4. Cliquez sur **Deploy the stack**

---

## 🖥️ Déploiement de la partie `client` (chez vous, sur serveur local)

### 1. Connectez-vous à Portainer (serveur local)
### 2. Allez dans **Stacks > Add Stack**
### 3. Choisissez **Git Repository**
Remplissez les champs comme suit :

| Champ                 | Valeur                                                        |
|----------------------|---------------------------------------------------------------|
| Name                 | `bonjour-client`                                              |
| Git repository       | `https://github.com/<TON-UTILISATEUR>/bonjour-relay.git`     |
| Repository reference | `main` (ou la branche utilisée)                              |
| Compose path         | `client/docker-compose.yml`                                  |

### 4. Cliquez sur **Deploy the stack**

> ⚠️ **IMPORTANT** : dans `client/docker-compose.yml`, remplace `IP_DU_NAS` par l’adresse réelle du NAS sur le réseau VPN :
```yaml
environment:
  - BONJOUR_PROXY_URL=http://192.168.100.10:8080/services
```

---

## 📈 Résultat attendu

- Le conteneur `bonjour-server` détecte les services Bonjour (ex : imprimante HP).
- Le conteneur `bonjour-client`, chez vous, interroge le serveur et **publie localement les services détectés** via mDNS.
- Votre Mac (connecté au VPN) voit **comme s’il y avait une imprimante/scanner local**.
- Cela permet à **HP Scan ou AirPrint** de fonctionner à distance.

---

## 🔍 Vérification

Sur votre Mac connecté au VPN, ouvrez un terminal :

```bash
dns-sd -B _ipp._tcp
```

Vous devriez voir apparaître votre imprimante/scanner distant.

---

## 📄 Licence

MIT – utilisation libre à vos risques et périls 🙂
