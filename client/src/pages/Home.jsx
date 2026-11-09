import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
export default function Home() {
  const [areas, setAreas] = useState([]);
  useEffect(() => { api.get("/areas").then(r => setAreas(r.data.data || [])).catch(() => {}); }, []);
  return <div>
    <section className="hero">
      <span className="eyebrow">SMART • SIMPLE • SUSTAINABLE</span>
      <h1>Waste collection,<br/><span>made effortless.</span></h1>
      <p>Book a doorstep pickup and help keep your neighbourhood clean.</p>
      <Link className="button" to="/contact">Contact our team</Link>
    </section>
    <section className="section">
      <h2>How it works</h2><div className="cards">
        <article className="card"><b>01</b><h3>Choose your pickup</h3><p>Select the waste type, area and convenient time slot.</p></article>
        <article className="card"><b>02</b><h3>We assign a collector</h3><p>Our team assigns a collection professional to your request.</p></article>
        <article className="card"><b>03</b><h3>Track completion</h3><p>Follow your booking status until collection is complete.</p></article>
      </div>
    </section>
    <section className="section"><h2>Service areas</h2><div className="chips">{areas.filter(a => a.is_active).map(a => <span className="chip" key={a.id}>{a.name} · {a.pincode}</span>)}</div></section>
  </div>;
}
