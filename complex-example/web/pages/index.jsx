import React from "react";
import "isomorphic-unfetch";

class MainPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const { code } = query;
    const baseUrl = `https://${req.headers.host}/api`;
    if (!code) {
      return {};
    }
    const { ok, access_token, user } = await fetch(
      `${baseUrl}/auth?code=${code}`
    ).then(res => res.json());
    if (!ok) {
      return {};
    }
    return { baseUrl, access_token, user };
  }

  state = {
    message: "",
    chosen: 0,
    channels: []
  };

  componentDidMount() {
    if (this.props.access_token) {
      fetch(`${this.props.baseUrl}/channels?token=${this.props.access_token}`)
        .then(res => res.json())
        .then(({ channels }) => this.setState({ channels }));
    }
  }

  handleChange = ev => {
    this.setState({ message: ev.target.value });
  };

  handleKeyDown = ev => {
    if (ev.keyCode == 13 && !ev.shiftKey) {
      this.sendMessage();
      ev.preventDefault();
    }
  };

  sendMessage = () => {
    console.log(`Sending message: ${this.state.message}`);
    fetch(`${this.props.baseUrl}/message?token=${this.props.access_token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel: this.state.channels[this.state.chosen].id,
        message: this.state.message
      })
    }).then(res => {
      if (res.ok) this.setState({ message: "" });
    });
  };

  generateBody = () => {
    if (this.props.user && this.state.channels.length > 0) {
      return (
        <React.Fragment>
          <div className="form-group d-flex flex-row align-items-center">
            <label className="mt-2 mr-4" htmlFor="channelDropDown">
              Choose a channel
            </label>
            <div className="dropdown" id="channelDropDown">
              <button
                className="btn btn-secondary dropdown-toggle text-monospace"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                #{this.state.channels[this.state.chosen].name}
              </button>
              <div
                className="dropdown-menu"
                style={{ maxHeight: "50vh", overflow: "scroll" }}
                aria-labelledby="dropdownMenuButton"
              >
                {this.state.channels.map(({ name, id }, idx) => (
                  <a
                    className="dropdown-item text-monospace"
                    key={id}
                    onClick={() => this.setState({ chosen: idx })}
                  >
                    #{name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="messageTextArea">Write a message!</label>
            <textarea
              className="form-control"
              id="messageTextArea"
              rows="3"
              value={this.state.message}
              onKeyDown={this.handleKeyDown}
              onChange={this.handleChange}
            />
          </div>
        </React.Fragment>
      );
    }
    if (this.props.user) {
      return <h2>Loading channels!</h2>;
    }
    return (
      <React.Fragment>
        <h2>No authentication done!</h2>
        <a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=67733202768.483645493858">
          <img
            alt="Sign in with Slack"
            height="40"
            width="172"
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
          />
        </a>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="container mt-4">
        <h1 className="pb-4 mb-4">Serverless Slack API Demo</h1>
        {this.generateBody()}
      </div>
    );
  }
}

export default MainPage;
