# 🧠 astromegistus-webapp

## 🧱 Next.js App – Modular Structure with App Router

This project is a modular and scalable web application built using [Next.js](https://nextjs.org/) with the **App Router**, **TypeScript**, and **Tailwind CSS**. It uses route groups for clean separation of user-facing and auth-related routes, and `shadcn/ui` for reusable, accessible UI components.

---

## 📁 Project Structure

This project uses the [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing) along with modular route groups and component-based architecture.

---

## 🗂️ Folder Structure

```bash
src/
│
├── app/
│   ├── (user)/                            # User-specific routes
│   │   └── product/
│   │       ├── page.tsx                  # Product page for users
│   │       └── _component/
│   │           └── product-page/         # UI components for product page
│   │
│   ├── (auth)/                            # Authentication routes
│       └── login/
│           └── page.tsx                  # Login page
│
├── components/
│   └── ui/                                # Shared shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       └── ...                           # Other UI components (e.g., dialog, badge)
│
├── lib/                                   # Utility functions, API handlers, etc.
│
├── types/                                 # Global TypeScript types and interfaces
│
└── styles/                                # Tailwind setup and global styles
```
