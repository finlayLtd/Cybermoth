describe("Logic", () => {
    test("User", async () => {
        const user = {
            id: "peter",
            name: "Peter"
        };
        expect(user.name).toBe("Peter");
    });
});
