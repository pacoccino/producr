import React, { Component } from 'react';

class LoginPage extends Component {

    submit() {
        const username = this.emailNode.value;
        const password = this.passwordNode.value;

        fetch('http://localhost:3001/login', {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        }).then(function(response) {
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.url);

            response.text().then(function(responseText) { console.log(responseText) })
        }, function(error) {
            console.log(error.message);
        })
    }

    render() {
        return (
            <div>
                <input type="text" ref={ node => this.emailNode = node } placeholder="email" />
                <input type="password" ref={ node => this.passwordNode = node } placeholder="password" />
                <button onClick={this.submit.bind(this)}>Login</button>
            </div>
        );
    }
}

export default LoginPage;
