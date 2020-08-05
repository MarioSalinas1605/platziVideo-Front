/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
// eslint-disable-next-line import/extensions
import Footer from '../../components/Footer.jsx';

describe('<Footer />', () => {
  const footer = mount(<Footer />);
  test('Render Footer Component', () => {
    expect(footer.length).toEqual(1);
  });
  test('Footer haves 3 anchors', () => {
    expect(footer.find('a')).toHaveLength(3);
  });
});
