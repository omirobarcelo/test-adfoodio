import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('header has link to home', () => {
  const { container, getByTestId } = render(<App />);
  const headerElement = container.querySelector('header');
  const linkElement = getByTestId('home-link');
  expect(linkElement).toBeInTheDocument();
  expect(headerElement).toContainElement(linkElement);
  expect(linkElement.getAttribute('href')).toBe('/');
});
