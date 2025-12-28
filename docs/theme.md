# Glass Casual Gamer Theme
## A Premium Visual Experience

This document defines a cohesive, AAA-quality visual identity for **Scratch Dog**. The design philosophy centers on **immersive depth**, **cinematic polish**, and **fluid responsiveness**—evoking the sleek sophistication of modern console title screens while remaining accessible and performant on the web.

---

## 1. Color Palette

The palette is inspired by deep space and neon-lit cityscapes, creating a sense of vast potential and electric energy.

### Core Colors
| Token                | Hex         | Usage                                    |
|----------------------|-------------|------------------------------------------|
| `--bg-void`          | `#050507`   | The deepest background layer, pure black |
| `--bg-midnight`      | `#0a0a0f`   | Primary screen backgrounds               |
| `--bg-surface`       | `#12121a`   | Card and panel backgrounds               |
| `--bg-elevated`      | `#1a1a24`   | Elevated surfaces, modals                |

### Glass & Transparency
| Token                  | Value                          | Usage                          |
|------------------------|--------------------------------|--------------------------------|
| `--glass-fill`         | `rgba(255, 255, 255, 0.03)`    | Glass panel fills              |
| `--glass-fill-hover`   | `rgba(255, 255, 255, 0.06)`    | Hovered glass elements         |
| `--glass-border`       | `rgba(255, 255, 255, 0.08)`    | Subtle glass borders           |
| `--glass-blur`         | `12px`                         | Backdrop blur intensity        |

### Accent Colors
| Token                | Hex         | RGB for Glow           | Usage                    |
|----------------------|-------------|------------------------|--------------------------|
| `--accent-primary`   | `#8b5cf6`   | `139, 92, 246`         | Primary actions, focus   |
| `--accent-secondary` | `#ec4899`   | `236, 72, 153`         | Secondary highlights     |
| `--accent-tertiary`  | `#06b6d4`   | `6, 182, 212`          | Informational accents    |
| `--accent-success`   | `#22c55e`   | `34, 197, 94`          | Success states           |
| `--accent-warning`   | `#f59e0b`   | `245, 158, 11`         | Warning states           |
| `--accent-error`     | `#ef4444`   | `239, 68, 68`          | Error states             |

### Text Hierarchy
| Token                | Hex         | Usage                                    |
|----------------------|-------------|------------------------------------------|
| `--text-primary`     | `#ffffff`   | Headlines, primary content               |
| `--text-secondary`   | `#a1a1aa`   | Supporting text, descriptions            |
| `--text-muted`       | `#52525b`   | Disabled text, placeholders              |
| `--text-inverse`     | `#09090b`   | Text on light backgrounds                |

---

## 2. Typography

Typography is designed for readability at a glance while conveying a sense of premium quality.

### Font Stack
```css
--font-display: 'Outfit', 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
| Level         | Size                    | Weight | Letter Spacing | Line Height |
|---------------|-------------------------|--------|----------------|-------------|
| **Hero**      | `clamp(4rem, 12vw, 8rem)` | 800    | `-0.04em`      | 1.0         |
| **Title**     | `clamp(2rem, 6vw, 4rem)`  | 700    | `-0.02em`      | 1.1         |
| **Heading**   | `1.5rem`                  | 600    | `-0.01em`      | 1.2         |
| **Subheading**| `1.125rem`                | 500    | `0`            | 1.4         |
| **Body**      | `1rem`                    | 400    | `0`            | 1.6         |
| **Caption**   | `0.875rem`                | 400    | `0.02em`       | 1.5         |
| **Overline**  | `0.75rem`                 | 600    | `0.1em`        | 1.4         |

---

## 3. Common UI Elements

### Buttons
Buttons should feel substantial and reactive, with layered depth.

```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), color-mix(in srgb, var(--accent-primary) 80%, black));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(139, 92, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}
```

### Glass Panels
Panels use layered transparency to create depth without obscuring content.

```css
.glass-panel {
  background: var(--glass-fill);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### Menu Items
Menu items should have subtle hover states that feel responsive but not jarring.

```css
.menu-item {
  padding: 16px 24px;
  border-radius: 8px;
  transition: all 0.2s ease-out;
}

.menu-item:hover {
  background: var(--glass-fill-hover);
  transform: translateX(4px);
}

.menu-item:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

---

## 4. Transitions & Animations

Animations should feel **cinematic** and **intentional**—never rushed.

### Timing Functions
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Screen Transitions
| Transition      | Duration | Easing             | Description                        |
|-----------------|----------|--------------------|------------------------------------|
| Fade In/Out     | `2000ms` | `ease-in-out`      | Full-screen fades between scenes   |
| Menu Slide      | `400ms`  | `--ease-out-expo`  | Panel slide entrances              |
| Modal Entrance  | `300ms`  | `--spring`         | Modal pop-in with slight overshoot |

### Keyframe Library
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.4); }
}
```

---

## 5. Interactions

### Hover States
All interactive elements should respond to hover with a combination of:
- Subtle background change
- Slight lift (`translateY(-2px)`)
- Enhanced glow or shadow

### Focus States
Focus indicators must be **highly visible** for accessibility:
- `2px` outline in `--accent-primary`
- `2px` outline offset
- No reliance on color alone

### Active/Pressed States
- Scale down slightly (`scale(0.98)`)
- Reduce shadow depth
- Instant feedback (`0ms` delay)

### Disabled States
- `opacity: 0.4`
- `cursor: not-allowed`
- Remove all interactive effects
- `filter: grayscale(50%)`

---

## 6. Visual States

### Loading
Use subtle skeleton loaders with a shimmering gradient:
```css
.skeleton {
  background: linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-elevated) 50%, var(--bg-surface) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Empty States
- Centered layout
- Muted icon (48px)
- Explanatory text in `--text-muted`
- Optional action button

### Error States
- `--accent-error` border on affected element
- Shake animation on validation failure
- Clear error message below input

### Success States
- Brief flash of `--accent-success`
- Checkmark animation
- Optional confetti burst for major achievements

---

## 7. Responsive Behavior

The design should adapt fluidly to any screen size using these breakpoints:

| Breakpoint | Width       | Adjustments                              |
|------------|-------------|------------------------------------------|
| **Mobile** | `< 640px`   | Single column, larger touch targets (48px min), reduced blur |
| **Tablet** | `640–1024px`| Two columns, moderate spacing            |
| **Desktop**| `> 1024px`  | Full layout, maximum effects             |

### Scaling Strategy
- Use `clamp()` for typography and spacing
- Fluid gaps: `gap: clamp(12px, 3vw, 32px)`
- Maintain 16px minimum touch target on mobile

---

## 8. Performance

Visual fidelity must never compromise performance. Follow these guidelines:

### GPU Acceleration
- Use `transform` and `opacity` for all animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly and only when needed

### Blur Optimization
- Reduce `--glass-blur` to `4px` on mobile/low-power devices
- Provide fallback solid backgrounds when blur is disabled

### Animation Budget
- Limit simultaneous animations to 3–4 elements
- Use `prefers-reduced-motion` to disable non-essential animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Accessibility

The theme must be fully accessible to all players.

### Color Contrast
- All text meets **WCAG AA** minimum (4.5:1 for body, 3:1 for large text)
- Interactive elements have 3:1 contrast against background

### Motion Sensitivity
- Respect `prefers-reduced-motion`
- Avoid flashing content (< 3 flashes per second)

### Keyboard Navigation
- All interactive elements are focusable
- Logical tab order
- Visible focus indicators

### Screen Readers
- All images have descriptive `alt` text
- Buttons and links have accessible names
- Live regions announce dynamic content changes

---

## Implementation Checklist

- [ ] Define all CSS variables in `:root`
- [ ] Import Outfit and Inter fonts from Google Fonts
- [ ] Create reusable component classes (`btn-primary`, `glass-panel`, etc.)
- [ ] Implement keyframe library
- [ ] Add `prefers-reduced-motion` support
- [ ] Test color contrast ratios
- [ ] Verify responsive behavior at all breakpoints
- [ ] Validate keyboard navigation flow
