import { useState } from "react";
import axios from "axios";
import { currentUser } from "../mockSession";
import "../styles/EprDetailModal.css";

export default function EprDetailModal({ epr, onClose, onUpdated }: any) {

  const isStudent = currentUser.role === "student";
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    overall_rating: epr.overall_rating,
    technical_skills_rating: epr.technical_skills_rating,
    non_technical_skills_rating: epr.non_technical_skills_rating,
    remarks: epr.remarks,
    status: epr.status
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    setSaving(true);
    await axios.patch(
      `http://localhost:5000/api/epr/${epr.id}`,
      form,
      {
        headers: {
          "x-user-id": currentUser.id,
          "x-user-role": currentUser.role
        }
      }
    );
    setSaving(false);
    onUpdated();
    onClose();
  };

  const statusClass: Record<string, string> = {
    draft: "epr-status--draft",
    submitted: "epr-status--submitted",
    archived: "epr-status--archived"
  };

  return (
    <div className="epr-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="epr-modal">

        {/* Header */}
        <div className="epr-modal__header">
          <div className="epr-modal__header-left">
            <span className="epr-modal__eyebrow">Performance Review</span>
            <h3 className="epr-modal__title">EPR Details</h3>
          </div>
          <span className={`epr-status ${statusClass[form.status] ?? ""}`}>
            {form.status}
          </span>
        </div>

        <div className="epr-modal__divider" />

        {/* Ratings grid */}
        <div className="epr-modal__ratings-grid">

          <div className="epr-modal__field">
            <label className="epr-modal__label">Overall Rating</label>
            <div className="epr-modal__input-wrap">
              <input
                className="epr-modal__input"
                type="number"
                name="overall_rating"
                min="1" max="5"
                value={form.overall_rating}
                onChange={handleChange}
                disabled={isStudent || !edit}
              />
              <span className="epr-modal__input-suffix">/ 5</span>
            </div>
          </div>

          <div className="epr-modal__field">
            <label className="epr-modal__label">Technical Skills</label>
            <div className="epr-modal__input-wrap">
              <input
                className="epr-modal__input"
                type="number"
                name="technical_skills_rating"
                min="1" max="5"
                value={form.technical_skills_rating}
                onChange={handleChange}
                disabled={isStudent || !edit}
              />
              <span className="epr-modal__input-suffix">/ 5</span>
            </div>
          </div>

          <div className="epr-modal__field">
            <label className="epr-modal__label">Non-Technical Skills</label>
            <div className="epr-modal__input-wrap">
              <input
                className="epr-modal__input"
                type="number"
                name="non_technical_skills_rating"
                min="1" max="5"
                value={form.non_technical_skills_rating}
                onChange={handleChange}
                disabled={isStudent || !edit}
              />
              <span className="epr-modal__input-suffix">/ 5</span>
            </div>
          </div>

          <div className="epr-modal__field">
            <label className="epr-modal__label">Status</label>
            <select
              className="epr-modal__select"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={isStudent || !edit}
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="archived">Archived</option>
            </select>
          </div>

        </div>

        {/* Remarks */}
        <div className="epr-modal__field epr-modal__field--full">
          <label className="epr-modal__label">Remarks</label>
          <textarea
            className="epr-modal__textarea"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            disabled={isStudent || !edit}
            placeholder="No remarks added yet..."
          />
        </div>

        <div className="epr-modal__divider" />

        {/* Footer */}
        <div className="epr-modal__actions">
          <button className="epr-modal__btn epr-modal__btn--ghost" onClick={onClose}>
            Close
          </button>
          {!isStudent && (
            !edit ? (
              <button className="epr-modal__btn epr-modal__btn--primary" onClick={() => setEdit(true)}>
                ✎ &nbsp;Edit
              </button>
            ) : (
              <button className="epr-modal__btn epr-modal__btn--primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
}