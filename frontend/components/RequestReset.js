import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: ''
  };

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestReset, { error, loading, called }) => (
          <Form method="post" data-test="reset-form" onSubmit={async e => {
            e.preventDefault();
            await requestReset();
            this.setState({
              email: ''
            })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && <p>Success! Check your email for a reset link.</p>}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  onChange={this.saveToState}
                  name="email"
                  placeholder="email"
                  id="request_reset_email"
                  value={this.state.email}
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

export default RequestReset;
export {REQUEST_RESET_MUTATION};
