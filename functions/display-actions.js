module.exports = (req, res) => {
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
							"text": "Are you sure you want to do this?",
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
