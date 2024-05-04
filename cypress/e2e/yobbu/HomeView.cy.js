import trips from "../../fixtures/trips.json";
describe("Home page", () => {
  it("should test correctly search Trips", () => {
    cy.visit("http://localhost:5173");
    cy.contains("HomeView");
    cy.contains("Paris");
    cy.contains("Madrid");
    cy.get("#date_departure");
    cy.get("#submit-btn");
    cy.get("#signin-btn");
    cy.get("#date_departure").type("lorem");
    cy.get("#submit-btn").click();
    cy.contains("Paris").should("not.exist");
    cy.contains("No trips found");
  });

  it.only("Should test correctly access to trip details and provider details", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Paris");
    cy.contains("Madrid");
    cy.get("#88888888-8888-8888-8888-888888888888").click();
    cy.contains("Trip Details");
    cy.get("#provider_avatar").click();
    cy.contains("provider details");
    cy.contains("provider@example.com");
  });
});
