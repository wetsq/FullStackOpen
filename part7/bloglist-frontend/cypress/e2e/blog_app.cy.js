describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/test/reset')

    const user = {
      name: 'Veeti',
      username: 'veesal',
      password: 'salasana',
    }

    const secondUser = {
      name: 'jaakko',
      username: 'jako',
      password: 'salasana',
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', secondUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('veesal')
      cy.get('#password').type('salasana')
      cy.get('#loginButton').click()

      cy.contains('logged in as veesal')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('väärä')
      cy.get('#password').type('salasana')
      cy.get('#loginButton').click()

      cy.contains('username or password invalid')
    })

    describe('Logged in', function () {
      beforeEach(function () {
        cy.get('#username').type('veesal')
        cy.get('#password').type('salasana')
        cy.get('#loginButton').click()
      })

      it('Can create new blog', function () {
        cy.get('#toggleCreateBlogButton').click()
        cy.get('#title').type('otsikko')
        cy.get('#author').type('tekijä')
        cy.get('#url').type('www')
        cy.get('#submitButton').click()

        cy.contains('otsikko tekijä')
      })

      describe('When blog has been created', function () {
        beforeEach(function () {
          cy.get('#toggleCreateBlogButton').click()
          cy.get('#title').type('otsikko')
          cy.get('#author').type('tekijä')
          cy.get('#url').type('www')
          cy.get('#submitButton').click()

          cy.contains('logout').click()
          cy.visit('http://localhost:3000')

          cy.get('#username').type('jako')
          cy.get('#password').type('salasana')
          cy.get('#loginButton').click()

          cy.get('#toggleCreateBlogButton').click()
          cy.get('#title').type('eri')
          cy.get('#author').type('tekijä')
          cy.get('#url').type('www')
          cy.get('#submitButton').click()

          cy.contains('logout').click()
          cy.visit('http://localhost:3000')

          cy.get('#username').type('veesal')
          cy.get('#password').type('salasana')
          cy.get('#loginButton').click()
        })

        it('blog can be liked', function () {
          cy.contains('otsikko tekijä').contains('view').click()
          cy.contains('like').click()
          cy.contains('1')
        })

        it('user can delete own blogs', function () {
          cy.contains('otsikko tekijä').contains('view').click()
          cy.contains('remove').click()
          cy.get('html').should('not.contain', 'otsikko tekijä')
        })

        it('user can only see remove button on own blogs', function () {
          cy.contains('eri tekijä').contains('view').click()
          cy.contains('jaakko').should('not.contain', 'remove')
        })

        it.only('most liked blog is showed first', function () {
          cy.contains('otsikko tekijä').contains('view').click()
          cy.contains('otsikko tekijä').contains('like').click()
          cy.contains('otsikko tekijä').contains('1')
          cy.contains('otsikko tekijä').contains('like').click()
          cy.contains('otsikko tekijä').contains('2')

          cy.contains('eri tekijä').contains('view').click()
          cy.contains('eri tekijä').contains('like').click()
          cy.contains('eri tekijä').contains('1')
          cy.contains('eri tekijä').contains('like').click()
          cy.contains('eri tekijä').contains('2')
          cy.contains('eri tekijä').contains('like').click()
          cy.contains('eri tekijä').contains('3')

          cy.get('.blog').eq(0).should('contain', 'eri tekijä')
          cy.get('.blog').eq(1).should('contain', 'otsikko tekijä')
        })
      })
    })
  })
})
