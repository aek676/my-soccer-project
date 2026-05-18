A reusable Bottom Tab Navigation component for a mobile application, specifically for REGISTERED users.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile-first (Ionic App)
- Background: Pure White (#ffffff)
- Top Border: 1px hairline (#dee1e6)
- Active State: Primary Blue (#0052ff) for both icon and label
- Inactive State: Muted Gray (#7c828a) for both icon and label
- Typography: Sans-serif (Inter), small size (e.g., 10px-12px) for labels

**Component Structure:**
A fixed bottom bar containing 4 evenly spaced tab buttons. Each tab consists of a standard mobile icon stacked above a short text label.

**Tabs:**
1. **"Players" Tab:** (Icon: Users or List)
2. **"News" Tab:** (Icon: Newspaper)
3. **"Ideal Team" Tab:** (Icon: Star or Soccer Pitch)
4. **"Profile" Tab:** (Icon: User or Settings gear)

**Props/States:**
- `activeTab`: Indicates which tab is currently selected (highlights it in Primary Blue, leaves others in Muted Gray).