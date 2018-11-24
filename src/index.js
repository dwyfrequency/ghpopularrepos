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
          <li
            key={lang}
            onClick={() => {
              props.handleSelectLanguage(lang);
            }}
          >
            {lang}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RepoGrid(props) {
  return (
    <ul style={{ display: "flex", flexWrap: "wrap" }}>
      {props.repos.map(
        ({ name, owner: { login }, stargazers_count, html_url }) => {
          return (
            <li key={name} style={{ margin: 30 }}>
              <ul>
                <li>
                  <a href={html_url}>{name}</a>
                </li>
                <li>@{login}</li>
                <li>{stargazers_count}</li>
              </ul>
            </li>
          );
        }
      )}
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      activeLanguage: "all",
      loading: true
    };

    this.handleSelectLanguage = this.handleSelectLanguage.bind(this);
    this.fetchRepos = this.fetchRepos.bind(this);
  }
  componentDidMount = () => {
    // when component first mounts it will fetch all the popular repositories
    this.fetchRepos(this.state.activeLanguage);
  };

  componentDidUpdate = (prevProps, prevState) => {
    // if the language selected was dif than before, fetch the repos for the new lang
    if (prevState.activeLanguage !== this.state.activeLanguage) {
      this.fetchRepos(this.state.activeLanguage);
    }
  };

  fetchRepos(lang) {
    // show the loading while we get the popular repos from the api then set it update the state again with new info
    this.setState({
      loading: true
    });

    window.API.fetchPopularRepos(lang).then(repos => {
      this.setState({
        loading: false,
        repos
      });
    });
  }
  handleSelectLanguage(lang) {
    this.setState({
      activeLanguage: lang
    });
  }
  render() {
    return (
      <div>
        <Nav handleSelectLanguage={this.handleSelectLanguage} />
        {this.state.loading === true ? (
          <Loading />
        ) : (
          <div>
            <h1 style={{ textAlign: "center" }}>{this.state.activeLanguage}</h1>
            <RepoGrid repos={this.state.repos} />
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
