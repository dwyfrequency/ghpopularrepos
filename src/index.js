import React from "react";
import ReactDOM from "react-dom";

window.API = {
  fetchPopularRepos(language) {
    // "language" can be "javascript", "ruby", "python", or "all"
    const encodedURI = encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
    );
    return fetch(encodedURI)
      .then(data => data.json())
      .then(repos => repos.items)
      .catch(error => {
        console.warn(error);
        return null;
      });
  }
};

function Nav(props) {
  return (
    <ul>
      {props.languages.map(language => (
        <li key={language} onClick={() => props.getRepos(language)}>
          {language}
        </li>
      ))}
    </ul>
  );
}

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Loading"
    };
  }
  componentDidMount() {
    const stopper = this.state.text + "...";
    this.interval = window.setInterval(() => {
      this.state.text === stopper
        ? this.setState(() => ({ text: "Loading" }))
        : this.setState(prevState => ({ text: prevState.text + "." }));
    }, 300);
  }
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }
  render() {
    return <p>{this.state.text}</p>;
  }
}

function PopularRepos(props) {
  return (
    <ul>
      {props.popularRepos.map(data => {
        const { url, name, stargazers_count } = data;

        return (
          <li key={name}>
            <ul>
              <li>{url}</li>
              <li>{name}</li>
              <li>{stargazers_count}</li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: ["all", "javascript", "ruby", "python"],
      loadBody: false,
      popularRepos: null
    };
  }
  onClickHandler = language => {
    window.API.fetchPopularRepos(language).then(repos => {
      this.setState({ loadBody: true, popularRepos: repos });
    });
  };
  render() {
    const { languages, loadBody, popularRepos } = this.state;
    return (
      <div>
        <Nav languages={languages} getRepos={this.onClickHandler} />
        {/* <Loading /> */}
        {loadBody ? <PopularRepos popularRepos={popularRepos} /> : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
