const express = require("express");
const router = express.Router();
const { Permit } = require("permitio");

// Permit PDP instance.
const permit = new Permit({
	pdp: "http://localhost:7766",
	// Permit SDK Key
	token:
		"eyJhbGciOiJSUzI1NiIsImtpZCI6IjRjYjFhYjYyLWVhZTctNDFmZS04NWMwLTAyZjFlNjMyN2FlZCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjI0MDUxNDcsImV4cCI6MTY5Mzg1NDc0NywiYXVkIjoiaHR0cHM6Ly9hcGkucGVybWl0LmlvL3YxLyIsImlzcyI6Imh0dHBzOi8vYXV0aC5wZXJtaXQuaW8vIiwic3ViIjoiYjQ3ZjYyNTAzM2ViNGQ2NGJlZjllMmNhMmMyNzZlYmQifQ.GtdOpg2KNEhqJCbPgX_j5aS6TOzX7R-XFh6lckUOPsVzDOqqkE_LQ7DvUKCjWqUWynt_nlccASVs5Nxq9uIA1kYtO3acMrekeKb9mlA4n2eTc73g7ulw1w1hg1MVxI8CBztd8vHH3A0LS2o44LM0V2UuaRx5ZD9WxACKOyaAJ6cCsMSj_hacsd2ggNSp98ACealNbeY9y2zsJOqnYSv_f-MYJQBO24IArg6knZSwleMqDAq-4rgT3RhQPgComiu0xxNeAgDh9i_Vk6eCarj-XY1Xct6CbQTZIeS-qBRsdmFf-b_mAijxwuYs6QkQ2qIckGYoZM8L8cx0TyX8cB2-jVxxvODSGl6w4bo3ZntNqIlSi9asDTVgEj9PZf9NVivcA_yTlCpMN6uNDuTAybjIXt09n8gUlMXdw_hp0dHgGan2bgxAPJlGVy___iTNWF-P54okEuAv27Sa1bmZ9nu81Z44wlh_r9x6JFjgT7G0vMuSt8Qx9rln8gzz0UTRHkPiiFRS_wq0wcMOSPkZgURtKNe94FTjd2lgCw7eSQe7NZR8sVmNGyjFiJDJhMfGn4eI2sfAERlGr33upkW7gpdkCQ_70QqIRdyGrbnLGvWVgrSmjrzNCBwo2O1btjT9xLfK7CsagFEjJDFb_I-7JJRdGFFTQStaW-SwaDYN83vn2-Y",
});

// Verify that a user is authenticated by checking the session.
router.post("/", async (req, res) => {
	const { action, resource, userData } = req.body;

	// Permit check for correct permissions for a sepcific role.
	const permitted = await permit.check(userData.token.sub, action, {
		type: resource,
		tenant: "FusionAuth",
	});

	const userId = userData.token.sub;

	if (permitted) {
		console.log(`${userId} is PERMITTED to ${action} on ${resource}.`);
		res.status(200).send(`${userId} is PERMITTED to ${action} on ${resource}`);
	} else {
		console.log(`${userId} is NOT PERMITTED to ${action} on ${resource}`);
		res
			.status(403)
			.send(`${userId} is NOT PERMITTED to ${action} on ${resource}`);
	}
});

module.exports = router;
