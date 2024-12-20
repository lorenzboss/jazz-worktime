const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/main.js", // Pfad zu deiner Hauptdatei
  output: {
    filename: "main.bundle.js", // Gebündelte Datei
    path: path.resolve(__dirname, "dist"), // Zielverzeichnis
  },
};
