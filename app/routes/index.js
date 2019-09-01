const recipeRoute = require("./recipe-routes/recipes")
module.exports = (app) => {

    app.use("/vo",
        recipeRoute
    )
}