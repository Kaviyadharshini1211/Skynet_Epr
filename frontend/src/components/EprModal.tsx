import { useState } from "react";
import axios from "axios";
import { currentUser } from "../mockSession";
import "../styles/EprModal.css";

export default function EprModal({ person, onClose, onCreated }: any) {

  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    period_start: "",
    period_end: "",
    overall_rating: "",
    technical_skills_rating: "",
    non_technical_skills_rating: "",
    remarks: "",
    status: "draft"
  });

  const handleChange = (e: any) => {

    let value = e.target.value;

    /* Ensure ratings stay between 1–5 */

    if (
      e.target.name === "overall_rating" ||
      e.target.name === "technical_skills_rating" ||
      e.target.name === "non_technical_skills_rating"
    ) {

      if (value !== "") {
        const num = Number(value);

        if (num < 1 || num > 5) {
          setError("Ratings must be between 1 and 5");
        } else {
          setError("");
        }
      }

    }

    setForm({ ...form, [e.target.name]: value });
  };

  const submit = async () => {

    setError("");

    if (!form.period_start || !form.period_end) {
      setError("Please select an evaluation period.");
      return;
    }

    if (!form.overall_rating || !form.technical_skills_rating || !form.non_technical_skills_rating) {
      setError("Please fill all rating fields.");
      return;
    }

    /* Validate ratings */

    const ratings = [
      Number(form.overall_rating),
      Number(form.technical_skills_rating),
      Number(form.non_technical_skills_rating)
    ];

    for (let r of ratings) {
      if (r < 1 || r > 5) {
        setError("Ratings must be between 1 and 5.");
        return;
      }
    }

    try {

      setSaving(true);

      await axios.post(
        "http://localhost:5000/api/epr",
        {
          ...form,
          overall_rating: Number(form.overall_rating),
          technical_skills_rating: Number(form.technical_skills_rating),
          non_technical_skills_rating: Number(form.non_technical_skills_rating),
          person_id: person.id,
          evaluator_id: currentUser.id,
          role_type: person.role
        },
        {
          headers: {
            "x-user-id": currentUser.id,
            "x-user-role": currentUser.role
          }
        }
      );

      onCreated();
      onClose();

    } catch (err: any) {

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create EPR.");
      }

    } finally {

      setSaving(false);

    }
  };

  const generateRemarks = async () => {

    if (!form.overall_rating || !form.technical_skills_rating || !form.non_technical_skills_rating) {
      setError("Enter ratings before generating AI remarks.");
      return;
    }

    try {

      setGenerating(true);

      const res = await axios.post(
        "http://localhost:5000/api/epr/assist",
        {
          overallRating: Number(form.overall_rating),
          technicalSkillsRating: Number(form.technical_skills_rating),
          nonTechnicalSkillsRating: Number(form.non_technical_skills_rating)
        }
      );

      setForm({ ...form, remarks: res.data.suggestedRemarks });

    } catch (err) {

      console.error("AI assist failed", err);
      setError("AI remark generation failed.");

    } finally {

      setGenerating(false);

    }

  };

  return (
    <div className="eprm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="eprm-modal">

        {/* Header */}
        <div className="eprm-modal__header">
          <div className="eprm-modal__header-left">
            <span className="eprm-modal__eyebrow">New Entry</span>
            <h3 className="eprm-modal__title">Create Performance Record</h3>
          </div>

          {person && (
            <div className="eprm-modal__person-badge">
              <span className="eprm-modal__person-name">{person.name}</span>
              <span className="eprm-modal__person-role">{person.role}</span>
            </div>
          )}

        </div>

        <div className="eprm-modal__divider" />

        {/* Error */}
        {error && (
          <div className="eprm-error">
            <span className="eprm-error__icon">⚠</span> {error}
          </div>
        )}

        {/* Period */}
        <div className="eprm-modal__row">

          <div className="eprm-modal__field">
            <label className="eprm-modal__label">Period Start</label>
            <input
              className="eprm-modal__input"
              type="date"
              name="period_start"
              onChange={handleChange}
            />
          </div>

          <div className="eprm-modal__field">
            <label className="eprm-modal__label">Period End</label>
            <input
              className="eprm-modal__input"
              type="date"
              name="period_end"
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Ratings */}
        <div className="eprm-modal__row">

          <div className="eprm-modal__field">
            <label className="eprm-modal__label">Overall Rating</label>
            <input
              className="eprm-modal__input"
              type="number"
              name="overall_rating"
              min="1"
              max="5"
              onChange={handleChange}
            />
          </div>

          <div className="eprm-modal__field">
            <label className="eprm-modal__label">Technical Skills</label>
            <input
              className="eprm-modal__input"
              type="number"
              name="technical_skills_rating"
              min="1"
              max="5"
              onChange={handleChange}
            />
          </div>

          <div className="eprm-modal__field">
            <label className="eprm-modal__label">Non-Technical Skills</label>
            <input
              className="eprm-modal__input"
              type="number"
              name="non_technical_skills_rating"
              min="1"
              max="5"
              onChange={handleChange}
            />
          </div>

          <div className="eprm-modal__field">
            <label className="eprm-modal__label">Status</label>
            <select
              className="eprm-modal__select"
              name="status"
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>

        </div>

        {/* Remarks */}
        <div className="eprm-modal__field">

          <div className="eprm-modal__label-row">

            <label className="eprm-modal__label">
              Instructor Remarks
            </label>

            <button
              className="eprm-modal__btn eprm-modal__btn--ai"
              type="button"
              onClick={generateRemarks}
              disabled={generating}
            >
              {generating ? "Generating…" : "✦ AI Suggest"}
            </button>

          </div>

          <textarea
            className="eprm-modal__textarea"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Write remarks or use AI to generate…"
          />

        </div>

        <div className="eprm-modal__divider" />

        {/* Footer */}
        <div className="eprm-modal__actions">

          <button
            className="eprm-modal__btn eprm-modal__btn--ghost"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="eprm-modal__btn eprm-modal__btn--primary"
            onClick={submit}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save EPR"}
          </button>

        </div>

      </div>
    </div>
  );
}