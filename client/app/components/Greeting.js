import React from "react";

export default function Greeting({ body }) {
	let message = body.token
		? `Hi, ${body.token.email}!`
		: "You're not logged in.";

	return <span>{message}</span>;
}
