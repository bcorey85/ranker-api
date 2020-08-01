const { app } = require('./app');
const dbConnect = require('./config/db');

dbConnect();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`App started on ${port}`));
