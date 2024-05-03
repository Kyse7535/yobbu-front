import trips from "../../fixtures/trips.json"
describe('Home page', () => {

    it ('should intercept calls to search Trips', () => {

        cy.visit('http://localhost:5173')
        cy.contains('HomeView')
        cy.contains('Paris')
        cy.contains('Madrid')
        cy.get('#date_departure')
        cy.get('#submit-btn')
        cy.get("#signin-btn")
        cy.get("#date_departure").type("lorem");
        cy.get("#submit-btn").click();
        cy.contains("Paris").should('not.exist')
        cy.contains("No trips found")
    })
})