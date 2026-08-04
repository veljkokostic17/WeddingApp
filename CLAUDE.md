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

`Vendor` and `Category` have full CRUD (`VendorController`, `CategoryController`), and `VendorPhoto`/`VendorUnavailableDate` have `Create`/`Delete` nested on `VendorController`. `User`, `Favorite`, JWT auth, and the mobile-facing screens described in `PROJECT_BRIEF.md` are not yet built.

**Child-entity pattern (`VendorPhoto`, `VendorUnavailableDate`)**: these only ever make sense in the context of one `Vendor` (a `VendorPhoto` has zero meaning without its `VendorId`), so they don't get their own top-level controller or full CRUD. Instead: no standalone `GetAll`/`GetById` (they're read as part of `VendorDto`, not fetched independently) and no `Update` (editing doesn't make sense for either — delete + recreate instead). Just `Create`/`Delete`, nested as extra actions on `VendorController` under routes like `POST/DELETE api/vendor/{vendorId}/photos[/{photoId}]` and `POST/DELETE api/vendor/{vendorId}/dates[/{dateId}]`. `VendorId` always comes from the route parameter, never the request body, so a child row can never be attached to the wrong vendor by mistake — see `VendorMappers.ToVendorPhotoFromCreateDto`/`ToVendorUnavailableDateFromCreateDto`, both of which take `vendorId` as an explicit parameter rather than reading it off the DTO. Note: neither `Create` endpoint currently validates that the vendor id actually exists first — an FK violation is the only thing that would catch a bogus `vendorId` today. Deferred deliberately, not forgotten.

**Watch for EF Core reference cycles when embedding a child entity in a parent DTO.** `Vendor` has `List<VendorPhoto> Photos` and `List<VendorUnavailableDate> UnavailableDates`; both child models have a `Vendor` back-reference. When a query does `.Include(v => v.Photos)` (or `.Include(v => v.UnavailableDates)`), EF's relationship fixup sets both directions, so the raw object graph is a cycle (`Vendor → Photos → VendorPhoto → Vendor → ...`). Confirmed this actually throws `System.Text.Json.JsonException: A possible object cycle was detected` at runtime (not a compile error) the first time a vendor had ≥1 photo. Fix is to never put the raw EF model in a DTO — `VendorDto.Photos`/`VendorDto.UnavailableDates` are `List<VendorPhotoDto>`/`List<VendorUnavailableDateDto>` (plain DTOs with no back-reference), mapped via `VendorMappers.ToVendorPhotoDto()`/`ToVendorUnavailableDateDto()`. Apply the same fix for any future child entity added to `VendorDto`.

**Vendor photos are URLs, not uploaded files.** `CreateVendorPhotoDto.ImageUrl` is a plain string — Swagger/the API never receives file bytes. Planned approach: upload images to Cloudinary's free tier (generous enough for this project's scale — dev pastes the resulting URL into `ImageUrl`), rather than running a self-hosted file server. Not yet implemented or decided in code; revisit if/when actual photo upload UX is built.

**User/auth (in progress).** Using ASP.NET Core Identity (`IdentityUser`/`IdentityDbContext`/`UserManager`/`SignInManager`), not a hand-rolled `User` model + custom password hasher — the app is headed toward being sold commercially (developer + their mentor plan to partner and charge for access, separate from any in-app purchase), so Identity's built-in roles and account lockout are worth the extra setup vs. rolling it by hand. Note `PasswordHasher<T>` and the JWT-handling libraries (`System.IdentityModel.Tokens.Jwt`, pulled in transitively via `Microsoft.AspNetCore.Authentication.JwtBearer`) are identical either way — Identity isn't "safer crypto," it's more built-in scaffolding (roles, lockout) around the same primitives. Packages added so far: `Microsoft.AspNetCore.Identity.EntityFrameworkCore`, `Microsoft.AspNetCore.Authentication.JwtBearer`.

`AppUser : IdentityUser` (`backend/Models/AppUser.cs`) is done — adds `CreatedAt`, `YourName`, `YourPartnerName`, `WeddingDate`. All three are non-nullable: name/partner-name/wedding-date are collected as required fields at registration (not an optional editable-later step), specifically so the mobile app never needs two different UI states depending on whether profile data exists yet. `WeddingDate` is `DateOnly`, matching `VendorUnavailableDate.Date` — a wedding date has no meaningful time component, so `DateTime` would be the wrong type here.

No `Role` column on `AppUser`. An eventual "Admin" designation is needed — not for any admin UI (none is planned, per `PROJECT_BRIEF.md`) but to lock down `Vendor`/`Category` write endpoints once this is deployed publicly (they currently have no `[Authorize]` at all, which is fine only while nothing is reachable but `localhost`). That'll use Identity's own `RoleManager<IdentityRole>` / `AspNetUserRoles` join table, assigned to the developer's one account, rather than a plain string field on `AppUser`.

Next steps: convert `ApplicationDbContext` to `IdentityDbContext<AppUser>`, add the resulting migration, then build `TokenService` (JWT creation — Identity handles user storage/password verification but not token creation, that's still hand-written) and `AuthController` (`Register`/`Login`).

**Mobile** is still the stock `create-expo-app` template (`expo-router` file-based routing under `app/`, template components under `components/`, `hooks/`, `constants/theme.ts`). No wedding-app-specific screens exist yet. `mobile/AGENTS.md` (imported by `mobile/CLAUDE.md`) flags that Expo has changed enough that versioned docs at `docs.expo.dev/versions/v54.0.0/` should be checked before writing Expo code — keep that reference intact rather than replacing it.

## Where we left off (backend build order)

Working controller-by-controller through the API before touching the mobile app is a deliberate choice, not just habit: `Vendor`/`Category`/`Photo`/`UnavailableDate` are all public, admin-managed, read-mostly data that needs no `[Authorize]` at all, so auth can slot in once, right before `Favorite` (the only user-owned resource), instead of being retrofitted onto every controller.

Order, and current status:
1. ✅ `Category` — full CRUD
2. ✅ `Vendor` — full CRUD
3. ✅ `VendorPhoto` — `Create`/`Delete` nested on `VendorController`, embedded read via `VendorDto.Photos`
4. ✅ `VendorUnavailableDate` — same pattern as `VendorPhoto`, `Create`/`Delete` nested on `VendorController`, embedded read via `VendorDto.UnavailableDates`
5. 🔶 `User` model + JWT auth — in progress. Modeled loosely on the developer's prior "FinShark" project, but using ASP.NET Core Identity rather than FinShark's approach (see User/auth note above) — this isn't just repeating an established pattern, so plan to walk through it together rather than following a template. Done: packages installed, `AppUser` model written. Not done: `ApplicationDbContext` still a plain `DbContext` (needs to become `IdentityDbContext<AppUser>`), no migration yet, no `TokenService`/`AuthController`.
6. ⬜ `Favorite` — needs both `User` and `Vendor` to exist
7. ⬜ Mobile screens (`PROJECT_BRIEF.md` MVP scope) — starts only after the above

## Working style

Per `PROJECT_BRIEF.md`: this is a learning project for a 2nd-year student who is comfortable with C#/EF/ASP.NET/React but new to React Native/Expo. Prefer small incremental steps with explanations over large generated features, especially for anything React Native/mobile-specific. If a request would reintroduce something explicitly listed as out-of-scope in `PROJECT_BRIEF.md` (booking, payments, in-app messaging, admin panel, vendor self-service, reviews), flag it rather than building it.

Default to explaining what to write and letting the developer type it themselves, checking/reviewing after (mirrors how `Category` and `VendorPhoto` CRUD got built) — write code directly only when they explicitly ask for it (e.g. "write it for me," "I'm confused, just do it"). When something might have a subtle runtime bug (not just a compile error) — e.g. the EF cycle above — actually run the app and hit the endpoint rather than reasoning about it in the abstract.
