import { useLayoutEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({});
  useLayoutEffect(() => {
    function updateSize() {
      setSize({ x: window.innerWidth, y: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
