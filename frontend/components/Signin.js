import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

import {CURRENT_USER_QUERY} from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Signin extends Component {
  state = {
    name: '',
    password: '',
    email: ''
  };

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
        {(signin, { error, loading }) => (
          <Form method="post" onSubmit={async e => {
            e.preventDefault();
            const res = await signin();
            console.log(res);
            this.setState({
              password: '',
              email: ''
            })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign In for An Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  onChange={this.saveToState}
                  name="email"
                  placeholder="email"
                  id="signin_email"
                  value={this.state.email}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  onChange={this.saveToState}
                  name="password"
                  placeholder="password"
                  id="signin_password"
                  value={this.state.password}
                />
              </label>
              <button type="submit">Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
