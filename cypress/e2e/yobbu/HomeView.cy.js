import trips from "../../fixtures/trips.json";
describe("Home page", () => {
  it("should test correctly search Trips", () => {
    cy.visit("http://localhost:5173");
    cy.contains("HomeView");
    cy.contains("Paris");
    cy.contains("Madrid");
    cy.get("#date_departure");
    cy.get("#submit-btn");
    cy.get("#date_departure").type("lorem");
    cy.get("#submit-btn").click();
    cy.contains("Paris").should("not.exist");
    cy.contains("No trips found");
  });

  it("Should test correctly access to trip details and provider details", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Paris");
    cy.contains("Madrid");
    cy.get("#88888888-8888-8888-8888-888888888888").click();
    cy.contains("Trip Details");
    cy.get("#provider_avatar").click();
    cy.contains("provider details");
    cy.contains("provider@example.com");
    cy.contains("Madrid").should("not.exist");
    cy.get("#fetch-trip-provider").click();
    cy.contains("Madrid");
  });

  it("should make an order correctly", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Paris");
    cy.contains("Madrid");
    cy.get("#88888888-8888-8888-8888-888888888888").click();
    cy.get("#btn-commander").click();
    cy.get("#next-btn").should("be.disabled");
    cy.get("#weight").type(45);
    cy.get("#format-1").click();
    cy.get("#poids-unite-1").click();
    cy.get("#next-btn").should("not.be.disabled").click();
    cy.contains("Depart du colis");
    cy.get("#next-btn").should("be.disabled");
    cy.get("#mode-envoi-1").click();
    cy.get("#email-envoi").type("lorem");
    cy.get("#next-btn").should("not.be.disabled");
    cy.get("#next-btn").click();
    cy.contains("Arrivee du colis");
    cy.get("#next-btn").should("be.disabled");
    cy.get("#mode-livraison-1").click();
    cy.get("#next-btn").should("not.be.disabled").click();
    cy.contains("Votre commande a ete ajoute au panier");
  });
});
