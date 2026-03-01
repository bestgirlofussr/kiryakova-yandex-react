import type {} from '../support/cypress';
import '@4tw/cypress-drag-drop';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.prepareBurgerTest();
    cy.prepareSelectors();
  });

  it('should create order after adding ingredients and login', () => {
    cy.contains('Соберите бургер').should('be.visible');

    // Drag bun
    cy.get('@bunCard').first().drag('@bunZone');

    //  Drag main
    cy.get('@mainCard').first().drag('@mainZone');

    // Drag sauce
    cy.get('[data-testid="ingredient-card-sauce"]').first().drag('@mainZone');

    // Order button
    cy.get('@orderBtn').should('not.be.disabled');

    // Create order unAuth
    cy.get('@orderBtn').click();
    cy.url().should('include', '/login');

    // Login
    cy.login();

    // Create order auth
    cy.get('@orderBtn').click();
    cy.wait('@createOrder');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').contains('54321');
  });

  it('should show error on order creation failure', () => {
    cy.get('@bunCard').first().drag('@bunZone');

    cy.get('@mainCard').first().drag('@mainZone');

    // Create order unAuth
    cy.get('@orderBtn').click();
    cy.url().should('include', '/login');

    // Login
    cy.login();

    cy.intercept('POST', '**/orders', {
      statusCode: 500,
      body: { success: false, message: 'Server error' },
    }).as('createOrderFail');

    cy.get('@orderBtn').click();
    cy.wait('@createOrderFail');

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Произошла ошибка при отправке заказа: Server error').should('exist');
  });

  it('should show ingredient modal', () => {
    cy.get('[data-testid="ingredient-card-link"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
  });

  it('should calculate total price correctly', () => {
    cy.get('@price').contains('0');
    // bun * 2 1255
    cy.get('@bunCard').first().drag('@bunZone');
    cy.get('@price').contains('2510');

    // + main 3000
    cy.get('@mainCard').first().drag('@mainZone');
    cy.get('@price').contains('5510');
  });

  it('should create button be disabled', () => {
    cy.get('@orderBtn').should('be.disabled');
  });

  it('should create button be disabled with only bun ingredient', () => {
    cy.get('@bunCard').drag('@bunZone');
    cy.get('@orderBtn').should('be.disabled');
  });

  it('should create button be active with main ingredient', () => {
    cy.get('@bunCard').drag('@bunZone');
    cy.get('@mainCard').drag('@mainZone');
    cy.get('@orderBtn').should('not.be.disabled');
  });

  it('should ingredient drag only to correct slot', () => {
    cy.get('@bunCard').drag('@mainZone');
    cy.get('@mainCard').drag('@bunZone');
    cy.get('@orderBtn').should('be.disabled');
  });
});
