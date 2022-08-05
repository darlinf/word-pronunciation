import { useState, useEffect } from "react";
import { wordService } from "../_services/word.service";

export default function useEditWord(element, id) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    wordService
      .editWord(id, element)
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setLoading, element, id]);

  return loading;
}
