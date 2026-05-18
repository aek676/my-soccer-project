An editorial news feed displaying player updates and articles, resembling a high-end financial news publisher. Specific for REGISTERED users.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Theme: Clean editorial pacing (Bloomberg/FT style)
- Background: Pure White (#ffffff)
- Text Primary: Ink Black (#0a0b0d)
- Text Secondary: Muted Gray (#7c828a)
- Accent: Blue (#0052ff) for text links only
- Badges: Pill-shaped (#eef0f3 background, ink text)

**Page Structure:**
1. **Top Navigation:** Light header with text logo "MSP".
2. **Header Band:** "Player News Network" (Weight 400).
3. **News Feed (1-column constrained width):**
   - Generous spacing between articles (48px).
   - **Article Component:** 
     - Metadata row: Date (Monospace) and Pill Badge with the Player's name.
     - Headline: Large serif or sans-serif (Display sm, weight 400).
     - Body snippet: Muted gray text.
     - 1px hairline divider separating articles.
4. **Footer:** Use the `BottomTabsRegistered` component (defined separately), setting the "News" tab as active.