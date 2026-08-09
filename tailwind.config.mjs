/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-panel': 'var(--paper-panel)',
        ink: 'var(--ink)',
        'ink-secondary': 'var(--ink-secondary)',
        'ink-tertiary': 'var(--ink-tertiary)',
        'ink-faint': 'var(--ink-tertiary)',
        'ink-muted': 'var(--ink-secondary)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        bg: 'var(--paper)',
        surface: 'var(--surface)',
        rule: 'var(--line)'
      },
      fontFamily: {
        hand: ['Caveat', 'cursive', 'handwriting'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
