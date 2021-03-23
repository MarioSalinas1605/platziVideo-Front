/* eslint-disable no-undef */
import { addFavorite, login } from '../../actions';
import movieMock from '../../__mocks__/movieMock';
import { LOGIN, ADD_FAVORITE } from '../../types';

describe('Actions', () => {
  test('should ', () => {
    const payload = movieMock;
    const expectedAction = {
      type: ADD_FAVORITE,
      payload,
    };
    expect(addFavorite(payload)).toEqual(expectedAction);
  });

  test('Login', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };
    const expectedAction = {
      type: LOGIN,
      payload,
    };
    expect(login(payload)).toEqual(expectedAction);
  });
});
