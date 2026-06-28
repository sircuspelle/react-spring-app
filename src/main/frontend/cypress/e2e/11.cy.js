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
    it('11: x out of range', () => {
        loginNewUser()
        cy.contains('.form-group', 'X').find('input').clear().type('10')
        cy.contains('.form-group', 'R').find('input').clear().type('2')

        cy.on('window:alert', (text) => {
            if (text.includes('Регистрация')) return
            expect(text).to.include('X должен быть')
        })
        cy.contains('button', 'Проверить').click()
    });
});