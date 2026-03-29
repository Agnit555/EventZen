import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Budget.css";
import { useNavigate } from "react-router-dom";

export default function BudgetPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    eventId: "",
    eventName: "",
    totalBudget: "",
    venueCost: "",
    foodCost: "",
    logisticsCost: ""
  });
  const [saved, setSaved] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [noBudgetMsg, setNoBudgetMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // ✅ FETCH EVENTS
  useEffect(() => {
    API.get("/api/budget/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SELECT EVENT
  const handleEventChange = async (e) => {
    const selected = events.find(ev => ev.id === Number(e.target.value));
    if (!selected) return;

    const newForm = {
      eventId: selected.id,
      eventName: selected.title,
      totalBudget: "",
      venueCost: "",
      foodCost: "",
      logisticsCost: ""
    };

    setForm(newForm);

    // reset
    setSaved(false);
    setSavedData(null);
    setNoBudgetMsg("");
    setIsEditing(false);

    try {
      const res = await API.get(`/api/budget/${selected.id}`);
      console.log("API RESPONSE:", res.data); // 🔥 DEBUG

      if (res.data) {
        const data = res.data;

        setSaved(true);
        setSavedData(data);

        // ✅ SAFE MAPPING (handles casing issues)
        setForm({
          eventId: data.eventId || data.eventid || "",
          eventName: data.eventName || data.eventname || "",
          totalBudget: data.totalBudget || data.totalbudget || "",
          venueCost: data.venueCost || data.venuecost || "",
          foodCost: data.foodCost || data.foodcost || "",
          logisticsCost: data.logisticsCost || data.logisticscost || ""
        });
      }
    } catch (err) {
      setNoBudgetMsg(`${selected.title} budget not yet prepared`);
    }
  };

  // ✅ SUBMIT (CREATE + UPDATE)
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        totalBudget: Number(form.totalBudget),
        venueCost: Number(form.venueCost),
        foodCost: Number(form.foodCost),
        logisticsCost: Number(form.logisticsCost)
      };

      await API.post("/api/budget", payload);

      alert(isEditing ? "Budget Updated!" : "Budget Saved!");

      setSaved(true);
      setSavedData(payload);
      setIsEditing(false);

    } catch (err) {
      console.error(err);
      alert("Error saving budget");
    }
  };

  // ✅ SAFE CALCULATIONS (handles both cases)
  const v = Number(savedData?.venueCost ?? savedData?.venuecost ?? 0);
  const f = Number(savedData?.foodCost ?? savedData?.foodcost ?? 0);
  const l = Number(savedData?.logisticsCost ?? savedData?.logisticscost ?? 0);
  const t = Number(savedData?.totalBudget ?? savedData?.totalbudget ?? 0);

  return (
    <div>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">EventZen</div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="budget-container">

        {/* TITLE */}
        <h2 className="budget-title">Budget Management</h2>

        {/* FORM */}
        <div className="budget-form">

          {/* EVENT DROPDOWN */}
          <select className="budget-select" onChange={handleEventChange}>
            <option>Select Event</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          {/* ✅ FIXED CONTROLLED INPUTS */}
          <input
            className="budget-input"
            name="totalBudget"
            value={form.totalBudget || ""}
            onChange={handleChange}
            placeholder="Total Budget"
          />

          <input
            className="budget-input"
            name="venueCost"
            value={form.venueCost || ""}
            onChange={handleChange}
            placeholder="Venue Cost"
          />

          <input
            className="budget-input"
            name="foodCost"
            value={form.foodCost || ""}
            onChange={handleChange}
            placeholder="Food Cost"
          />

          <input
            className="budget-input"
            name="logisticsCost"
            value={form.logisticsCost || ""}
            onChange={handleChange}
            placeholder="Logistics Cost"
          />

          {/* SAVE / UPDATE */}
          {(!saved || isEditing) && (
            <button className="budget-btn" onClick={handleSubmit}>
              {isEditing ? "Update Budget" : "Save Budget"}
            </button>
          )}
        </div>

        {noBudgetMsg && (
          <p className="budget-empty">{noBudgetMsg}</p>
        )}

        {/* TABLE */}
        {savedData && (
          <div className="budget-table-box">
            <h3>{savedData?.eventName || savedData?.eventname} Expense Chart</h3>

            <table className="budget-table">
              <thead>
                <tr>
                  <th>Total Budget</th>
                  <th>Venue</th>
                  <th>Food</th>
                  <th>Logistics</th>
                  <th>Total Expense</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t}</td>
                  <td>{v}</td>
                  <td>{f}</td>
                  <td>{l}</td>
                  <td>{v + f + l}</td>
                  <td>{t - (v + f + l)}</td>
                </tr>
              </tbody>
            </table>

            {/* EDIT BUTTON */}
            {!isEditing && (
              <button
                className="budget-btn edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Budget
              </button>
            )}
          </div>
        )}

      </div>

      <button
        className="budget-back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}