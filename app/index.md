# Asklu — Component Specification & Game Logic

## App Shell & Global State

### State Machine (App.tsx)
```typescript
type View = 'landing' | 'setup' | 'game-hub' | 'game1' | 'game2' | 'souk' | 'gameover';
type GameMode = 'next-letter' | 'amudru' | null;

interface Team {
  id: 'atlas-lions' | 'barbary-monkeys';
  name: string;
  score: number;
  avatar: string; // path to image
  coins: number;
  accessories: string[]; // unlocked items
}

interface AppState {
  view: View;
  teams: [Team, Team];
  activeTeamIndex: 0 | 1;
  currentPuzzleIndex: number;
  isAnimating: boolean;
  teacherPanelOpen: boolean;
  soundEnabled: boolean;
}
```

### State Transitions
| From | Trigger | To |
|------|---------|-----|
| landing | Click "Commencer" | setup |
| setup | Select 2 teams, click "Démarrer" | game-hub |
| game-hub | Click Game 1 card | game1 |
| game-hub | Click Game 2 card | game2 |
| game1 | Complete all 10 puzzles | game-hub |
| game2 | Complete all 8 animals | game-hub |
| game-hub | Click "Terminer" (both games done) | souk |
| souk | Click "Nouvelle Partie" | gameover |
| gameover | Click "Rejouer" | setup |
| *any* | Teacher toggle panel | *same* |

### Reducer Actions
- `START_SETUP`, `START_GAME`, `SELECT_GAME`, `NEXT_PUZZLE`, `ANSWER_CORRECT`, `ANSWER_INCORRECT`, `SWITCH_TEAM`, `TOGGLE_PANEL`, `TOGGLE_SOUND`, `RESET_GAME`, `UNLOCK_ACCESSORY`

---

## Global Layout Components

### ScoreboardHeader
- **Position:** Fixed top, full width, z-index: 50
- **Height:** 80px
- **Background:** `#FFFFFF` with `box-shadow: 0 4px 0 #E1E8DE`
- **Layout:** Flex row, space-between
  - **Left:** Team Atlas Lions avatar (40x40) + team name + score badge (saffron circle, 32px, bold)
  - **Center:** Current game title / "Asklu" logo
  - **Right:** Team Barbary Monkeys score badge + team name + avatar (40x40)
- **Active Indicator:** The active team's side gets a 4px bottom border in their team color (saffron for Atlas, terracotta for Barbary)
- **Animations:** Score changes trigger a `scale(1.3)` bounce animation over 300ms using Back.easeOut

### TeacherControlPanel
- **Position:** Fixed right side, overlay mode, z-index: 100
- **Width:** 360px (desktop), full-width (mobile)
- **Height:** 100vh
- **Background:** `#FFFFFF` with left shadow `box-shadow: -8px 0 0 #E1E8DE`
- **Border-radius:** 24px 0 0 24px
- **Toggle Button:** Small floating button at right edge, 48x48, `#1A54F4` background, white chevron icon
- **Sections:**
  1. **Active Team Display:** Large team avatar, name, "C'est votre tour!" label
  2. **Answer Options:** 2x2 grid (game1) or 4-column (game2) of large touch-friendly buttons (min 80x80)
  3. **Control Buttons:**
     - `[ Correct ]` — `#00A86B` background, white check icon
     - `[ Incorrect ]` — `#E74C3C` background, white X icon
     - `[ Passer ]` — grey background, skip arrow
  4. **Score Override:** +/- buttons for manual score adjustment
  5. **Game Controls:** Reset round, return to hub
- **Keyboard Shortcuts:**
  - `←` / `→` — Switch active team
  - `1`/`2`/`3`/`4` — Select answer option
  - `Enter` — Confirm correct
  - `Esc` — Close panel

### StarLoader (Transition Overlay)
- **Full-screen overlay:** z-index: 9999
- **Background:** `rgba(249, 251, 247, 0.95)`
- **Center Content:** Two 6-pointed SVG stars, 80x80 each
- **Animation:** Continuous 2000ms loop — scale(0)→scale(1) rotate(180deg)→scale(0) rotate(360deg), second star delayed 500ms
- **Trigger:** Shows during view transitions, hides when new view assets ready
- **Exit:** Fade out over 400ms

### FloatingScore (+10 animation)
- **Element:** Absolutely positioned div with `+10` or `+15` text in `#FFC72C`, bold, 48px
- **Trigger:** On correct answer
- **Animation:** GSAP timeline — start at answer card position, float up 100px while fading out over 1500ms
- **Easing:** `Power2.easeOut`

---

## Page: Landing (View: 'landing')

### Layout
- **Full-screen:** 100vh, 100vw
- **Background:** Gradient overlay on generated background image — `linear-gradient(135deg, rgba(26,84,244,0.85) 0%, rgba(0,168,107,0.75) 50%, rgba(255,199,44,0.8) 100%)`
- **Content:** Centered vertically and horizontally

### Elements
1. **Logo Mark:** 
   - Large Tifinagh tree glyph "ⴰⵙⴽⵍⵓ" in white, 96px, font-weight 800
   - Subtle text-shadow: `0 4px 20px rgba(0,0,0,0.2)`

2. **Title:**
   - "Asklu" in white, 64px, font-weight 700
   - Letter-spacing: 0.05em

3. **Subtitle:**
   - "Apprentissage du Tifinagh en classe" in white, 24px, font-weight 400
   - Opacity: 0.9

4. **Start Button:**
   - Text: "Commencer"
   - Style: Large pill button, `background: #FFC72C`, color `#1E252B`, 24px bold
   - Size: 240px x 72px, border-radius: 36px
   - Shadow: `0 8px 0 #E5B020`
   - Hover: translateY(-2px), shadow increases to `0 10px 0 #E5B020`
   - Active: translateY(4px), shadow reduces to `0 4px 0 #E5B020`
   - Animation: Gentle pulse (scale 1→1.03→1) over 2s, infinite, ease-in-out

5. **Decorative Elements:**
   - Floating geometric shapes (circles, diamonds) in corners, opacity 0.15
   - Subtle parallax on mouse move (±20px)

### Animations
- **Entrance:** Title fades in + translateY(30px→0) over 800ms, delay 200ms
- **Subtitle:** Same, delay 400ms
- **Button:** Same, delay 600ms, with spring ease Back.easeOut(1.2)

---

## Page: Setup (View: 'setup')

### Layout
- **Background:** `#F9FBF7`
- **Content:** Max-width 800px, centered
- **Header:** "Configuration de la classe" — 36px, `#1E252B`, centered

### Elements
1. **Group Count Selector:**
   - Label: "Nombre de groupes"
   - Two large toggle buttons: `[ 2 Groupes ]` `[ 3 Groupes ]` (3 groups optional)
   - Default: 2 selected
   - Style: Pill buttons, selected = `#1A54F4` bg, white text; unselected = `#FFFFFF` bg, `#1E252B` text, shadow

2. **Team Configuration Cards:**
   - Two side-by-side cards (flex row, gap 24px)
   - Each card: 360px wide, `#FFFFFF` bg, border-radius 24px, shadow `0 8px 0 #E1E8DE`
   - **Card Content:**
     - Team avatar image (120x120, centered)
     - Team name input (editable, default "Les Lions de l'Atlas" / "Les Macaques de Barbarie")
     - Color picker: 4 circular swatches (Majorelle, Saffron, Atlas Green, Terracotta)
   - **Hover:** Card lifts slightly (translateY(-4px)), shadow increases

3. **Start Button:**
   - Text: "Démarrer la partie"
   - Full-width of content area, 64px height
   - Style: `#00A86B` bg, white text, 20px bold, border-radius 16px
   - Shadow: `0 6px 0 #008F5B`
   - Disabled state (if names empty): opacity 0.5, cursor not-allowed

### Animations
- **Cards entrance:** Staggered from bottom, 200ms apart, translateY(50px)→0, opacity 0→1, duration 600ms, ease Back.easeOut(1.4)
- **Start button:** Delay 400ms after cards, scale(0.9)→scale(1), opacity 0→1

---

## Page: Game Hub (View: 'game-hub')

### Layout
- **Background:** `#F9FBF7`
- **Header:** ScoreboardHeader (persistent)
- **Content:** Centered, max-width 1000px
- **Title:** "Choisissez un jeu" — 40px, centered, margin-top 120px

### Elements
1. **Game Cards Row:**
   - Three cards in a row (flex, gap 32px, justify-center)
   - Each card: 280px wide, 380px tall, `#FFFFFF` bg, border-radius 24px, shadow `0 8px 0 #E1E8DE`
   - **Card 1 — "Next Letter Quest":**
     - Top: Game icon area (generated image or SVG illustration of Tifinagh letters in sequence)
     - Title: "Next Letter Quest" — 22px bold
     - Subtitle: "Trouve la lettre suivante" — 16px, muted
     - Status badge: "Jouer" (green) or "Terminé" (grey) with checkmark
   - **Card 2 — "Amudru Match":**
     - Similar layout with animal imagery
     - Title: "Amudru Match"
     - Subtitle: "Relie l'animal à sa lettre"
   - **Card 3 — "Le Souk Virtuel":**
     - Locked until both games complete
     - Lock icon overlay if locked
     - Title: "Le Souk Virtuel"
     - Subtitle: "Dépense tes pièces!"

2. **Card Interactions:**
   - Hover: translateY(-8px), shadow increases to `0 12px 0 #D1D8D0`, transition 300ms ease
   - Click: scale(0.97) briefly, then navigate
   - Locked card: opacity 0.6, no hover effect, cursor not-allowed

3. **Floating Action Button (bottom-right):**
   - "Terminer la session" button
   - Only visible if at least one game played
   - Style: `#D96B43` bg, white text, pill shape

### Animations
- **Cards entrance:** Staggered scale(0.8)→scale(1) + opacity 0→1, 150ms apart, duration 500ms, ease Back.easeOut(1.2)
- **Active team pulse:** The scoreboard header's active indicator gently pulses (opacity 0.7→1) every 2s

---

## Page: Game 1 — Next Letter Quest (View: 'game1')

### Layout
- **Background:** `#F9FBF7` with subtle gradient hint of active team color (saffron or terracotta at 5% opacity)
- **Header:** ScoreboardHeader (persistent)
- **Stage Area:** Centered, max-width 900px, margin-top 100px

### Data: Tifinagh Letter Sequence Puzzles
```typescript
interface LetterPuzzle {
  sequence: string[];      // 3 shown letters, e.g., ['ⴰ', 'ⴱ', 'ⴳ']
  correctAnswer: string;   // 'ⴷ'
  options: string[];       // 4 choices including correct
  hint: string;            // "Pense au son 'd'"
}

const letterPuzzles: LetterPuzzle[] = [
  { sequence: ['ⴰ', 'ⴱ', 'ⴳ'], correctAnswer: 'ⴷ', options: ['ⴷ', 'ⴹ', 'ⴻ', 'ⴼ'], hint: "Pense au son 'd'" },
  { sequence: ['ⴱ', 'ⴳ', 'ⴷ'], correctAnswer: 'ⴹ', options: ['ⴰ', 'ⴹ', 'ⵀ', 'ⵃ'], hint: "Pense au son 'ḍ'" },
  { sequence: ['ⴳ', 'ⴷ', 'ⴹ'], correctAnswer: 'ⴻ', options: ['ⴼ', 'ⴻ', 'ⴽ', 'ⵀ'], hint: "Pense au son 'e'" },
  { sequence: ['ⴷ', 'ⴹ', 'ⴻ'], correctAnswer: 'ⴼ', options: ['ⴻ', 'ⴽ', 'ⴼ', 'ⵁ'], hint: "Pense au son 'f'" },
  { sequence: ['ⴹ', 'ⴻ', 'ⴼ'], correctAnswer: 'ⴽ', options: ['ⴼ', 'ⵀ', 'ⴽ', 'ⵃ'], hint: "Pense au son 'k'" },
  { sequence: ['ⴻ', 'ⴼ', 'ⴽ'], correctAnswer: 'ⵀ', options: ['ⴽ', 'ⵁ', 'ⵀ', 'ⵉ'], hint: "Pense au son 'h'" },
  { sequence: ['ⴼ', 'ⴽ', 'ⵀ'], correctAnswer: 'ⵃ', options: ['ⵀ', 'ⵃ', 'ⵄ', 'ⵉ'], hint: "Pense au son 'ḥ'" },
  { sequence: ['ⴽ', 'ⵀ', 'ⵃ'], correctAnswer: 'ⵄ', options: ['ⵃ', 'ⵄ', 'ⵅ', 'ⵉ'], hint: "Pense au son 'ɛ'" },
  { sequence: ['ⵀ', 'ⵃ', 'ⵄ'], correctAnswer: 'ⵅ', options: ['ⵄ', 'ⵅ', 'ⵇ', 'ⵉ'], hint: "Pense au son 'x'" },
  { sequence: ['ⵃ', 'ⵄ', 'ⵅ'], correctAnswer: 'ⵇ', options: ['ⵅ', 'ⵇ', 'ⵉ', 'ⵊ'], hint: "Pense au son 'q'" },
];
```

### Stage Elements

#### 1. Progress Indicator
- **Position:** Top of stage area
- **Style:** Row of 10 small circles (16px), gap 8px
- **States:** 
  - Completed: `#00A86B` fill with white checkmark
  - Current: `#1A54F4` fill, pulsing
  - Upcoming: `#E1E8DE` fill

#### 2. Sequence Cards Row (The Puzzle)
- **Layout:** 4 cards in a horizontal row (flex, gap 24px, centered)
- **Card Size:** 160px x 200px each
- **Card Style:** `#FFFFFF` bg, border-radius 24px, shadow `0 8px 0 #E1E8DE`
- **Content:**
  - **Cards 1-3:** Large Tifinagh letter (72px, `#1E252B`, bold, centered), letter name below (16px, muted)
  - **Card 4 (Question):** Large question mark "?" (72px, `#1A54F4`), pulsing animation, subtle glow `box-shadow: 0 0 20px rgba(26,84,244,0.3)`
- **Connector Lines:** Small arrows (→) between cards, 32px, `#D96B43`

#### 3. Hint Text
- **Position:** Below cards, centered
- **Style:** 18px, `#D96B43`, italic
- **Visibility:** Only shown after 15 seconds or on teacher request

#### 4. Answer Feedback Area
- **Position:** Below hint
- **States:**
  - **Correct:** Large green checkmark appears, text "Bravo! +10 points" in `#00A86B`, 28px
  - **Incorrect:** Gentle shake animation on the sequence cards, text "Essayez encore!" in `#E74C3C`

### Animations
- **Card Fan Entrance (GSAP):** The 4 puzzle cards animate in with the core Card Fan effect:
  - All start stacked at center: `left: 50%, top: 50%`, `rotationZ: -180 to -240`, `rotationY: 40 to 80`, `autoAlpha: 0`
  - Animate to final positions with `left: +=0, +=220, +=440, +=660`, `rotationZ: 0, 5, -5, -10`
  - Stagger: 0.2s between cards
  - Easing: `Power4.easeIn` for rotation, `Back.easeOut(0.4)` for landing
- **Correct Answer:** 
  - Question card flips (rotationY 0→180→0) to reveal correct letter
  - Golden particles burst from card (8-12 small circles radiating outward, fading over 1s)
  - Score float animation triggers
- **Incorrect Answer:**
  - Cards shake left-right (translateX: -10px→10px→-10px→10px→0) over 400ms
  - Brief red tint overlay (background: rgba(231,76,60,0.1))

### Teacher Panel (Game 1 Mode)
- **Answer Grid:** 2x2 layout of large buttons
- **Button Content:** Tifinagh letter (48px) + phonetic hint below (14px)
- **Button Style:** 140x140px, `#FFFFFF` bg, border-radius 16px, shadow `0 6px 0 #E1E8DE`
- **Selection:** Click highlights with `#1A54F4` border (4px), inner shadow glow
- **Confirm:** Teacher clicks [Correct] or [Incorrect] after selecting

---

## Page: Game 2 — Amudru Match (View: 'game2')

### Layout
- **Background:** `#F9FBF7` with subtle team color tint
- **Header:** ScoreboardHeader (persistent)
- **Stage Area:** Centered, max-width 800px, margin-top 80px

### Data: Animal-Letter Puzzles
```typescript
interface AnimalPuzzle {
  animalName: string;      // "Ammar" (eagle)
  animalImage: string;     // path to generated image
  correctLetter: string;   // 'ⴰ' (A)
  fullWordTifinagh: string; // 'ⴰⵎⵎⴰⵔ'
  fullWordLatin: string;   // "Ammar"
  options: string[];       // 4 letter choices
  pronunciation: string;   // phonetic guide
}

const animalPuzzles: AnimalPuzzle[] = [
  { 
    animalName: "Ammar", 
    animalImage: "/animals/eagle.png",
    correctLetter: 'ⴰ', 
    fullWordTifinagh: 'ⴰⵎⵎⴰⵔ', 
    fullWordLatin: "Ammar",
    options: ['ⴰ', 'ⴱ', 'ⴳ', 'ⴷ'],
    pronunciation: "ah-mar"
  },
  { 
    animalName: "Bougzem", 
    animalImage: "/animals/monkey.png",
    correctLetter: 'ⴱ', 
    fullWordTifinagh: 'ⴱⵓⴳⵣⵎ', 
    fullWordLatin: "Bougzem",
    options: ['ⴰ', 'ⴱ', 'ⴳ', 'ⴹ'],
    pronunciation: "boog-zem"
  },
  { 
    animalName: "Giter", 
    animalImage: "/animals/lion.png",
    correctLetter: 'ⴳ', 
    fullWordTifinagh: 'ⴳⵉⵜⵔ', 
    fullWordLatin: "Giter",
    options: ['ⴳ', 'ⴷ', 'ⴹ', 'ⴻ'],
    pronunciation: "gee-ter"
  },
  { 
    animalName: "Derna", 
    animalImage: "/animals/bear.png",
    correctLetter: 'ⴷ', 
    fullWordTifinagh: 'ⴷⴻⵔⵏⴰ', 
    fullWordLatin: "Derna",
    options: ['ⴱ', 'ⴳ', 'ⴷ', 'ⴼ'],
    pronunciation: "der-nah"
  },
  { 
    animalName: "Yeffer", 
    animalImage: "/animals/elephant.png",
    correctLetter: 'ⵢ', 
    fullWordTifinagh: 'ⵢⴻⴼⴼⴻⵔ', 
    fullWordLatin: "Yeffer",
    options: ['ⵢ', 'ⵡ', 'ⵉ', 'ⵓ'],
    pronunciation: "yeh-fer"
  },
  { 
    animalName: "Zerdas", 
    animalImage: "/animals/fox.png",
    correctLetter: 'ⵣ', 
    fullWordTifinagh: 'ⵣⴻⵔⴷⴰⵙ', 
    fullWordLatin: "Zerdas",
    options: ['ⵣ', 'ⵥ', 'ⵙ', 'ⵛ'],
    pronunciation: "zer-das"
  },
  { 
    animalName: "Tafdalt", 
    animalImage: "/animals/butterfly.png",
    correctLetter: 'ⵜ', 
    fullWordTifinagh: 'ⵜⴰⴼⴷⴰⵍⵜ', 
    fullWordLatin: "Tafdalt",
    options: ['ⵜ', 'ⵟ', 'ⴹ', 'ⴸ'],
    pronunciation: "taf-dalt"
  },
  { 
    animalName: "Cermen", 
    animalImage: "/animals/fish.png",
    correctLetter: 'ⵛ', 
    fullWordTifinagh: 'ⵛⴻⵔⵎⴻⵏ', 
    fullWordLatin: "Cermen",
    options: ['ⵛ', 'ⵃ', 'ⵅ', 'ⴽ'],
    pronunciation: "cher-men"
  },
];
```

### Stage Elements

#### 1. Progress Indicator
- Same style as Game 1, but 8 circles

#### 2. Animal Card (Center Stage)
- **Size:** 360px x 420px
- **Style:** `#FFFFFF` bg, border-radius 24px, shadow `0 12px 0 #E1E8DE`
- **Content:**
  - Animal illustration image (fills top 70% of card, object-fit: contain)
  - Animal name in Latin script below (22px, `#1E252B`)
  - Prompt text: "Quelle est la première lettre?" (18px, `#D96B43`)

#### 3. Answer Options Row
- **Layout:** 4 buttons in a row below the animal card, gap 16px
- **Button Size:** 100px x 100px
- **Button Style:** `#FFFFFF` bg, border-radius 16px, shadow `0 6px 0 #E1E8DE`
- **Content:** Large Tifinagh letter (48px, `#1E252B`)

#### 4. Reveal Area (shown after correct answer)
- **Full Word Display:** Tifinagh word (56px, `#1A54F4`) + Latin transcription (20px, muted)
- **Pronunciation Button:** Speaker icon + "Écouter" text
- **Animation:** Word types in letter by letter, 200ms per letter

### Animations
- **Animal Card Entrance:** 
  - Scale(0.7)→scale(1), opacity 0→1, duration 600ms, ease Back.easeOut(1.4)
  - Subtle float animation starts (translateY: 0→-8px→0, 3s infinite)
- **Answer Buttons:** 
  - Staggered entrance from bottom, 100ms apart, translateY(30px)→0
- **Correct Answer:**
  - Animal card celebrates: quick scale(1.1)→scale(1) bounce
  - Animal image gets a brief golden tint overlay
  - Answer buttons dissolve away (opacity→0, translateY(20px))
  - Reveal area slides in from bottom
  - Golden particles burst
- **Incorrect Answer:**
  - Animal card shakes (same as Game 1)
  - Selected wrong button turns `#E74C3C` with X icon

### Teacher Panel (Game 2 Mode)
- **Answer Grid:** 4 horizontal buttons
- **Each Button:** Shows Tifinagh letter (40px) + letter name phonetically (12px)
- **Selection Flow:** Teacher clicks letter → button highlights → clicks [Correct]/[Incorrect]

---

## Page: Virtual Souk (View: 'souk')

### Layout
- **Background:** `#F9FBF7` with decorative geometric border pattern
- **Header:** ScoreboardHeader (persistent)
- **Content:** Max-width 1000px, centered

### Elements

#### 1. Final Scores Display
- **Position:** Top of content area
- **Layout:** Two large score cards side by side
- **Card Style:** 400px wide, `#FFFFFF` bg, border-radius 24px, shadow `0 8px 0 #E1E8DE`
- **Content:**
  - Team avatar (80x80)
  - Team name (24px bold)
  - Final score (64px, `#1A54F4`, font-weight 800)
  - Coins earned: Coin icon + number (28px, `#FFC72C`)
- **Winner Highlight:** Winner card gets a golden border (4px `#FFC72C`) and a crown icon
- **Draw State:** Both cards get equal celebration treatment, text "Égalité!" displayed

#### 2. Score Animation
- **Trigger:** On mount
- **Effect:** Score counts up from 0 to final value over 2s
- **Coins:** Count up 200ms after score completes
- **Easing:** `Power2.easeOut`

#### 3. Souk Shop Grid
- **Title:** "Le Souk Virtuel — Dépense tes pièces!"
- **Layout:** 3-column grid of item cards, gap 24px
- **Items:**
```typescript
interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string; // SVG or image path
  category: 'background' | 'accessory' | 'emote';
}

const shopItems: ShopItem[] = [
  { id: 'carpet-backdrop', name: 'Tapis Amazigh', description: 'Un fond traditionnel pour votre avatar', cost: 10, icon: '/shop/carpet.png', category: 'background' },
  { id: 'silver-crown', name: 'Tazarshit', description: 'Couronne d\'argent traditionnelle', cost: 15, icon: '/shop/crown.png', category: 'accessory' },
  { id: 'djellaba-cape', name: 'Djellaba', description: 'Cape traditionnelle colorée', cost: 12, icon: '/shop/djellaba.png', category: 'accessory' },
  { id: 'drum-emote', name: 'Bendir', description: 'Emote avec tambour', cost: 8, icon: '/shop/drum.png', category: 'emote' },
  { id: 'tea-set', name: 'Atay', description: 'Service à thé marocain', cost: 10, icon: '/shop/tea.png', category: 'accessory' },
  { id: 'souk-lantern', name: 'Fanous', description: 'Lanterne du souk', cost: 12, icon: '/shop/lantern.png', category: 'background' },
];
```

#### 4. Shop Item Card
- **Size:** Full column width, ~280px tall
- **Style:** `#FFFFFF` bg, border-radius 16px, shadow `0 6px 0 #E1E8DE`
- **Content:**
  - Item icon/image area (120x120, centered)
  - Item name (18px bold)
  - Description (14px, muted)
  - Cost badge: Coin icon + number (16px, `#FFC72C`)
  - Buy button: "Acheter" (full width, `#1A54F4` bg if affordable, grey if not)
- **States:**
  - Affordable: Normal styling
  - Unaffordable: opacity 0.5, button disabled
  - Purchased: Green checkmark replaces button, "Possédé" text

#### 5. Coin Display
- **Position:** Fixed bottom-right, floating pill
- **Style:** `#FFC72C` bg, `#1E252B` text, border-radius 24px, padding 12px 24px
- **Content:** Coin icon + remaining coins count
- **Animation:** Updates with a quick scale bounce

### Animations
- **Score cards entrance:** Slide in from sides (left card from left, right card from right), 400ms, ease Power3.out
- **Shop grid:** Staggered fade-in, 80ms per card, translateY(30px)→0
- **Purchase success:** 
  - Item card flashes green briefly
  - Coin count decrements with bounce
  - Small "-X" floating text from coin display
  - Buy button transforms to green "Possédé" checkmark

---

## Page: Game Over (View: 'gameover')

### Layout
- **Full-screen:** 100vh
- **Background:** Gradient `linear-gradient(135deg, #1A54F4 0%, #00A86B 100%)`
- **Content:** Centered

### Elements
1. **Trophy/Tree Icon:**
   - Large white tree glyph or trophy SVG, 120px
   - Subtle glow animation

2. **Winner Announcement:**
   - "Félicitations!" (48px, white)
   - Winner team name (64px, white, bold)
   - Or "Tout le monde a gagné!" for draws

3. **Final Stats:**
   - Both team scores displayed side by side
   - Total coins earned

4. **Action Buttons:**
   - "Rejouer" — `#FFC72C` bg, large pill button
   - "Retour à l'accueil" — transparent, white border

### Animations
- **Background:** Subtle animated gradient shift (hue rotation over 10s)
- **Elements:** Staggered entrance, 200ms apart, scale(0.8)→1 + opacity
- **Confetti:** 50-80 small colored shapes (circles, stars) falling from top, random horizontal drift, looping for 5s then fading

---

## Utility Components

### TifinaghText
- **Props:** `text: string`, `size?: 'sm'|'md'|'lg'|'xl'`, `color?: string`, `animate?: boolean`
- **Function:** Renders Tifinagh text with proper font stack and line-height
- **Animation:** If `animate=true`, letters stagger in with opacity + translateY

### GameCard
- **Props:** `letter: string`, `state: 'shown'|'hidden'|'correct'|'incorrect'`, `onClick?: () => void`
- **Style:** 160x200px card with tactile shadow
- **States:**
  - shown: Letter displayed normally
  - hidden: Question mark with blue glow
  - correct: Green tint + checkmark
  - incorrect: Red tint + shake animation

### AnswerButton
- **Props:** `content: string`, `selected: boolean`, `correct: boolean|null`, `onClick: () => void`, `disabled: boolean`
- **Style:** Large touch-friendly button (min 80x80)
- **States:**
  - Default: White bg, shadow
  - Selected: Blue border glow
  - Correct (revealed): Green bg, white text
  - Incorrect (revealed): Red bg, white text

### Coin
- **Props:** `count: number`, `size?: 'sm'|'md'|'lg'`
- **Style:** Gold circle (SVG or CSS) with number inside
- **Animation:** Entrance scale bounce, update bounce

### ParticleBurst
- **Trigger:** Correct answer
- **Effect:** 8-12 colored circles radiating from center point
- **Animation:** GSAP timeline, each particle: random angle, 100-150px distance, scale(1→0), opacity(1→0), 800ms

---

## Sound Design (Mock System)

While actual audio files are not included, the app structure supports sound triggers:

```typescript
interface SoundEffects {
  correct: 'play-success-chime',
  incorrect: 'play-soft-buzzer',
  cardFlip: 'play-paper-flip',
  scoreTick: 'play-coin-clink',
  celebration: 'play-ta-da',
  click: 'play-soft-pop',
}
```

- **Correct answer:** High-pitched chime + coin clink
- **Incorrect answer:** Soft buzzer (non-judgmental)
- **Card flip:** Paper rustling sound
- **Score increment:** Coin clinking, one per point
- **Turn switch:** Gentle whoosh
- **Celebration:** Fanfare/ta-da for game completion

All sounds triggered via `playSound(key)` utility that checks `soundEnabled` state.

---

## Responsive Behavior

### Desktop (Primary — Classroom Projector)
- Full layout as described
- Teacher panel as sidebar overlay
- Large touch targets (min 80x80px for buttons)

### Tablet (Teacher's Device)
- Teacher panel becomes full-screen modal
- Simplified stage view
- Touch-optimized buttons (min 64x64px)

### Mobile (Portrait)
- Scoreboard collapses to minimal (scores only)
- Cards stack vertically in games
- Teacher panel is bottom sheet
- Simplified animations for performance

---

## Performance Considerations

1. **Image Preloading:** Use `imagesloaded` library before starting each game round
2. **Animation GPU:** All card animations use `transform` and `opacity` only (GPU-accelerated)
3. **Font Loading:** Tifinagh font preloaded in `<head>` with `font-display: swap`
4. **State Updates:** Batch score updates, use React.memo for game cards
5. **will-change:** Apply `will-change: transform` to animated cards during gameplay only
