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
app.use(express.json());
app.use(cors());
app.post('/', (req, res) => {
  const {data} = req.body;
  // remove body data
  // console.log(data);
  writeFile(data);

});

function writeFile(data) {
  let deleteFiles = false;
  // try {
  //   fs.readdirSync('./Results').forEach(file => {
  //     if(file.includes("result_2_gen_") ) {
  //       fs.unlinkSync(path.join('./Results', file));
  //       console.log('contains', contains(data, file));
  //       console.log("deleted file", file);
  //     }
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  for(let i = 0; i < data.length; i++) {
    if(data[i].filename.includes("result_2_gen_")) {
      deleteFiles = true;
    }
  }
  // if(deleteFiles) {
  //   try {
  //     fs.readdirSync('./Results').forEach(file => {
  //       if(file.includes("result_2_gen_") ) {
  //         fs.unlinkSync(path.join('./Results', file));
  //         console.log('contains', contains(data, file));
  //         console.log("deleted file", file);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  for(let i = 0; i < data.length; i++) {
    fs.writeFile(data[i].filename, data[i].data, { flag: data[i].flag }, err => {});
  }
}

function contains(a, obj) {
  var i = a.length;
  while (i--) {
     if (a[i].filename === obj) {
         return true;
     }
  }
  return false;
}


