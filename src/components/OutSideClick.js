import { useRef } from "react";
import useOutClickEvent from "../hooks/useOutClickEvent";

export default function OutSideClick({ children, setShowWordDetails }) {
  const wrapperRef = useRef(null);
  useOutClickEvent(wrapperRef, setShowWordDetails);
  return <div ref={wrapperRef}>{children}</div>;
}
