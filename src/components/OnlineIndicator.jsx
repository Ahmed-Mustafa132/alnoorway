import React from "react";

export default function OnlineIndicator({ isOnline = false, size = "md" }) {
  const sizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  };

  const color = isOnline ? "bg-emerald-500" : "bg-red-500";

  return (
    <div className={`${sizes[size]} rounded-full ${color} border-2 border-white shadow-md`} />
  );
}