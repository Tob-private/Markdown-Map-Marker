# Markdown Map Marker

An app that allows you to create interactive maps from images and add markers to signify points of interest on these maps.

Deployed on [Vercel](https://markdown-map-marker.vercel.app/)

## Goal

The goal I worked towards was that non-programmers should be able to create, edit, and delete both new pages and map markers.

The idea is that the "admin" users can use a program called obsidian to edit the .md files in the project.

## Tech

CSS Modules
[Next.js](https://nextjs.org/docs)
[Leaflet React](https://react-leaflet.js.org/)
[Supabase](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
[Lucide and Lucide React](https://lucide.dev/packages). I needed both since i couldn't render react components in html, and when I eventually worked with react components it was more convenient to add the other package as well.
[Zod](https://zod.dev/)
[Shadcn](https://ui.shadcn.com/)

## Getting Started

First, clone repo

````
git clone https://github.com/Tob-private/Markdown-Map-Marker.git
cd Markdown-Map-Marker
```

Second, run the development server:

```bash
npm i
npm run dev
````

Third, setup a supabase project with 3 tables with the following structure:

md_files:
| id (uuid) | created_at (timestamp) | updated_at (timestamp) | filename (varchar) | md_path (varchar) | user_id (uuid fk) |
| --------- | ---------------------- | ---------------------- | ------------------ | ----------------- | ----------------- |

map_markers:
| id (uuid) | created_at (timestamp) | updated_at (timestamp) | lat (float8) | lng (float8) | user_id (uuid fk) | img_path (varchar) | title (varchar) | desc (varchar) | note_id (uuid fk) |
| --------- | ---------------------- | ---------------------- | ------------ | ------------ | ----------------- | ------------------ | --------------- | -------------- | ----------------- |

user_perms:
| id (uuid fk) | role (text) |
| ------------ | ----------- |

Fourth, create a .env.local file with the following vars:

```
NEXT_PUBLIC_SUPABASE_URL = "https://linktoyour.supabase.project"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "your_anonsupabase_key"

NEXT_PUBLIC_BASE_URL = ""
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project structure

```
src
├── app
│   ├── (auth)
│   │   ├── login
│   │   │   ├── page.module.css
│   │   │   └── page.tsx
│   │   ├── sign-up
│   │   │   ├── page.module.css
│   │   │   └── page.tsx
│   │   └── sync-session
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── [id]
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── form
│   │   ├── error-message.module.css
│   │   └── error-message.tsx
│   ├── header
│   │   ├── header.module.css
│   │   ├── header.tsx
│   │   ├── user-profile.module.css
│   │   └── user-profile.tsx
│   ├── leaflet
│   │   ├── autocomplete-search.module.css
│   │   ├── autocomplete-search.tsx
│   │   ├── leaflet-map-events.tsx
│   │   ├── leaflet-map-inner.module.css
│   │   ├── leaflet-map-inner.tsx
│   │   ├── leaflet-map.tsx
│   │   ├── marker-form.module.css
│   │   └── marker-form.tsx
│   ├── md-wrapper.tsx
│   ├── navigation
│   │   ├── sidemenu-client.module.css
│   │   ├── sidemenu-client.tsx
│   │   ├── sidemenu-items.tsx
│   │   └── sidemenu.tsx
│   └── ui
│       ├── button.tsx
│       └── popover.tsx
├── lib
│   ├── actions
│   │   ├── auth.ts
│   │   ├── directory.ts
│   │   ├── marker-actions.ts
│   │   └── marker-form.ts
│   ├── data
│   │   ├── callouts.ts
│   │   └── fileExtensions.ts
│   ├── db
│   │   ├── seed
│   │   │   └── md-files-setup.ts
│   │   └── supabase
│   │       ├── client.ts
│   │       └── server.ts
│   ├── helpers
│   │   ├── helpers.ts
│   │   ├── md-helpers.ts
│   │   └── nav-helpers.tsx
│   ├── leaflet
│   │   ├── leaflet.ts
│   │   └── md-files.ts
│   ├── types
│   │   ├── api
│   │   │   └── leaflet.ts
│   │   ├── auth.ts
│   │   ├── callout.ts
│   │   ├── directory-tree.ts
│   │   ├── leaflet.ts
│   │   └── supabase.ts
│   └── utils.ts
├── markdown-it-plugins.d.ts
└── providers
    ├── lucide-provider.tsx
    └── user-context.tsx


public
├── Markdown Map Marker
│   ├── assets
│   │   ├── lathernia.png
│   │   └── maps
│   │       ├── halrani.jpg
│   │       └── lathernia 1.png
│   ├── Lathernia
│   │   ├── Ancerin
│   │   │   └── Ancerin.md
│   │   ├── Dunlarin
│   │   │   └── Dunlarin.md
│   │   ├── Halrani
│   │   │   ├── Gryphon St. Cemetary.md
│   │   │   ├── Halrani.md
│   │   │   ├── Lark St..md
│   │   │   ├── Plim's Clothing Emporium.md
│   │   │   ├── Royal Treasury.md
│   │   │   ├── Tanner's Tannery.md
│   │   │   ├── The Golden Ring Inn.md
│   │   │   ├── The Grand Library.md
│   │   │   ├── The Iron Golem Inn.md
│   │   │   ├── The Iron Guardhouse.md
│   │   │   ├── The Iron Palace.md
│   │   │   └── The Old Gryphon Smithy.md
│   │   ├── Lathernia.md
│   │   ├── Ozir
│   │   │   └── Ozir.md
│   │   ├── Sanbul
│   │   │   └── Sanbul.md
│   │   ├── Sultan's Hills.md
│   │   ├── The Broken Flats.md
│   │   ├── The Ghaba Forest.md
│   │   └── The Larus Ocean.md
│   └── md-styling.md
└── marker-icon.png
```
