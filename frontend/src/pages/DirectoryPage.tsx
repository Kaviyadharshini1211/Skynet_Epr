import { useEffect, useState } from "react";
import { getPeople } from "../services/api";
import "../styles/DirectoryPage.css";

export default function DirectoryPage() {

  const [people, setPeople] = useState<any[]>([]);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const res = await getPeople();
    setPeople(res.data);
  };

  return (
    <div className="dir-container">

      <div className="dir-sidebar">
        <h2 className="dir-sidebar__title">People Directory</h2>

        {people.map((p) => (
          <div key={p.id} className="dir-card">
            <strong className="dir-card__name">{p.name}</strong>
            <div className="dir-card__role">{p.role}</div>
          </div>
        ))}
      </div>

      <div className="dir-detail">
        <h3 className="dir-detail__placeholder">Select a person</h3>
      </div>

    </div>
  );
}