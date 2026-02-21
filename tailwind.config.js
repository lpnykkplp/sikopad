/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    850: '#172033',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(6, 182, 212, 0.3)',
                'glow': '0 0 20px rgba(6, 182, 212, 0.4)',
                'glow-lg': '0 0 40px rgba(6, 182, 212, 0.5)',
                'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
                'glow-teal': '0 0 20px rgba(20, 184, 166, 0.4)',
                'inner-glow': 'inset 0 0 20px rgba(6, 182, 212, 0.15)',
            },
            animation: {
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.4s ease-out',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
