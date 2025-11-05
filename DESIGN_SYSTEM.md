# Design System - x402 Crypto Paywall

## 🎨 Overview

The x402 payment demo features a modern, premium aesthetic with Avalanche-inspired colors and smooth interactions.

---

## Color Palette

### Primary Colors
- **Red Accent**: `from-red-400 to-rose-400` - Main brand color
- **Dark Background**: `from-slate-900 via-slate-800 to-slate-900` - Base gradient

### Status Colors
- **Success**: `emerald-400` / `emerald-500` - Payment verified, access granted
- **Warning**: `yellow-400` - Action required, signing needed
- **Error**: `red-500` / `rose-600` - Payment failed
- **Info**: `cyan-500` / `blue-600` - Informational highlights

### Neutral Colors
- **White**: Primary text
- **Gray-100 to Gray-300**: Secondary text, gradients
- **Gray-400 to Gray-500**: Muted text, borders
- **Slate-700 to Slate-900**: Dark UI elements

---

## Typography

### Font Weights
- **Black (900)**: Main headings
- **Bold (700)**: Sub-headings, buttons
- **Semibold (600)**: Labels, badges
- **Medium (500)**: Body text emphasis
- **Normal (400)**: Body text

### Font Sizes
- **7xl (72px)**: Hero headings
- **6xl (60px)**: Page headings
- **5xl (48px)**: Sub-page headings
- **4xl (36px)**: Section headings
- **3xl (30px)**: Card titles
- **2xl (24px)**: Sub-sections
- **xl (20px)**: Body large, buttons
- **lg (18px)**: Body emphasis
- **base (16px)**: Body text
- **sm (14px)**: Meta text, captions

---

## Components

### Buttons

#### Primary CTA
```tsx
<Link
  href="/authenticate"
  className="group/btn relative block overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-[2px] transition-all hover:shadow-2xl hover:shadow-red-500/50"
>
  <div className="rounded-[14px] bg-gradient-to-r from-red-600 to-rose-600 px-8 py-5 transition-all group-hover/btn:from-red-500 group-hover/btn:to-rose-500">
    <span className="text-xl font-bold text-white">
      Pay $0.10 to Unlock
    </span>
  </div>
</Link>
```

#### Secondary Button
```tsx
<button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:border-red-500/30 hover:bg-white/10">
  Return to Homepage
</button>
```

### Cards

#### Main Feature Card
```tsx
<div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-red-500/30 hover:shadow-red-500/10 sm:p-12">
  {/* Glow effect */}
  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>
  
  <div className="relative">
    {/* Content */}
  </div>
</div>
```

#### Info Card
```tsx
<div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-red-500/20 hover:bg-white/10">
  {/* Content */}
</div>
```

#### Status Card (Success)
```tsx
<div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
  {/* Success content */}
</div>
```

#### Status Card (Warning)
```tsx
<div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
  {/* Warning content */}
</div>
```

#### Status Card (Error)
```tsx
<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
  {/* Error content */}
</div>
```

### Badges

#### Brand Badge
```tsx
<div className="inline-block rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 px-6 py-2 backdrop-blur-sm">
  <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent">
    Powered by x402 Protocol
  </span>
</div>
```

#### Status Badge
```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
  <span className="text-sm font-semibold text-emerald-300">
    Premium Content
  </span>
</div>
```

### Icons

#### Icon Container with Gradient
```tsx
<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* SVG path */}
  </svg>
</div>
```

### Loading States

#### Spinner
```tsx
<div className="relative h-24 w-24">
  <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-red-500"></div>
  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20"></div>
</div>
```

---

## Backgrounds

### Main Background
```tsx
<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  {/* Radial gradient overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
  
  {/* Grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
  
  {/* Content */}
  <div className="relative z-10">
    {/* Your content */}
  </div>
</main>
```

---

## Animations

### Hover Effects
- **Buttons**: Scale slightly, change gradient, add shadow
- **Cards**: Border glow, shadow enhancement
- **Links**: Color transition to red-400

### Transitions
- Default: `transition-all`
- Colors: `transition-colors`
- Transform: `transition-transform`
- Opacity: `transition-opacity`

### Pulse Animation
```tsx
<div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
```

### Spin Animation
```tsx
<div className="animate-spin rounded-full border-4 border-slate-700 border-t-red-500"></div>
```

---

## Spacing Scale

- **xs**: `gap-2` / `p-2` (8px)
- **sm**: `gap-3` / `p-3` (12px)
- **md**: `gap-4` / `p-4` (16px)
- **lg**: `gap-6` / `p-6` (24px)
- **xl**: `gap-8` / `p-8` (32px)
- **2xl**: `gap-12` / `p-12` (48px)
- **3xl**: `gap-16` / `p-16` (64px)

---

## Border Radius

- **sm**: `rounded` (4px)
- **md**: `rounded-lg` (8px)
- **lg**: `rounded-xl` (12px)
- **xl**: `rounded-2xl` (16px)
- **2xl**: `rounded-3xl` (24px)
- **full**: `rounded-full` (9999px)

---

## Shadows

### Glow Effects
- **Red Glow**: `shadow-2xl shadow-red-500/50`
- **Emerald Glow**: `shadow-lg shadow-emerald-500/50`

### Card Shadows
- **Default**: `shadow-2xl`
- **Hover**: `hover:shadow-red-500/10`

---

## Glassmorphism

### Backdrop Blur
```tsx
<div className="backdrop-blur-sm">  {/* Subtle */}
<div className="backdrop-blur-xl">  {/* Strong */}
```

### Semi-transparent Backgrounds
- Light: `bg-white/5`
- Medium: `bg-white/10`
- Dark: `bg-slate-800/90`

---

## Grid Layouts

### 2-Column Responsive
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  {/* Content */}
</div>
```

### 4-Item Feature Grid
```tsx
<div className="mb-8 grid gap-4 sm:grid-cols-2">
  {/* 4 feature cards */}
</div>
```

---

## Best Practices

1. **Consistency**: Use the same color palette throughout
2. **Contrast**: Ensure text is readable on all backgrounds
3. **Spacing**: Maintain consistent spacing between elements
4. **Hover States**: Add subtle interactions to all clickable elements
5. **Loading States**: Show clear feedback during async operations
6. **Errors**: Use red/rose colors for error states
7. **Success**: Use emerald/green for success states
8. **Accessibility**: Maintain proper ARIA labels and semantic HTML

---

## Responsive Breakpoints

- **sm**: 640px (mobile landscape / tablet portrait)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

---

**This design system ensures a cohesive, modern, and premium feel across the entire x402 payment demo! 🎨**

