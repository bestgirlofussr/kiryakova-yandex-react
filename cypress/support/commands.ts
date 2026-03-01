/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add('prepareBurgerTest', () => {
  // Мокаем API
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients' }).as('getIngredients');
  cy.intercept('POST', '**/orders', { fixture: 'order-success' }).as('createOrder');
  cy.intercept('POST', '**/auth/login', { fixture: 'login-success' }).as('postLogin');

  // Открываем главную страницу
  cy.visit('/');

  // Ждём ингредиенты
  cy.wait('@getIngredients');
});

Cypress.Commands.add('prepareSelectors', () => {
  cy.get('[data-testid="ingredient-card-bun"]').as('bunCard');
  cy.get('[data-testid="ingredient-card-main"]').as('mainCard');
  cy.get('[data-testid="constructor-bun"]').as('bunZone');
  cy.get('[data-testid="constructor-main"]').as('mainZone');
  cy.get('[data-testid="order-button"]').as('orderBtn');
  cy.get('[data-testid="price"]').as('price');
});

Cypress.Commands.add('login', () => {
  cy.get('[data-testid="email-input"]').type('test@example.com');
  cy.get('[data-testid="password-input"]').type('123456');
  cy.get('[data-testid="login-button"]').click();

  cy.wait('@postLogin');
});
