var admin = require("firebase-admin");
var moment = require("moment");
var db = admin.database();

module.exports = async (req, res) => {
	let lastNudgeTime = await getLastNudgeTime();

	let response = {
		"text": "How can I help?",
		"attachments": [
			{
				"text": "Choose an action",
				"fallback": "You are unable to choose a game",
				"callback_id": "kd_action",
				"attachment_type": "default",
				"actions": [
					{
						"name": "action",
						"text": "Who is on kitchen duty this week?",
						"type": "button",
						"value": "who"
					},
					{
						"name": "action",
						"text": "The kitchen is a mess!",
						"style": "danger",
						"type": "button",
						"value": "nudge",
						"confirm": {
							"title": "Oh no! I'll let the team know!",
							"text": "Are you sure you want to do this?" +
								(lastNudgeTime != null ? " They were last notified " +
									lastNudgeTime + "." : ""),
							"ok_text": "Yeah, it's awful!",
							"dismiss_text": "It can wait"
						}
					}
				]
			}
		]
	};
	res.send(response);
};

//#region Utils

async function getLastNudgeTime() {
	let lastNudgeSnapshot = await db.ref("lastNudge").once("value");
	let lastNudgeTimestamp = lastNudgeSnapshot.val();

	if (lastNudgeTimestamp == null) {
		return null;
	}

	let lastNudge = moment(lastNudgeTimestamp).fromNow();

	return lastNudge;
}

//#endregion