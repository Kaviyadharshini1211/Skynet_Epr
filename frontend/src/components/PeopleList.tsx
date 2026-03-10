import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PeopleList.css";

type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  course_name?: string;
  status?: string;
  total_eprs_written?: number;
};

const ROLES = [
  { label: "All",         value: "" },
  { label: "Students",    value: "student" },
  { label: "Instructors", value: "instructor" },
];

export default function PeopleList({ onSelect }: any) {

  const [people, setPeople]   = useState<Person[]>([]);
  const [role, setRole]       = useState("");
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, [role, search]);

  const fetchPeople = async () => {
    setLoading(true);
    const params: any = {};
    if (role)   params.role   = role;
    if (search) params.search = search;
    const res = await axios.get("http://localhost:5000/api/people", { params });
    setPeople(res.data);
    setLoading(false);
  };

  const statusClass: Record<string, string> = {
    active:   "pl-badge--active",
    inactive: "pl-badge--inactive",
    pending:  "pl-badge--pending",
  };

  return (
    <div className="pl-container">

      {/* Header */}
      <div className="pl-header">
        <span className="pl-eyebrow">Directory</span>
        <h2 className="pl-title">People</h2>
      </div>

      {/* Role filter tabs */}
      <div className="pl-tabs">
        {ROLES.map((r) => (
          <button
            key={r.value}
            className={`pl-tab ${role === r.value ? "pl-tab--active" : ""}`}
            onClick={() => setRole(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="pl-search-wrap">
        <span className="pl-search-icon">⌕</span>
        <input
          className="pl-search"
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="pl-search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* List */}
      <div className="pl-list">
        {loading && (
          <div className="pl-empty">
            <span className="pl-spinner" />
          </div>
        )}

        {!loading && people.length === 0 && (
          <div className="pl-empty">No people found.</div>
        )}

        {!loading && people.map((person) => (
          <div
            key={person.id}
            className="pl-card"
            onClick={() => onSelect(person)}
          >
            {/* Avatar */}
            <div className={`pl-avatar ${person.role === "instructor" ? "pl-avatar--instructor" : "pl-avatar--student"}`}>
              {person.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="pl-card__info">
              <div className="pl-card__top">
                <strong className="pl-card__name">{person.name}</strong>
                <span className={`pl-role-badge ${person.role === "instructor" ? "pl-role-badge--instructor" : "pl-role-badge--student"}`}>
                  {person.role}
                </span>
              </div>

              <div className="pl-card__email">{person.email}</div>

              <div className="pl-card__meta">
                {person.role === "student" && (
                  <>
                    {person.course_name && (
                      <span className="pl-meta-item">
                        <span className="pl-meta-icon">◎</span> {person.course_name}
                      </span>
                    )}
                    {person.status && (
                      <span className={`pl-badge ${statusClass[person.status] ?? ""}`}>
                        {person.status}
                      </span>
                    )}
                  </>
                )}

                {person.role === "instructor" && (
                  <span className="pl-meta-item">
                    <span className="pl-meta-icon">✎</span> {person.total_eprs_written ?? 0} EPRs written
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <span className="pl-card__arrow">›</span>
          </div>
        ))}
      </div>

    </div>
  );
}