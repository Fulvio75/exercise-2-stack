/* 
  Le seguenti importazioni seguono la sintassi CommonJS (modularizzazione in ambiente NodeJS) 
*/

// Ci serve per impostare output.path, poiché vogliamo modificare la cartella di destinazione predefinita, 
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/* 
  Le seguenti esportazioni seguono la sintassi CommonJS (modularizzazione in ambiente NodeJS) 
*/
module.exports = {
  // L'esercizio non richiede esplicitamente una modalità di generazione dell'output
  // Scelgo "development" per rendere un po' più semplice da interpretare l'output generato dalla build. 
  mode: 'development',

  // In assenza di questa sezione, webpack genererà il proprio output
  // nella cartella "dist", assegnando al file js generato il nome "main.js"
  output : {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        // Utilizziamo babel-loader per caricare i file jsx (per la transpilazione React)
        // Poiché nell'esercizio non è richiesto, non utilizziamo Babel per transpilare
        // da versioni più recenti di js a versioni più antiquate supportate da tutti i 
        // browser - nell'espressione regolare usiamo jsx$ anziché jsx?$
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        // Regole valide per transpilare/elaborare i fogli di stile scss e css
        // (siano essi file originali oppure gli output di passi precedenti).
        test: /\.s?css$/i,
        // webpack legge da "destra a sinistra": quindi se viene trovato
        // un file che corrisponde all'espressione regolare:
        // - prima viene applicato il caricatore "sass-loader"
        // - dopodiché l'output viene elaborato con il caricatore "css-loader"
        // - infine l'output viene elaborato con il caricatore di "MiniCssExtractPlugin"
        use: [
          // 3. Utilizziamo il caricatore di MiniCssExtractPlugin per assegnare un nome 
          //    specifico agli output del caricatore css-loader
          MiniCssExtractPlugin.loader,
          // 2. Utilizziamo css-loader per trattare gli output css della transpilazione scss
          //    Se questo passaggio fosse l'ultimo, le regole css risulterebbero incorporate
          //    direttamente nell'output js
          "css-loader",
          // 1. Utilizziamo sass-loader per la transpilazione scss --> css
          "sass-loader"
        ],
      },
    ],
  },

  // Estensioni che vengono inferite quando si importa da un modulo senza fornire l'estensione
  // Il sorgente di index.jsx importa da App.jsx senza usare l'estensione, quindi è necessario
  // che l'estensione .jsx venga inferita durante l'importazione [a meno di modificare il sorgente]
  resolve: {
    extensions: [".jsx"]
  },

  plugins: [
    // Utilizziamo il plugin https://webpack.js.org/plugins/mini-css-extract-plugin/
    // con l'obiettivo di assegnare al foglio di stile CSS che andremo a generare il nome desiderato.
    new MiniCssExtractPlugin({
      // Se non impostassimo questa opzione del plugin MiniCssExtractPlugin, il nome del file
      // css generato sarebbe "main.css" (indipendentemente dal nome del file js di ingresso).
      filename: "styles.css"
    })
  ],
}