import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import Router from 'next/router';

Router.router = {
  push() {},
  prefetch() {}
}

import Pagination, {PAGINATION_QUERY} from '../components/Pagination';

const makeMocksFor = length => {
  return [
    {
      request: {query: PAGINATION_QUERY},
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              __typename: 'count',
              count: length
            }
          }
        }
      }
    }
  ]
}

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1}/>
      </MockedProvider>
    )
    expect(wrapper.text()).toContain('Loading')
  })

  it('renders pagination for 18 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1}/>
      </MockedProvider>
    )
    await wait();
    wrapper.update();
    const pagination = wrapper.find('PaginationStyles[data-test="pagination"]');
    expect(pagination.text()).toContain('18 Items Total');
    expect(toJSON(pagination)).toMatchSnapshot();
  })

  it('disables prev button on first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1}/>
      </MockedProvider>
    )
    await wait();
    wrapper.update();
    const pagination = wrapper.find('PaginationStyles[data-test="pagination"]');
    expect(pagination.find('a.prev').prop('aria-disabled')).toBeTruthy()
  });
  it('disables next button on last page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5}/>
      </MockedProvider>
    )
    await wait();
    wrapper.update();
    const pagination = wrapper.find('PaginationStyles[data-test="pagination"]');
    expect(pagination.find('a.next').prop('aria-disabled')).toBeTruthy()
  })
  it('enables all buttons on middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3}/>
      </MockedProvider>
    )
    await wait();
    wrapper.update();
    const pagination = wrapper.find('PaginationStyles[data-test="pagination"]');
    expect(pagination.find('a.prev').prop('aria-disabled')).toBeFalsy()
    expect(pagination.find('a.next').prop('aria-disabled')).toBeFalsy()
  })
  
});