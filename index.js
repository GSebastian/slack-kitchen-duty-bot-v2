const app = require("express")();
const displayActions = require("./functions/display-actions.js");

app.post("/", (req, res) => {
	displayActions(req, res);
});

app.listen(3000, () => console.log("Server running"));