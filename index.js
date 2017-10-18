/* jshint node: true */

'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const existsSync = require('exists-sync');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = {
  name: 'ember-cli-dotenv',

  init() {
    this._super.apply(this, arguments);

    let project = this.project;
    let hasOwn = Object.prototype.hasOwnProperty;
    let configFactory = path.join(project.root, 'dotenv.js');
    let options = {
      path: path.join(project.root, '.env'),
      clientAllowedKeys: []
    };

    if (existsSync(configFactory)) {
      Object.assign(options, require(configFactory)(this.env));
    }

    if (existsSync(options.path) && dotenv.config({ path: options.path })) {
      let loadedConfig = dotenv.parse(fs.readFileSync(options.path));
      let allowedKeys = options.clientAllowedKeys || [];

      this._config = allowedKeys.reduce((accumulator, key) => {
        accumulator[key] = loadedConfig[key];

        return accumulator;
      }, {});
    }
  },

  config(env, baseConfig) {
    return this._config;
  }
};
