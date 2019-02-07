import React from 'react';
import styled from 'styled-components';

import RemoveFromCart from './RemoveFromCart';

import formatMoney from '../lib/formatMoney';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem, cartItem: { item } }) => {
  if(!item) return (<CartItemStyles>
    <p>This item has been removed!</p>
    <RemoveFromCart id={cartItem.id}/>
  </CartItemStyles>);

  return (
    <CartItemStyles>
      <img width="100" src={item.image} alt={item.title} />
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>
          {formatMoney(cartItem.quantity * item.price)}
          {' - '}
          <em>
            {cartItem.quantity} * {formatMoney(item.price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id}/>
    </CartItemStyles>
  );
};

export default CartItem;
