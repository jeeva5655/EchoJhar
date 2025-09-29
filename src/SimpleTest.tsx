import React from "react";

export default function SimpleTest() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "green" }}>✅ React App is Working!</h1>
      <p>If you can see this, the React app is loading correctly.</p>
      <button onClick={() => alert("Button works!")}>Test Button</button>
    </div>
  );
}