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
    it('15: sync r', () => {
        loginNewUser();

        cy.contains('.form-group', 'R').find('input').clear().type('5');

        cy.get('canvas').click(250, 150);

        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(2).should('contain.text', '5');
        });
    });
});