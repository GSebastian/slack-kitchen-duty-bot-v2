module.exports = async (req, res) => {
	// Responds immediately. Firebase logic executes in the background and sends a request to
	// the callback URL

	await handleActionsImmediately(req, res);
};

function handleActionsImmediately(req, res) {
	let body = JSON.parse(req.body.payload);

	if (body.actions[0].value == "who" || body.actions[0].value == "nudge") {
		res.send("⚡️ Crunching the numbers ... \n\n Proving String Theory 💡\n\n " +
			"Almost there ...");
	}
}