"use client";

import { useState } from "react";
import api from "@/services/api";

export default function TripForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    budget: 10000,
    travel_style: "budget",
    interests: "beaches,food",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post("/trip", {
        ...form,
        interests: form.interests.split(",").map(i => i.trim())
      });

      alert(`Trip Created: ${response.data.id}`);

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-4"
    >
      <input
        placeholder="Destination"
        className="w-full p-3 rounded bg-zinc-900"
        value={form.destination}
        onChange={e=>setForm({...form,destination:e.target.value})}
      />

      <input
        type="date"
        className="w-full p-3 rounded bg-zinc-900"
        value={form.start_date}
        onChange={e=>setForm({...form,start_date:e.target.value})}
      />

      <input
        type="date"
        className="w-full p-3 rounded bg-zinc-900"
        value={form.end_date}
        onChange={e=>setForm({...form,end_date:e.target.value})}
      />

      <input
        type="number"
        className="w-full p-3 rounded bg-zinc-900"
        value={form.budget}
        onChange={e=>setForm({...form,budget:Number(e.target.value)})}
      />

      <input
        placeholder="Interests (comma separated)"
        className="w-full p-3 rounded bg-zinc-900"
        value={form.interests}
        onChange={e=>setForm({...form,interests:e.target.value})}
      />

      <button
        disabled={loading}
        className="w-full bg-white text-black rounded p-3 font-semibold"
      >
        {loading ? "Planning..." : "Generate Trip"}
      </button>
    </form>
  );
}