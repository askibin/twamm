"use strict";

const twammTypes = require("..");
const assert = require("assert").strict;

assert.deepEqual(Object.keys(twammTypes), ["OrderSide"]);
console.info("@twamm/types tests passed");
