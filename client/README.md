# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Variables

The frontend supports the following environment variables for backend connection:

- `VITE_BACKEND`: The backend API URL (e.g., `http://localhost:3000` or a remote server). If this starts with `mongodb`, it will be used as the MongoDB connection string (for fullstack setups).
- `VITE_MONGO`: Alternative MongoDB connection string (optional, for advanced setups).

**Example .env file:**

```
# For local development
VITE_BACKEND=http://localhost:3000

# For production/Atlas
# VITE_BACKEND=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

The frontend will automatically use the correct variable based on your setup.
