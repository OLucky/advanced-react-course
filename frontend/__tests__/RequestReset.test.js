import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';

import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'test@test.com' }
    },
    result: {
      data: {
        requestReset: {
          message: 'success',
          __typename: 'Message'
        }
      }
    }
  }
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    const form = wrapper.find('[data-test="reset-form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    wrapper
      .find('input')
      .simulate('change', { target: { name: 'email', value: 'test@test.com' } });
    wrapper.find('form').simulate('submit');
    await wait(10);
    wrapper.update();
    expect(wrapper.find('form').find('p').text()).toContain('Success');
  });
});
