import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';

import RemoveFromCart, { REMOVE_CART_ITEM_MUTATION } from '../components/RemoveFromCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({id: 'abc123'})]
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_CART_ITEM_MUTATION,
      variables: {
        id: 'abc123'
      }
    },
    result: {
      data: {
        removeCartItem: {
          __typename: 'CartItem',
          id: 'abc123'
        }
      }
    }
  }
];

describe('<RemoveFromCart/>', () => {
  it('renders and matches', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id="abc123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
  });

  it('remove the item from cart', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
      <ApolloConsumer>
        {client => {
          apolloClient = client;
          return <RemoveFromCart id="abc123" />
        }}
      </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const {data: {me}} = await apolloClient.query({query: CURRENT_USER_QUERY});
    expect(me.cart).toHaveLength(1);

    wrapper.find('button').simulate('click');
    await wait();
    const {data: {me: me2}} = await apolloClient.query({query: CURRENT_USER_QUERY});
    expect(me2.cart).toHaveLength(0);
  })
});
