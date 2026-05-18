A detailed profile page for a soccer player with a dark hero section and a clean white editorial section for stats and user comments. Specific for GUEST users.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Theme: High contrast (Dark hero + White content)
- Hero Background: Deep Black (#0a0b0d)
- Content Background: Pure White (#ffffff)
- Primary Accent: Blue (#0052ff) for CTAs and interactive stars
- Text on Dark: White (#ffffff)
- Text on Light: Ink Black (#0a0b0d)
- Typography: Sans-serif (Inter) weight 400 for headings, Monospace for stats
- Cards: 24px border radius

**Page Structure:**
1. **Top Navigation (Dark):** Deep Black background, White text. Text logo "MSP" on the left, "Back" arrow icon.
2. **Hero Profile Band (Dark):** Deep black background. Large circular player image overlapping the bottom edge. Player Alias/Name (Mega Display, weight 400), First Name, Last Name, Team, and League.
3. **Stats Grid (Light):** White background section. A grid of cleanly formatted stats (Age, Height, Weight, Number, Position) using Monospace font for the values.
4. **Geolocation Map:** A clean, rounded map component (24px radius, read-only) showing the player's origin/registered location.
5. **Comments Section:**
   - Heading: "Scout Notes & Comments" with a primary blue "Add Comment" icon button next to it.
   - **Comment List:** Cards with author name, star rating, comment text, and an "Added from [Location]" small badge.
6. **Add Comment Modal (Guest Version):**
   - Opens when the "Add Comment" icon is tapped.
   - A bottom sheet or modal overlay with rounded top corners (24px radius).
   - Includes an "Author Name" text input field, Textarea, 5-star rating selector, and a "Submit Note" pill CTA.