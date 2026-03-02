import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      prepareBurgerTest(): void;
      prepareSelectors(): void;
      login(): void;
    }
  }
}
