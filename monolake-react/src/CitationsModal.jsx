import React, { useEffect } from "react";

export default function CitationsModal({ onClose }) {
  // Allow closing with Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        className="bg-gray-900 text-white rounded-xl shadow-2xl relative"
        style={{
          width: "400px",
          maxHeight: "500px",
          overflowY: "auto",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          animation: "fadeIn 0.25s ease-out",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            color: "#aaa",
            fontSize: "14px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
          }}
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-lg font-semibold mb-4 text-center text-gray-100">
          Citations
        </div>

        {/* Content */}
        <div className="credit-text text-sm text-gray-300 space-y-3 leading-relaxed">
        <p>
            <span>
            <a href="https://poly.pizza/m/fq_bAKD1Khg">
            Birds nest </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            Poly by Google</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/eMNhHDZakYp">
            Flying gull </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            Poly by Google</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/45wMLZn4kj1">
            Wolf </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            Poly by Google</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/fZwM-PXohV6">
            shrimp </a>
            by&nbsp;
            <a href="https://poly.pizza/u/angelo%20raffaele%20Catalano">
            angelo raffaele Catalano</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/f8kM9xA_5sV">
            Fly </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            jeremy</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/fBqPJ_8L3H5">
            Osprey </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            Poly by Google</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/4plJcFXhim">
            Duck </a>
            by&nbsp;
            <a href="https://poly.pizza/u/madtrollstudio">
            madtrollstudio</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/6b7Ul6MeLrJ">
            Cactus Wren </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            Poly by Google</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>
        <p>
            <span>
            <a href="https://poly.pizza/m/0WRzrtCIIRp">
            Seagull </a>
            by&nbsp;
            <a href="https://poly.pizza/u/Poly by Google">
            Poly by Google</a>&nbsp;[
            <a href="https://creativecommons.org/licenses/by/3.0/">
            CC-BY</a>] via Poly Pizza
            </span>
        </p>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
