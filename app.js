const express = require('express');
const path = require('path')


const app = express(); 

app.use(express.static(path.join(__dirname,'public')));

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`)
})

app.listen(3000, () => {
    console.log("App listening on port 3000")
})