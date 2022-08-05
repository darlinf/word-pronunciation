const populateVoiceList = (callback) => {
  const callBackEvent = () => {
    const voicesList = window.speechSynthesis.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase();
      const bname = b.name.toUpperCase();

      if (aname < bname) {
        return -1;
      } else if (aname === bname) {
        return 0;
      } else {
        return +1;
      }
    });
    console.log(voicesList);
    callback(voicesList);
  };

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = callBackEvent;
  }
};

export default populateVoiceList;
