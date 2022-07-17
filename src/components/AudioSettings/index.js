export default function AudioSettings() {
  return (
    <div>
      <p>Audio settings:</p>
      <div>
        <input type="range" id="volume" name="volume" min="0" max="11" />
        <label for="volume">Pitch</label>
      </div>
      <div>
        <input
          type="range"
          id="cowbell"
          name="cowbell"
          min="0"
          max="100"
          value="90"
          step="10"
        />
        <label for="cowbell">Rate</label>
      </div>
      <button>Join word</button>
    </div>
  );
}
