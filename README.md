# AiQA Frontend

Frontend React cho ứng dụng AiQA - hệ thống hỏi đáp tài liệu dựa trên AI.

## Công nghệ

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Routing
- **Recoil**: State management
- **TanStack Query**: Data fetching và caching
- **TailwindCSS**: Styling
- **Chart.js**: Data visualization

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` trong thư mục `frontend` với nội dung:

```env
# Backend API Configuration
# Địa chỉ backend khi chạy development server
VITE_API_URL=http://localhost:8000

# Base URL cho API calls (dùng khi build production)
# Nếu frontend và backend cùng domain: VITE_API_BASE_URL=/api
# Nếu khác domain: VITE_API_BASE_URL=http://your-backend-domain.com/api
VITE_API_BASE_URL=/api
```

**Lưu ý:**

- `VITE_API_URL`: Dùng cho Vite proxy trong development mode
- `VITE_API_BASE_URL`: Dùng cho production build (axios baseURL)

## Chạy

### Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Production build

```bash
npm run build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── api/           # API client và axios config
├── atoms/         # Recoil atoms (state)
├── components/    # React components
│   ├── auth/      # Authentication components
│   ├── chat/      # Chat components
│   ├── common/    # Common/shared components
│   └── documents/ # Document components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Features

- **Authentication**: Đăng nhập/đăng ký với session-based auth
- **PDF Management**: Upload và quản lý tài liệu PDF
- **Chat Interface**: Giao diện chat với streaming support
- **Conversations**: Quản lý nhiều cuộc hội thoại
- **Scoring**: Đánh giá và theo dõi chất lượng hội thoại
