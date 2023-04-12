import React, { Component } from 'react';
import './count.css';

class Count extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
    };
  }
  // sets the results object state by calling the api
  componentDidMount() {
    fetch('/api/templatematching')
      .then((res) => res.json())
      .then((results) =>
        this.setState({ results }, () => console.log('Template Matching Complete...', results))
      );
  }

  render() {
    return (
      <div>
        <h2>Results</h2>
        <ul>
          {this.state.results.map((results) => (
            <li key={results.image}>
              {results.templateImage} {results.takeoffCount}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Count;
