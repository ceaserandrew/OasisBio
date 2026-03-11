/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.9816 0.0017 247.8577)',
        foreground: 'oklch(0.1221 0.0036 255.5078)',
        card: 'oklch(1.0000 0 0)',
        'card-foreground': 'oklch(0.1221 0.0036 255.5078)',
        popover: 'oklch(1.0000 0 0)',
        'popover-foreground': 'oklch(0.1221 0.0036 255.5078)',
        primary: 'oklch(0.1221 0.0036 255.5078)',
        'primary-foreground': 'oklch(1.0000 0 0)',
        secondary: 'oklch(0.9653 0 0)',
        'secondary-foreground': 'oklch(0.5560 0 0)',
        muted: 'oklch(0.9653 0 0)',
        'muted-foreground': 'oklch(0.5560 0 0)',
        accent: 'oklch(0.9653 0 0)',
        'accent-foreground': 'oklch(0.1221 0.0036 255.5078)',
        destructive: 'oklch(0.5948 0.2007 25.5645)',
        'destructive-foreground': 'oklch(1.0000 0 0)',
        border: 'oklch(0.9288 0 0)',
        input: 'oklch(0.9288 0 0)',
        ring: 'oklch(0.1221 0.0036 255.5078)',
        // 功能色
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        'display': ['Inter Tight', 'Helvetica Now', 'Satoshi', 'sans-serif'],
        'sans': ['Inter', 'Suisse Intl', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
        },
      },
    },
  },
  plugins: [],
}