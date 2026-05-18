An editorial-style dashboard showing a list of soccer players with search and filtering capabilities, specifically for REGISTERED users.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Theme: Clean, editorial calm, lots of whitespace (96px section padding)
- Background: Pure White (#ffffff)
- Primary Accent: Blue (#0052ff) for active states and primary CTAs
- Text Primary: Ink Black (#0a0b0d)
- Semantic Colors: Green (#05b169) and Red (#cf202f) for stats (text only, no fills)
- Typography: Sans-serif for UI, Monospace (JetBrains Mono) for player stats/numbers
- Shapes: Pill-shaped search inputs and badges, full-circle (9999px) for player avatars

**Page Structure:**
1. **Top Navigation:** 
   - Left: Text logo "MSP" (weight 600).
   - Right: Show the User's Avatar.
2. **Hero Section:** Clean white background. Display heading (weight 400) "Player Database". 
3. **Search & Filter Bar:** Pill-shaped search input (#eef0f3 background). Dropdown filters for "Team", "League", and "Date Added".
4. **Player List (Asset Rows):** Vertical list of players. Each row has:
   - Left: Circular player photo (32px)
   - Center: Player Alias/Name and Position
   - Right: Age and Shirt Number in Monospace font, and a chevron icon to view details
   - Separated by 1px hairline dividers (#dee1e6).
5. **Floating Action Button (FAB) & Action Sheet:** 
   - A blue circular button with a "+" icon.
   - **Interaction:** When tapped, it opens an Action Sheet (bottom menu) with two choices:
     - ✍️ "Add Manually" (Navigates to the manual creation form)
     - 🌐 "Import from API" (Navigates to the API search/import interface)
6. **Footer:** Use the `BottomTabsRegistered` component (defined separately), setting the "Players" tab as active.