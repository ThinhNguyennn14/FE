/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Màu chính cho light mode (giữ nguyên)
        primary: {
          DEFAULT: '#4318FF',
          hover: '#3311DB',
        },
        // Bảng màu mới cho dark mode (lấy cảm hứng từ ảnh)
        dark: {
          bg: {
            primary: '#050A15',   // Nền chính tối nhất
            secondary: '#0A1122', // Nền phụ cho card/sidebar
            tertiary: '#131C33',  // Nền cho các input/phần tử nhỏ
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#A3AED0',
            muted: '#707EAE',
          },
          border: '#1B254B',
          // Màu neon chủ đạo
          neon: {
            blue: '#00E5FF',
            purple: '#7B61FF',
            green: '#05CD99',
            orange: '#FFB547',
            red: '#E31A1A',
          }
        }
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 229, 255, 0.3)',
        'neon-purple': '0 0 15px rgba(123, 97, 255, 0.3)',
        'card-dark': '0px 10px 30px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%)',
      }
    },
  },
  plugins: [],
}