"use client";

import Image from "next/image";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function ImagePreviewModal({ src, alt, open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open || !src) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-6">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:opacity-70 transition"
      >
        <FiX className="w-6 h-6" />
      </button>

      <div className="relative max-w-3xl w-full max-h-[90vh]">
        <Image
          src={src}
          alt={alt || "Preview"}
          width={1200}
          height={1200}
          className="object-contain w-full h-auto rounded-xl"
        />
      </div>
    </div>
  );
}
