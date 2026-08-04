# Wedding Planning App — Zrenjanin

## What this is
A mobile app (Android + iOS, built with React Native/Expo) where couples in Zrenjanin, Serbia can browse local wedding vendors by category — venues, bands, photographers, hair & makeup, jewelry, wedding dresses — see photos and details, and contact them directly. Modeled loosely on vencaj.me's concept, but for Zrenjanin specifically, with a different design and reduced scope.

This is a solo internship project. Developer is a 2nd-year Software Engineering student, comfortable with C#, ASP.NET Core (MVC + Web API), Entity Framework, React, JWT auth, and Git. This is their **first mobile app** and first React Native project. Time budget: 100–300 hours total.

## System architecture — two pieces
1. **Mobile app** (React Native + Expo) — customer-facing, for couples. Published to Google Play and the App Store.
2. **Backend** (ASP.NET Core) — the JSON API only. No admin web pages, no MVC/Razor UI.
3. **Database** (PostgreSQL or SQL Server via Entity Framework) — accessed only through the backend API.

No admin panel is planned for v1. The developer is the sole person managing vendor data — no other person (including the internship supervisor) edits data directly. Vendor data is added/edited by the developer via Swagger UI, direct database access, or simple seed/import scripts — whichever is fastest, since it's a single-user internal workflow, not a product feature.

## Scope — included in v1 (MVP)
- Registration / login for couples (JWT auth)
- Home screen — personalized header showing the couple's names and wedding date (e.g. "Marija & Petar's Wedding — 128 days to go"), above a category grid (Venue, Band, Photographer, Hair & Makeup, Jewelry, Wedding Dress, Decoration)
- Wedding details setup — a simple form (during registration or editable later from Profile) where the user enters their own name, partner's name, and wedding date
- Category list screen — vendors in that category, no price filtering (pricing is not shown in-app; it's negotiated directly between the couple and the vendor via the contact options below)
- Vendor profile screen — photos, description, capacity (venues only, shown as a plain number like "up to 150 guests" — NOT a visual seating/table designer), contact button; venues additionally show a read-only monthly calendar (via a library like `react-native-calendars`) with unavailable dates visually marked (color-coded, e.g. dot or highlight) — display only, no date selection or booking action
- Contact options — phone call button, Instagram link button (no in-app messaging, no email flow)
- Favorites — couples can save/unsave vendors
- Basic profile screen — account info, logout

## Explicitly OUT of scope for v1
- In-app booking or payments
- In-app messaging or email inquiry system
- Visual seating/table layout designer
- Interactive booking calendar — no tapping a date to reserve/hold it, no confirmation flow, no booking state. Venue availability is shown as a READ-ONLY color-coded monthly calendar (couples can view which dates are taken, nothing more)
- Vendor-facing app or vendor self-service logins
- Admin web panel / dashboard of any kind
- Digital invitations, guest list management, budget planner
- Reviews and ratings

## Data model (core entities)
- **User**: id, email, passwordHash, role (Couple/Admin), createdAt, yourName (nullable), partnerName (nullable), weddingDate (nullable)
- **Category**: id, name (Venue, Band, Photographer, Hair & Makeup, Jewelry, Wedding Dress, Decoration)
- **Vendor**: id, categoryId, name, description, address, phone, instagramUrl, capacity (nullable, venues only — guest count), tableSize (nullable, venues only — free text or a simple descriptor, not a visual layout), isActive, createdAt
- **VendorPhoto**: id, vendorId, imageUrl, sortOrder
- **VendorUnavailableDate**: id, vendorId, date — venues only; backend just stores/returns this list, the mobile app renders it as a read-only color-coded monthly calendar (not an interactive booking flow)
- **Favorite**: id, userId, vendorId

## Tech stack
- **Mobile**: React Native + Expo (SDK 54, to stay compatible with Expo Go on physical devices during the current SDK transition period — check current Expo Go compatibility before upgrading)
- **Backend**: ASP.NET Core on .NET 10 (LTS). API controllers only, returning JSON — no Razor/MVC views.
- **Auth**: JWT bearer tokens for the mobile app. No separate admin auth system needed.
- **Database**: PostgreSQL or SQL Server, accessed via Entity Framework Core, migrations-based.
- **Photo storage**: cloud blob storage (e.g. Azure Blob Storage); only the resulting URL is stored in the database, not the image binary.
- **UI component library (mobile)**: React Native Paper (Material Design 3) — theme it rather than build every component from scratch.
- **Calendar display**: `react-native-calendars` — for the read-only venue availability view, styled to match the app's palette rather than its default colors.
- **API docs**: Swashbuckle (Swagger UI) added manually, since .NET 10's default template only ships raw OpenAPI JSON, not a visual UI.

## Visual design direction
Minimalist, elegant, soft color palette — off-white/cream background, muted gold accent, soft blush pink accent, charcoal (not pure black) text. Serif font for headings (e.g. Playfair Display), clean sans-serif for body text (e.g. Inter or system default). White cards with soft rounded corners and subtle shadows. Inspired by local vendor branding references (e.g. elegant serif logo wordmarks, gold-on-white aesthetic) rather than a specific competitor's exact look.

No full Figma mockup set exists or is planned. Design approach: establish the palette/theme + component library first, build one reference screen, then match that established style across all subsequent screens.

## Vendor content approach
No real vendor data exists yet. Vendors are added/edited solely by the developer — via Swagger UI, direct database access, or simple seed/import scripts — as local businesses (venues, bands, photographers, etc.) agree to be listed. No admin panel, no other person edits data, no vendor self-service in v1.

## Cost constraints (already budgeted, for context — not something Claude Code needs to solve)
- Apple Developer Program: $99/year
- Google Play Developer account: $25 one-time
- Backend + database hosting: roughly $0–30/month combined, using free/starter tiers while usage is low

## Working style preferences for Claude Code
- Prefer small, understandable, incremental steps over large generated features — this is a learning project, not just a delivery.
- Explain non-obvious lines/patterns when generating code, especially anything React Native or mobile-specific (developer's background is web/backend, not mobile).
- Reuse patterns from developer's prior projects where applicable: Web API + JWT auth + EF Core pattern is closely modeled on a prior project called "FinShark" (ASP.NET Core Web API + React + JWT + EF Core).
- Keep scope disciplined — if a request seems to reintroduce something listed under "explicitly out of scope," flag it rather than just building it.
