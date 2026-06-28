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
    it('14: table restart', () => {
        loginNewUser();
        cy.contains('.form-group', 'X').find('input').clear().type('1');
        cy.contains('.form-group', 'R').find('input').clear().type('2');
        cy.contains('button', 'Проверить').click();
        cy.get('table tbody tr').first().should('be.visible');

        cy.reload();
        cy.get('table tbody tr').first().should('be.visible');
    });
});