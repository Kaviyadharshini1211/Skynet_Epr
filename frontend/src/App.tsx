import { useState } from "react";
import PeopleList from "./components/PeopleList";
import PersonDetails from "./components/PersonDetails";
import "./styles/App.css";

export default function App() {

  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  return (
    <div className="app-layout">

      {/* LEFT PANEL */}
      <aside className="app-sidebar">
        <PeopleList onSelect={setSelectedPerson} />
      </aside>

      {/* RIGHT PANEL */}
      <main className="app-detail">
        <PersonDetails person={selectedPerson} />
      </main>

    </div>
  );
}