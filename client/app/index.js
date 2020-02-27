import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Greeting from './components/Greeting.js';
import LogInOut from './components/LogInOut.js';
import UserData from './components/UserData.js';

const config = require('../../config');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			body: {} // this is the body from /user
		};
		this.handleTextInput = this.handleTextInput.bind(this);
	}

	componentDidMount() {
		fetch(`http://localhost:${config.serverPort}/user`, {
			credentials: 'include' // fetch won't send cookies unless you set credentials
		})
			.then(response => response.json())
			.then((response) => {
				this.setState({
					body: response
				});
			});
	}

	handleTextInput(event) {

		// update this.state.body.registration.data.userData
		let body = this.state.body;
		body.registration.data.userData = event.target.value;
		this.setState({
			body: body
		});

		// save the change in FusionAuth
		fetch(`http://localhost:${config.serverPort}/setUserData?userData=${event.target.value}&userID=${this.state.body.sub}`);
	}

	render() {
		return (
			<div>
				<header>
					<h1>FusionAuth Example: React</h1>
					<Greeting body={this.state.body}/>
					<LogInOut body={this.state.body} uri={`http://localhost:${config.serverPort}`}/> {/*TODO: move uri definition*/}
				</header>
				<main>
					<UserData body={this.state.body} handleTextInput={this.handleTextInput}/>
					<pre>{JSON.stringify(this.state.body, null, '\t')}</pre>
				</main>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));