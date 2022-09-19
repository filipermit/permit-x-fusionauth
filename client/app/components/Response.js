import React from "react";

export default function Response(props) {
	return (
		<div id="Response">
			<h2>FusionAuth Response</h2>
			<pre>{JSON.stringify(props.body, null, "\t")}</pre>
		</div>
	);
}
