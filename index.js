var app = require("express")();
var bodyParser = require("body-parser");
var admin = require("firebase-admin");
var environment = require("./environment.js");

admin.initializeApp({
	credential: admin.credential.cert(environment.getFirebaseServiceAccount()),
	databaseURL: environment.getFirebaseDatabaseUrl()
});

const displayActions = require("./functions/display-actions.js");
const handleActionsImmediately = require("./functions/handle-actions-immediately.js");
const handleActions = require("./functions/handle-actions.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
	displayActions(req, res);
});

app.post("/handle-actions", async (req, res) => {
	await handleActionsImmediately(req, res);
	await handleActions(req, res);
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));