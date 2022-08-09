import "./NavBar.css";
import { NavLink } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import { useContext } from "react";

export default function NavBar() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="nav-bar-container">
      <ul>
        <li>
          <NavLink
            style={theme.textColor}
            to="/"
            className={({ isActive }) => (isActive ? "nav-link-active" : "")}
          >
            Word pronounce
          </NavLink>
        </li>

        <li>
          <NavLink
            style={theme.textColor}
            to="/sentence"
            className={({ isActive }) => (isActive ? "nav-link-active" : "")}
          >
            Sentence pronounce
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
