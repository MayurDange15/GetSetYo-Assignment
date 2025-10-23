import React, { useMemo, useState, useEffect } from "react";
import sampleData from "../mockData"; // create this file (see below)

export default function FilterableList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  // price filters (used in bonus) - initialize to full range after data loads
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // load (mock) data once
  useEffect(() => {
    // simulate fetch or just set mock
    setData(sampleData);
    // set price defaults based on data
    const prices = sampleData.map((i) => i.price);
    setMinPrice(Math.min(...prices));
    setMaxPrice(Math.max(...prices));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(data.map((d) => d.category)))],
    [data]
  );

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return data.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (text && !item.name.toLowerCase().includes(text)) return false;
      // price filter
      if (item.price < minPrice || item.price > maxPrice) return false;
      return true;
    });
  }, [data, search, category, minPrice, maxPrice]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 12,
        }}
      >
        {filtered.length === 0 ? (
          <div>No items found</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}
            >
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 12 }}>{item.category}</div>
              <div style={{ marginTop: 8 }}>${item.price.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
