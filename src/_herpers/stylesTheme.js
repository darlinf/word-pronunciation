const styles = {
  dark: {
    body: () => {
      document.body.style = "background:#303030";
      document.body.style = "transition: all 800ms ease";
    },
    pronounceContainer: {
      background: "#444444",
    },
    headerPronounce: { background: "#0D47A1" },
    textShowResult: { background: "#0c0c0c6b" },
    textColor: { color: "white" },
  },

  white: {
    body: (from = "none") => {
      if (from === "none")
        document.body.style = "background:white; transition: all 800ms ease ";
      else document.body.style = "background:white  ";
    },
    pronounceContainer: { background: "#e6e6e6b0" },
    headerPronounce: { background: "#1976D2" },
    textShowResult: { background: "#3b8ad9af" },
    textColor: { color: "black" },
  },
};

export default styles;
