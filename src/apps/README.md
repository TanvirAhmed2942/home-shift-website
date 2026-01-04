# 📦 ShiftMyHome - Applications Directory

This directory contains **5 independent applications** that make up the ShiftMyHome platform.

---

## 🎯 Applications Overview

| App | Description | Entry Point | URL (Production) |
|-----|-------------|-------------|------------------|
| **Website** | Public-facing website | `/apps/website/App.tsx` | `shiftmyhome.com` |
| **Admin** | Operations dashboard | `/apps/admin/App.tsx` | `admin.shiftmyhome.com` |
| **Driver** | Driver mobile app | `/apps/driver/App.tsx` | `driver.shiftmyhome.com` |
| **Customer** | Customer portal | `/apps/customer/App.tsx` | `my.shiftmyhome.com` |
| **Partner** | Partner/affiliate dashboard | `/apps/partner/App.tsx` | `partner.shiftmyhome.com` |

---

## 🚀 Quick Start

### Run Single App
```bash
# Website
cd website && npm start

# Admin
cd admin && npm start

# Driver
cd driver && npm start

# Customer
cd customer && npm start

# Partner
cd partner && npm start
```

### Run All Apps (Development)
```bash
# Install concurrently if not installed
npm install -g concurrently

# From /apps directory
npm run dev:all
```

---

## 📁 Directory Structure

```
/apps
├── /website          → Public website
│   ├── App.tsx
│   ├── /pages
│   └── /components
│
├── /admin            → Admin dashboard
│   ├── App.tsx
│   └── /components
│
├── /driver           → Driver app
│   ├── App.tsx
│   └── /components
│
├── /customer         → Customer dashboard
│   ├── App.tsx
│   └── /components
│
└── /partner          → Partner dashboard
    ├── App.tsx
    └── /components
```

---

## 🔧 Configuration

### Environment Variables (Per App)

Each app can have its own `.env` file:

```
/apps/website/.env
/apps/admin/.env
/apps/driver/.env
/apps/customer/.env
/apps/partner/.env
```

### Shared Environment Variables

Common variables are in root `.env`:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
MAPBOX_TOKEN=...
```

---

## 🎨 Styling

All apps use:
- **Tailwind CSS** (configured in `/styles/globals.css`)
- **Shared UI components** from `/shared/components/ui`
- **App-specific styles** in each app's directory

---

## 🧪 Testing

### Test Single App
```bash
cd website && npm test
```

### Test All Apps
```bash
npm run test:all
```

---

## 📦 Building for Production

### Build Single App
```bash
cd website && npm run build
```

### Build All Apps
```bash
npm run build:all
```

---

## 🔐 Authentication

Each app has role-based access:

- **Website**: Public (no auth required)
- **Admin**: Admin role required
- **Driver**: Driver role required
- **Customer**: Customer role required
- **Partner**: Partner role required

Authentication is handled via Supabase (see `/shared/utils/auth.ts`)

---

## 📊 Performance

Each app is optimized for:
- **Code splitting** (lazy loading)
- **Tree shaking** (unused code removed)
- **Smaller bundle sizes** (only load what's needed)
- **Independent caching** (per app)

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```bash
# Deploy website
vercel --prod --cwd apps/website

# Deploy admin
vercel --prod --cwd apps/admin
```

### Option 2: Docker

See `/docker-compose.yml` for multi-app setup.

---

## 📚 Documentation

Full documentation: `/PROJECT_RESTRUCTURE.md`

---

**Last Updated**: 29 December 2024
