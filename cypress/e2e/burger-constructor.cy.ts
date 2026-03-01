import type {} from '../support/cypress';
import '@4tw/cypress-drag-drop';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.prepareBurgerTest();
  });

  it('should create order after adding ingredients and login', () => {
    cy.contains('Соберите бургер').should('be.visible');

    // Drag bun
    cy.get('[data-testid="ingredient-card-bun"]')
      .first()
      .drag('[data-testid="constructor-bun"]');

    //  Drag main
    cy.get('[data-testid="ingredient-card-main"]')
      .first()
      .drag('[data-testid="constructor-main"]');

    // Drag sauce
    cy.get('[data-testid="ingredient-card-sauce"]')
      .first()
      .drag('[data-testid="constructor-main"]');

    // Order button
    cy.get('[data-testid="order-button"]').should('not.be.disabled');

    // Create order unAuth
    cy.get('[data-testid="order-button"]').click();
    cy.url().should('include', '/login');

    // Login
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('123456');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@postLogin');

    // Create order auth
    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrder');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').contains('54321');
  });

  it('should show error on order creation failure', () => {
    cy.get('[data-testid="ingredient-card-bun"]')
      .first()
      .drag('[data-testid="constructor-bun"]');

    cy.get('[data-testid="ingredient-card-main"]')
      .first()
      .drag('[data-testid="constructor-main"]');

    // Create order unAuth
    cy.get('[data-testid="order-button"]').click();
    cy.url().should('include', '/login');

    // Login
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('123456');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@postLogin');

    cy.intercept('POST', '**/orders', {
      statusCode: 500,
      body: { success: false, message: 'Server error' },
    }).as('createOrderFail');

    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrderFail');

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Произошла ошибка при отправке заказа: Server error').should('exist');
  });

  it('should show ingredient modal', () => {
    cy.get('[data-testid="ingredient-card-link"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
  });

  it('should calculate total price correctly', () => {
    cy.get('[data-testid="price"]').contains('0');
    // bun * 2 1255
    cy.get('[data-testid="ingredient-card-bun"]')
      .first()
      .drag('[data-testid="constructor-bun"]');
    cy.get('[data-testid="price"]').contains('2510');

    // + main 3000
    cy.get('[data-testid="ingredient-card-main"]')
      .first()
      .drag('[data-testid="constructor-main"]');
    cy.get('[data-testid="price"]').contains('5510');
  });

  it('should create button be disabled', () => {
    cy.get('[data-testid="order-button"]').should('be.disabled');
  });

  it('should create button be disabled with only bun ingredient', () => {
    cy.get('[data-testid="ingredient-card-bun"]').drag(
      '[data-testid="constructor-bun"]'
    );
    cy.get('[data-testid="order-button"]').should('be.disabled');
  });

  it('should create button be active with main ingredient', () => {
    cy.get('[data-testid="ingredient-card-bun"]').drag(
      '[data-testid="constructor-bun"]'
    );
    cy.get('[data-testid="ingredient-card-main"]').drag(
      '[data-testid="constructor-main"]'
    );
    cy.get('[data-testid="order-button"]').should('not.be.disabled');
  });

  it('should ingredient drag only to right slot', () => {
    cy.get('[data-testid="ingredient-card-bun"]').drag(
      '[data-testid="constructor-main"]'
    );
    cy.get('[data-testid="ingredient-card-main"]').drag(
      '[data-testid="constructor-bun"]'
    );
    cy.get('[data-testid="order-button"]').should('be.disabled');
  });
});
