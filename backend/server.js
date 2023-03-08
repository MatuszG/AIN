const open = require("open");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();


(async () => {
  await open("../build/index.html", { wait: true });
})();


app.listen(3001);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: '15mb' }))
app.use(express.json());
app.use(cors());
app.post('/', (req, res) => {
  const {data} = req.body;
  // remove body data
  // console.log(data);
  res.sendStatus(200);
  writeFile(data);
});

app.post('/1', (req, res) => {
  const {data} = req.body;
  // try {
  //   fs.readdirSync('./Results').forEach(file => {
  //     if(file.includes("result_2_gen_") ) {
  //       console.log(__dirname)
  //       fs.unlinkSync(path.join(__dirname,'./Results', file));
  //       console.log("deleted file", file);
  //     }
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  // remove body data
  // console.log(data);
  res.sendStatus(200);
  writeFile2(data);
  
});

function writeFile2(data) {
  for(let i = 0; i < data.length; i++) {
    fs.writeFile(data[i].filename, data[i].data, { flag: data[i].flag }, err => {
    });
  }
}

function writeFile(data) {
  for(let i = 0; i < data.length; i++) {
    fs.writeFile(data[i].filename, data[i].data, { flag: data[i].flag }, err => {
    });
  }
}


