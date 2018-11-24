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
  const languages = ["all", "javascript", "ruby", "python"];
  return (
    <nav>
      <ul>
        {languages.map(lang => (
          <li key={lang} onClick={() => {}}>
            {lang}
          </li>
        ))}
      </ul>
    </nav>
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

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {" "}
        <Nav />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
