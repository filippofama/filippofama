# Auralis — Health & Performance

> Il tuo corpo, finalmente compreso. Una companion app fitness & salute progettata per far sembrare Garmin Connect un reperto archeologico.

Auralis è una **Progressive Web App** installabile su **telefono e computer**: nessuno store, nessuna attesa. La apri nel browser, la "Aggiungi alla schermata Home" e diventa un'app a tutti gli effetti, offline-ready.

L'estetica è ispirata al **Liquid Glass di Apple**: superfici translucide e sfocate, bordi con riflessi speculari, uno sfondo "aurora" che respira lentamente e micro-animazioni a molla su ogni interazione.

![Liquid Glass UI](public/favicon.svg)

## ✨ Cosa include

| Sezione | Funzionalità |
|---|---|
| **Oggi** | Anelli attività animati (passi · calorie · minuti intensi), Body Battery, stress, sonno, idratazione con quick-add, insight AI "Aura", segnali vitali |
| **Attività** | Lista con riepiloghi, dettaglio con traccia GPS stilizzata, frequenza cardiaca, altimetria, frazioni al km, zone FC, Training Effect |
| **Salute** | Frequenza cardiaca giornaliera, Body Battery, stress, SpO₂, frequenza respiratoria — con gauge radiali animati |
| **Sonno** | Punteggio, fasi (profondo/leggero/REM/sveglio), ipnogramma, HRV notturna, trend settimanale |
| **Allenamento** | Stato di forma, carico acuto/cronico, VO₂max, predittore tempi di gara, allenamenti consigliati |
| **Sfide** | Sfide community, badge, record personali, feed social con kudos |
| **Corpo** | Peso, BMI, massa grassa/muscolare, idratazione, trend nel tempo |
| **Profilo** | Account, dispositivo connesso, preferenze, export dati |

## 🎨 Design system — "Liquid Glass"

- Sfondo **aurora** vivo con blob in `drift` infinito + grana sottile
- Superfici `.glass` con `backdrop-filter: blur + saturate` e highlight speculare (`.glass-spec`)
- Anelli e gauge SVG animati con easing `[0.22, 1, 0.36, 1]`
- Transizioni di pagina con blur+fade, indicatori di navigazione con `layoutId` (morphing fluido)
- Palette: aqua · sky · violet · coral · amber · lime su fondo notte profonda

## 🚀 Avvio

```bash
npm install
npm run dev        # sviluppo (http://localhost:5173)
npm run build      # build di produzione
npm run preview    # anteprima della build
```

### Installare sul telefono / computer
1. Apri l'app nel browser (Safari su iOS, Chrome su Android/desktop)
2. **iOS**: Condividi → *Aggiungi alla schermata Home*
3. **Android/Desktop**: menu → *Installa app* / icona di installazione nella barra indirizzi

## 🛠️ Stack

- **React 18** + **TypeScript** + **Vite**
- **Framer Motion** — animazioni e gesture
- **Recharts** — grafici
- **Tailwind CSS** — styling + utility glass custom
- **vite-plugin-pwa** — installabilità & offline
- **lucide-react** — icone

## 📊 Dati

L'app gira su un dataset dimostrativo realistico (`src/data/mock.ts`) che riproduce le metriche di un dispositivo reale. La struttura è pronta per essere collegata a un backend o alle API di un wearable.

---

*Auralis v1.0 — progettato con cura, animato col vetro liquido.*
