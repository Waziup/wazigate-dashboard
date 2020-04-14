const path = require("path");
const package = require("./package.json");
const fs = require("fs");
const childProcess = require("child_process");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var branch = "unknown";
try {
	branch = childProcess.execSync("git rev-parse --abbrev-ref HEAD", {
		encoding: "utf8"
	});
	branch = branch.trim();
} catch (err) {}

const version = package.version;

console.log("This is a %s build. %s", branch, version);

fs.writeFileSync(
	"./src/version.ts",
	`
// Autogenerated by webpack.config.js
export const version = "${version}";
export const branch = "${branch}";
`
);

module.exports = {
	mode: "production",

	devtool: "source-map",

	resolve: {
		extensions: [".ts", ".tsx", ".scss", ".css", ".js"]
	},

	entry: ["./src/index.tsx"],

	plugins: [],

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: "ts-loader"
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				loader: "file-loader",
				options: {
					publicPath: "img",
					outputPath: "img"
				}
			},
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			}
		]
	},

	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist")
	},

	externals: [
		{
			react: "React",
			"react-dom": "ReactDOM",
		},
		// /@material-ui\/core\/.*/
	]
};
