/* 
  Le seguenti importazioni seguono la sintassi CommonJS (modularizzazione in ambiente NodeJS) 
*/

// Ci serve per impostare output.path, poiché vogliamo modificare la cartella di destinazione predefinita, 
const path = require("path");
// Ci serve per poter cambiare il nome del foglio di stile generato
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Ci serve per poter generare un file HTML da un modello
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Ci serve per ripulire la cartella di distribuzione automaticamente a ogni build. [[non richiesto esplicitamente dall'esercizio]]
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Configurazione dei 3 plugin che utilizziamo
const plugins = [
  // Plugin per la pulizia automatica della cartella di output [[non richiesto esplicitamente dall'esercizio]]
  new CleanWebpackPlugin(),

  // Utilizziamo il plugin https://webpack.js.org/plugins/mini-css-extract-plugin/
  // con l'obiettivo di assegnare al foglio di stile CSS che andremo a generare il nome desiderato.
  new MiniCssExtractPlugin({
    // Se non impostassimo questa opzione del plugin MiniCssExtractPlugin, il nome del file
    // css generato sarebbe "main.css" (indipendentemente dal nome del file js di ingresso).
    filename: "styles.css"
  }),

  // Il plugin HtmlWebpackPlugin ci consente di distribuire il file html generato a partire da un modello
  // senza aver timore di doverlo preservare dalla cancellazione e lasciando che siano webpack e i suoi plugin
  // a impostare correttamente le dipendenze.
  new HtmlWebpackPlugin({
    // In assenza di un'indicazione esplicita, verrà creato nella cartella destinazione un 
    // file index.html con alcune dipendenze, che tuttavia ignora il modello predisposto inizialmente nell'esercizio. 
    // Conseguentemente è necessario specificare qual è il modello da cui partire.
    template: "./index.html"
  }),
];

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
    extensions: [
      ".jsx",
      // Purtroppo l'esecuzione di webpack-dev-server effettua alcune importazioni inferite
      // di file .js; di conseguenza è necessario, perché il server vada in esecuzione, inferire
      // anche le estensioni js [es. di errore: Can't resolve './named-references']
      ".js"]
  },

  plugins: plugins,

  // Aggiungiamo i file di mappa per facilitare il debugging dell'errore
  // "Target container is not a DOM element" che si è manifestato in assenza
  // dell'opzione "template" su HtmlWebpackPlugin
  devtool: "source-map",

  devServer: {
    // Per utilizzare webpack-dev-server, occorre indicare qual è la cartella dove si trovano 
    // le risorse statiche che verranno servite.
    static: './build',
    // Evita di causare un ricaricamento della pagina in caso di modifica a caldo delle risorse
    // statiche (es.: file .scss). Non ha impatto sui file jsx [per modificare i file jsx "a caldo"
    // sarebbe necessario il plugin "react-refresh-webpack-plugin"]
    hot: true
  },
}