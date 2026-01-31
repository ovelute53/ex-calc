/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind가 클래스 이름을 찾을 파일들의 경로를 지정합니다.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 폰트 설정 (Pretendard 우선)
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}