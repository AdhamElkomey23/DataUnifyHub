# Design Guidelines: Internal Business Management Application

## Design Approach

**Selected Framework**: Design System Approach inspired by **Linear** and **Notion**
- Linear's clean task management UI and subtle interactions
- Notion's excellent information hierarchy and data organization
- Material Design's robust table and form patterns

**Justification**: This is a utility-focused, information-dense internal tool where efficiency, learnability, and data clarity are paramount. The design must support daily operations without visual distractions.

---

## Core Design Principles

1. **Clarity Over Aesthetics**: Every design choice serves data visibility and task completion
2. **Consistent Patterns**: Repeated UI elements for faster learning and muscle memory
3. **Purposeful Hierarchy**: Clear visual distinction between primary actions and supporting information
4. **Efficient Navigation**: Maximum 2 clicks to reach any core function

---

## Color Palette

**Dark Mode Primary** (Default for long working hours):
- Background: 220 15% 12%
- Surface: 220 15% 16%
- Surface Elevated: 220 15% 20%
- Border: 220 15% 25%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 65%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Border: 220 15% 88%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%

**Functional Colors**:
- Primary/Brand: 210 85% 55% (Professional blue for actions)
- Success: 145 65% 45% (Price updates, completed tasks)
- Warning: 35 90% 60% (Approaching deadlines)
- Danger: 0 70% 55% (Delete actions, overdue tasks)
- Neutral: 220 10% 50% (Disabled states, secondary info)

**Role-Based Accent Colors** (Subtle indicators):
- Admin: 270 60% 60%
- Operations: 210 60% 60%
- Sales: 160 50% 50%
- Accountant: 30 70% 55%

---

## Typography

**Font System**: Inter (via Google Fonts CDN)
- Primary: Inter (400, 500, 600, 700)
- Monospace: 'JetBrains Mono' for data/numbers

**Scale**:
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-base font-medium (16px)
- Body Text: text-sm (14px)
- Helper Text: text-xs text-secondary (12px)
- Table Headers: text-xs font-medium uppercase tracking-wide
- Data/Numbers: font-mono text-sm

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4
- Micro-spacing: space-x-2 for inline elements

**Grid Structure**:
- Sidebar: w-64 (256px) fixed
- Main Content: flex-1 with max-w-7xl mx-auto px-6
- Dashboard Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Tables: Full width with horizontal scroll on mobile

**Container Strategy**:
- Dashboard: max-w-7xl
- Forms/Modals: max-w-2xl
- Data Tables: w-full

---

## Component Library

### Navigation
- **Sidebar**: Fixed left, dark background, icon + label navigation items, active state with subtle highlight (bg-white/10), hover states (bg-white/5)
- **Top Bar**: User profile dropdown (right), breadcrumbs (left), search bar (center), h-16 height
- **Mobile**: Hamburger menu triggering slide-in sidebar

### Dashboard Cards
- White/surface background with subtle border
- Rounded corners: rounded-lg
- Padding: p-6
- Header: Flex justify-between with title and action icon
- Content: List items with hover states
- Footer: Link to full view ("View all →")

### Data Tables
- Sticky header: sticky top-0 bg-surface z-10
- Zebra striping: even:bg-surface-elevated
- Row hover: hover:bg-surface-elevated/50
- Cell padding: px-4 py-3
- Action buttons: Icon buttons in final column
- Filters: Top bar with dropdowns and search
- Pagination: Bottom right, showing "1-20 of 150 items"

### Forms & Inputs
- Input height: h-10
- Border: border border-border rounded-md
- Focus state: ring-2 ring-primary/50 border-primary
- Labels: text-sm font-medium mb-2
- Error state: border-danger text-danger
- Helper text: text-xs text-secondary mt-1
- Consistent dark mode: Dark background inputs with lighter text

### Task Cards
- Border-left accent by priority: border-l-4 border-l-danger/warning/neutral
- Compact view: px-4 py-3
- Status badge: Top right, small pill with status color
- Assignee avatar: Bottom left, w-6 h-6
- Due date: Bottom right, text-xs with calendar icon
- Expand: Click to show full description and comments

### Buttons
- Primary: bg-primary text-white hover:bg-primary/90 h-10 px-6 rounded-md font-medium
- Secondary: border border-border hover:bg-surface-elevated h-10 px-6 rounded-md
- Ghost: hover:bg-surface-elevated text-secondary h-9 px-3 rounded-md
- Icon: w-9 h-9 rounded-md hover:bg-surface-elevated
- Destructive: bg-danger text-white hover:bg-danger/90

### Modals & Overlays
- Backdrop: bg-black/50 backdrop-blur-sm
- Panel: bg-surface border border-border rounded-lg shadow-2xl max-w-2xl w-full p-6
- Header: pb-4 border-b border-border
- Footer: pt-4 border-t border-border with action buttons right-aligned

### Status Indicators
- Task Status: Pill badges (To Do: bg-neutral/20, In Progress: bg-primary/20, Done: bg-success/20)
- Priority: Color-coded dots before task title
- Last Updated: Relative time with tooltip ("2 hours ago")
- Change History: Timeline view with user avatar and timestamp

---

## Page-Specific Layouts

### Dashboard
- 3-column grid on desktop (Pending Tasks | Recent Updates | Quick Stats)
- Metric cards at top: 4-column grid showing key numbers
- Activity feed: Right sidebar showing recent changes

### Price Management
- Top filters bar: Service Type dropdown, City dropdown, Search input, "Add Price" button (right)
- Table: Service | City | Category | Current Price | Last Updated | Updated By | Actions
- Inline editing: Click to edit cells, save/cancel buttons
- Change history: Modal showing timeline of price changes

### Contacts Directory
- Left sidebar: Category filter list with counts
- Main area: Card grid (3 columns) or table view toggle
- Card layout: Avatar/logo, name, role, company, quick action buttons (WhatsApp, Email)
- Tags: Small pills below contact info

### Task Management
- Kanban board view option: 3 columns (To Do | In Progress | Done)
- List view: Grouped by due date (Today, Tomorrow, This Week, Later)
- Filter/sort bar: Assigned to me, Priority, Due date, Status
- Task detail sidebar: Slides in from right when task clicked

---

## Animations & Interactions

**Minimal Motion Strategy**:
- Page transitions: None (instant)
- Dropdown menus: Simple fade-in (150ms)
- Modal open: Scale from 0.95 to 1 (200ms)
- Toast notifications: Slide in from top (250ms)
- Hover states: Instant background color change (no transition)
- Loading states: Subtle skeleton screens (no spinners)

---

## Data Visualization

**Dashboard Metrics**:
- Large number: text-3xl font-bold
- Trend indicator: Small arrow with percentage change
- Sparkline: Minimal line chart (optional, only if data available)

**Status Distribution**:
- Horizontal bar showing task completion percentage
- Color segments for To Do/In Progress/Done

---

## Accessibility & Responsive Behavior

- All interactive elements: min-h-10 for touch targets
- Focus indicators: Clear ring-2 on all inputs/buttons
- Color contrast: Meets WCAG AA standards
- Mobile: Single column layout, bottom navigation bar, collapsible sidebar
- Tablet: 2-column grids, persistent sidebar
- Desktop: Full multi-column layouts

---

## Images

**No hero images required** - this is an internal utility tool focused on data and functionality.

**Supporting Graphics**:
- Empty states: Simple illustrations for empty tables/task lists (e.g., "No tasks yet" with minimal icon)
- User avatars: Circular, 2-letter initials with role-based background colors
- Company logos: In contacts cards (32x32px)
- File previews: Thumbnails for uploaded documents (48x48px)

**Placement**:
- Dashboard: Icon-based metric cards (no images)
- Contacts: Logo/avatar at top of cards
- Tasks: Assignee avatars only
- Empty states: Centered illustration with text