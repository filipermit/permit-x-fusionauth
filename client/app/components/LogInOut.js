import React from "react";
import { Button } from "@mantine/core";

export default function LogInOut({ uri, body }) {
	let message = body.token ? "Sign Out" : "Sign In";
	let path = body.token ? "/logout" : "/login";

	return (
		<Button
			color="green"
			onClick={() => (window.location.href = uri + path)}
			style={{ width: "280px" }}
		>
			{message}
		</Button>
	);
}
