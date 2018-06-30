const app = require("express")();
const bodyParser = require("body-parser");
const displayActions = require("./functions/display-actions.js");
const handleActions = require("./functions/handle-actions.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
	displayActions(req, res);
});

app.post("/handle-actions", (req, res) => {
	handleActions(req, res);
});

app.listen(3000, () => console.log("Server running"));