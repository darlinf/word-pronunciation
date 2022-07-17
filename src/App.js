import "./App.css";
import Home from "./page/home";
import { WordContextProvider } from "./context/WordContext";

function App() {
  return (
    <div>
      <WordContextProvider>
        <Home></Home>
      </WordContextProvider>
    </div>
  );
}

export default App;
