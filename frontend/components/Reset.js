import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Form from './styles/Form';
import Error from './ErrorMessage';

import {CURRENT_USER_QUERY} from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  state = {
    password: '',
    confirmPassword: ''
  };

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{ ...this.state, resetToken: this.props.resetToken }}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(reset, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({
                password: '',
                confirmPassword: ''
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Enter a new password</h2>
              <Error error={error} />
              {!error && !loading && called && <p>Success! Your password has been reset!</p>}
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  onChange={this.saveToState}
                  name="password"
                  placeholder="password"
                  id="password"
                  value={this.state.password}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm password
                <input
                  type="password"
                  onChange={this.saveToState}
                  name="confirmPassword"
                  placeholder="confirm password"
                  id="confirmPassword"
                  value={this.state.confirmPassword}
                />
              </label>
              <button type="submit">Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired
}

export default Reset;
