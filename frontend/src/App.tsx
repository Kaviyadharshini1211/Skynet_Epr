import { useState, useEffect } from "react";
import axios from "axios";
import PeopleList from "./components/PeopleList";
import PersonDetails from "./components/PersonDetails";
import "./styles/App.css";
import { currentUser } from "./mockSession";

export default function App() {

  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  /* Fetch people and identify logged-in user */

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const res = await axios.get("http://localhost:5000/api/people");

        const users = res.data;

        const me = users.find((u: any) => String(u.id) === String(currentUser.id));

        if (me) {
          setLoggedInUser(me);
        } else {
          setLoggedInUser({
            id: currentUser.id,
            name: "Current User",
            role: currentUser.role
          });
        }

      } catch (error) {

        console.error("Failed to fetch users", error);

        setLoggedInUser({
          id: currentUser.id,
          name: "Current User",
          role: currentUser.role
        });

      }

    };

    fetchUsers();

  }, []);

  return (
    <div className="app-layout">

      {/* Logged-in user badge */}

      {loggedInUser && (
        <div className="app-user-badge">
          <strong>{loggedInUser.name}</strong>
          <span className="app-user-role">
            ({loggedInUser.role})
          </span>
        </div>
      )}

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