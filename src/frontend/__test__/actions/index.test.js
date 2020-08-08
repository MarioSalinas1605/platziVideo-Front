/* eslint-disable no-undef */
import { setFavorite, loginRequest } from '../../actions';
import movieMock from '../../__mocks__/movieMock';
import { LOGIN_REQUEST, SET_FAVORITE } from '../../types';

describe('Actions', () => {
  test('should ', () => {
    const payload = movieMock;
    const expectedAction = {
      type: SET_FAVORITE,
      payload,
    };
    expect(setFavorite(payload)).toEqual(expectedAction);
  });

  test('Login', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };
    const expectedAction = {
      type: LOGIN_REQUEST,
      payload,
    };
    expect(loginRequest(payload)).toEqual(expectedAction);
  });
});
