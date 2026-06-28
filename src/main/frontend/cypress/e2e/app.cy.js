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

    it('1: reg success', () => {
        cy.visit('/');
        cy.get('#username').type(getUniqueUser());
        cy.get('input[type="password"]').type(pass);
        cy.on('window:alert', (text) => {
            expect(text).to.include('Регистрация успешна');
        });
        cy.contains('button', 'Регистрация').click();
    });

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

    it('3: reg empty fields', () => {
        cy.visit('/');
        cy.contains('button', 'Регистрация').click();
        cy.contains('Логин не может быть пустым').should('be.visible');
    });

    it('4: login success', () => {
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
    });

    it('5: login wrong password', () => {
        cy.visit('/');
        cy.get('#username').type('randomuser123');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.contains('button', 'Войти').click();
        cy.contains('Неверный логин или пароль').should('be.visible');
    });

    it('6: logout', () => {
        loginNewUser();
        cy.contains('button', 'Выход').click();
        cy.url().should('include', '/login');
    });

    it('7: unauthorized access', () => {
        cy.visit('/main',  { failOnStatusCode: false });
        cy.url().should('include', '/login');
    });

    it('8: succes hit form', () => {
        loginNewUser();
        cy.get('.input-section').should('exist');
        cy.contains('.form-group', 'X').find('input').clear().type('1');
        cy.contains('.form-group', 'R').find('input').clear().type('2');
        cy.contains('button', 'Проверить').click();
        cy.get('table tbody tr').first().should('be.visible');
    });

    it('9: bad hit form', () => {
        loginNewUser();
        cy.contains('.form-group', 'X').find('input').clear().type('2');
        cy.contains('.form-group', 'R').find('input').clear().type('1');
        cy.contains('button', 'Проверить').click();
        cy.get('table tbody tr').first().should('contain.text', 'Промах');
    });

    it('10: canvas hit', () => {
        loginNewUser();
        cy.contains('.form-group', 'R').find('input').clear().type('1');
        cy.get('canvas').click(250, 150);
        cy.get('table tbody tr').first().should('be.visible')
    });

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

    it('12: form - R <= 0', () => {
        loginNewUser();
        cy.contains('.form-group', 'X').find('input').clear().type('2');
        cy.contains('.form-group', 'R').find('input').clear().type('-1');

        cy.on('window:alert', (text) => {
            if (text.includes('Регистрация')) return;
            expect(text).to.include('R должен быть')
        });

        cy.contains('button', 'Проверить').click()
    });

    it('13: remove all points', () => {
        loginNewUser();
        cy.contains('.form-group', 'X').find('input').clear().type('1');
        cy.contains('.form-group', 'R').find('input').clear().type('2');
        cy.contains('button', 'Проверить').click();
        cy.get('table tbody tr').first().should('be.visible');

        cy.contains('button', 'Очистить').click();
        cy.contains('Результатов пока нет').should('be.visible');
    });

    it('14: table restart', () => {
        loginNewUser();
        cy.contains('.form-group', 'X').find('input').clear().type('1');
        cy.contains('.form-group', 'R').find('input').clear().type('2');
        cy.contains('button', 'Проверить').click();
        cy.get('table tbody tr').first().should('be.visible');

        cy.reload();
        cy.get('table tbody tr').first().should('be.visible');
    });

    it('15: sync r', () => {
        loginNewUser();

        cy.contains('.form-group', 'R').find('input').clear().type('5');

        cy.get('canvas').click(250, 150);

        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(2).should('contain.text', '5');
        });
    });
});