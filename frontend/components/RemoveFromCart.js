import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const REMOVE_CART_ITEM_MUTATION = gql`
  mutation removeCartItem($id: ID!) {
    removeCartItem(id: $id) {
      id
    }
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  update = (cache, payload) => {
    const data = cache.readQuery({query: CURRENT_USER_QUERY});
    const cartItemId = payload.data.removeCartItem.id;

    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    cache.writeQuery({query: CURRENT_USER_QUERY, data})
  }

  render() {
    return (
      <Mutation
        mutation={REMOVE_CART_ITEM_MUTATION}
        update={this.update}
        variables={{ id: this.props.id }}
        optimisticResponse={{
          __typename: 'Mutation',
          removeCartItem: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
      >
        {(removeCartItem, { loading, error }) => {
          return <BigButton title="Delete Item" disabled={loading} onClick={removeCartItem}>X</BigButton>;
        }}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
export {REMOVE_CART_ITEM_MUTATION};