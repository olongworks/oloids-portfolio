"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f3f2ee",
        color: "#070707",
        fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
        padding: "24px"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, opacity: 0.55, fontSize: "0.82rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Something interrupted the preview
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "16px",
            border: "1px solid rgba(7, 7, 7, 0.14)",
            borderRadius: "999px",
            padding: "10px 16px",
            background: "rgba(255, 255, 255, 0.72)",
            cursor: "pointer"
          }}
        >
          Reload view
        </button>
      </div>
    </main>
  );
}
