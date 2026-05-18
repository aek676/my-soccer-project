An AI-powered generation tool interface that creates an "Ideal Team" using LLMs, featuring a dark premium hero section.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Theme: Premium, AI-assisted feature (Dark UI emphasis)
- Background: Deep Black (#0a0b0d)
- Cards: Elevated Dark Surface (#16181c)
- Primary Accent: Blue (#0052ff)
- Typography: Sans-serif (Inter) weight 400 for headings

**Page Structure:**
1. **Top Navigation:** Dark header with "Ideal Team" title.
2. **AI Hero Section:** Deep black background. Heading "Generate Ideal Team". Subtext "Powered by Groq / Google AI". A large blue pill CTA "Generate Squad".
3. **Results Area (Post-Generation):**
   - Elevated dark card (24px radius, padding 32px) representing the soccer pitch layout.
   - 11 circular avatars arranged in a tactical formation (e.g., 4-3-3).
   - Monospace text for player names below each avatar.
   - Outline button "Save Team" below the pitch.
4. **Footer:** Use the `BottomTabsRegistered` component (defined separately), setting the "Ideal Team" tab as active.
