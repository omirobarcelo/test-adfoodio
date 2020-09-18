import React from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../store";

export function Menu() {
  const { menu } = useAppState();
  return (
    <div>
      <span>Menu</span>
      {menu && menu.map((item) => (
        <div key={item.id}>
          <span>{item.id}</span> <span>{item.name}</span>
        </div>
      ))}
      <div>
        <Link to="/order">
          <button>Click</button>
        </Link>
      </div>
    </div>
  );
}
