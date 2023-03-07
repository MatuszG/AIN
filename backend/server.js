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
  const {data} = req.body;
  writeFile(data)
});

function writeFile(data) {
  for(let i = 0; i < data.length; i++) {
    fs.writeFile(data[i].filename, data[i].data, { flag: data[i].flag }, err => {});
  }
};

