const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ownerRoutes = require('./src/routes/ownerRoutes');
const farmerRoutes = require('./src/routes/farmerRoutes');

const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use('/owner', ownerRoutes);
app.use('/farmer', farmerRoutes);

app.listen(3000, async () => {
    console.log("Server listening on PORT 3000");
});