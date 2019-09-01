const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')({});
const db = pgp('postgres://postgres:root@localhost:5432/postgres')


router.get("/getRecipes", (req, res) => {
    db.any('SELECT * from food_cart.RECIEPE_INFOR', 123).then(function (data) {
        let finalarr = []
        for (let i = 0; i < data.length; i++) {
            let obj = {
                name: data[i].recipe_name,
                description: data[i].description,
                ingredients: JSON.parse(data[i].ingredient),
                imagePath: data[i].image_url,

            }
            finalarr.push(obj)
        }
        res.send({ statusCode: 200, message: finalarr });
    }).catch(function (error) {
        console.log(error)
        res.send({ statusCode: 400, message: "Sorry, some error occured !!!" })
    })
})


router.post('/createRecipe', (req, res) => {
    if (req && req.body) {
        let obj = {
            recipe_name: req.body.name,
            image_url: req.body.imagePath,
            description: req.body.description,
            ingredient: JSON.stringify(req.body.ingredients),
            created_on: "now()",
            updated_on: "now()",
            price: 20,
        }
        let data = Object.keys(obj);
        let values = "";
        for (let key in obj) {
            values += `'${obj[key]}',`
        }
        values = values.substring(0, values.length - 1)
        let queryString = `INSERT INTO food_cart.RECIEPE_INFOR(${data}) values(
            ${values} 
            ) RETURNING * `
        db.one(queryString, data, a => {
            console.log(a);
            res.send({ statusCode: 200, message: a })
        }).catch(err => {
            console.log(err);
            res.send({ statusCode: 400, message: "Sorry, Some Error Occured" })
        })
    } else {
        res.send({ statusCode: 400, message: "Bad Request" })
    }
})

router.post('/deleteRecipe', (req, res) => {
    if (req && req.body) {
        let id = req.body.id + 1;
        let queryString = `DELETE FROM food_cart.RECIEPE_INFOR WHERE recipe_name = '${req.body.name}' RETURNING *`;
        db.one(queryString, id, a => {
            console.log(a);
            res.send({ statusCode: 200, message: a })
        }).catch(err => {
            console.log(err);
            res.send({ statusCode: 400, message: "Sorry some error occured !!!" })
        })

    } else {
        res.send({ statusCode: 400, message: "Sorry,Id is mandatory field" })
    }
})

router.put('/updateRecipe', (req, res) => {
    if (req && req.body) {
        let id = req.body.id + 1;
        let obj = {
            recipe_name: req.body.name,
            image_url: req.body.imagePath,
            description: req.body.description,
            ingredient: JSON.stringify(req.body.ingredients),
            price: 20,
            updated_on: "now()",
        }
        let values = "";
        for (let key in obj) {
            values += `${key} = '${obj[key]}',`
        }
        values = values.substring(0, values.length - 1)
        let queryString = `UPDATE food_cart.RECIEPE_INFOR SET ${values} WHERE recipe_name = '${req.body.name}' RETURNING *`;
        db.one(queryString, id, a => {
            console.log(a);
            res.send({ statusCode: 200, message: a })
        }).catch(err => {
            console.log(err);
            res.send({ statusCode: 400, message: "Sorry ,Some error occured !!!" })
        })
    } else {
        res.send({ statusCode: 400, message: "Sorry, Id is mandatory field" })
    }
})





module.exports = router;