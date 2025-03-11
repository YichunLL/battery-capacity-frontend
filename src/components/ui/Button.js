import React from "react";  // ✅ Import React (Fix for JSX)

export function Button({ children, onClick }) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
}


