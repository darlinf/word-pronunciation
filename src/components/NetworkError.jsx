import "./NetworkError.css";

export default function NetworkError({ errorNetwork }) {
  return (
    <>
      {errorNetwork && (
        <div className="errorContainer">
          <div className="network">Network error</div>
        </div>
      )}
    </>
  );
}
