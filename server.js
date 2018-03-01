/**
 * Created by barthclem on 1/31/18.
 */
const express = require('express');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));
app.get('*', (req, res, next) => {
  console.log(`Routed to angular`);
  res.sendFile(__dirname + '/dist/index.html');
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, ()=> { console.log(`Server is started`);});
