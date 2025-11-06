import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('app matches snapshot', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toMatchSnapshot();
});