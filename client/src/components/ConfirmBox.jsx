import React from "react";
export default function ConfirmBox({ open, title = "Are you sure?", message, onCancel, onConfirm }) {
  if (!open) return null;
  return <div className="modal-backdrop"><section className="modal">
    <h3>{title}</h3><p>{message || "This action cannot be undone."}</p>
    <div className="actions"><button className="secondary" onClick={onCancel}>Cancel</button><button className="danger" onClick={onConfirm}>Confirm</button></div>
  </section></div>;
}
