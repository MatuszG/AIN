const {merge} = require('webpack-merge');

const commonConfiguration = require('./webpack/common');

module.exports= (_env, {mode}) =>{
   const config = require(`./webpack/${mode}`);
   const mergedConfig = merge(commonConfiguration, config);

   return mergedConfig;
}
