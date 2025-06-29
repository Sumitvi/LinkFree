# 🚀 LinkFree

A **Fullstack Link-in-bio platform** like Linktree — built with `Spring Boot + React + Tailwind CSS`.  
Share all your important links, customize your profile, track analytics, and more — completely free.

---

## 🛠️ Tech Stack

| Frontend        | Backend            | Database | Security       |
|-----------------|--------------------|----------|----------------|
| React.js        | Spring Boot        | H2 (dev) | Spring Security + JWT |
| Tailwind CSS    | Spring Data JPA    | ✅ Supports PostgreSQL / MySQL | BCrypt |

---

## 🔗 Features

- 🔐 JWT Authentication (Login/Register with BCrypt)
- 🛡️ Protected Dashboard Routes via `AuthGuard`
- ➕ Add, Edit, Delete links
- 🌐 Public Profile Page → `/u/:username`
- 📊 Click Analytics with Charts
- 🔗 Link Shortener (e.g. `/s/xyz123`)
- 🔒 Password-Protected Links
- 📷 QR Code Generation (Toggle per link)
- 🎨 Theme Customization:
  - Button shape, size, fonts, gradients, colors
- 🖼️ Avatar & Cover Image Upload
- 🔗 Add Social Links (GitHub, LinkedIn, etc.)
- 📬 Contact Form with email collection
- 🚪 Logout with session clearing

---

## 🔮 Next Features (Coming Soon)

- 🔓 Google OAuth Login
- 💫 Animated Link Buttons
- ✨ UI Overhaul (Dark Mode, Glassmorphism)
- ⏰ Link Scheduling (enable by time/date)
- 🧩 Drag & Drop Link Reordering
- 🧵 Public Theme Gallery
- 📅 Social Media Post Scheduling
- 💸 Digital Product Selling via Stripe
- 🧠 Visitor device/location tracking

---

## ⚙️ Getting Started

### Backend Setup (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
