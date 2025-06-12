# Jokr-Exam API-dokumentasjon

Dette prosjektet er en Node.js/Express-applikasjon med MongoDB, hvor brukere kan lese og vurdere vitser. Under finner du en oversikt over alle relevante API-endepunkter.

## GET-endepunkter

- `/`  
  Viser forsiden (index).

- `/vits`  
  Henter en tilfeldig vits fra ekstern API (eller database) og viser den for vurdering.

- `/faq`  
  Viser FAQ-siden.

- `/top`  
  Viser en liste over topprangerte vitser fra databasen.

- `/joke/:id`  
  Viser en spesifikk vits (med gitt id) og lar brukeren vurdere den.

## POST-endepunkter

- `/vits/rate`  
  Tar imot vurdering (rating) for en vits. Krever `jokeId` og `rating` i body (form-data). Oppdaterer rating for vitsen og viser gjennomsnitt.

## Andre detaljer
- Alle views er EJS-maler.
- Statisk innhold (CSS, bilder) serveres fra `/public`.
- 404-feil håndteres og sender brukeren til forsiden.

---

**Eksempel på POST til /vits/rate:**

```
POST /vits/rate
Content-Type: application/x-www-form-urlencoded

jokeId=<vitsens_id>&rating=4
```

---

For å kjøre prosjektet:
1. Installer avhengigheter: `npm install`
2. Start server: `npm start` eller `npm run dev`
3. Åpne i nettleser: [http://localhost:4000](http://localhost:4000)

---

**Kontakt:**
For spørsmål, kontakt prosjektansvarlig.
