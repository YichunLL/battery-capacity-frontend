import React from "react";  // ✅ Import React for JSX

export function Card({ children }) {
  return <div className="p-6 bg-white shadow-md rounded-lg">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
