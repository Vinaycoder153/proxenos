# Badge & Typography System Guide

## 🎨 Badge System

### Overview
The enhanced badge component provides **consistent, clean styling** with pre-built variants for different use cases.

---

## 📦 Badge Variants

### **1. Priority Badges**
Use for task priorities with automatic color coding:

```tsx
import { Badge } from "@/components/ui/badge";
import { getPriorityBadgeVariant } from "@/lib/badge-helpers";

// Automatic variant selection
<Badge variant={getPriorityBadgeVariant(task.priority)}>
  {task.priority} Priority
</Badge>

// Or manual:
<Badge variant="priority_high">High Priority</Badge>
<Badge variant="priority_medium">Medium Priority</Badge>
<Badge variant="priority_low">Low Priority</Badge>
```

**Colors:**
- `priority_high` - Red (urgent)
- `priority_medium` - Yellow (important)
- `priority_low` - Green (normal)

---

### **2. Status Badges**
Use for task/habit status:

```tsx
<Badge variant="status_pending">Pending</Badge>
<Badge variant="status_completed">Completed</Badge>
<Badge variant="status_missed">Missed</Badge>
```

**Colors:**
- `status_pending` - Blue
- `status_completed` - Primary green
- `status_missed` - Orange

---

### **3. Tech/System Badges**
Use for system labels, metadata, technical info:

```tsx
<Badge variant="tech">Live Feed</Badge>
<Badge variant="tech_outline">v4.0.2</Badge>
```

**Style:** Ultra-small mono font, wide tracking

---

### **4. Minimal Badges**
Use for subtle, clean labels:

```tsx
<Badge variant="minimal">Draft</Badge>
<Badge variant="minimal_primary">Active</Badge>
```

**Style:** Subtle colors, minimal contrast

---

### **5. Standard Badges**
Classic variants:

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Delete</Badge>
```

---

## ✍️ Typography System

### **Mono Text Utilities**

Clean, uppercase mono text for labels and UI elements:

```tsx
<span className="text-mono-xs">Extra Small Label</span>
<span className="text-mono-sm">Small Label</span>
<span className="text-mono-md">Medium Label</span>
<span className="text-mono-lg">Large Label</span>
```

**Use for:** Form labels, button text, navigation items

---

### **Label Utilities**

System-style labels with muted colors:

```tsx
<span className="label-xs">Metadata</span>
<span className="label-sm">Section Label</span>
<span className="label-md">Field Label</span>
```

**Use for:** Field labels, metadata, system info

---

### **Heading Utilities**

Bold, impactful headings:

```tsx
<h1 className="heading-xl">Command Center</h1>
<h2 className="heading-lg">Mission Log</h2>
<h3 className="heading-md">Daily Protocols</h3>
<h4 className="heading-sm">Quick Stats</h4>
<h5 className="heading-xs">Section Title</h5>
```

**Use for:** Page titles, section headers

---

### **Clean Text Utilities**

Readable body text:

```tsx
<p className="text-clean-sm">Small paragraph text</p>
<p className="text-clean-md">Medium paragraph text</p>
<p className="text-clean-lg">Large paragraph text</p>
```

**Use for:** Descriptions, body copy, readable content

---

### **Numeric Display**

Tabular numbers for consistent alignment:

```tsx
<span className="text-numeric">42</span>
<span className="text-numeric-lg">98.7%</span>
```

**Use for:** Stats, scores, metrics, percentages

---

### **System Text**

Ultra-small system/metadata text:

```tsx
<span className="text-system">Network Latency</span>
<span className="text-system-primary">Active Link</span>
```

**Use for:** Status indicators, system info, footer text

---

### **Gradient Text**

Eye-catching gradient text:

```tsx
<span className="text-gradient-primary">Featured</span>
<span className="text-gradient-accent">Premium</span>
```

**Use for:** Highlights, featured content, CTAs

---

### **Glow Text**

Neon-style glowing text:

```tsx
<span className="text-glow">Neon Text</span>
<span className="text-glow-sm">Subtle Glow</span>
```

**Use for:** Emphasis, active states, primary actions

---

### **Truncate Utilities**

Automatic text truncation with ellipsis:

```tsx
<p className="text-truncate-1">Single line truncated...</p>
<p className="text-truncate-2">Two lines max...</p>
<p className="text-truncate-3">Three lines max...</p>
```

**Use for:** Card descriptions, list items, previews

---

## 🎯 Usage Examples

### **Task Card with Priority Badge**

```tsx
<div className="card">
  <div className="flex items-center justify-between">
    <h3 className="heading-sm">{task.title}</h3>
    <Badge variant={getPriorityBadgeVariant(task.priority)}>
      {task.priority}
    </Badge>
  </div>
  <p className="text-clean-sm text-truncate-2">{task.description}</p>
  <span className="label-xs">Due: {task.due_date}</span>
</div>
```

### **Stats Display**

```tsx
<div className="stats-card">
  <span className="label-sm">Completion Rate</span>
  <div className="text-numeric-lg text-gradient-primary">87%</div>
  <Badge variant="tech">Real-time</Badge>
</div>
```

### **System Status**

```tsx
<div className="status-bar">
  <span className="text-system">Network Status</span>
  <Badge variant="minimal_primary">Online</Badge>
  <span className="text-system-primary">24ms</span>
</div>
```

---

## 🎨 Design Principles

### **Consistency**
- Use the same variant for the same purpose across the app
- Stick to the predefined utilities instead of inline styles

### **Hierarchy**
- Larger text = more important
- Brighter colors = higher priority
- Glow/gradient = special attention

### **Readability**
- Use `text-clean-*` for body text
- Use `text-mono-*` for UI elements
- Use `label-*` for metadata

### **Performance**
- All utilities are pre-compiled CSS
- No runtime style calculations
- Optimized for production builds

---

## 🚀 Migration Guide

### **Old Badge Usage:**
```tsx
// ❌ Before
<Badge className="text-[10px] font-mono uppercase border-red-500/30 bg-red-500/5 text-red-400">
  High Priority
</Badge>
```

### **New Badge Usage:**
```tsx
// ✅ After
<Badge variant="priority_high">High Priority</Badge>
```

### **Old Text Styling:**
```tsx
// ❌ Before
<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
  Label
</span>
```

### **New Text Styling:**
```tsx
// ✅ After
<span className="label-sm">Label</span>
```

---

## 📝 Quick Reference

| Use Case | Badge Variant | Text Utility |
|----------|--------------|--------------|
| High priority task | `priority_high` | `text-mono-sm` |
| Completed status | `status_completed` | `label-sm` |
| System metadata | `tech_outline` | `text-system` |
| Large number | - | `text-numeric-lg` |
| Page title | - | `heading-xl` |
| Body text | - | `text-clean-md` |
| Truncated preview | - | `text-truncate-2` |

---

**Created:** 2026-01-03  
**Version:** 1.0.0  
**Status:** Production Ready ✅
