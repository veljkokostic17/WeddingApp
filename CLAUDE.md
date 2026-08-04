# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

See `PROJECT_BRIEF.md` for full product scope, data model, tech stack, and design direction — read it before making scope decisions. Short version: a mobile app (React Native/Expo) for couples in Zrenjanin, Serbia to browse wedding vendors by category, with an ASP.NET Core Web API + SQL Server backend. Solo internship project; no admin web panel is planned — vendor data is managed directly via Swagger/DB by the developer.

## Repo layout

Two independent projects, no root solution/workspace file tying them together:
- `backend/` — ASP.NET Core Web API (.NET 10)
- `mobile/` — Expo/React Native app (SDK 54)

Each is built and run independently.

## Commands

### Backend (`backend/`)
- `dotnet build` — build
- `dotnet run` — run locally (Swagger UI at `/swagger` in Development)
- `dotnet ef migrations add <Name>` — add a migration after changing a model (requires `dotnet-ef`, already referenced via `Microsoft.EntityFrameworkCore.Tools`)
- `dotnet ef database update` — apply migrations to the local SQL Server instance
- No test project exists yet.

### Mobile (`mobile/`)
- `npm start` / `npx expo start` — start the dev server
- `npm run android` / `npm run ios` / `npm run web` — start targeting a specific platform
- `npm run lint` — `expo lint`
- No test suite exists yet.

## Architecture

**Backend** is a pure JSON API — `AddControllers()` / `MapControllers()` only, no MVC views, no Razor, no admin UI in code. Pattern per controller: `Controllers/*Controller.cs` → `Dtos/<Entity>/*.cs` → `Mappers/<Entity>Mappers.cs` extension methods (`.ToXDto()`, `.ToXFromCreateDTO()`) convert between EF Core models and DTOs. This mirrors the developer's prior "FinShark" project (ASP.NET Core Web API + EF Core + JWT), which is the reference pattern to follow for new controllers/auth.

EF Core is code-first: entities live in `Models/`, changes flow into `Migrations/` via `dotnet ef migrations add`. `Data/ApplicationDbContext.cs` is the single `DbContext`, currently exposing `Vendors`, `Categories`, `Photos`, `VendorUnavailableDates`. Connection string in `appsettings.json` points at a local `SQLEXPRESS` instance with `Trusted_Connection` + `TrustServerCertificate` — dev-only, no secrets there.

Only `Vendor` (+ `Category`) is implemented so far, with full CRUD in `VendorController`. `User`, `Favorite`, JWT auth, and the mobile-facing screens described in `PROJECT_BRIEF.md` are not yet built.

**Mobile** is still the stock `create-expo-app` template (`expo-router` file-based routing under `app/`, template components under `components/`, `hooks/`, `constants/theme.ts`). No wedding-app-specific screens exist yet. `mobile/AGENTS.md` (imported by `mobile/CLAUDE.md`) flags that Expo has changed enough that versioned docs at `docs.expo.dev/versions/v54.0.0/` should be checked before writing Expo code — keep that reference intact rather than replacing it.

## Working style

Per `PROJECT_BRIEF.md`: this is a learning project for a 2nd-year student who is comfortable with C#/EF/ASP.NET/React but new to React Native/Expo. Prefer small incremental steps with explanations over large generated features, especially for anything React Native/mobile-specific. If a request would reintroduce something explicitly listed as out-of-scope in `PROJECT_BRIEF.md` (booking, payments, in-app messaging, admin panel, vendor self-service, reviews), flag it rather than building it.
