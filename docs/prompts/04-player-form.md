A sophisticated, institutional-grade form page for adding or editing a soccer player's data, including an interactive map for geolocation.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Theme: Clean, minimal, white canvas
- Background: Pure White (#ffffff)
- Form Elements: Soft Gray inputs (#f7f7f7) with 12px radius, 1px border on focus
- Primary Accent: Blue (#0052ff) for the primary submit button
- Typography: Sans-serif, 400 weight for headers

**Page Structure:**
1. **Header:** Standard light navigation with text logo "MSP" and a "Back" button.
2. **Page Title:** "Register New Player" (Display lg, weight 400).
3. **Scrollable Form Area:**
   - **Image Upload:** A dropzone or input for URL/Camera capture with a circular preview at the top.
   - **Personal Info:** Inputs for Alias/Name, First Name, Last Name, Birthdate, Age, and Nationality.
   - **Physical Stats:** Inputs for Height and Weight.
   - **Sporting Info:** Inputs for League, Team, Position, and Shirt Number.
   - **Geolocation:** A clean, rounded map component (24px radius) with a pin marker to select the player's origin location.
4. **Action Footer (Fixed at bottom):** "Cancel" outline button and "Save Player" solid blue pill button.
