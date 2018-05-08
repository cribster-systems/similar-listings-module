import SimilarListings from '../src/index.jsx';
import React from 'react';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';
import "isomorphic-fetch";


describe('SimilarListings component renders similar listings correctly', () => {
  it('renders correctly', () => {
    const SimilarListingWrapper = shallow(
      <SimilarListings currentListingId={1} />
    );
    expect(SimilarListingWrapper).toMatchSnapshot();
  });
});


describe('Similiar Listings', () => {
  test('Should fetch all data from the server upon mounting', () => {
    sinon.spy(SimilarListings.prototype, 'fetchSimilarListings');
    const wrapper = mount( < SimilarListings currentListingId={1} /> );
    expect(SimilarListings.prototype.fetchSimilarListings.calledOnce).toBe(true);
    SimilarListings.prototype.fetchSimilarListings.restore();
  });
});

