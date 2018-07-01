var axios = require("axios");
var admin = require("firebase-admin");
var environment = require("../environment.js");

admin.initializeApp({
	credential: admin.credential.cert(environment.getFirebaseServiceAccount()),
	databaseURL: environment.getFirebaseDatabaseUrl()
});

var db = admin.database();

module.exports = async (req, res) => {
	await handleActions(req, res);
};

async function handleActions(req, res) {
	let body = JSON.parse(req.body.payload);

	var teamThisWeek = await findTeamForThisWeek();

	console.log("Found team");

	if (body.actions[0].value == "who") {
		handleWho(teamThisWeek, body.response_url);
	} else if (body.actions[0].value == "nudge") {
		handleNudge(teamThisWeek, body.response_url, body.channel.id);
	} else {
		console.log("Bad input");
	}
}

async function handleWho(teamThisWeek, responseUrl) {
	var teamsResponse = "This week's team is " + teamThisWeek.teamName + " formed of: ";
	for (var i = 0; i < teamThisWeek.members.length; i++) {
		teamsResponse += "<@" + teamThisWeek.members[i].slackUserId + ">";
		if (i == teamThisWeek.members.length - 2) {
			teamsResponse += " and ";
		} else if (i < teamThisWeek.members.length - 2) {
			teamsResponse += ", ";
		}
	}

	console.log("Teams response: " + teamsResponse);

	try {
		let response = await axios.post(responseUrl, { text: teamsResponse });
		console.log(response);
	} catch (error) {
		console.log(error);
	}
}

async function handleNudge(teamThisWeek, responseUrl, channelId) {
	for (var i = 0; i < teamThisWeek.members.length; i++) {
		try {
			let openRoomResponse =
				await axios.post(
					"https://slack.com/api/im.open",
					{ user: teamThisWeek.members[i] },
					{ headers: { "Authorization": "Bearer " + environment.getSlackToken() } }
				);

			console.log(openRoomResponse);

			let postMessageResponse =
				await axios.post(
					"https://slack.com/api/chat.postMessage",
					{
						channel: channelId,
						text: "🚨🚨🚨 Red alert! The kitchen is filthy! 🚨🚨🚨\n\n\n"
							+ "Ok, maybe that was too dramatic, but would you mind making sure "
							+ "everything's ok in there? 👌"
					},
					{ headers: { "Authorization": "Bearer " + environment.getSlackToken() } }
				);

			console.log(postMessageResponse);
		} catch (error) {
			console.log(error);
		}
	}
	try {
		let postMessageToReporterResponse = await axios.post(
			responseUrl,
			{ text: "I've just sent a message to everyone in this week's team! 💨 Chop chop! 💨 " }
		);
		console.log(postMessageToReporterResponse);
	} catch (error) {
		console.log(error);
	}
}

//#region Utils

async function weeksFromStartDate() {
	var ref = db.ref("/flamelink/environments/production/content/teamPlanning/en-US");
	let teamPlanningSnapshot = await ref.once("value");
	let teamPlanningObject = teamPlanningSnapshot.val();

	console.log("TeamPlanning object startTime: " + teamPlanningObject.startTime);

	let startDate = new Date(teamPlanningObject.startTime);
	var currentDate = new Date();

	var diffWeeks = Math.round((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));

	console.log("Weeks from start date: " + diffWeeks);

	return diffWeeks;
}

async function numberOfTeams() {
	var ref = db.ref("/flamelink/environments/production/content/team/en-US");
	let teamsSnapshot = await ref.once("value");
	let numberOfTeams = teamsSnapshot.numChildren();

	console.log("Number of teams: " + numberOfTeams);

	return numberOfTeams;
}

async function findTeamForThisWeek() {
	try {
		var weeksNumber = await weeksFromStartDate();
		var teamsNumber = await numberOfTeams();
	} catch (err) {
		console.log(err);
	}

	// Team order is 1-indexed (for a friendlier CMS experience)
	let teamIndex = weeksNumber % teamsNumber + 1;

	let teamsRef = db.ref("/flamelink/environments/production/content/team/en-US");

	let teamsSnapshot = await teamsRef.once("value");

	var promises = [];
	teamsSnapshot.forEach(function (data) {
		let teamObject = data.val();

		if (teamObject.order == teamIndex) {

			promises.push(new Promise((resolve, reject) => {
				resolve(teamObject);
			}));

			console.log("Picked team: ");
			console.log(teamObject);

			return true;
		}
	});
	try {
		var results = await Promise.all(promises);
		return results[0];
	} catch (err) {
		console.log(err);
	}
}

//#endregion