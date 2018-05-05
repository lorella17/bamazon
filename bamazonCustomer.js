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
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Welcome to John Brown's Market initiate purchase simply enter the product ID"
            },

            {
                type: "input",
                name: "amount",
                message: "How many would you like to purchase?"

            }

        ]).then(function (answer) {

        console.log(answer);

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            console.log("=================");
            // console.log(res[0].stock_quantity);

            answer.product = res[(answer.product - 1)].product_name;
            console.log(answer.product);

            for (let i = 0; i < res.length; i++) {
                console.log(i);

                if (answer.product === res[i].product_name) {
                    console.log(res[i].stock_quantity);

                    //checking our stock and comparing it with user request
                    if (res[i].stock_quantity < answer.amount) {
                        console.log("Insufficient quantity!")
                    }
                    //if there is place the order and update the database
                    else if (res[i].stock_quantity > answer.amount) {
                        //then display the total cost
                        checkOut((res[i].stock_quantity - answer.amount), answer.product, answer.amount, res[i].price);


                    } else {
                        console.log("not working");
                    }
                }
            }

        })
    });
}

function checkOut(quantity, product, amount, price) {

    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                product_name: product
            }
        ],

        function (err, res) {
            if (err) throw err;
            showTotal(amount, price);
            //LINE 109 WILL RUN LAST OR AFTER THE CONNECTION QUERY
        });


}

function showTotal(quantity, price) {
    total = quantity * price;
    console.log(`Your Total is: ${total}`);
    console.log("Thank you for shopping with us your order has been placed");
    // return connection.end();
}

