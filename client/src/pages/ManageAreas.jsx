import React, { useEffect, useState } from "react";
import api from "../api";
import ConfirmBox from "../components/ConfirmBox";

const blank = { name: "", pincode: "" };
export default function ManageAreas() {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { const r = await api.get("/areas"); setAreas(r.data.data || []); }
    catch (e) { setNotice(e.response?.data?.message || "Could not load areas. Admin login may be required for this action."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault(); setNotice("");
    try {
      if (editing) await api.put(`/areas/${editing}`, form);
      else await api.post("/areas", form);
      setNotice(editing ? "Area updated successfully" : "Area added successfully");
      setForm(blank); setEditing(null); load();
    } catch (e) { setNotice(e.response?.data?.message || "Could not save area"); }
  }
  function edit(area) { setEditing(area.id); setForm({ name: area.name, pincode: area.pincode }); }
  async function remove() {
    try { await api.delete(`/areas/${removeId}`); setNotice("Area deleted"); setRemoveId(null); load(); }
    catch (e) { setNotice(e.response?.data?.message || "Could not delete area"); setRemoveId(null); }
  }
  return <section>
    <div className="page-title"><div><span className="eyebrow">ADMIN / CONFIGURATION</span><h1>Manage Areas</h1><p>Add and maintain service zones and pincodes.</p></div></div>
    {notice && <div className="notice">{notice}</div>}
    <div className="two-col">
      <form className="panel form" onSubmit={submit}><h2>{editing ? "Edit area" : "Add new area"}</h2>
        <label>Area name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength="60" placeholder="e.g. Zone 1 North" /></label>
        <label>6-digit pincode<input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} required pattern="\d{6}" placeholder="411001" /></label>
        <button>{editing ? "Save changes" : "Add area"}</button>
        {editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(blank); }}>Cancel edit</button>}
      </form>
      <div className="panel"><h2>Service areas</h2>{loading ? <p>Loading...</p> : <div className="table-wrap"><table><thead><tr><th>Name</th><th>Pincode</th><th>Actions</th></tr></thead><tbody>
        {areas.map(a => <tr key={a.id}><td>{a.name}</td><td>{a.pincode}</td><td><button className="small secondary" onClick={() => edit(a)}>Edit</button> <button className="small danger" onClick={() => setRemoveId(a.id)}>Delete</button></td></tr>)}
        {!areas.length && <tr><td colSpan="3">No areas found.</td></tr>}
      </tbody></table></div>}</div>
    </div>
    <ConfirmBox open={Boolean(removeId)} title="Delete area?" message="This area may be linked to bookings. The database will prevent deletion if it is in use." onCancel={() => setRemoveId(null)} onConfirm={remove} />
  </section>;
}
