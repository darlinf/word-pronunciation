const speak = (
  textToSpeak = "hello",
  pitchV = 0.7,
  rateV = 0.5,
  voice = "Google US English"
) => {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  if (textToSpeak !== "") {
    const utterThis = new SpeechSynthesisUtterance(textToSpeak);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    let voices = synth.getVoices();

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === voice) {
        utterThis.voice = voices[i];
        break;
      }
    }

    utterThis.pitch = pitchV;
    utterThis.rate = rateV;
    synth.speak(utterThis);
  }
};

export default speak;
