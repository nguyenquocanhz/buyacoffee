/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",            // Các file HTML ở thư mục gốc
    "./assets/**/*.js",    // Chỉ quét file JS trong thư mục assets
    // "./src/**/*.{html,js}" // Nếu bạn có thư mục src, hãy dùng dòng này
  ],
  darkMode: 'class', // Quan trọng: Chế độ tối kích hoạt bằng class
  theme: {
    extend: {
      colors: {
        primary: '#0a68ac',     // Màu chủ đạo
        
        // --- Light Mode Palette ---
        dark: '#242526',        // Text chính
        white: '#ffffff',       
        accent: '#0d6efd',      
        appGray: '#808080',        
        slate: '#495057',       
        border: '#e9e9e9',      
        bgLight: '#f8f9fa',
        
        // --- Dark Mode Palette ---
        darker: '#18191a',      // Nền body tối
        cardDark: '#242526',    // Nền card tối
        bgDark: '#3a3b3c',      // Nền element tối
        borderDark: '#3e4042',  // Border tối
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'heading': ['16.1px', '1.5'], 
        'btn': ['18.2px', '1.5'],     
        'link': ['15.05px', '1.5'],   
      },
      borderRadius: {
        'sm': '4px',    
        'md': '8px',    
        'lg': '10px',   
        'xl': '12px',   // Dùng cho các nút bo tròn lớn
        'full': '50%',  
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)', // Shadow đậm hơn cho nền tối
      }
    }
  },
  plugins: [],
}