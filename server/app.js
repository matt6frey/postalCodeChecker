const express = require('express');
const xlsx = require('node-xlsx').default;
const XLSX = require('xlsx');
const fs = require('fs');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/ping', (request, response) => {
    response.statusCode = 200;
    response.json({
        message: "OK"
    });
});

app.get('/availability/:postalCode', (request, response) => {
    let postalCode = (request.params.postalCode) ? request.params.postalCode : false;
    let message, results = [];
    if (postalCode) {
        postalCode = postalCode.toUpperCase().replace(" ", '');
        // Match Canadian or USA postal codes
        if(postalCode.match(/(\D\d\D\d\D\d){1}/) || postalCode.match(/\d{5}/) && postalCode.length === 5) {
            const locations = xlsx.parse('db/postal_codes.xlsx')[0];
            results = locations.data.filter((row) => { 
                if(row.indexOf(postalCode) > -1) {
                    return row;
                }
            });
            response.statusCode = 200;
            message = "Success.";
        } else {
            response.statusCode = 404;
            message = "Invalid Postal Code.";
        }
    }
    if(!message) {
        message = "Postal code required."
    }
    response.json({availability: (results.length) ? results[0] : results, message: message});
});

app.get('/alt/:postalCode', (request, response) => {
    let postalCode = (request.params.postalCode) ? request.params.postalCode : false;
    let message, results = [];
    if (postalCode) {
        postalCode = postalCode.toUpperCase().replace(" ", '');
        // Match Canadian or USA postal codes
        if(postalCode.match(/(\D\d\D\d\D\d){1}/) || postalCode.match(/\d{5}/) && postalCode.length === 5) {
            const wb = XLSX.readFile('db/postal_codes.xlsx');
            const sheetnames = wb.SheetNames;
            const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetnames[0]]);
            const len = rows.length;
            for (let i = 0; i < len; i++) {
                if(rows[i].POST_CODE === postalCode) { 
                    results.push(rows[i]);
                    // break; // 7s
                }
            } // 6s

            // for (let row of rows) {
            //     if(row.POST_CODE === postalCode) {
            //         results.push(row);
            //         // break; // 7s
            //     }
            // } // 6s
        } else {
            response.statusCode = 404;
            message = "Invalid Postal Code.";
        }
    }
    if(!message) {
        message = "Postal code required."
    }
    response.json({availability: (results.length) ? results[0] : results, message: message});
});

console.log("Server listening on port 3000")
app.listen(3000);