import React from "react";

export const InputField = ({ label, name, type = "text", value, error, onChange }) => {
  return (
    <div style={{ marginBottom: "12px" }}>
      {label && <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        style={{
          padding: "8px 12px",
          width: "100%",
          borderRadius: "6px",
          border: error ? "1px solid #ff4d4f" : "1px solid #ccc",
        }}
      />

      {error && (
        <p style={{ color: "red", marginTop: "4px", fontSize: "13px" }}>
          {error}
        </p>
      )}
    </div>
  );
};
