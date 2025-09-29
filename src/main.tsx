
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";

// Simple test to see if React is working
function TestComponent() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'var(--background)',
      color: 'var(--foreground)',
      minHeight: '100vh'
    }}>
      <h1>🎉 React App is Working!</h1>
      <p>If you can see this, React is loading correctly.</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Clicked {count} times
      </button>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => {
            window.location.href = window.location.href.replace(/TestComponent/, '');
            loadMainApp();
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Load Main Tourism App
        </button>
      </div>
    </div>
  );
}

function loadMainApp() {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}

// Check if URL has test parameter to show test component
const urlParams = new URLSearchParams(window.location.search);
const showTest = urlParams.get('test') === 'true';

if (showTest) {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}