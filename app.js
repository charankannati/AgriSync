const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ownerRoutes = require('./src/routes/ownerRoutes');
const farmerRoutes = require('./src/routes/farmerRoutes');
const transporterRoutes = require('./src/routes/transporterRoutes');
const transactionsRoutes = require('./src/routes/transactionsRoutes');
const processorRoutes = require('./src/routes/processorRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const wholesalerRoutes = require('./src/routes/wholesalerRoutes');
const distributorRoutes = require('./src/routes/distributorRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use('/owner', ownerRoutes);
app.use('/farmer', farmerRoutes);
app.use('/transporter', transporterRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/processor', processorRoutes);
app.use('/events', eventRoutes);
app.use('/wholesaler', wholesalerRoutes);
app.use('/distributor', distributorRoutes);
app.use('/customer', customerRoutes);

app.listen(3000, async () => {
    console.log("Server listening on PORT 3000");
});