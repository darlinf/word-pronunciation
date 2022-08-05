/*eslint-disable*/
const recogniseVoice = (voiceResult) => {
  var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;

  var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;

  var SpeechRecognitionEvent =
    SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  var recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = "en-US";
  //recognition.lang = "es-ES";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  console.log("Ready to receive a color command.");

  recognition.onresult = function (event) {
    console.log("Confidence: " + event.results[0][0].transcript);
    console.log("Confidence: " + event.results[0][0].confidence);
    voiceResult(event.results[0][0].transcript);
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onnomatch = function (event) {
    console.log("I didn't recognise that color.");
  };

  recognition.onerror = function (event) {
    console.log("Error occurred in recognition: " + event.error);
  };
};

export default recogniseVoice;
