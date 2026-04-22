# 📝 AI-Powered Blog Platform

A full‑stack blog platform with role‑based access (Author, Viewer, Admin), AI‑generated post summaries using **Google Gemini**, and real‑time comments. Built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.

## 🚀 Live Demo

[Click here!](https://bloggy-u.vercel.app/)

---

## ✨ Features

- **Authentication** – Sign up / Login via Supabase Auth (email confirmation)
- **Role‑Based Access**
  - **Author** – Create posts, edit own posts, view comments
  - **Viewer** – Read posts, view AI summaries, comment on posts
  - **Admin** – Edit/delete any post, delete any comment
- **AI Summary Generation** – Google Gemini API generates a ~200‑word summary when a post is created (generated only once and stored)
- **Blog Posts**
  - Title, featured image, rich body content, comments section
  - Search posts (title / body)
  - Pagination (6 posts per page)
  - Edit / Delete (author or admin)
- **Comments** – Add and delete comments (users can delete own comments, admins can delete any)
- **Responsive UI** – Modern card layout, hover effects, gradient hero section

---

## 🛠️ Tech Stack

| Layer          | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| **Frontend**   | Next.js 15 (App Router), React, Tailwind CSS                              |
| **Backend**    | Next.js Server Actions + API Routes                                       |
| **Auth**       | Supabase Auth (email/password)                                            |
| **Database**   | Supabase PostgreSQL with Row Level Security (RLS)                         |
| **AI**         | Google Gemini API (`gemini-pro-latest`)                                   |
| **Deployment** | Vercel                                                                     |
| **Version Control** | Git + GitHub                                                          |

---

## 🤖 AI Summary Generation
- When a user creates a post, the server action createPost calls generateSummary().

- The summary is generated using Google Gemini (gemini-pro-latest model).

- The summary is stored in the posts.summary column and never regenerated (cost optimization).

- If the API fails or rate‑limits (429), the system falls back to a local text summary – the app never breaks.

---

## Role Management
- New users are automatically assigned the viewer role via a database trigger.

- To promote a user to author or admin, update the role column in the public.users table directly (Supabase dashboard or SQL).
