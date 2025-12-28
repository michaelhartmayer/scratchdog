# Theme Specification Checklist

## 1. Glass Casual Gamer Theme
- [x] 1.1. Theme definition documented in /docs/theme.md
- [x] 1.2. React Design System implementation
    - [x] 1.2.1. Create /src/components/DesignSystem directory
    - [x] 1.2.2. Each component has folder + index.ts export

## 2. Color Palette
- [x] 2.1. Core Colors defined in CSS
    - [x] 2.1.1. --bg-void (#050507)
    - [x] 2.1.2. --bg-midnight (#0a0a0f)
    - [x] 2.1.3. --bg-surface (#12121a)
    - [x] 2.1.4. --bg-elevated (#1a1a24)
- [x] 2.2. Glass & Transparency
    - [x] 2.2.1. --glass-fill
    - [x] 2.2.2. --glass-fill-hover
    - [x] 2.2.3. --glass-border
    - [x] 2.2.4. --glass-blur
- [x] 2.3. Accent Colors
    - [x] 2.3.1. --accent-primary (Violet)
    - [x] 2.3.2. --accent-secondary (Pink)
    - [x] 2.3.3. --accent-tertiary (Cyan)
    - [x] 2.3.4. --accent-success (Green)
    - [x] 2.3.5. --accent-warning (Amber)
    - [x] 2.3.6. --accent-error (Red)
- [x] 2.4. Text Hierarchy
    - [x] 2.4.1. --text-primary
    - [x] 2.4.2. --text-secondary
    - [x] 2.4.3. --text-muted
    - [x] 2.4.4. --text-inverse

## 3. Typography
- [x] 3.1. Font Stack
    - [x] 3.1.1. --font-display (Outfit, Inter)
    - [x] 3.1.2. --font-body (Inter)
    - [x] 3.1.3. --font-mono (JetBrains Mono)
- [x] 3.2. Type Scale
    - [x] 3.2.1. Hero styles
    - [x] 3.2.2. Title styles
    - [x] 3.2.3. Heading styles
    - [x] 3.2.4. Subheading styles
    - [x] 3.2.5. Body styles
    - [x] 3.2.6. Caption styles
    - [x] 3.2.7. Overline styles

## 4. Design System Components
- [x] 4.1. Button Component
    - [x] 4.1.1. Primary variant
    - [x] 4.1.2. Secondary variant
    - [x] 4.1.3. Ghost variant
    - [x] 4.1.4. Disabled state
    - [x] 4.1.5. Hover, focus, active states
- [x] 4.2. GlassPanel Component
    - [x] 4.2.1. Backdrop blur
    - [x] 4.2.2. Subtle border
    - [x] 4.2.3. Configurable padding
- [x] 4.3. Text Component
    - [x] 4.3.1. Hero variant
    - [x] 4.3.2. Title variant
    - [x] 4.3.3. Heading variant
    - [x] 4.3.4. Subheading variant
    - [x] 4.3.5. Body variant
    - [x] 4.3.6. Caption variant
    - [x] 4.3.7. Overline variant
- [x] 4.4. MenuItem Component
    - [x] 4.4.1. Hover state with translateX
    - [x] 4.4.2. Focus-visible outline
    - [x] 4.4.3. Disabled state

## 5. Transitions & Animations
- [x] 5.1. Timing Functions
    - [x] 5.1.1. --ease-out-expo
    - [x] 5.1.2. --ease-in-out-quart
    - [x] 5.1.3. --spring
- [ ] 5.2. Screen Transitions
    - [ ] 5.2.1. Fade In/Out (2000ms)
    - [ ] 5.2.2. Menu Slide (400ms)
    - [ ] 5.2.3. Modal Entrance (300ms)
- [x] 5.3. Keyframe Animations
    - [x] 5.3.1. fadeIn
    - [x] 5.3.2. fadeInUp
    - [x] 5.3.3. scaleIn
    - [x] 5.3.4. pulse
    - [x] 5.3.5. shimmer
    - [x] 5.3.6. float
    - [x] 5.3.7. glow

## 6. Interactions
- [ ] 6.1. Hover States
    - [x] 6.1.1. Background change
    - [x] 6.1.2. translateY(-2px) lift
    - [x] 6.1.3. Enhanced glow/shadow
- [x] 6.2. Focus States
    - [x] 6.2.1. 2px outline
    - [x] 6.2.2. Outline offset
- [x] 6.3. Active/Pressed States
    - [x] 6.3.1. scale(0.98)
    - [x] 6.3.2. Reduced shadow
- [x] 6.4. Disabled States
    - [x] 6.4.1. opacity: 0.4
    - [x] 6.4.2. cursor: not-allowed
    - [x] 6.4.3. grayscale filter

## 7. Visual States
- [ ] 7.1. Loading (skeleton + shimmer)
- [ ] 7.2. Empty States (centered + muted icon)
- [ ] 7.3. Error States (border + shake)
- [ ] 7.4. Success States (flash + checkmark)

## 8. Responsive Behavior
- [ ] 8.1. Breakpoints defined
    - [ ] 8.1.1. Mobile (< 640px)
    - [ ] 8.1.2. Tablet (640-1024px)
    - [ ] 8.1.3. Desktop (> 1024px)
- [ ] 8.2. Mobile Adjustments
    - [ ] 8.2.1. Single column layout
    - [ ] 8.2.2. 48px touch targets
    - [ ] 8.2.3. Reduced blur (4px)

## 9. Performance
- [x] 9.1. GPU Acceleration
    - [x] 9.1.1. transform/opacity animations only
    - [x] 9.1.2. No layout-triggering animations
- [x] 9.2. Animation Budget
    - [ ] 9.2.1. 3-4 element limit
    - [x] 9.2.2. prefers-reduced-motion support

## 10. Accessibility
- [ ] 10.1. Color Contrast
    - [ ] 10.1.1. WCAG AA for body text
    - [ ] 10.1.2. 3:1 for large text
- [x] 10.2. Motion Sensitivity
    - [x] 10.2.1. prefers-reduced-motion
    - [x] 10.2.2. No rapid flashing
- [x] 10.3. Keyboard Navigation
    - [x] 10.3.1. All elements focusable
    - [x] 10.3.2. Logical tab order
    - [x] 10.3.3. Visible focus indicators
