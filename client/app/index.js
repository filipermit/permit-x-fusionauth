import React, { useState, useEffect, createContext } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./components/Home";
import RestrictedPage from "./components/RestrictedPage";

const config = require("../../config");

export const UserContext = createContext();

function App() {
	const [body, setBody] = useState({});

	useEffect(() => {
		fetch(`http://localhost:${config.serverPort}/user`, {
			credentials: "include", // fetch won't send cookies unless you set credentials
		})
			.then((response) => response.json())
			.then((response) => {
				setBody(response);
				console.log(response);
			});
	}, []);

	if (body !== {}) {
		console.log(body);
	}

	return (
		<UserContext.Provider value={body}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<BrowserRouter>
					<Routes>
						<Route index element={<Home body={body} />} />
						<Route path="restricted" element={<RestrictedPage body={body} />} />
					</Routes>
				</BrowserRouter>
			</MantineProvider>
		</UserContext.Provider>
	);
}

createRoot(document.getElementById("Container")).render(<App />);
