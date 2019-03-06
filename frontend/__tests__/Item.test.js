import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

import ItemComponent from '../components/Item';

const fakeItem = {
  id: '11111',
  title: 'Cool thing',
  price: 4000,
  description: 'Some test',
  image: 'stuff.jpg',
  largeImage: 'stuff-large.jpg'
}

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem}/>);

    expect(toJSON(wrapper)).toMatchSnapshot();
  })

  // it('renders price tag properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem}/>);
  //   const PriceTag = wrapper.find('PriceTag');
    
  //   expect(PriceTag.children().text()).toBe('$50');
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  // });

  // it('renders the image', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem}/>);
  //   const img = wrapper.find('img');

  //   expect(img.props().src).toBe(fakeItem.image);
  //   expect(img.props().alt).toBe(fakeItem.title);
  // });

  // it('renders out the buttons', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem}/>);
  //   const ButtonList = wrapper.find('.buttonList');

  //   expect(ButtonList.children()).toHaveLength(3);
  //   expect(ButtonList.find('Link')).toHaveLength(1);
  //   expect(ButtonList.find('DeleteItem')).toHaveLength(1);
  //   expect(ButtonList.find('AddToCart')).toHaveLength(1);
  // })
});