const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ownerRoutes = require('./src/routes/ownerRoutes');

const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use('/owner', ownerRoutes);

app.listen(3000, async () => {
    console.log("Server listening on PORT 3000");
});