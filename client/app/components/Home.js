import React from "react";

import Greeting from "../components/Greeting.js";
import LogInOut from "../components/LogInOut.js";

const config = require("../../../config");

export default function Home({ body }) {
	// TODO: Move useEffect and state to global parent and pass body down as props.

	console.log("BODY HOME PAGE: ", body);

	return (
		<>
			<header>
				<Greeting body={body} />
				<LogInOut body={body} uri={`http://localhost:${config.serverPort}`} />
			</header>
			<main className={"main"}>
				<h1 className={"title"}>
					<span>Welcome to </span>
					<a href="https://fusionauth.io/" id="fusionauth">
						FusionAuth
					</a>
					<span> x </span>
					<a href="https://www.permit.io/" id="permit">
						Permit
					</a>
					<span> Demo</span>
				</h1>
			</main>
		</>
	);
}
