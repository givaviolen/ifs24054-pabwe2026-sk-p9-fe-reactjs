# Delcom Blog — Frontend (ReactJS + Vite + Tailwind, Port 5174)

```bash
npm install
npm run dev            # http://localhost:5174 (proxy /api -> http://localhost:8081)
npm test               # unit test (Vitest)
npm run test:coverage  # dengan laporan coverage
npm run build          # hasil statis di dist/ (Vercel/Netlify/Cloudflare Pages)
```
Backend harus berjalan di port 8081. Untuk deploy terpisah isi `VITE_API_BASE_URL`.
Login admin default: `admin` / `admin`.
