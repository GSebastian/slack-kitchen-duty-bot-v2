let liveServiceAccount = require("./kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json");
let testServiceAccount = require("./kitchen-duty-test-firebase-adminsdk-dxpbl-cf1bc3eb3b.json");
let credentials = require("./credentials.json");

let environment = "test"; // "live"

module.exports = {
	getFirebaseDatabaseUrl: function () {
		if (environment == "test") {
			return credentials.firebase_app_test;
		} else if (environment == "live") {
			return credentials.firebase_app_live;
		}
	},
	getFirebaseServiceAccount: function () {
		if (environment == "test") {
			return testServiceAccount;
		} else if (environment == "live") {
			return liveServiceAccount;
		}
	},
	getSlackToken: function () {
		return credentials.slack_token;
	}
};
