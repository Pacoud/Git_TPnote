describe("Frontend and backend integration", () => {
  it("loads the frontend and validates the API health endpoint", () => {
    cy.visit("/");
    cy.contains("Pipeline CI/CD GitLab avec Docker et AWS").should("be.visible");
    cy.request("/api/health").its("body").should("deep.equal", { status: "ok" });
    cy.get("[data-testid='api-status']").should("contain", "ok");
    cy.screenshot("frontend-api-health");
  });
});
