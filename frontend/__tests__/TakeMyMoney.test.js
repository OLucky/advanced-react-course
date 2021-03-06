import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import NProgress from 'nprogress';
import Router from 'next/router';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';

import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

Router.router = { push() {} };

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()] } } }
  }
];

describe('<TakeMyMoney/>', () => {
  it('renders and matches', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const checkoutButton = wrapper.find('ReactStripeCheckout');
    expect(toJSON(checkoutButton)).toMatchSnapshot();
  });

  it('creates and order on token', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {createOrder: {id: 'xyz789'}}
    });

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const component = wrapper.find('TakeMyMoney').instance();
    component.onToken({id:'abc123'}, createOrderMock);
    expect(createOrderMock).toBeCalled();
    expect(createOrderMock).toBeCalledWith({variables: {token: 'abc123'}});
  });

  it('turns the progress bar on', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {createOrder: {id: 'xyz789'}}
    });
    NProgress.start = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const component = wrapper.find('TakeMyMoney').instance();
    component.onToken({id:'abc123'}, createOrderMock);
    expect(NProgress.start).toBeCalled();
  });

  it('routes to the order page when completed', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {createOrder: {id: 'xyz789'}}
    });

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    Router.router.push = jest.fn();

    const component = wrapper.find('TakeMyMoney').instance();
    component.onToken({id:'abc123'}, createOrderMock);
    await wait();
    expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/order", "query": {"id": "xyz789"}});
  });
});
