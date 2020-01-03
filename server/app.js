const express = require('express');
const app = express();

app.get('/ping', (request, response) => {
	response.statusCode = 200;
	response.json({
        message: "OK"
    });
});


app.listen(3000);