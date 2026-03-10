import { useEffect, useState } from "react";
import axios from "axios";
import EprModal from "./EprModal";
import EprDetailModal from "./EprDetailModal";
import { currentUser } from "../mockSession";
import "../styles/PersonDetails.css";

export default function PersonDetails({ person }: any) {

  const [eprs, setEprs]             = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEpr, setSelectedEpr] = useState<any>(null);
  const [summary, setSummary]       = useState<any>(null);

  useEffect(() => {
    if (person?.id) {
      fetchEprs();
      fetchSummary();
    }
  }, [person]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/epr/summary/${person.id}`,
        { headers: { "x-user-id": currentUser.id, "x-user-role": currentUser.role } }
      );
      setSummary(res.data);
    } catch {
      setSummary(null);
    }
  };

  const fetchEprs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/epr?personId=${person.id}`,
        { headers: { "x-user-id": currentUser.id, "x-user-role": currentUser.role } }
      );
      setEprs(res.data);
    } catch (error) {
      console.error("EPR fetch failed", error);
    }
  };

  if (!person) {
    return (
      <div className="pd-empty">
        <span className="pd-empty__icon">◎</span>
        <p>Select a person to view their details</p>
      </div>
    );
  }

  const statusClass: Record<string, string> = {
    draft:     "pd-epr-status--draft",
    submitted: "pd-epr-status--submitted",
    archived:  "pd-epr-status--archived",
  };

  const ratingColor = (r: number) => {
    if (r >= 4.5) return "pd-stat__value--high";
    if (r >= 3)   return "pd-stat__value--mid";
    return "pd-stat__value--low";
  };

  return (
    <div className="pd-container">

      {/* Person header */}
      <div className="pd-person-header">
        <div className={`pd-person-avatar ${person.role === "instructor" ? "pd-person-avatar--instructor" : "pd-person-avatar--student"}`}>
          {person.name.charAt(0).toUpperCase()}
        </div>
        <div className="pd-person-header__info">
          <div className="pd-person-header__top">
            <h2 className="pd-person-name">{person.name}</h2>
            <span className={`pd-role-badge ${person.role === "instructor" ? "pd-role-badge--instructor" : "pd-role-badge--student"}`}>
              {person.role}
            </span>
          </div>
          <span className="pd-person-email">{person.email}</span>
        </div>

        {currentUser.role === "instructor" && person.role === "student" && (
          <button className="pd-btn pd-btn--primary" onClick={() => setShowCreate(true)}>
            + New EPR
          </button>
        )}
      </div>

      <div className="pd-divider" />

      {/* Performance Snapshot */}
      {summary && (
        <div className="pd-snapshot">
          <div className="pd-section-eyebrow">Performance Snapshot</div>

          <div className="pd-stats-grid">
            <div className="pd-stat">
              <span className="pd-stat__label">Overall Avg</span>
              <span className={`pd-stat__value ${ratingColor(summary.averageOverallRating)}`}>
                {summary.averageOverallRating}
                <span className="pd-stat__denom">/5</span>
              </span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat__label">Technical</span>
              <span className={`pd-stat__value ${ratingColor(summary.averageTechnicalRating)}`}>
                {summary.averageTechnicalRating}
                <span className="pd-stat__denom">/5</span>
              </span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat__label">Non-Technical</span>
              <span className={`pd-stat__value ${ratingColor(summary.averageNonTechnicalRating)}`}>
                {summary.averageNonTechnicalRating}
                <span className="pd-stat__denom">/5</span>
              </span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat__label">Total EPRs</span>
              <span className="pd-stat__value pd-stat__value--neutral">
                {summary.eprCount}
              </span>
            </div>
          </div>

          {summary.lastThreePeriods?.length > 0 && (
            <div className="pd-trend">
              <span className="pd-trend__label">Recent Trend</span>
              <div className="pd-trend__list">
                {summary.lastThreePeriods.map((p: any, index: number) => {
                  const start     = new Date(p.period_start);
                  const end       = new Date(p.period_end);
                  const startMonth = start.toLocaleString("default", { month: "short" });
                  const endMonth   = end.toLocaleString("default", { month: "short" });
                  const year       = end.getFullYear();
                  return (
                    <div key={index} className="pd-trend__item">
                      <span className="pd-trend__period">
                        {startMonth}–{endMonth} {year}
                      </span>
                      <span className="pd-trend__arrow">→</span>
                      <span className={`pd-trend__rating ${ratingColor(p.overall_rating)}`}>
                        {p.overall_rating} / 5
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pd-divider" />

      {/* EPR list */}
      <div className="pd-section-eyebrow">Performance Records</div>

      <div className="pd-epr-list">
        {eprs.length === 0 && (
          <div className="pd-epr-empty">No performance records yet.</div>
        )}

        {eprs.map((epr) => (
          <div
            key={epr.id}
            className="pd-epr-card"
            onClick={() => setSelectedEpr(epr)}
          >
            <div className="pd-epr-card__left">
              <span className="pd-epr-card__period">
                {new Date(epr.period_start).toLocaleDateString()} — {new Date(epr.period_end).toLocaleDateString()}
              </span>
              <div className="pd-epr-card__rating">
                Rating <strong>{epr.overall_rating}</strong><span className="pd-epr-card__denom">/5</span>
              </div>
            </div>
            <div className="pd-epr-card__right">
              <span className={`pd-epr-status ${statusClass[epr.status] ?? ""}`}>
                {epr.status}
              </span>
              <span className="pd-epr-card__arrow">›</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreate && (
        <EprModal
          person={person}
          onClose={() => setShowCreate(false)}
          onCreated={() => { fetchEprs(); fetchSummary(); }}
        />
      )}

      {selectedEpr && (
        <EprDetailModal
          epr={selectedEpr}
          onClose={() => setSelectedEpr(null)}
          onUpdated={() => { fetchEprs(); fetchSummary(); }}
        />
      )}

    </div>
  );
}