var mysql = require("mysql");
var inquirer = require("inquirer");



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("working so far");
    openMarket();
    // connection.end();
});

function openMarket() {

    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id} | Product: ${res[i].product_name} | Price: ${res[i].price}`);
        }
        // NEED TO REVIEW NEXT LINE
        if (i === res.length) {
            listItems();
        }
        // console.log("coming along")
    });

}


function listItems() {

    inquirer
        .prompt([{
            name: "action",
            type: "input",
            message: "Welcome to initiate purchase simply enter the product ID"
        },

            {
                type: "input",
                name: "confirm amount",
                message: "How many would you like to purchase?"


            }
        ]).then(function (answer) {

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            answer.product = res[(answer.product - 1)].product_name;
            console.log(answer.product);

            for (let i = 0; i < res.length; i++) {
                if (answer.product === res[i].product_name) {

                    //checking our stock and comparing it with user request
                    if (res[i].stock_quanity < answer.amount) {
                        console.log("Insufficient quantity!")
                    }
                    //if there is place the order and update the database
                    else if (res[i].stock_quanity > answer.amount) {
                        //then display the total cost
                        placeOrder((res[i].stock_quanity - answer.amount), answer.product);
                        displayTotal(answer.amount, res[i].price);

                    } else {
                        console.log("still working");
                    }
                }
            }

        })
    });
}

        function placeOrder(quanity, product) {
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quanity: quanity
                    },
                    {
                        product_name: product
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log("Thank you for shopping with us your order has been placed");
                });

        }

        function displayTotal(quanity, price) {
            total = quanity * price;
            console.log(`Your Total is: $${total}`);
            return connection.end();
        }

