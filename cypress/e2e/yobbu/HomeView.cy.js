describe("Home page", () => {
  // cy.fixture("tripsClient.json").then((data) => {
  //   cy.intercept("GET", "**/api/v1/Trips", { body: data }).as("trips");

  //   cy.wait(@trips).then(() => {

  //   })
  // });

  beforeEach(function () {
    cy.fixture("tripsClient").then((data) => {
      cy.intercept(
        "GET",
        "http://localhost:4500/api/v1/Trips?date_departure=&date_arrival=&city_departure=&city_arrival=&country_departure=&country_arrival=",
        {
          body: data,
        }
      ).as("trips");
      cy.intercept(
        "GET",
        "http://localhost:4500/api/v1/Trips?date_departure=lorem&date_arrival=&city_departure=&city_arrival=&country_departure=&country_arrival=",
        {
          body: [],
        }
      ).as("trips1");
      cy.intercept(
        "GET",
        "http://localhost:4500/api/v1/d3b07384-d9a7-43a8-9b25-dc36d05ed812/Trips",
        {
          body: data,
        }
      ).as("providerTrips");
    });
    cy.fixture("Provider").then((data) => {
      cy.intercept("GET", "http://localhost:4500/api/v1/Provider/*", {
        body: data,
      }).as("providers");
    });
    cy.fixture("FormatTrip").then((data) => {
      cy.intercept("GET", "http://localhost:4500/api/v1/Trip/Formats/List/*", {
        body: data,
      }).as("formatTrip");
    });
  });

  it("should test correctly search Trips", () => {
    cy.visit("http://localhost:5173");
    cy.wait("@trips");
    cy.contains("HomeView");
    cy.contains("toto");
    cy.get("#date_departure");
    cy.get("#submit-btn");
    cy.get("#date_departure").type("lorem");
    cy.get("#submit-btn").click();
    cy.wait("@trips1");
    cy.contains("Paris").should("not.exist");
    cy.contains("No trips found");
  });

  it("Should test correctly access to trip details and provider details", () => {
    cy.visit("http://localhost:5173");
    cy.wait("@trips");
    cy.contains("HomeView");
    cy.contains("toto");
    cy.get("#fab8b398-962c-4213-95b3-6e6d1cfb1954").click();
    cy.contains("Trip Details");
    cy.get("#provider_avatar").click();
    cy.wait("@providers");
    cy.contains("provider details");
    cy.contains("provider1@example.com");
    cy.contains("Madrid").should("not.exist");
    cy.get("#fetch-trip-provider").click();
    cy.wait("@providerTrips");
    cy.contains("toto");
  });

  it("should make an order correctly and modify order", () => {
    cy.visit("http://localhost:5173");
    cy.contains("toto");
    cy.get("#fab8b398-962c-4213-95b3-6e6d1cfb1954").click();
    cy.get("#btn-commander").click();
    cy.wait("@formatTrip");
    cy.get("#next-btn").should("be.disabled");
    cy.get("#weight").type(45);
    cy.get("#20cdc2ef-8db9-4a0a-81e5-a2ee34379e03").click();
    cy.get("#poids-unite-1").click();
    cy.get("#20cdc2ef-8db9-4a0a-81e5-a2ee34379e03").click();
    cy.contains("50.45");
    cy.get("#next-btn").should("not.be.disabled").click();
    cy.contains("Depart du colis");
    cy.get("#next-btn").should("be.disabled");
    cy.get("#a12f1f76-490c-4d7a-ae3d-8627fc9a2db8").click();
    cy.contains("65.45");
    cy.get("#email-envoi").type("lorem");
    cy.get("#next-btn").should("not.be.disabled");
    cy.get("#next-btn").click();
    cy.contains("Arrivee du colis");
    cy.get("#next-btn").should("be.disabled");
    cy.get("#c789b14a-01da-465f-8966-b54a3d3a6b8e").click();
    cy.contains("80.45");
    // cy.get("#btn-add-adresse").click();
    // cy.get("#btn-validate-adresse").should("be.disabled");
    // cy.get("#civilite-1").click();
    // cy.get("#nom-adresse").type("John");
    // cy.get("#prenom-adresse").type("Doe");
    // cy.get("#btn-validate-adresse").should("not.be.disabled").click();
    // cy.contains("mr Doe John");
    cy.get("#email_arrivee").type("ipsum");
    cy.get("#next-btn").should("not.be.disabled").click();
    cy.contains("Votre commande a ete ajoute au panier");

    //modify order
    cy.get("#panier").click();
    cy.contains("Mon panier");
    cy.get("#btn-modifier-order-0").click();
    cy.contains("80.45");
    cy.get("#next-btn").should("not.be.disabled");
    cy.get("#weight").clear();
    cy.get("#next-btn").should("be.disabled");
    cy.contains("80");
    cy.get("#weight").type(15);
    cy.get("#poids-unite-2").click();
    cy.contains("230");
    cy.get("#next-btn").should("not.be.disabled").click();
    cy.get("#next-btn").click();

    //delete order
    cy.get("#panier").click();
    cy.get("#btn-delete-order-0").click();
    cy.get("#btn-confirm-delete-order").click();
    cy.contains("order remove successfully");
    cy.contains("Votre panier est vide");
  });

  it.skip("Should modify order", () => {
    cy.visit("http://localhost:5173");
    cy.get("#panier").click();
  });
});
