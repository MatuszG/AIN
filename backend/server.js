const open = require("open");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

(async () => {
  await open("../build/index.html", { wait: true });
})();


app.listen(3001);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.post('/', (req, res) => {
  res.send('Hello World!');
  const {data} = req.body;
  console.log(req.body);
});

function writeFile(where, what) {
  fs.writeFile(where, what, { flag: 'w' }, err => {});
};

