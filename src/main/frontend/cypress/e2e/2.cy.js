const getUniqueUser = () => `user_${Date.now()}_${Math.floor(Math.random() * 3000)}`;
const pass = 'password123';

function loginNewUser() {
    const user = getUniqueUser();
    cy.visit('/');
    cy.get('#username').type(user);
    cy.get('input[type="password"]').type(pass);
    cy.contains('button', 'Регистрация').click();

    cy.get('#username').should('have.value', '');
    cy.get('input[type="password"]').should('have.value', '');


    cy.get('#username').type(user);
    cy.get('input[type="password"]').type(pass);
    cy.contains('button', 'Войти').click();
    cy.url().should('include', '/main');
}

describe('lab4 - func tests', () => {

    it('2: reg existing', () => {
        const user = getUniqueUser();
        cy.visit('/');
        cy.get('#username').type(user);
        cy.get('input[type="password"]').type(pass);
        cy.contains('button', 'Регистрация').click();

        cy.get('#username').should('have.value', '');
        cy.get('input[type="password"]').should('have.value', '');


        cy.get('#username').clear().type(user);
        cy.get('input[type="password"]').clear().type(pass);

        cy.contains('button', 'Регистрация').click();
        cy.contains('already taken').should('be.visible');
    });

});