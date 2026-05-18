A settings and profile screen for the application where users can manage their account and switch backend services. Specific for REGISTERED users.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Theme: Clean, minimal, white canvas
- Background: Soft Gray (#f7f7f7) for the page background, Pure White (#ffffff) for setting cards
- Primary Accent: Blue (#0052ff) for active toggles and primary actions
- Text Primary: Ink Black (#0a0b0d)
- Cards: Softly rounded (24px radius), grouped list style

**Page Structure:**
1. **Top Navigation:** Light header with title "Profile & Settings" and text logo "MSP".
2. **User Card:** A white card displaying the User's Avatar, Username, Email, and Role.
3. **System Settings Group:** 
   - Heading: "Developer Settings"
   - White card containing a list item "Backend Service".
   - A prominent Toggle/Segmented Control (Node.js / SpringBoot) to switch the API destination.
4. **Account Actions:**
   - White card with a list item "Logout" in red text (#cf202f).
5. **Footer:** Use the `BottomTabsRegistered` component (defined separately), setting the "Profile" tab as active.