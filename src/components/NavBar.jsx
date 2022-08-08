import "./NavBar.css";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="nav-bar-container">
      <ul>
        <li>
          <NavLink
            style={{ color: "white" }}
            to="/"
            className={({ isActive }) => (isActive ? "nav-link-active" : "")}
          >
            Word pronounce
          </NavLink>
        </li>

        <li>
          <NavLink
            style={{ color: "white" }}
            to="/sentence-pronounce"
            className={({ isActive }) => (isActive ? "nav-link-active" : "")}
          >
            Sentence pronounce
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
