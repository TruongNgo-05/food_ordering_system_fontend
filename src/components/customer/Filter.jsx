import { T } from "../../constants/customerTheme";

export default function Filter({ setFilter }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {["Tất cả", "Cơm", "Nước", "Bánh"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            background: T.primary,
            color: "white",
            cursor: "pointer",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
