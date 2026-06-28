describe('authorization', () => {
    it('try to register', () => {
        cy.visit("spb.hh.ru")

        cy.contains('Войти').click({ force: true })

        cy.wait(1000)

        cy.contains('Я ищу работу').click()

        cy.contains('Войти').click()

        cy.contains('Почта').click()

        cy.get('input[name="username"]').type('al.sol.1607@gmail.com')

        cy.contains('Дальше').click()


        cy.contains('Войти').should('not.exist')

    })
})