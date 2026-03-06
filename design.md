# Oli-Branch Visual Design Style Guide

## Design Philosophy

### Color Palette
**Primary Colors:**
- Deep Forest Green (#1B4332) - Trust, growth, stability
- Warm Sage (#52796F) - Balance, wisdom, nature
- Soft Cream (#F8F5F0) - Clean, approachable, premium
- Charcoal (#2D3748) - Professional, readable, modern

**Accent Colors:**
- Gold (#D4AF37) - Success, premium, achievement
- Coral (#FF6B6B) - Energy, action, urgency (sparingly)

**Rationale:** Moving beyond typical fintech blue to create differentiation while maintaining trust through nature-inspired, calming tones.

### Typography
**Display Font:** Tiempos Headline (Bold, 700)
- Hero headings and major section titles
- Creates editorial sophistication and authority

**Body Font:** Inter (Regular 400, Medium 500, Semibold 600)
- All body text, navigation, and UI elements
- Excellent readability across devices
- Modern, friendly, and accessible

**Font Hierarchy:**
- H1: Tiempos Bold, 3.5rem (56px) - Hero only
- H2: Tiempos Bold, 2.5rem (40px) - Section headers
- H3: Inter Semibold, 1.5rem (24px) - Subsections
- Body: Inter Regular, 1rem (16px) - Main content
- Small: Inter Regular, 0.875rem (14px) - Captions

### Visual Language
**Aesthetic Direction:** Modern Editorial × Financial Trust
- Inspired by premium financial publications (Bloomberg Businessweek, Financial Times)
- Clean, grid-based layouts with generous white space
- Sophisticated use of typography and color
- Human-centered imagery with professional polish

**Imagery Style:**
- Authentic photography of diverse small business owners
- Clean, minimal product screenshots
- Abstract geometric patterns for backgrounds
- No stock photos of generic business people

## Visual Effects & Animation

### Used Libraries
1. **Anime.js** - Smooth micro-interactions and form animations
2. **ECharts.js** - Financial data visualization with custom styling
3. **Splide.js** - Testimonial and case study carousels
4. **p5.js** - Subtle background particle effects
5. **Matter.js** - Interactive financial health meter
6. **PIXI.js** - Hero section visual effects
7. **Shader-park** - Premium background gradients

### Effect Implementation

#### Hero Section
- Animated gradient background using Shader-park
- Floating geometric shapes with Matter.js physics
- Typewriter effect for main headline with Typed.js
- Subtle parallax scrolling on background elements

#### Interactive Elements
- Form field focus states with Anime.js scaling
- Progress bars with smooth fill animations
- Card hover effects with 3D tilt and shadow expansion
- Button micro-interactions with color morphing

#### Data Visualization
- Animated chart reveals with ECharts.js
- Real-time updating metrics with smooth transitions
- Interactive tooltips with contextual information
- Color-coded financial health indicators

#### Background & Atmosphere
- Subtle particle system with p5.js
- Organic shape animations for visual interest
- Depth-based parallax scrolling (max 8% translation)
- Consistent color temperature throughout

### Scroll Motion Rules
- Elements fade in when entering upper 50% of viewport
- Maximum 24px vertical translation
- 200ms animation duration with ease-out timing
- Stagger delays for grouped elements (50ms intervals)
- All content visible by default (opacity: 0.9 minimum)

### Hover Effects
- Cards: 3D tilt (5° max) + shadow expansion
- Buttons: Color shift + subtle glow
- Images: Ken Burns zoom (1.05x scale)
- Links: Animated underline growth
- Form elements: Border color morphing

## Layout & Grid System

### Grid Structure
- 12-column responsive grid
- 24px gutters on desktop, 16px on mobile
- Maximum content width: 1200px
- Consistent 40px vertical rhythm

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

### Spacing Scale
- xs: 8px
- sm: 16px
- md: 24px
- lg: 32px
- xl: 48px
- 2xl: 64px

## Component Styling

### Buttons
**Primary:** Deep Forest Green background, Cream text
**Secondary:** Transparent with Forest Green border
**Accent:** Gold background for high-value actions

### Cards
- Subtle shadows with organic edge radius
- Hover states with depth and lift
- Consistent padding and typography hierarchy

### Forms
- Clean, minimal styling with focus states
- Real-time validation with gentle color coding
- Progress indicators for multi-step processes

### Navigation
- Sticky header with backdrop blur
- Clean typography with adequate touch targets
- Mobile-first responsive behavior

This design system creates a sophisticated, trustworthy brand presence that differentiates Oli-Branch from typical fintech competitors while maintaining the professional credibility essential for financial services.