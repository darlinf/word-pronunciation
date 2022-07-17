import "./home.css";
import WordPronounce from "../components/WordPronounce";
import NewWord from "../components/NewWord";

import { useContext } from "react";
import WordContext from "../context/WordContext";

function Home() {
  const { word } = useContext(WordContext);

  return (
    <div>
      <NewWord></NewWord>
      {word?.map((x, index) => {
        return (
          <div key={index}>
            <WordPronounce wordPronounce={x}></WordPronounce>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
