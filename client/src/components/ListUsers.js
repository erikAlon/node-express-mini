import React from 'react';
import './css/ListUsers.css';
import axios from 'axios';

export default class ListUsers extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentWillMount() {
    axios
      .get('http://localhost:8000/api/users')
      .then((response) => {
        console.log(response);
        this.setState({
          users: response.data,
        });
      })
      .catch((err) => {
        console.log(`\nError listing users... \n\n${err}\n`);
      });
  }

  render() {
    return (
      <ul>
        {this.state.users.map((user, index) => {
          return (
            <li key={index}>
              <h1>{user.name}</h1>
              <h2>{user.bio}</h2>
            </li>
          );
        })}
      </ul>
    );
  }
}
