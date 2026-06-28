describe('cytests: leetcode', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('ResizeObserver loop')) {
            return false
        }
    });

    beforeEach(() => {
        cy.setCookie('cf_clearance', Cypress.env('cf_clearance'), {
            domain: '.leetcode.com',
            secure: true
        })

    });

    it('1: problems: topics first bar', () => {
        cy.visit('https://leetcode.com/problemset/')

        cy.url().should('include', '/problemset')

        cy.contains('Algorithms').click()
        cy.url().should('include', '/problemset/algorithms')

        cy.get('a[href*="/problems/"]').first().click()
        cy.url().should('include', '/problems/')

    })

    it('2: problems: topics second bar', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.contains('Dynamic Programming').click()
        cy.url().should('include', '/problem-list/dynamic-programming')
    })

    it('3: problems: sort problems by difficult ascending, second is surely easy', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.get('svg[data-icon="arrow-down-arrow-up"]').closest('button').click()

        cy.contains('Difficulty').click()
        cy.get('a[href*="/problems/"]').eq(1).should('contain.text', 'Easy')

    })

    it('4: problems: sort problems by acceptage ascending, compare', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.get('svg[data-icon="arrow-down-arrow-up"]').closest('button').click()

        cy.contains('Acceptance').click()

        cy.get('div.w-full.pb-\\[80px\\]').should(($container) => {

            const $tasks = $container.find('a[href*="/problems/"]')

            const task1 = $tasks.eq(1).find(':contains("%")').last().text()
            const task2 = $tasks.eq(2).find(':contains("%")').last().text()

            const rate1 = parseFloat(task1.replace('%', '').trim())
            const rate2 = parseFloat(task2.replace('%', '').trim())

            expect(rate2).to.be.at.most(rate1)

        })
    })


    it('5: problems: filter problems, random pick', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.get('svg[data-icon="filter"]').closest('button').click()

        cy.contains('Difficulty').parent().click()

        cy.contains('Hard').click()

        cy.get('svg[data-icon="filter"]').closest('button').click({force: true})

        cy.get('svg[data-icon="shuffle"]').click({force: true})

        cy.url().should('include', '/problems')

        cy.contains('Hard').should('be.visible')
    });

    it('6: problems: must be a hint with run forbid', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.get('a[href*="/problems/"]').eq(1).click()
        cy.url().should('include', '/problems/')

        cy.contains('You need to').should('be.visible')
        cy.contains('to run or submit').should('be.visible')
    });

    it('7: problems: run mut be fobidden', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.get('a[href*="/problems/"]').eq(1).click()
        cy.url().should('include', '/problems/')

        cy.get('svg[data-icon="play"]').first().closest("button").click()

        cy.contains('Compile Error').should('not.exist')
    });


    // it.only('8: problems: run for registered', () => {
    //     cy.visit('https://leetcode.com/problemset/')
    //     cy.url().should('include', '/problemset')
    //
    //     cy.pause()
    //
    //     cy.contains('Log in').click()
    //     cy.url().should('include', '/login/')
    //
    //     cy.pause()
    //
    //     // cy.get('input[name="login"]').first().type(Cypress.env('username'))
    //     // cy.get('input[name="password"]').first().type(Cypress.env('password'))
    //     // cy.wait(10000)
    //
    //     cy.contains('button', 'Log in').click()
    //
    //     cy.pause()
    //
    //     // cy.url().should('include', '/problems/')
    //     //
    //     // cy.get('svg[data-icon="play"]').first().closest("button").click()
    //     //
    //     // cy.contains('Compile Error').should('not.exist')
    // });


    it('8: contest: must be forbidden for unregistered', () => {
        cy.visit('https://leetcode.com/contest/')
        cy.url().should('include', '/contest')

        cy.wait(1000)

        cy.get('a[href*="weekly-contest"]').first().click()
        cy.url({timeout: 10000}).should('include', 'weekly-contest')

        cy.wait(2000)
        cy.contains('button', 'Register').click()
        cy.contains('Please').should('be.visible')
    });


    // it('10: contest: must be reachable for unregistered', () => {
    //     cy.visit('https://leetcode.com/contest/')
    //     cy.url().should('include', '/contest')
    //
    //     cy.wait(1000)
    //
    //     cy.get('a[href*="weekly-contest"]').first().click()
    //     cy.url({ timeout: 10000 }).should('include', 'weekly-contest')
    //
    //     cy.contains('button', 'Register').click()
    //     cy.contains('Two-step Verification Required').should('not.exist')
    // });

    it('9: discuss: reading allowed for everyone', () => {
        cy.visit('https://leetcode.com/discuss/')
        cy.url().should('include', '/discuss')


        cy.wait(2000)
        cy.get('a[href*="/discuss/post"]').first().invoke('removeAttr', 'target').click()

        cy.wait(1000)

        cy.url().should('include', '/discuss/post')
    });

    it('10: discuss: feedback must be forbidden for unregistered', () => {
        cy.visit('https://leetcode.com/discuss/')
        cy.url().should('include', '/discuss')

        cy.wait(2000)
        cy.get('svg[data-icon="up"]').eq(1).click()
        cy.contains('Please').should('be.visible')
    });

    // it('13: discuss: feedback must be forbidden for unregistered', () => {
    //     cy.visit('https://leetcode.com/discuss/')
    //     cy.url().should('include', '/discuss')
    //
    //     cy.wait(2000)
    //     cy.get('svg[data-icon="up"]').eq(1).click()
    //     cy.contains('Please').should('be.visible')
    // });

    it('11: interview: must be forbidden for unregistered', () => {
        cy.visit('https://leetcode.com/interview/')
        cy.url().should('include', '/interview')

        cy.contains('Start Interviewing').click()

        cy.wait(2000)
        cy.url().should('include', 'login')
        // cy.get('svg[data-icon="up"]').eq(1).click()
        // cy.contains('Please').should('be.visible')
    });


    it('12: problems: quest shouldn tbe allowed', () => {
        cy.visit('https://leetcode.com/problemset/')
        cy.url().should('include', '/problemset')

        cy.get('svg[data-icon="sidebar"]').first().click()


        cy.contains('Quest').click({force: true})

        cy.wait(1000)

        cy.contains('Sign in to start your journey').should('be.visible')
    });


});