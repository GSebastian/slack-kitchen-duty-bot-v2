var request = require("request");
var admin = require("firebase-admin");
var environment = require("../environment.js");

admin.initializeApp({
	credential: admin.credential.cert(environment.getFirebaseServiceAccount()),
	databaseURL: environment.getFirebaseDatabaseUrl()
});

var db = admin.database();

module.exports = (req, res) => {
	// Responds immediately. Firebase logic executes in the background and sends a request to
	// the callback URL

	handleActionsImmediately(req, res);
	handleActions(req, res);
};

//#region Handle actions immediately
function handleActionsImmediately(req, res) {
	let body = JSON.parse(req.body.payload);

	if (body.actions[0].value == "who" || body.actions[0].value == "nudge") {
		res.send("⚡️ Crunching the numbers ... \n\n Proving String Theory 💡\n\n " +
			"Almost there ...");
	}
}
//#endregion

//#region Handle actions

function handleActions(req, res) {
	let body = JSON.parse(req.body.payload);

	findTeamForThisWeek(team => {
		console.log("Found team");
		var i;
		var teamsResponse;

		if (body.actions[0].value == "who") {

			teamsResponse = "This week's team is " + team.teamName + " formed of: ";
			for (i = 0; i < team.members.length; i++) {
				teamsResponse += "<@" + team.members[i].slackUserId + ">";
				if (i == team.members.length - 2) {
					teamsResponse += " and ";
				} else if (i < team.members.length - 2) {
					teamsResponse += ", ";
				}
			}
			console.log("Teams response: " + teamsResponse);
			request({
				url: body.response_url,
				method: "POST",
				json: true,
				body: { text: teamsResponse }
			}, function (error, response, body) {
				console.log("Who response " + body + " error " + error);
				if (error) {
					console.log(error);
				} else {
					console.log("Successfully made 'who' request");
				}
			});
		} else if (body.actions[0].value == "nudge") {
			teamsResponse = "This week's team is " + team.teamName + " formed of: ";
			for (i = 0; i < team.members.length; i++) {
				request({
					url: "https://slack.com/api/im.open",
					method: "POST",
					json: true,
					headers: {
						"Authorization": "Bearer " + environment.getSlackToken()
					},
					body: {
						user: team.members[i].slackUserId
					}
				}, function (error, response, body) {
					if (error == null) {
						request({
							url: "https://slack.com/api/chat.postMessage",
							method: "POST",
							json: true,
							headers: {
								"Authorization": "Bearer " + environment.getSlackToken()
							},
							body: {
								channel: body.channel.id,
								text: "🚨🚨🚨 Red alert! The kitchen is filthy! 🚨🚨🚨\n\n\n"
									+ "Ok, maybe that was too dramatic, but would you mind making sure everything's ok in there? 👌"
							}
						}, function (error, response, body) {
							console.log(body);
						});
					}
				});
			}
			request({
				url: body.response_url,
				method: "POST",
				json: true,
				body: { text: "I've just sent a message to everyone in this week's team! 💨 Chop chop! 💨 " }
			}, function (error) {
				if (error) {
					console.log(error);
				} else {
					console.log("Successfully made 'nudge' request");
				}
			});
		} else {
			console.log("Bad input");
		}
	});
}

function weeksFromStartDate(callback) {
	var ref = db.ref("/flamelink/environments/production/content/teamPlanning/en-US");
	ref.once("value", function (data) {
		let teamPlanningObject = data.val();

		console.log("TeamPlanning object startTime: " + teamPlanningObject.startTime);

		let startDate = new Date(teamPlanningObject.startTime);
		var currentDate = new Date();

		var diffWeeks = Math.round((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));

		console.log("Weeks from start date: " + diffWeeks);

		callback(diffWeeks);
	});
}

function numberOfTeams(callback) {
	var ref = db.ref("/flamelink/environments/production/content/team/en-US");
	ref.once("value", function (data) {
		console.log("Number of teams: " + data.numChildren());
		callback(data.numChildren());
	});
}

function findTeamForThisWeek(callback) {
	weeksFromStartDate(weeksValue => {
		numberOfTeams(number => {
			// Team order is 1-indexed (for a friendlier CMS experience)
			let teamIndex = weeksValue % number + 1;

			var teamsRef = db.ref("/flamelink/environments/production/content/team/en-US");

			teamsRef.once("value", function (snapshot) {
				snapshot.forEach(function (data) {
					let teamObject = data.val();
					if (teamObject.order == teamIndex) {

						console.log("Picked team: " + teamObject);

						callback(teamObject);
						return true;
					}
				});
			});
		});
	});
}

//#endregion