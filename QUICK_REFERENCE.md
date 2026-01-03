# Quick Reference: Badges & Typography

## 🏷️ Badge Variants

```tsx
// Priority
<Badge variant="priority_high">High</Badge>      // Red
<Badge variant="priority_medium">Medium</Badge>  // Yellow
<Badge variant="priority_low">Low</Badge>        // Green

// Status
<Badge variant="status_pending">Pending</Badge>      // Blue
<Badge variant="status_completed">Completed</Badge>  // Green
<Badge variant="status_missed">Missed</Badge>        // Orange

// Tech/System
<Badge variant="tech">Live Feed</Badge>           // Primary, small
<Badge variant="tech_outline">v4.0.2</Badge>      // Outline, small

// Minimal
<Badge variant="minimal">Draft</Badge>            // Subtle
<Badge variant="minimal_primary">Active</Badge>   // Subtle primary

// Standard
<Badge variant="default">Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Delete</Badge>
```

---

## ✍️ Typography Classes

### Mono Text (UI Elements)
```tsx
className="text-mono-xs"  // 10px, uppercase
className="text-mono-sm"  // 11px, uppercase
className="text-mono-md"  // 12px, uppercase
className="text-mono-lg"  // 14px, uppercase
```

### Labels (Metadata)
```tsx
className="label-xs"  // 8px, muted
className="label-sm"  // 10px, muted
className="label-md"  // 11px, muted
```

### Headings (Titles)
```tsx
className="heading-xs"  // 14px, bold
className="heading-sm"  // 18px, bold
className="heading-md"  // 24px, bold
className="heading-lg"  // 32px, bold
className="heading-xl"  // 48px, bold
```

### Clean Text (Body)
```tsx
className="text-clean-sm"  // 13px, readable
className="text-clean-md"  // 14px, readable
className="text-clean-lg"  // 16px, readable
```

### Numbers (Stats)
```tsx
className="text-numeric"     // Tabular nums
className="text-numeric-lg"  // 48px, tabular
```

### System (Metadata)
```tsx
className="text-system"          // 9px, muted
className="text-system-primary"  // 9px, primary
```

### Special Effects
```tsx
className="text-gradient-primary"  // Gradient
className="text-gradient-accent"   // Multi-color gradient
className="text-glow"              // Neon glow
className="text-glow-sm"           // Subtle glow
className="text-truncate-1"        // 1 line ellipsis
className="text-truncate-2"        // 2 lines ellipsis
className="text-truncate-3"        // 3 lines ellipsis
```

---

## 🎯 Common Patterns

### Task Card
```tsx
<div>
  <h3 className="heading-sm">{title}</h3>
  <Badge variant="priority_high">High</Badge>
  <p className="text-clean-sm text-truncate-2">{description}</p>
  <span className="label-xs">Due: {date}</span>
</div>
```

### Stats Display
```tsx
<div>
  <span className="label-sm">Completion</span>
  <div className="text-numeric-lg text-gradient-primary">87%</div>
  <Badge variant="tech">Real-time</Badge>
</div>
```

### System Status
```tsx
<div>
  <span className="text-system">Network</span>
  <Badge variant="minimal_primary">Online</Badge>
  <span className="text-system-primary">24ms</span>
</div>
```

---

## 🔧 Helper Functions

```tsx
import { getPriorityBadgeVariant, getPriorityLabel } from "@/lib/badge-helpers";

// Auto-select badge variant
<Badge variant={getPriorityBadgeVariant(task.priority)}>
  {getPriorityLabel(task.priority)}
</Badge>

// Available helpers:
getPriorityBadgeVariant(priority) → "priority_high" | "priority_medium" | "priority_low"
getStatusBadgeVariant(status) → "status_pending" | "status_completed" | "status_missed"
getPriorityLabel(priority) → "High Priority" | "Medium Priority" | "Low Priority"
getStatusLabel(status) → "Pending" | "Completed" | "Missed"
```

---

## 📋 Cheat Sheet

| Need | Use |
|------|-----|
| Priority badge | `variant="priority_{high\|medium\|low}"` |
| Status badge | `variant="status_{pending\|completed\|missed}"` |
| Small label | `className="label-sm"` |
| Page title | `className="heading-xl"` |
| Body text | `className="text-clean-md"` |
| Large number | `className="text-numeric-lg"` |
| System info | `className="text-system"` |
| Truncate text | `className="text-truncate-2"` |

---

**For full documentation, see:** `BADGE_TYPOGRAPHY_GUIDE.md`
