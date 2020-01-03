const express = require('express');
const xlsx = require('xlsx');
const app = express();

app.get('/ping', (request, response) => {
    response.statusCode = 200;
    response.json({
        message: "OK"
    });
});


app.get('/availability/:postalCode', (request, response) => {
    const postalCode = (request.params.postalCode) ? request.params.postalCode : false;
    if (postalCode) {
        postalCode = postalCode.toUpperCase().trim();
        if(postalCode.match('(\D\d\D\d\D\d|(\d{5})){1}').length) {
            const locations = xlsx.readFile('db/postal_codes.xlsx');
        }
    }
});

app.listen(3000);