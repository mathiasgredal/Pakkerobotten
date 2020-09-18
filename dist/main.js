/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/neataptic/src/architecture/architect.js":
/*!**************************************************************!*\
  !*** ./node_modules/neataptic/src/architecture/architect.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Import */
var methods = __webpack_require__(/*! ../methods/methods */ "./node_modules/neataptic/src/methods/methods.js");
var Network = __webpack_require__(/*! ./network */ "./node_modules/neataptic/src/architecture/network.js");
var Group = __webpack_require__(/*! ./group */ "./node_modules/neataptic/src/architecture/group.js");
var Layer = __webpack_require__(/*! ./layer */ "./node_modules/neataptic/src/architecture/layer.js");
var Node = __webpack_require__(/*! ./node */ "./node_modules/neataptic/src/architecture/node.js");

/*******************************************************************************
                                        architect
*******************************************************************************/

var architect = {
  /**
   * Constructs a network from a given array of connected nodes
   */
  Construct: function (list) {
    // Create a network
    var network = new Network(0, 0);

    // Transform all groups into nodes
    var nodes = [];

    var i;
    for (i = 0; i < list.length; i++) {
      let j;
      if (list[i] instanceof Group) {
        for (j = 0; j < list[i].nodes.length; j++) {
          nodes.push(list[i].nodes[j]);
        }
      } else if (list[i] instanceof Layer) {
        for (j = 0; j < list[i].nodes.length; j++) {
          for (var k = 0; k < list[i].nodes[j].nodes.length; k++) {
            nodes.push(list[i].nodes[j].nodes[k]);
          }
        }
      } else if (list[i] instanceof Node) {
        nodes.push(list[i]);
      }
    }

    // Determine input and output nodes
    var inputs = [];
    var outputs = [];
    for (i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].type === 'output' || nodes[i].connections.out.length + nodes[i].connections.gated.length === 0) {
        nodes[i].type = 'output';
        network.output++;
        outputs.push(nodes[i]);
        nodes.splice(i, 1);
      } else if (nodes[i].type === 'input' || !nodes[i].connections.in.length) {
        nodes[i].type = 'input';
        network.input++;
        inputs.push(nodes[i]);
        nodes.splice(i, 1);
      }
    }

    // Input nodes are always first, output nodes are always last
    nodes = inputs.concat(nodes).concat(outputs);

    if (network.input === 0 || network.output === 0) {
      throw new Error('Given nodes have no clear input/output node!');
    }

    for (i = 0; i < nodes.length; i++) {
      let j;
      for (j = 0; j < nodes[i].connections.out.length; j++) {
        network.connections.push(nodes[i].connections.out[j]);
      }
      for (j = 0; j < nodes[i].connections.gated.length; j++) {
        network.gates.push(nodes[i].connections.gated[j]);
      }
      if (nodes[i].connections.self.weight !== 0) {
        network.selfconns.push(nodes[i].connections.self);
      }
    }

    network.nodes = nodes;

    return network;
  },

  /**
   * Creates a multilayer perceptron (MLP)
   */
  Perceptron: function () {
    // Convert arguments to Array
    var layers = Array.prototype.slice.call(arguments);
    if (layers.length < 3) {
      throw new Error('You have to specify at least 3 layers');
    }

    // Create a list of nodes/groups
    var nodes = [];
    nodes.push(new Group(layers[0]));

    for (var i = 1; i < layers.length; i++) {
      var layer = layers[i];
      layer = new Group(layer);
      nodes.push(layer);
      nodes[i - 1].connect(nodes[i], methods.connection.ALL_TO_ALL);
    }

    // Construct the network
    return architect.Construct(nodes);
  },

  /**
   * Creates a randomly connected network
   */
  Random: function (input, hidden, output, options) {
    options = options || {};

    var connections = options.connections || hidden * 2;
    var backconnections = options.backconnections || 0;
    var selfconnections = options.selfconnections || 0;
    var gates = options.gates || 0;

    var network = new Network(input, output);

    var i;
    for (i = 0; i < hidden; i++) {
      network.mutate(methods.mutation.ADD_NODE);
    }

    for (i = 0; i < connections - hidden; i++) {
      network.mutate(methods.mutation.ADD_CONN);
    }

    for (i = 0; i < backconnections; i++) {
      network.mutate(methods.mutation.ADD_BACK_CONN);
    }

    for (i = 0; i < selfconnections; i++) {
      network.mutate(methods.mutation.ADD_SELF_CONN);
    }

    for (i = 0; i < gates; i++) {
      network.mutate(methods.mutation.ADD_GATE);
    }

    return network;
  },

  /**
   * Creates a long short-term memory network
   */
  LSTM: function () {
    var args = Array.prototype.slice.call(arguments);
    if (args.length < 3) {
      throw new Error('You have to specify at least 3 layers');
    }

    var last = args.pop();

    var outputLayer;
    if (typeof last === 'number') {
      outputLayer = new Group(last);
      last = {};
    } else {
      outputLayer = new Group(args.pop()); // last argument
    }

    outputLayer.set({
      type: 'output'
    });

    var options = {};
    options.memoryToMemory = last.memoryToMemory || false;
    options.outputToMemory = last.outputToMemory || false;
    options.outputToGates = last.outputToGates || false;
    options.inputToOutput = last.inputToOutput === undefined ? true : last.inputToOutput;
    options.inputToDeep = last.inputToDeep === undefined ? true : last.inputToDeep;

    var inputLayer = new Group(args.shift()); // first argument
    inputLayer.set({
      type: 'input'
    });

    var blocks = args; // all the arguments in the middle

    var nodes = [];
    nodes.push(inputLayer);

    var previous = inputLayer;
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];

      // Init required nodes (in activation order)
      var inputGate = new Group(block);
      var forgetGate = new Group(block);
      var memoryCell = new Group(block);
      var outputGate = new Group(block);
      var outputBlock = i === blocks.length - 1 ? outputLayer : new Group(block);

      inputGate.set({
        bias: 1
      });
      forgetGate.set({
        bias: 1
      });
      outputGate.set({
        bias: 1
      });

      // Connect the input with all the nodes
      var input = previous.connect(memoryCell, methods.connection.ALL_TO_ALL);
      previous.connect(inputGate, methods.connection.ALL_TO_ALL);
      previous.connect(outputGate, methods.connection.ALL_TO_ALL);
      previous.connect(forgetGate, methods.connection.ALL_TO_ALL);

      // Set up internal connections
      memoryCell.connect(inputGate, methods.connection.ALL_TO_ALL);
      memoryCell.connect(forgetGate, methods.connection.ALL_TO_ALL);
      memoryCell.connect(outputGate, methods.connection.ALL_TO_ALL);
      var forget = memoryCell.connect(memoryCell, methods.connection.ONE_TO_ONE);
      var output = memoryCell.connect(outputBlock, methods.connection.ALL_TO_ALL);

      // Set up gates
      inputGate.gate(input, methods.gating.INPUT);
      forgetGate.gate(forget, methods.gating.SELF);
      outputGate.gate(output, methods.gating.OUTPUT);

      // Input to all memory cells
      if (options.inputToDeep && i > 0) {
        let input = inputLayer.connect(memoryCell, methods.connection.ALL_TO_ALL);
        inputGate.gate(input, methods.gating.INPUT);
      }

      // Optional connections
      if (options.memoryToMemory) {
        let input = memoryCell.connect(memoryCell, methods.connection.ALL_TO_ELSE);
        inputGate.gate(input, methods.gating.INPUT);
      }

      if (options.outputToMemory) {
        let input = outputLayer.connect(memoryCell, methods.connection.ALL_TO_ALL);
        inputGate.gate(input, methods.gating.INPUT);
      }

      if (options.outputToGates) {
        outputLayer.connect(inputGate, methods.connection.ALL_TO_ALL);
        outputLayer.connect(forgetGate, methods.connection.ALL_TO_ALL);
        outputLayer.connect(outputGate, methods.connection.ALL_TO_ALL);
      }

      // Add to array
      nodes.push(inputGate);
      nodes.push(forgetGate);
      nodes.push(memoryCell);
      nodes.push(outputGate);
      if (i !== blocks.length - 1) nodes.push(outputBlock);

      previous = outputBlock;
    }

    // input to output direct connection
    if (options.inputToOutput) {
      inputLayer.connect(outputLayer, methods.connection.ALL_TO_ALL);
    }

    nodes.push(outputLayer);
    return architect.Construct(nodes);
  },

  /**
   * Creates a gated recurrent unit network
   */
  GRU: function () {
    var args = Array.prototype.slice.call(arguments);
    if (args.length < 3) {
      throw new Error('not enough layers (minimum 3) !!');
    }

    var inputLayer = new Group(args.shift()); // first argument
    var outputLayer = new Group(args.pop()); // last argument
    var blocks = args; // all the arguments in the middle

    var nodes = [];
    nodes.push(inputLayer);

    var previous = inputLayer;
    for (var i = 0; i < blocks.length; i++) {
      var layer = new Layer.GRU(blocks[i]);
      previous.connect(layer);
      previous = layer;

      nodes.push(layer);
    }

    previous.connect(outputLayer);
    nodes.push(outputLayer);

    return architect.Construct(nodes);
  },

  /**
   * Creates a hopfield network of the given size
   */
  Hopfield: function (size) {
    var input = new Group(size);
    var output = new Group(size);

    input.connect(output, methods.connection.ALL_TO_ALL);

    input.set({
      type: 'input'
    });
    output.set({
      squash: methods.activation.STEP,
      type: 'output'
    });

    var network = new architect.Construct([input, output]);

    return network;
  },

  /**
   * Creates a NARX network (remember previous inputs/outputs)
   */
  NARX: function (inputSize, hiddenLayers, outputSize, previousInput, previousOutput) {
    if (!Array.isArray(hiddenLayers)) {
      hiddenLayers = [hiddenLayers];
    }

    var nodes = [];

    var input = new Layer.Dense(inputSize);
    var inputMemory = new Layer.Memory(inputSize, previousInput);
    var hidden = [];
    var output = new Layer.Dense(outputSize);
    var outputMemory = new Layer.Memory(outputSize, previousOutput);

    nodes.push(input);
    nodes.push(outputMemory);

    for (var i = 0; i < hiddenLayers.length; i++) {
      var hiddenLayer = new Layer.Dense(hiddenLayers[i]);
      hidden.push(hiddenLayer);
      nodes.push(hiddenLayer);
      if (typeof hidden[i - 1] !== 'undefined') {
        hidden[i - 1].connect(hiddenLayer, methods.connection.ALL_TO_ALL);
      }
    }

    nodes.push(inputMemory);
    nodes.push(output);

    input.connect(hidden[0], methods.connection.ALL_TO_ALL);
    input.connect(inputMemory, methods.connection.ONE_TO_ONE, 1);
    inputMemory.connect(hidden[0], methods.connection.ALL_TO_ALL);
    hidden[hidden.length - 1].connect(output, methods.connection.ALL_TO_ALL);
    output.connect(outputMemory, methods.connection.ONE_TO_ONE, 1);
    outputMemory.connect(hidden[0], methods.connection.ALL_TO_ALL);

    input.set({
      type: 'input'
    });
    output.set({
      type: 'output'
    });

    return architect.Construct(nodes);
  }
};

/* Export */
module.exports = architect;


/***/ }),

/***/ "./node_modules/neataptic/src/architecture/connection.js":
/*!***************************************************************!*\
  !*** ./node_modules/neataptic/src/architecture/connection.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Export */
module.exports = Connection;

/*******************************************************************************
                                      CONNECTION
*******************************************************************************/

function Connection (from, to, weight) {
  this.from = from;
  this.to = to;
  this.gain = 1;

  this.weight = (typeof weight === 'undefined') ? Math.random() * 0.2 - 0.1 : weight;

  this.gater = null;
  this.elegibility = 0;

  // For tracking momentum
  this.previousDeltaWeight = 0;

  // Batch training
  this.totalDeltaWeight = 0;

  this.xtrace = {
    nodes: [],
    values: []
  };
}

Connection.prototype = {
  /**
   * Converts the connection to a json object
   */
  toJSON: function () {
    var json = {
      weight: this.weight
    };

    return json;
  }
};

/**
 * Returns an innovation ID
 * https://en.wikipedia.org/wiki/Pairing_function (Cantor pairing function)
 */
Connection.innovationID = function (a, b) {
  return 1 / 2 * (a + b) * (a + b + 1) + b;
};


/***/ }),

/***/ "./node_modules/neataptic/src/architecture/group.js":
/*!**********************************************************!*\
  !*** ./node_modules/neataptic/src/architecture/group.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Export */
module.exports = Group;

/* Import */
var methods = __webpack_require__(/*! ../methods/methods */ "./node_modules/neataptic/src/methods/methods.js");
var config = __webpack_require__(/*! ../config */ "./node_modules/neataptic/src/config.js");
var Layer = __webpack_require__(/*! ./layer */ "./node_modules/neataptic/src/architecture/layer.js");
var Node = __webpack_require__(/*! ./node */ "./node_modules/neataptic/src/architecture/node.js");

/*******************************************************************************
                                         Group
*******************************************************************************/

function Group (size) {
  this.nodes = [];
  this.connections = {
    in: [],
    out: [],
    self: []
  };

  for (var i = 0; i < size; i++) {
    this.nodes.push(new Node());
  }
}

Group.prototype = {
  /**
   * Activates all the nodes in the group
   */
  activate: function (value) {
    var values = [];

    if (typeof value !== 'undefined' && value.length !== this.nodes.length) {
      throw new Error('Array with values should be same as the amount of nodes!');
    }

    for (var i = 0; i < this.nodes.length; i++) {
      var activation;
      if (typeof value === 'undefined') {
        activation = this.nodes[i].activate();
      } else {
        activation = this.nodes[i].activate(value[i]);
      }

      values.push(activation);
    }

    return values;
  },

  /**
   * Propagates all the node in the group
   */
  propagate: function (rate, momentum, target) {
    if (typeof target !== 'undefined' && target.length !== this.nodes.length) {
      throw new Error('Array with values should be same as the amount of nodes!');
    }

    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (typeof target === 'undefined') {
        this.nodes[i].propagate(rate, momentum, true);
      } else {
        this.nodes[i].propagate(rate, momentum, true, target[i]);
      }
    }
  },

  /**
   * Connects the nodes in this group to nodes in another group or just a node
   */
  connect: function (target, method, weight) {
    var connections = [];
    var i, j;
    if (target instanceof Group) {
      if (typeof method === 'undefined') {
        if (this !== target) {
          if (config.warnings) console.warn('No group connection specified, using ALL_TO_ALL');
          method = methods.connection.ALL_TO_ALL;
        } else {
          if (config.warnings) console.warn('No group connection specified, using ONE_TO_ONE');
          method = methods.connection.ONE_TO_ONE;
        }
      }
      if (method === methods.connection.ALL_TO_ALL || method === methods.connection.ALL_TO_ELSE) {
        for (i = 0; i < this.nodes.length; i++) {
          for (j = 0; j < target.nodes.length; j++) {
            if (method === methods.connection.ALL_TO_ELSE && this.nodes[i] === target.nodes[j]) continue;
            let connection = this.nodes[i].connect(target.nodes[j], weight);
            this.connections.out.push(connection[0]);
            target.connections.in.push(connection[0]);
            connections.push(connection[0]);
          }
        }
      } else if (method === methods.connection.ONE_TO_ONE) {
        if (this.nodes.length !== target.nodes.length) {
          throw new Error('From and To group must be the same size!');
        }

        for (i = 0; i < this.nodes.length; i++) {
          let connection = this.nodes[i].connect(target.nodes[i], weight);
          this.connections.self.push(connection[0]);
          connections.push(connection[0]);
        }
      }
    } else if (target instanceof Layer) {
      connections = target.input(this, method, weight);
    } else if (target instanceof Node) {
      for (i = 0; i < this.nodes.length; i++) {
        let connection = this.nodes[i].connect(target, weight);
        this.connections.out.push(connection[0]);
        connections.push(connection[0]);
      }
    }

    return connections;
  },

  /**
   * Make nodes from this group gate the given connection(s)
   */
  gate: function (connections, method) {
    if (typeof method === 'undefined') {
      throw new Error('Please specify Gating.INPUT, Gating.OUTPUT');
    }

    if (!Array.isArray(connections)) {
      connections = [connections];
    }

    var nodes1 = [];
    var nodes2 = [];

    var i, j;
    for (i = 0; i < connections.length; i++) {
      var connection = connections[i];
      if (!nodes1.includes(connection.from)) nodes1.push(connection.from);
      if (!nodes2.includes(connection.to)) nodes2.push(connection.to);
    }

    switch (method) {
      case methods.gating.INPUT:
        for (i = 0; i < nodes2.length; i++) {
          let node = nodes2[i];
          let gater = this.nodes[i % this.nodes.length];

          for (j = 0; j < node.connections.in.length; j++) {
            let conn = node.connections.in[j];
            if (connections.includes(conn)) {
              gater.gate(conn);
            }
          }
        }
        break;
      case methods.gating.OUTPUT:
        for (i = 0; i < nodes1.length; i++) {
          let node = nodes1[i];
          let gater = this.nodes[i % this.nodes.length];

          for (j = 0; j < node.connections.out.length; j++) {
            let conn = node.connections.out[j];
            if (connections.includes(conn)) {
              gater.gate(conn);
            }
          }
        }
        break;
      case methods.gating.SELF:
        for (i = 0; i < nodes1.length; i++) {
          let node = nodes1[i];
          let gater = this.nodes[i % this.nodes.length];

          if (connections.includes(node.connections.self)) {
            gater.gate(node.connections.self);
          }
        }
    }
  },

  /**
   * Sets the value of a property for every node
   */
  set: function (values) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (typeof values.bias !== 'undefined') {
        this.nodes[i].bias = values.bias;
      }

      this.nodes[i].squash = values.squash || this.nodes[i].squash;
      this.nodes[i].type = values.type || this.nodes[i].type;
    }
  },

  /**
   * Disconnects all nodes from this group from another given group/node
   */
  disconnect: function (target, twosided) {
    twosided = twosided || false;

    // In the future, disconnect will return a connection so indexOf can be used
    var i, j, k;
    if (target instanceof Group) {
      for (i = 0; i < this.nodes.length; i++) {
        for (j = 0; j < target.nodes.length; j++) {
          this.nodes[i].disconnect(target.nodes[j], twosided);

          for (k = this.connections.out.length - 1; k >= 0; k--) {
            let conn = this.connections.out[k];

            if (conn.from === this.nodes[i] && conn.to === target.nodes[j]) {
              this.connections.out.splice(k, 1);
              break;
            }
          }

          if (twosided) {
            for (k = this.connections.in.length - 1; k >= 0; k--) {
              let conn = this.connections.in[k];

              if (conn.from === target.nodes[j] && conn.to === this.nodes[i]) {
                this.connections.in.splice(k, 1);
                break;
              }
            }
          }
        }
      }
    } else if (target instanceof Node) {
      for (i = 0; i < this.nodes.length; i++) {
        this.nodes[i].disconnect(target, twosided);

        for (j = this.connections.out.length - 1; j >= 0; j--) {
          let conn = this.connections.out[j];

          if (conn.from === this.nodes[i] && conn.to === target) {
            this.connections.out.splice(j, 1);
            break;
          }
        }

        if (twosided) {
          for (j = this.connections.in.length - 1; j >= 0; j--) {
            var conn = this.connections.in[j];

            if (conn.from === target && conn.to === this.nodes[i]) {
              this.connections.in.splice(j, 1);
              break;
            }
          }
        }
      }
    }
  },

  /**
   * Clear the context of this group
   */
  clear: function () {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
  }
};


/***/ }),

/***/ "./node_modules/neataptic/src/architecture/layer.js":
/*!**********************************************************!*\
  !*** ./node_modules/neataptic/src/architecture/layer.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Export */
module.exports = Layer;

/* Import */
var methods = __webpack_require__(/*! ../methods/methods */ "./node_modules/neataptic/src/methods/methods.js");
var Group = __webpack_require__(/*! ./group */ "./node_modules/neataptic/src/architecture/group.js");
var Node = __webpack_require__(/*! ./node */ "./node_modules/neataptic/src/architecture/node.js");

/*******************************************************************************
                                         Group
*******************************************************************************/

function Layer () {
  this.output = null;

  this.nodes = [];
  this.connections = { in: [],
    out: [],
    self: []
  };
}

Layer.prototype = {
  /**
   * Activates all the nodes in the group
   */
  activate: function (value) {
    var values = [];

    if (typeof value !== 'undefined' && value.length !== this.nodes.length) {
      throw new Error('Array with values should be same as the amount of nodes!');
    }

    for (var i = 0; i < this.nodes.length; i++) {
      var activation;
      if (typeof value === 'undefined') {
        activation = this.nodes[i].activate();
      } else {
        activation = this.nodes[i].activate(value[i]);
      }

      values.push(activation);
    }

    return values;
  },

  /**
   * Propagates all the node in the group
   */
  propagate: function (rate, momentum, target) {
    if (typeof target !== 'undefined' && target.length !== this.nodes.length) {
      throw new Error('Array with values should be same as the amount of nodes!');
    }

    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (typeof target === 'undefined') {
        this.nodes[i].propagate(rate, momentum, true);
      } else {
        this.nodes[i].propagate(rate, momentum, true, target[i]);
      }
    }
  },

  /**
   * Connects the nodes in this group to nodes in another group or just a node
   */
  connect: function (target, method, weight) {
    var connections;
    if (target instanceof Group || target instanceof Node) {
      connections = this.output.connect(target, method, weight);
    } else if (target instanceof Layer) {
      connections = target.input(this, method, weight);
    }

    return connections;
  },

  /**
   * Make nodes from this group gate the given connection(s)
   */
  gate: function (connections, method) {
    this.output.gate(connections, method);
  },

  /**
   * Sets the value of a property for every node
   */
  set: function (values) {
    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];

      if (node instanceof Node) {
        if (typeof values.bias !== 'undefined') {
          node.bias = values.bias;
        }

        node.squash = values.squash || node.squash;
        node.type = values.type || node.type;
      } else if (node instanceof Group) {
        node.set(values);
      }
    }
  },

  /**
   * Disconnects all nodes from this group from another given group/node
   */
  disconnect: function (target, twosided) {
    twosided = twosided || false;

    // In the future, disconnect will return a connection so indexOf can be used
    var i, j, k;
    if (target instanceof Group) {
      for (i = 0; i < this.nodes.length; i++) {
        for (j = 0; j < target.nodes.length; j++) {
          this.nodes[i].disconnect(target.nodes[j], twosided);

          for (k = this.connections.out.length - 1; k >= 0; k--) {
            let conn = this.connections.out[k];

            if (conn.from === this.nodes[i] && conn.to === target.nodes[j]) {
              this.connections.out.splice(k, 1);
              break;
            }
          }

          if (twosided) {
            for (k = this.connections.in.length - 1; k >= 0; k--) {
              let conn = this.connections.in[k];

              if (conn.from === target.nodes[j] && conn.to === this.nodes[i]) {
                this.connections.in.splice(k, 1);
                break;
              }
            }
          }
        }
      }
    } else if (target instanceof Node) {
      for (i = 0; i < this.nodes.length; i++) {
        this.nodes[i].disconnect(target, twosided);

        for (j = this.connections.out.length - 1; j >= 0; j--) {
          let conn = this.connections.out[j];

          if (conn.from === this.nodes[i] && conn.to === target) {
            this.connections.out.splice(j, 1);
            break;
          }
        }

        if (twosided) {
          for (k = this.connections.in.length - 1; k >= 0; k--) {
            let conn = this.connections.in[k];

            if (conn.from === target && conn.to === this.nodes[i]) {
              this.connections.in.splice(k, 1);
              break;
            }
          }
        }
      }
    }
  },

  /**
   * Clear the context of this group
   */
  clear: function () {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
  }
};

Layer.Dense = function (size) {
  // Create the layer
  var layer = new Layer();

  // Init required nodes (in activation order)
  var block = new Group(size);

  layer.nodes.push(block);
  layer.output = block;

  layer.input = function (from, method, weight) {
    if (from instanceof Layer) from = from.output;
    method = method || methods.connection.ALL_TO_ALL;
    return from.connect(block, method, weight);
  };

  return layer;
};

Layer.LSTM = function (size) {
  // Create the layer
  var layer = new Layer();

  // Init required nodes (in activation order)
  var inputGate = new Group(size);
  var forgetGate = new Group(size);
  var memoryCell = new Group(size);
  var outputGate = new Group(size);
  var outputBlock = new Group(size);

  inputGate.set({
    bias: 1
  });
  forgetGate.set({
    bias: 1
  });
  outputGate.set({
    bias: 1
  });

  // Set up internal connections
  memoryCell.connect(inputGate, methods.connection.ALL_TO_ALL);
  memoryCell.connect(forgetGate, methods.connection.ALL_TO_ALL);
  memoryCell.connect(outputGate, methods.connection.ALL_TO_ALL);
  var forget = memoryCell.connect(memoryCell, methods.connection.ONE_TO_ONE);
  var output = memoryCell.connect(outputBlock, methods.connection.ALL_TO_ALL);

  // Set up gates
  forgetGate.gate(forget, methods.gating.SELF);
  outputGate.gate(output, methods.gating.OUTPUT);

  // Add to nodes array
  layer.nodes = [inputGate, forgetGate, memoryCell, outputGate, outputBlock];

  // Define output
  layer.output = outputBlock;

  layer.input = function (from, method, weight) {
    if (from instanceof Layer) from = from.output;
    method = method || methods.connection.ALL_TO_ALL;
    var connections = [];

    var input = from.connect(memoryCell, method, weight);
    connections = connections.concat(input);

    connections = connections.concat(from.connect(inputGate, method, weight));
    connections = connections.concat(from.connect(outputGate, method, weight));
    connections = connections.concat(from.connect(forgetGate, method, weight));

    inputGate.gate(input, methods.gating.INPUT);

    return connections;
  };

  return layer;
};

Layer.GRU = function (size) {
  // Create the layer
  var layer = new Layer();

  var updateGate = new Group(size);
  var inverseUpdateGate = new Group(size);
  var resetGate = new Group(size);
  var memoryCell = new Group(size);
  var output = new Group(size);
  var previousOutput = new Group(size);

  previousOutput.set({
    bias: 0,
    squash: methods.activation.IDENTITY,
    type: 'constant'
  });
  memoryCell.set({
    squash: methods.activation.TANH
  });
  inverseUpdateGate.set({
    bias: 0,
    squash: methods.activation.INVERSE,
    type: 'constant'
  });
  updateGate.set({
    bias: 1
  });
  resetGate.set({
    bias: 0
  });

  // Update gate calculation
  previousOutput.connect(updateGate, methods.connection.ALL_TO_ALL);

  // Inverse update gate calculation
  updateGate.connect(inverseUpdateGate, methods.connection.ONE_TO_ONE, 1);

  // Reset gate calculation
  previousOutput.connect(resetGate, methods.connection.ALL_TO_ALL);

  // Memory calculation
  var reset = previousOutput.connect(memoryCell, methods.connection.ALL_TO_ALL);

  resetGate.gate(reset, methods.gating.OUTPUT); // gate

  // Output calculation
  var update1 = previousOutput.connect(output, methods.connection.ALL_TO_ALL);
  var update2 = memoryCell.connect(output, methods.connection.ALL_TO_ALL);

  updateGate.gate(update1, methods.gating.OUTPUT);
  inverseUpdateGate.gate(update2, methods.gating.OUTPUT);

  // Previous output calculation
  output.connect(previousOutput, methods.connection.ONE_TO_ONE, 1);

  // Add to nodes array
  layer.nodes = [updateGate, inverseUpdateGate, resetGate, memoryCell, output, previousOutput];

  layer.output = output;

  layer.input = function (from, method, weight) {
    if (from instanceof Layer) from = from.output;
    method = method || methods.connection.ALL_TO_ALL;
    var connections = [];

    connections = connections.concat(from.connect(updateGate, method, weight));
    connections = connections.concat(from.connect(resetGate, method, weight));
    connections = connections.concat(from.connect(memoryCell, method, weight));

    return connections;
  };

  return layer;
};

Layer.Memory = function (size, memory) {
  // Create the layer
  var layer = new Layer();
  // Because the output can only be one group, we have to put the nodes all in óne group

  var previous = null;
  var i;
  for (i = 0; i < memory; i++) {
    var block = new Group(size);

    block.set({
      squash: methods.activation.IDENTITY,
      bias: 0,
      type: 'constant'
    });

    if (previous != null) {
      previous.connect(block, methods.connection.ONE_TO_ONE, 1);
    }

    layer.nodes.push(block);
    previous = block;
  }

  layer.nodes.reverse();

  for (i = 0; i < layer.nodes.length; i++) {
    layer.nodes[i].nodes.reverse();
  }

  // Because output can only be óne group, fit all memory nodes in óne group
  var outputGroup = new Group(0);
  for (var group in layer.nodes) {
    outputGroup.nodes = outputGroup.nodes.concat(layer.nodes[group].nodes);
  }
  layer.output = outputGroup;

  layer.input = function (from, method, weight) {
    if (from instanceof Layer) from = from.output;
    method = method || methods.connection.ALL_TO_ALL;

    if (from.nodes.length !== layer.nodes[layer.nodes.length - 1].nodes.length) {
      throw new Error('Previous layer size must be same as memory size');
    }

    return from.connect(layer.nodes[layer.nodes.length - 1], methods.connection.ONE_TO_ONE, 1);
  };

  return layer;
};


/***/ }),

/***/ "./node_modules/neataptic/src/architecture/network.js":
/*!************************************************************!*\
  !*** ./node_modules/neataptic/src/architecture/network.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Export */
module.exports = Network;

/* Import */
var multi = __webpack_require__(/*! ../multithreading/multi */ "./node_modules/neataptic/src/multithreading/multi.js");
var methods = __webpack_require__(/*! ../methods/methods */ "./node_modules/neataptic/src/methods/methods.js");
var Connection = __webpack_require__(/*! ./connection */ "./node_modules/neataptic/src/architecture/connection.js");
var config = __webpack_require__(/*! ../config */ "./node_modules/neataptic/src/config.js");
var Neat = __webpack_require__(/*! ../neat */ "./node_modules/neataptic/src/neat.js");
var Node = __webpack_require__(/*! ./node */ "./node_modules/neataptic/src/architecture/node.js");

/* Easier variable naming */
var mutation = methods.mutation;

/*******************************************************************************
                                 NETWORK
*******************************************************************************/

function Network (input, output) {
  if (typeof input === 'undefined' || typeof output === 'undefined') {
    throw new Error('No input or output size given');
  }

  this.input = input;
  this.output = output;

  // Store all the node and connection genes
  this.nodes = []; // Stored in activation order
  this.connections = [];
  this.gates = [];
  this.selfconns = [];

  // Regularization
  this.dropout = 0;

  // Create input and output nodes
  var i;
  for (i = 0; i < this.input + this.output; i++) {
    var type = i < this.input ? 'input' : 'output';
    this.nodes.push(new Node(type));
  }

  // Connect input nodes with output nodes directly
  for (i = 0; i < this.input; i++) {
    for (var j = this.input; j < this.output + this.input; j++) {
      // https://stats.stackexchange.com/a/248040/147931
      var weight = Math.random() * this.input * Math.sqrt(2 / this.input);
      this.connect(this.nodes[i], this.nodes[j], weight);
    }
  }
}

Network.prototype = {
  /**
   * Activates the network
   */
  activate: function (input, training) {
    var output = [];

    // Activate nodes chronologically
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].type === 'input') {
        this.nodes[i].activate(input[i]);
      } else if (this.nodes[i].type === 'output') {
        var activation = this.nodes[i].activate();
        output.push(activation);
      } else {
        if (training) this.nodes[i].mask = Math.random() < this.dropout ? 0 : 1;
        this.nodes[i].activate();
      }
    }

    return output;
  },

  /**
   * Activates the network without calculating elegibility traces and such
   */
  noTraceActivate: function (input) {
    var output = [];

    // Activate nodes chronologically
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].type === 'input') {
        this.nodes[i].noTraceActivate(input[i]);
      } else if (this.nodes[i].type === 'output') {
        var activation = this.nodes[i].noTraceActivate();
        output.push(activation);
      } else {
        this.nodes[i].noTraceActivate();
      }
    }

    return output;
  },

  /**
   * Backpropagate the network
   */
  propagate: function (rate, momentum, update, target) {
    if (typeof target === 'undefined' || target.length !== this.output) {
      throw new Error('Output target length should match network output length');
    }

    var targetIndex = target.length;

    // Propagate output nodes
    var i;
    for (i = this.nodes.length - 1; i >= this.nodes.length - this.output; i--) {
      this.nodes[i].propagate(rate, momentum, update, target[--targetIndex]);
    }

    // Propagate hidden and input nodes
    for (i = this.nodes.length - this.output - 1; i >= this.input; i--) {
      this.nodes[i].propagate(rate, momentum, update);
    }
  },

  /**
   * Clear the context of the network
   */
  clear: function () {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
  },

  /**
   * Connects the from node to the to node
   */
  connect: function (from, to, weight) {
    var connections = from.connect(to, weight);

    for (var i = 0; i < connections.length; i++) {
      var connection = connections[i];
      if (from !== to) {
        this.connections.push(connection);
      } else {
        this.selfconns.push(connection);
      }
    }

    return connections;
  },

  /**
   * Disconnects the from node from the to node
   */
  disconnect: function (from, to) {
    // Delete the connection in the network's connection array
    var connections = from === to ? this.selfconns : this.connections;

    for (var i = 0; i < connections.length; i++) {
      var connection = connections[i];
      if (connection.from === from && connection.to === to) {
        if (connection.gater !== null) this.ungate(connection);
        connections.splice(i, 1);
        break;
      }
    }

    // Delete the connection at the sending and receiving neuron
    from.disconnect(to);
  },

  /**
   * Gate a connection with a node
   */
  gate: function (node, connection) {
    if (this.nodes.indexOf(node) === -1) {
      throw new Error('This node is not part of the network!');
    } else if (connection.gater != null) {
      if (config.warnings) console.warn('This connection is already gated!');
      return;
    }
    node.gate(connection);
    this.gates.push(connection);
  },

  /**
   *  Remove the gate of a connection
   */
  ungate: function (connection) {
    var index = this.gates.indexOf(connection);
    if (index === -1) {
      throw new Error('This connection is not gated!');
    }

    this.gates.splice(index, 1);
    connection.gater.ungate(connection);
  },

  /**
   *  Removes a node from the network
   */
  remove: function (node) {
    var index = this.nodes.indexOf(node);

    if (index === -1) {
      throw new Error('This node does not exist in the network!');
    }

    // Keep track of gaters
    var gaters = [];

    // Remove selfconnections from this.selfconns
    this.disconnect(node, node);

    // Get all its inputting nodes
    var inputs = [];
    for (var i = node.connections.in.length - 1; i >= 0; i--) {
      let connection = node.connections.in[i];
      if (mutation.SUB_NODE.keep_gates && connection.gater !== null && connection.gater !== node) {
        gaters.push(connection.gater);
      }
      inputs.push(connection.from);
      this.disconnect(connection.from, node);
    }

    // Get all its outputing nodes
    var outputs = [];
    for (i = node.connections.out.length - 1; i >= 0; i--) {
      let connection = node.connections.out[i];
      if (mutation.SUB_NODE.keep_gates && connection.gater !== null && connection.gater !== node) {
        gaters.push(connection.gater);
      }
      outputs.push(connection.to);
      this.disconnect(node, connection.to);
    }

    // Connect the input nodes to the output nodes (if not already connected)
    var connections = [];
    for (i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      for (var j = 0; j < outputs.length; j++) {
        let output = outputs[j];
        if (!input.isProjectingTo(output)) {
          var conn = this.connect(input, output);
          connections.push(conn[0]);
        }
      }
    }

    // Gate random connections with gaters
    for (i = 0; i < gaters.length; i++) {
      if (connections.length === 0) break;

      let gater = gaters[i];
      let connIndex = Math.floor(Math.random() * connections.length);

      this.gate(gater, connections[connIndex]);
      connections.splice(connIndex, 1);
    }

    // Remove gated connections gated by this node
    for (i = node.connections.gated.length - 1; i >= 0; i--) {
      let conn = node.connections.gated[i];
      this.ungate(conn);
    }

    // Remove selfconnection
    this.disconnect(node, node);

    // Remove the node from this.nodes
    this.nodes.splice(index, 1);
  },

  /**
   * Mutates the network with the given method
   */
  mutate: function (method) {
    if (typeof method === 'undefined') {
      throw new Error('No (correct) mutate method given!');
    }

    var i, j;
    switch (method) {
      case mutation.ADD_NODE:
        // Look for an existing connection and place a node in between
        var connection = this.connections[Math.floor(Math.random() * this.connections.length)];
        var gater = connection.gater;
        this.disconnect(connection.from, connection.to);

        // Insert the new node right before the old connection.to
        var toIndex = this.nodes.indexOf(connection.to);
        var node = new Node('hidden');

        // Random squash function
        node.mutate(mutation.MOD_ACTIVATION);

        // Place it in this.nodes
        var minBound = Math.min(toIndex, this.nodes.length - this.output);
        this.nodes.splice(minBound, 0, node);

        // Now create two new connections
        var newConn1 = this.connect(connection.from, node)[0];
        var newConn2 = this.connect(node, connection.to)[0];

        // Check if the original connection was gated
        if (gater != null) {
          this.gate(gater, Math.random() >= 0.5 ? newConn1 : newConn2);
        }
        break;
      case mutation.SUB_NODE:
        // Check if there are nodes left to remove
        if (this.nodes.length === this.input + this.output) {
          if (config.warnings) console.warn('No more nodes left to remove!');
          break;
        }

        // Select a node which isn't an input or output node
        var index = Math.floor(Math.random() * (this.nodes.length - this.output - this.input) + this.input);
        this.remove(this.nodes[index]);
        break;
      case mutation.ADD_CONN:
        // Create an array of all uncreated (feedforward) connections
        var available = [];
        for (i = 0; i < this.nodes.length - this.output; i++) {
          let node1 = this.nodes[i];
          for (j = Math.max(i + 1, this.input); j < this.nodes.length; j++) {
            let node2 = this.nodes[j];
            if (!node1.isProjectingTo(node2)) available.push([node1, node2]);
          }
        }

        if (available.length === 0) {
          if (config.warnings) console.warn('No more connections to be made!');
          break;
        }

        var pair = available[Math.floor(Math.random() * available.length)];
        this.connect(pair[0], pair[1]);
        break;
      case mutation.SUB_CONN:
        // List of possible connections that can be removed
        var possible = [];

        for (i = 0; i < this.connections.length; i++) {
          let conn = this.connections[i];
          // Check if it is not disabling a node
          if (conn.from.connections.out.length > 1 && conn.to.connections.in.length > 1 && this.nodes.indexOf(conn.to) > this.nodes.indexOf(conn.from)) {
            possible.push(conn);
          }
        }

        if (possible.length === 0) {
          if (config.warnings) console.warn('No connections to remove!');
          break;
        }

        var randomConn = possible[Math.floor(Math.random() * possible.length)];
        this.disconnect(randomConn.from, randomConn.to);
        break;
      case mutation.MOD_WEIGHT:
        var allconnections = this.connections.concat(this.selfconns);

        var connection = allconnections[Math.floor(Math.random() * allconnections.length)];
        var modification = Math.random() * (method.max - method.min) + method.min;
        connection.weight += modification;
        break;
      case mutation.MOD_BIAS:
        // Has no effect on input node, so they are excluded
        var index = Math.floor(Math.random() * (this.nodes.length - this.input) + this.input);
        var node = this.nodes[index];
        node.mutate(method);
        break;
      case mutation.MOD_ACTIVATION:
        // Has no effect on input node, so they are excluded
        if (!method.mutateOutput && this.input + this.output === this.nodes.length) {
          if (config.warnings) console.warn('No nodes that allow mutation of activation function');
          break;
        }

        var index = Math.floor(Math.random() * (this.nodes.length - (method.mutateOutput ? 0 : this.output) - this.input) + this.input);
        var node = this.nodes[index];

        node.mutate(method);
        break;
      case mutation.ADD_SELF_CONN:
        // Check which nodes aren't selfconnected yet
        var possible = [];
        for (i = this.input; i < this.nodes.length; i++) {
          let node = this.nodes[i];
          if (node.connections.self.weight === 0) {
            possible.push(node);
          }
        }

        if (possible.length === 0) {
          if (config.warnings) console.warn('No more self-connections to add!');
          break;
        }

        // Select a random node
        var node = possible[Math.floor(Math.random() * possible.length)];

        // Connect it to himself
        this.connect(node, node);
        break;
      case mutation.SUB_SELF_CONN:
        if (this.selfconns.length === 0) {
          if (config.warnings) console.warn('No more self-connections to remove!');
          break;
        }
        var conn = this.selfconns[Math.floor(Math.random() * this.selfconns.length)];
        this.disconnect(conn.from, conn.to);
        break;
      case mutation.ADD_GATE:
        var allconnections = this.connections.concat(this.selfconns);

        // Create a list of all non-gated connections
        var possible = [];
        for (i = 0; i < allconnections.length; i++) {
          let conn = allconnections[i];
          if (conn.gater === null) {
            possible.push(conn);
          }
        }

        if (possible.length === 0) {
          if (config.warnings) console.warn('No more connections to gate!');
          break;
        }

        // Select a random gater node and connection, can't be gated by input
        var index = Math.floor(Math.random() * (this.nodes.length - this.input) + this.input);
        var node = this.nodes[index];
        var conn = possible[Math.floor(Math.random() * possible.length)];

        // Gate the connection with the node
        this.gate(node, conn);
        break;
      case mutation.SUB_GATE:
        // Select a random gated connection
        if (this.gates.length === 0) {
          if (config.warnings) console.warn('No more connections to ungate!');
          break;
        }

        var index = Math.floor(Math.random() * this.gates.length);
        var gatedconn = this.gates[index];

        this.ungate(gatedconn);
        break;
      case mutation.ADD_BACK_CONN:
        // Create an array of all uncreated (backfed) connections
        var available = [];
        for (i = this.input; i < this.nodes.length; i++) {
          let node1 = this.nodes[i];
          for (j = this.input; j < i; j++) {
            let node2 = this.nodes[j];
            if (!node1.isProjectingTo(node2)) available.push([node1, node2]);
          }
        }

        if (available.length === 0) {
          if (config.warnings) console.warn('No more connections to be made!');
          break;
        }

        var pair = available[Math.floor(Math.random() * available.length)];
        this.connect(pair[0], pair[1]);
        break;
      case mutation.SUB_BACK_CONN:
        // List of possible connections that can be removed
        var possible = [];

        for (i = 0; i < this.connections.length; i++) {
          let conn = this.connections[i];
          // Check if it is not disabling a node
          if (conn.from.connections.out.length > 1 && conn.to.connections.in.length > 1 && this.nodes.indexOf(conn.from) > this.nodes.indexOf(conn.to)) {
            possible.push(conn);
          }
        }

        if (possible.length === 0) {
          if (config.warnings) console.warn('No connections to remove!');
          break;
        }

        var randomConn = possible[Math.floor(Math.random() * possible.length)];
        this.disconnect(randomConn.from, randomConn.to);
        break;
      case mutation.SWAP_NODES:
        // Has no effect on input node, so they are excluded
        if ((method.mutateOutput && this.nodes.length - this.input < 2) ||
          (!method.mutateOutput && this.nodes.length - this.input - this.output < 2)) {
          if (config.warnings) console.warn('No nodes that allow swapping of bias and activation function');
          break;
        }

        var index = Math.floor(Math.random() * (this.nodes.length - (method.mutateOutput ? 0 : this.output) - this.input) + this.input);
        var node1 = this.nodes[index];
        index = Math.floor(Math.random() * (this.nodes.length - (method.mutateOutput ? 0 : this.output) - this.input) + this.input);
        var node2 = this.nodes[index];

        var biasTemp = node1.bias;
        var squashTemp = node1.squash;

        node1.bias = node2.bias;
        node1.squash = node2.squash;
        node2.bias = biasTemp;
        node2.squash = squashTemp;
        break;
    }
  },

  /**
   * Train the given set to this network
   */
  train: function (set, options) {
    if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
      throw new Error('Dataset input/output size should be same as network input/output size!');
    }

    options = options || {};

    // Warning messages
    if (typeof options.rate === 'undefined') {
      if (config.warnings) console.warn('Using default learning rate, please define a rate!');
    }
    if (typeof options.iterations === 'undefined') {
      if (config.warnings) console.warn('No target iterations given, running until error is reached!');
    }

    // Read the options
    var targetError = options.error || 0.05;
    var cost = options.cost || methods.cost.MSE;
    var baseRate = options.rate || 0.3;
    var dropout = options.dropout || 0;
    var momentum = options.momentum || 0;
    var batchSize = options.batchSize || 1; // online learning
    var ratePolicy = options.ratePolicy || methods.rate.FIXED();

    var start = Date.now();

    if (batchSize > set.length) {
      throw new Error('Batch size must be smaller or equal to dataset length!');
    } else if (typeof options.iterations === 'undefined' && typeof options.error === 'undefined') {
      throw new Error('At least one of the following options must be specified: error, iterations');
    } else if (typeof options.error === 'undefined') {
      targetError = -1; // run until iterations
    } else if (typeof options.iterations === 'undefined') {
      options.iterations = 0; // run until target error
    }

    // Save to network
    this.dropout = dropout;

    if (options.crossValidate) {
      let numTrain = Math.ceil((1 - options.crossValidate.testSize) * set.length);
      var trainSet = set.slice(0, numTrain);
      var testSet = set.slice(numTrain);
    }

    // Loops the training process
    var currentRate = baseRate;
    var iteration = 0;
    var error = 1;

    var i, j, x;
    while (error > targetError && (options.iterations === 0 || iteration < options.iterations)) {
      if (options.crossValidate && error <= options.crossValidate.testError) break;

      iteration++;

      // Update the rate
      currentRate = ratePolicy(baseRate, iteration);

      // Checks if cross validation is enabled
      if (options.crossValidate) {
        this._trainSet(trainSet, batchSize, currentRate, momentum, cost);
        if (options.clear) this.clear();
        error = this.test(testSet, cost).error;
        if (options.clear) this.clear();
      } else {
        error = this._trainSet(set, batchSize, currentRate, momentum, cost);
        if (options.clear) this.clear();
      }

      // Checks for options such as scheduled logs and shuffling
      if (options.shuffle) {
        for (j, x, i = set.length; i; j = Math.floor(Math.random() * i), x = set[--i], set[i] = set[j], set[j] = x);
      }

      if (options.log && iteration % options.log === 0) {
        console.log('iteration', iteration, 'error', error, 'rate', currentRate);
      }

      if (options.schedule && iteration % options.schedule.iterations === 0) {
        options.schedule.function({ error: error, iteration: iteration });
      }
    }

    if (options.clear) this.clear();

    if (dropout) {
      for (i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].type === 'hidden' || this.nodes[i].type === 'constant') {
          this.nodes[i].mask = 1 - this.dropout;
        }
      }
    }

    return {
      error: error,
      iterations: iteration,
      time: Date.now() - start
    };
  },

  /**
   * Performs one training epoch and returns the error
   * private function used in this.train
   */
  _trainSet: function (set, batchSize, currentRate, momentum, costFunction) {
    var errorSum = 0;
    for (var i = 0; i < set.length; i++) {
      var input = set[i].input;
      var target = set[i].output;

      var update = !!((i + 1) % batchSize === 0 || (i + 1) === set.length);

      var output = this.activate(input, true);
      this.propagate(currentRate, momentum, update, target);

      errorSum += costFunction(target, output);
    }
    return errorSum / set.length;
  },

  /**
   * Tests a set and returns the error and elapsed time
   */
  test: function (set, cost = methods.cost.MSE) {
    // Check if dropout is enabled, set correct mask
    var i;
    if (this.dropout) {
      for (i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].type === 'hidden' || this.nodes[i].type === 'constant') {
          this.nodes[i].mask = 1 - this.dropout;
        }
      }
    }

    var error = 0;
    var start = Date.now();

    for (i = 0; i < set.length; i++) {
      let input = set[i].input;
      let target = set[i].output;
      let output = this.noTraceActivate(input);
      error += cost(target, output);
    }

    error /= set.length;

    var results = {
      error: error,
      time: Date.now() - start
    };

    return results;
  },

  /**
   * Creates a json that can be used to create a graph with d3 and webcola
   */
  graph: function (width, height) {
    var input = 0;
    var output = 0;

    var json = {
      nodes: [],
      links: [],
      constraints: [{
        type: 'alignment',
        axis: 'x',
        offsets: []
      }, {
        type: 'alignment',
        axis: 'y',
        offsets: []
      }]
    };

    var i;
    for (i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];

      if (node.type === 'input') {
        if (this.input === 1) {
          json.constraints[0].offsets.push({
            node: i,
            offset: 0
          });
        } else {
          json.constraints[0].offsets.push({
            node: i,
            offset: 0.8 * width / (this.input - 1) * input++
          });
        }
        json.constraints[1].offsets.push({
          node: i,
          offset: 0
        });
      } else if (node.type === 'output') {
        if (this.output === 1) {
          json.constraints[0].offsets.push({
            node: i,
            offset: 0
          });
        } else {
          json.constraints[0].offsets.push({
            node: i,
            offset: 0.8 * width / (this.output - 1) * output++
          });
        }
        json.constraints[1].offsets.push({
          node: i,
          offset: -0.8 * height
        });
      }

      json.nodes.push({
        id: i,
        name: node.type === 'hidden' ? node.squash.name : node.type.toUpperCase(),
        activation: node.activation,
        bias: node.bias
      });
    }

    var connections = this.connections.concat(this.selfconns);
    for (i = 0; i < connections.length; i++) {
      var connection = connections[i];
      if (connection.gater == null) {
        json.links.push({
          source: this.nodes.indexOf(connection.from),
          target: this.nodes.indexOf(connection.to),
          weight: connection.weight
        });
      } else {
        // Add a gater 'node'
        var index = json.nodes.length;
        json.nodes.push({
          id: index,
          activation: connection.gater.activation,
          name: 'GATE'
        });
        json.links.push({
          source: this.nodes.indexOf(connection.from),
          target: index,
          weight: 1 / 2 * connection.weight
        });
        json.links.push({
          source: index,
          target: this.nodes.indexOf(connection.to),
          weight: 1 / 2 * connection.weight
        });
        json.links.push({
          source: this.nodes.indexOf(connection.gater),
          target: index,
          weight: connection.gater.activation,
          gate: true
        });
      }
    }

    return json;
  },

  /**
   * Convert the network to a json object
   */
  toJSON: function () {
    var json = {
      nodes: [],
      connections: [],
      input: this.input,
      output: this.output,
      dropout: this.dropout
    };

    // So we don't have to use expensive .indexOf()
    var i;
    for (i = 0; i < this.nodes.length; i++) {
      this.nodes[i].index = i;
    }

    for (i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      let tojson = node.toJSON();
      tojson.index = i;
      json.nodes.push(tojson);

      if (node.connections.self.weight !== 0) {
        let tojson = node.connections.self.toJSON();
        tojson.from = i;
        tojson.to = i;

        tojson.gater = node.connections.self.gater != null ? node.connections.self.gater.index : null;
        json.connections.push(tojson);
      }
    }

    for (i = 0; i < this.connections.length; i++) {
      let conn = this.connections[i];
      let tojson = conn.toJSON();
      tojson.from = conn.from.index;
      tojson.to = conn.to.index;

      tojson.gater = conn.gater != null ? conn.gater.index : null;

      json.connections.push(tojson);
    }

    return json;
  },

  /**
   * Sets the value of a property for every node in this network
   */
  set: function (values) {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].bias = values.bias || this.nodes[i].bias;
      this.nodes[i].squash = values.squash || this.nodes[i].squash;
    }
  },

  /**
   * Evolves the network to reach a lower error on a dataset
   */
  evolve: async function (set, options) {
    if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
      throw new Error('Dataset input/output size should be same as network input/output size!');
    }

    // Read the options
    options = options || {};
    var targetError = typeof options.error !== 'undefined' ? options.error : 0.05;
    var growth = typeof options.growth !== 'undefined' ? options.growth : 0.0001;
    var cost = options.cost || methods.cost.MSE;
    var amount = options.amount || 1;

    var threads = options.threads;
    if (typeof threads === 'undefined') {
      if (typeof window === 'undefined') { // Node.js
        threads = __webpack_require__(/*! os */ "./node_modules/os-browserify/browser.js").cpus().length;
      } else { // Browser
        threads = navigator.hardwareConcurrency;
      }
    }

    var start = Date.now();

    if (typeof options.iterations === 'undefined' && typeof options.error === 'undefined') {
      throw new Error('At least one of the following options must be specified: error, iterations');
    } else if (typeof options.error === 'undefined') {
      targetError = -1; // run until iterations
    } else if (typeof options.iterations === 'undefined') {
      options.iterations = 0; // run until target error
    }

    var fitnessFunction;
    if (threads === 1) {
      // Create the fitness function
      fitnessFunction = function (genome) {
        var score = 0;
        for (var i = 0; i < amount; i++) {
          score -= genome.test(set, cost).error;
        }

        score -= (genome.nodes.length - genome.input - genome.output + genome.connections.length + genome.gates.length) * growth;
        score = isNaN(score) ? -Infinity : score; // this can cause problems with fitness proportionate selection

        return score / amount;
      };
    } else {
      // Serialize the dataset
      var converted = multi.serializeDataSet(set);

      // Create workers, send datasets
      var workers = [];
      if (typeof window === 'undefined') {
        for (var i = 0; i < threads; i++) {
          workers.push(new multi.workers.node.TestWorker(converted, cost));
        }
      } else {
        for (var i = 0; i < threads; i++) {
          workers.push(new multi.workers.browser.TestWorker(converted, cost));
        }
      }

      fitnessFunction = function (population) {
        return new Promise((resolve, reject) => {
          // Create a queue
          var queue = population.slice();
          var done = 0;

          // Start worker function
          var startWorker = function (worker) {
            if (!queue.length) {
              if (++done === threads) resolve();
              return;
            }

            var genome = queue.shift();

            worker.evaluate(genome).then(function (result) {
              genome.score = -result;
              genome.score -= (genome.nodes.length - genome.input - genome.output +
                genome.connections.length + genome.gates.length) * growth;
              genome.score = isNaN(parseFloat(result)) ? -Infinity : genome.score;
              startWorker(worker);
            });
          };

          for (var i = 0; i < workers.length; i++) {
            startWorker(workers[i]);
          }
        });
      };

      options.fitnessPopulation = true;
    }

    // Intialise the NEAT instance
    options.network = this;
    var neat = new Neat(this.input, this.output, fitnessFunction, options);

    var error = -Infinity;
    var bestFitness = -Infinity;
    var bestGenome;

    while (error < -targetError && (options.iterations === 0 || neat.generation < options.iterations)) {
      let fittest = await neat.evolve();
      let fitness = fittest.score;
      error = fitness + (fittest.nodes.length - fittest.input - fittest.output + fittest.connections.length + fittest.gates.length) * growth;

      if (fitness > bestFitness) {
        bestFitness = fitness;
        bestGenome = fittest;
      }

      if (options.log && neat.generation % options.log === 0) {
        console.log('iteration', neat.generation, 'fitness', fitness, 'error', -error);
      }

      if (options.schedule && neat.generation % options.schedule.iterations === 0) {
        options.schedule.function({ fitness: fitness, error: -error, iteration: neat.generation });
      }
    }

    if (threads > 1) {
      for (var i = 0; i < workers.length; i++) workers[i].terminate();
    }

    if (typeof bestGenome !== 'undefined') {
      this.nodes = bestGenome.nodes;
      this.connections = bestGenome.connections;
      this.selfconns = bestGenome.selfconns;
      this.gates = bestGenome.gates;

      if (options.clear) this.clear();
    }

    return {
      error: -error,
      iterations: neat.generation,
      time: Date.now() - start
    };
  },

  /**
   * Creates a standalone function of the network which can be run without the
   * need of a library
   */
  standalone: function () {
    var present = [];
    var activations = [];
    var states = [];
    var lines = [];
    var functions = [];

    var i;
    for (i = 0; i < this.input; i++) {
      var node = this.nodes[i];
      activations.push(node.activation);
      states.push(node.state);
    }

    lines.push('for(var i = 0; i < input.length; i++) A[i] = input[i];');

    // So we don't have to use expensive .indexOf()
    for (i = 0; i < this.nodes.length; i++) {
      this.nodes[i].index = i;
    }

    for (i = this.input; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      activations.push(node.activation);
      states.push(node.state);

      var functionIndex = present.indexOf(node.squash.name);

      if (functionIndex === -1) {
        functionIndex = present.length;
        present.push(node.squash.name);
        functions.push(node.squash.toString());
      }

      var incoming = [];
      for (var j = 0; j < node.connections.in.length; j++) {
        var conn = node.connections.in[j];
        var computation = `A[${conn.from.index}] * ${conn.weight}`;

        if (conn.gater != null) {
          computation += ` * A[${conn.gater.index}]`;
        }

        incoming.push(computation);
      }

      if (node.connections.self.weight) {
        let conn = node.connections.self;
        let computation = `S[${i}] * ${conn.weight}`;

        if (conn.gater != null) {
          computation += ` * A[${conn.gater.index}]`;
        }

        incoming.push(computation);
      }

      var line1 = `S[${i}] = ${incoming.join(' + ')} + ${node.bias};`;
      var line2 = `A[${i}] = F[${functionIndex}](S[${i}])${!node.mask ? ' * ' + node.mask : ''};`;
      lines.push(line1);
      lines.push(line2);
    }

    var output = [];
    for (i = this.nodes.length - this.output; i < this.nodes.length; i++) {
      output.push(`A[${i}]`);
    }

    output = `return [${output.join(',')}];`;
    lines.push(output);

    var total = '';
    total += `var F = [${functions.toString()}];\r\n`;
    total += `var A = [${activations.toString()}];\r\n`;
    total += `var S = [${states.toString()}];\r\n`;
    total += `function activate(input){\r\n${lines.join('\r\n')}\r\n}`;

    return total;
  },

  /**
   * Serialize to send to workers efficiently
   */
  serialize: function () {
    var activations = [];
    var states = [];
    var conns = [];
    var squashes = [
      'LOGISTIC', 'TANH', 'IDENTITY', 'STEP', 'RELU', 'SOFTSIGN', 'SINUSOID',
      'GAUSSIAN', 'BENT_IDENTITY', 'BIPOLAR', 'BIPOLAR_SIGMOID', 'HARD_TANH',
      'ABSOLUTE', 'INVERSE', 'SELU'
    ];

    conns.push(this.input);
    conns.push(this.output);

    var i;
    for (i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      node.index = i;
      activations.push(node.activation);
      states.push(node.state);
    }

    for (i = this.input; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      conns.push(node.index);
      conns.push(node.bias);
      conns.push(squashes.indexOf(node.squash.name));

      conns.push(node.connections.self.weight);
      conns.push(node.connections.self.gater == null ? -1 : node.connections.self.gater.index);

      for (var j = 0; j < node.connections.in.length; j++) {
        let conn = node.connections.in[j];

        conns.push(conn.from.index);
        conns.push(conn.weight);
        conns.push(conn.gater == null ? -1 : conn.gater.index);
      }

      conns.push(-2); // stop token -> next node
    }

    return [activations, states, conns];
  }
};

/**
 * Convert a json object to a network
 */
Network.fromJSON = function (json) {
  var network = new Network(json.input, json.output);
  network.dropout = json.dropout;
  network.nodes = [];
  network.connections = [];

  var i;
  for (i = 0; i < json.nodes.length; i++) {
    network.nodes.push(Node.fromJSON(json.nodes[i]));
  }

  for (i = 0; i < json.connections.length; i++) {
    var conn = json.connections[i];

    var connection = network.connect(network.nodes[conn.from], network.nodes[conn.to])[0];
    connection.weight = conn.weight;

    if (conn.gater != null) {
      network.gate(network.nodes[conn.gater], connection);
    }
  }

  return network;
};

/**
 * Merge two networks into one
 */
Network.merge = function (network1, network2) {
  // Create a copy of the networks
  network1 = Network.fromJSON(network1.toJSON());
  network2 = Network.fromJSON(network2.toJSON());

  // Check if output and input size are the same
  if (network1.output !== network2.input) {
    throw new Error('Output size of network1 should be the same as the input size of network2!');
  }

  // Redirect all connections from network2 input from network1 output
  var i;
  for (i = 0; i < network2.connections.length; i++) {
    let conn = network2.connections[i];
    if (conn.from.type === 'input') {
      let index = network2.nodes.indexOf(conn.from);

      // redirect
      conn.from = network1.nodes[network1.nodes.length - 1 - index];
    }
  }

  // Delete input nodes of network2
  for (i = network2.input - 1; i >= 0; i--) {
    network2.nodes.splice(i, 1);
  }

  // Change the node type of network1's output nodes (now hidden)
  for (i = network1.nodes.length - network1.output; i < network1.nodes.length; i++) {
    network1.nodes[i].type = 'hidden';
  }

  // Create one network from both networks
  network1.connections = network1.connections.concat(network2.connections);
  network1.nodes = network1.nodes.concat(network2.nodes);

  return network1;
};

/**
 * Create an offspring from two parent networks
 */
Network.crossOver = function (network1, network2, equal) {
  if (network1.input !== network2.input || network1.output !== network2.output) {
    throw new Error("Networks don't have the same input/output size!");
  }

  // Initialise offspring
  var offspring = new Network(network1.input, network1.output);
  offspring.connections = [];
  offspring.nodes = [];

  // Save scores and create a copy
  var score1 = network1.score || 0;
  var score2 = network2.score || 0;

  // Determine offspring node size
  var size;
  if (equal || score1 === score2) {
    let max = Math.max(network1.nodes.length, network2.nodes.length);
    let min = Math.min(network1.nodes.length, network2.nodes.length);
    size = Math.floor(Math.random() * (max - min + 1) + min);
  } else if (score1 > score2) {
    size = network1.nodes.length;
  } else {
    size = network2.nodes.length;
  }

  // Rename some variables for easier reading
  var outputSize = network1.output;

  // Set indexes so we don't need indexOf
  var i;
  for (i = 0; i < network1.nodes.length; i++) {
    network1.nodes[i].index = i;
  }

  for (i = 0; i < network2.nodes.length; i++) {
    network2.nodes[i].index = i;
  }

  // Assign nodes from parents to offspring
  for (i = 0; i < size; i++) {
    // Determine if an output node is needed
    var node;
    if (i < size - outputSize) {
      let random = Math.random();
      node = random >= 0.5 ? network1.nodes[i] : network2.nodes[i];
      let other = random < 0.5 ? network1.nodes[i] : network2.nodes[i];

      if (typeof node === 'undefined' || node.type === 'output') {
        node = other;
      }
    } else {
      if (Math.random() >= 0.5) {
        node = network1.nodes[network1.nodes.length + i - size];
      } else {
        node = network2.nodes[network2.nodes.length + i - size];
      }
    }

    var newNode = new Node();
    newNode.bias = node.bias;
    newNode.squash = node.squash;
    newNode.type = node.type;

    offspring.nodes.push(newNode);
  }

  // Create arrays of connection genes
  var n1conns = {};
  var n2conns = {};

  // Normal connections
  for (i = 0; i < network1.connections.length; i++) {
    let conn = network1.connections[i];
    let data = {
      weight: conn.weight,
      from: conn.from.index,
      to: conn.to.index,
      gater: conn.gater != null ? conn.gater.index : -1
    };
    n1conns[Connection.innovationID(data.from, data.to)] = data;
  }

  // Selfconnections
  for (i = 0; i < network1.selfconns.length; i++) {
    let conn = network1.selfconns[i];
    let data = {
      weight: conn.weight,
      from: conn.from.index,
      to: conn.to.index,
      gater: conn.gater != null ? conn.gater.index : -1
    };
    n1conns[Connection.innovationID(data.from, data.to)] = data;
  }

  // Normal connections
  for (i = 0; i < network2.connections.length; i++) {
    let conn = network2.connections[i];
    let data = {
      weight: conn.weight,
      from: conn.from.index,
      to: conn.to.index,
      gater: conn.gater != null ? conn.gater.index : -1
    };
    n2conns[Connection.innovationID(data.from, data.to)] = data;
  }

  // Selfconnections
  for (i = 0; i < network2.selfconns.length; i++) {
    let conn = network2.selfconns[i];
    let data = {
      weight: conn.weight,
      from: conn.from.index,
      to: conn.to.index,
      gater: conn.gater != null ? conn.gater.index : -1
    };
    n2conns[Connection.innovationID(data.from, data.to)] = data;
  }

  // Split common conn genes from disjoint or excess conn genes
  var connections = [];
  var keys1 = Object.keys(n1conns);
  var keys2 = Object.keys(n2conns);
  for (i = keys1.length - 1; i >= 0; i--) {
    // Common gene
    if (typeof n2conns[keys1[i]] !== 'undefined') {
      let conn = Math.random() >= 0.5 ? n1conns[keys1[i]] : n2conns[keys1[i]];
      connections.push(conn);

      // Because deleting is expensive, just set it to some value
      n2conns[keys1[i]] = undefined;
    } else if (score1 >= score2 || equal) {
      connections.push(n1conns[keys1[i]]);
    }
  }

  // Excess/disjoint gene
  if (score2 >= score1 || equal) {
    for (i = 0; i < keys2.length; i++) {
      if (typeof n2conns[keys2[i]] !== 'undefined') {
        connections.push(n2conns[keys2[i]]);
      }
    }
  }

  // Add common conn genes uniformly
  for (i = 0; i < connections.length; i++) {
    let connData = connections[i];
    if (connData.to < size && connData.from < size) {
      let from = offspring.nodes[connData.from];
      let to = offspring.nodes[connData.to];
      let conn = offspring.connect(from, to)[0];

      conn.weight = connData.weight;

      if (connData.gater !== -1 && connData.gater < size) {
        offspring.gate(offspring.nodes[connData.gater], conn);
      }
    }
  }

  return offspring;
};


/***/ }),

/***/ "./node_modules/neataptic/src/architecture/node.js":
/*!*********************************************************!*\
  !*** ./node_modules/neataptic/src/architecture/node.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Export */
module.exports = Node;

/* Import */
var methods = __webpack_require__(/*! ../methods/methods */ "./node_modules/neataptic/src/methods/methods.js");
var Connection = __webpack_require__(/*! ./connection */ "./node_modules/neataptic/src/architecture/connection.js");
var config = __webpack_require__(/*! ../config */ "./node_modules/neataptic/src/config.js");

/*******************************************************************************
                                         NODE
*******************************************************************************/

function Node (type) {
  this.bias = (type === 'input') ? 0 : Math.random() * 0.2 - 0.1;
  this.squash = methods.activation.LOGISTIC;
  this.type = type || 'hidden';

  this.activation = 0;
  this.state = 0;
  this.old = 0;

  // For dropout
  this.mask = 1;

  // For tracking momentum
  this.previousDeltaBias = 0;

  // Batch training
  this.totalDeltaBias = 0;

  this.connections = {
    in: [],
    out: [],
    gated: [],
    self: new Connection(this, this, 0)
  };

  // Data for backpropagation
  this.error = {
    responsibility: 0,
    projected: 0,
    gated: 0
  };
}

Node.prototype = {
  /**
   * Activates the node
   */
  activate: function (input) {
    // Check if an input is given
    if (typeof input !== 'undefined') {
      this.activation = input;
      return this.activation;
    }

    this.old = this.state;

    // All activation sources coming from the node itself
    this.state = this.connections.self.gain * this.connections.self.weight * this.state + this.bias;

    // Activation sources coming from connections
    var i;
    for (i = 0; i < this.connections.in.length; i++) {
      var connection = this.connections.in[i];
      this.state += connection.from.activation * connection.weight * connection.gain;
    }

    // Squash the values received
    this.activation = this.squash(this.state) * this.mask;
    this.derivative = this.squash(this.state, true);

    // Update traces
    var nodes = [];
    var influences = [];

    for (i = 0; i < this.connections.gated.length; i++) {
      let conn = this.connections.gated[i];
      let node = conn.to;

      let index = nodes.indexOf(node);
      if (index > -1) {
        influences[index] += conn.weight * conn.from.activation;
      } else {
        nodes.push(node);
        influences.push(conn.weight * conn.from.activation +
          (node.connections.self.gater === this ? node.old : 0));
      }

      // Adjust the gain to this nodes' activation
      conn.gain = this.activation;
    }

    for (i = 0; i < this.connections.in.length; i++) {
      let connection = this.connections.in[i];

      // Elegibility trace
      connection.elegibility = this.connections.self.gain * this.connections.self.weight *
        connection.elegibility + connection.from.activation * connection.gain;

      // Extended trace
      for (var j = 0; j < nodes.length; j++) {
        let node = nodes[j];
        let influence = influences[j];

        let index = connection.xtrace.nodes.indexOf(node);

        if (index > -1) {
          connection.xtrace.values[index] = node.connections.self.gain * node.connections.self.weight *
            connection.xtrace.values[index] + this.derivative * connection.elegibility * influence;
        } else {
          // Does not exist there yet, might be through mutation
          connection.xtrace.nodes.push(node);
          connection.xtrace.values.push(this.derivative * connection.elegibility * influence);
        }
      }
    }

    return this.activation;
  },

  /**
   * Activates the node without calculating elegibility traces and such
   */
  noTraceActivate: function (input) {
    // Check if an input is given
    if (typeof input !== 'undefined') {
      this.activation = input;
      return this.activation;
    }

    // All activation sources coming from the node itself
    this.state = this.connections.self.gain * this.connections.self.weight * this.state + this.bias;

    // Activation sources coming from connections
    var i;
    for (i = 0; i < this.connections.in.length; i++) {
      var connection = this.connections.in[i];
      this.state += connection.from.activation * connection.weight * connection.gain;
    }

    // Squash the values received
    this.activation = this.squash(this.state);

    for (i = 0; i < this.connections.gated.length; i++) {
      this.connections.gated[i].gain = this.activation;
    }

    return this.activation;
  },

  /**
   * Back-propagate the error, aka learn
   */
  propagate: function (rate, momentum, update, target) {
    momentum = momentum || 0;
    rate = rate || 0.3;

    // Error accumulator
    var error = 0;

    // Output nodes get their error from the enviroment
    if (this.type === 'output') {
      this.error.responsibility = this.error.projected = target - this.activation;
    } else { // the rest of the nodes compute their error responsibilities by backpropagation
      // error responsibilities from all the connections projected from this node
      var i;
      for (i = 0; i < this.connections.out.length; i++) {
        let connection = this.connections.out[i];
        let node = connection.to;
        // Eq. 21
        error += node.error.responsibility * connection.weight * connection.gain;
      }

      // Projected error responsibility
      this.error.projected = this.derivative * error;

      // Error responsibilities from all connections gated by this neuron
      error = 0;

      for (i = 0; i < this.connections.gated.length; i++) {
        let conn = this.connections.gated[i];
        let node = conn.to;
        let influence = node.connections.self.gater === this ? node.old : 0;

        influence += conn.weight * conn.from.activation;
        error += node.error.responsibility * influence;
      }

      // Gated error responsibility
      this.error.gated = this.derivative * error;

      // Error responsibility
      this.error.responsibility = this.error.projected + this.error.gated;
    }

    if (this.type === 'constant') return;

    // Adjust all the node's incoming connections
    for (i = 0; i < this.connections.in.length; i++) {
      let connection = this.connections.in[i];

      let gradient = this.error.projected * connection.elegibility;

      for (var j = 0; j < connection.xtrace.nodes.length; j++) {
        let node = connection.xtrace.nodes[j];
        let value = connection.xtrace.values[j];
        gradient += node.error.responsibility * value;
      }

      // Adjust weight
      let deltaWeight = rate * gradient * this.mask;
      connection.totalDeltaWeight += deltaWeight;
      if (update) {
        connection.totalDeltaWeight += momentum * connection.previousDeltaWeight;
        connection.weight += connection.totalDeltaWeight;
        connection.previousDeltaWeight = connection.totalDeltaWeight;
        connection.totalDeltaWeight = 0;
      }
    }

    // Adjust bias
    var deltaBias = rate * this.error.responsibility;
    this.totalDeltaBias += deltaBias;
    if (update) {
      this.totalDeltaBias += momentum * this.previousDeltaBias;
      this.bias += this.totalDeltaBias;
      this.previousDeltaBias = this.totalDeltaBias;
      this.totalDeltaBias = 0;
    }
  },

  /**
   * Creates a connection from this node to the given node
   */
  connect: function (target, weight) {
    var connections = [];
    if (typeof target.bias !== 'undefined') { // must be a node!
      if (target === this) {
        // Turn on the self connection by setting the weight
        if (this.connections.self.weight !== 0) {
          if (config.warnings) console.warn('This connection already exists!');
        } else {
          this.connections.self.weight = weight || 1;
        }
        connections.push(this.connections.self);
      } else if (this.isProjectingTo(target)) {
        throw new Error('Already projecting a connection to this node!');
      } else {
        let connection = new Connection(this, target, weight);
        target.connections.in.push(connection);
        this.connections.out.push(connection);

        connections.push(connection);
      }
    } else { // should be a group
      for (var i = 0; i < target.nodes.length; i++) {
        let connection = new Connection(this, target.nodes[i], weight);
        target.nodes[i].connections.in.push(connection);
        this.connections.out.push(connection);
        target.connections.in.push(connection);

        connections.push(connection);
      }
    }
    return connections;
  },

  /**
   * Disconnects this node from the other node
   */
  disconnect: function (node, twosided) {
    if (this === node) {
      this.connections.self.weight = 0;
      return;
    }

    for (var i = 0; i < this.connections.out.length; i++) {
      let conn = this.connections.out[i];
      if (conn.to === node) {
        this.connections.out.splice(i, 1);
        let j = conn.to.connections.in.indexOf(conn);
        conn.to.connections.in.splice(j, 1);
        if (conn.gater !== null) conn.gater.ungate(conn);
        break;
      }
    }

    if (twosided) {
      node.disconnect(this);
    }
  },

  /**
   * Make this node gate a connection
   */
  gate: function (connections) {
    if (!Array.isArray(connections)) {
      connections = [connections];
    }

    for (var i = 0; i < connections.length; i++) {
      var connection = connections[i];

      this.connections.gated.push(connection);
      connection.gater = this;
    }
  },

  /**
   * Removes the gates from this node from the given connection(s)
   */
  ungate: function (connections) {
    if (!Array.isArray(connections)) {
      connections = [connections];
    }

    for (var i = connections.length - 1; i >= 0; i--) {
      var connection = connections[i];

      var index = this.connections.gated.indexOf(connection);
      this.connections.gated.splice(index, 1);
      connection.gater = null;
      connection.gain = 1;
    }
  },

  /**
   * Clear the context of the node
   */
  clear: function () {
    for (var i = 0; i < this.connections.in.length; i++) {
      var connection = this.connections.in[i];

      connection.elegibility = 0;
      connection.xtrace = {
        nodes: [],
        values: []
      };
    }

    for (i = 0; i < this.connections.gated.length; i++) {
      let conn = this.connections.gated[i];
      conn.gain = 0;
    }

    this.error.responsibility = this.error.projected = this.error.gated = 0;
    this.old = this.state = this.activation = 0;
  },

  /**
   * Mutates the node with the given method
   */
  mutate: function (method) {
    if (typeof method === 'undefined') {
      throw new Error('No mutate method given!');
    } else if (!(method.name in methods.mutation)) {
      throw new Error('This method does not exist!');
    }

    switch (method) {
      case methods.mutation.MOD_ACTIVATION:
        // Can't be the same squash
        var squash = method.allowed[(method.allowed.indexOf(this.squash) + Math.floor(Math.random() * (method.allowed.length - 1)) + 1) % method.allowed.length];
        this.squash = squash;
        break;
      case methods.mutation.MOD_BIAS:
        var modification = Math.random() * (method.max - method.min) + method.min;
        this.bias += modification;
        break;
    }
  },

  /**
   * Checks if this node is projecting to the given node
   */
  isProjectingTo: function (node) {
    if (node === this && this.connections.self.weight !== 0) return true;

    for (var i = 0; i < this.connections.out.length; i++) {
      var conn = this.connections.out[i];
      if (conn.to === node) {
        return true;
      }
    }
    return false;
  },

  /**
   * Checks if the given node is projecting to this node
   */
  isProjectedBy: function (node) {
    if (node === this && this.connections.self.weight !== 0) return true;

    for (var i = 0; i < this.connections.in.length; i++) {
      var conn = this.connections.in[i];
      if (conn.from === node) {
        return true;
      }
    }

    return false;
  },

  /**
   * Converts the node to a json object
   */
  toJSON: function () {
    var json = {
      bias: this.bias,
      type: this.type,
      squash: this.squash.name,
      mask: this.mask
    };

    return json;
  }
};

/**
 * Convert a json object to a node
 */
Node.fromJSON = function (json) {
  var node = new Node();
  node.bias = json.bias;
  node.type = json.type;
  node.mask = json.mask;
  node.squash = methods.activation[json.squash];

  return node;
};


/***/ }),

/***/ "./node_modules/neataptic/src/config.js":
/*!**********************************************!*\
  !*** ./node_modules/neataptic/src/config.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                      CONFIG
*******************************************************************************/

// Config
var config = {
  warnings: false
};

/* Export */
module.exports = config;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/activation.js":
/*!**********************************************************!*\
  !*** ./node_modules/neataptic/src/methods/activation.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                  ACTIVATION FUNCTIONS
*******************************************************************************/

// https://en.wikipedia.org/wiki/Activation_function
// https://stats.stackexchange.com/questions/115258/comprehensive-list-of-activation-functions-in-neural-networks-with-pros-cons
var activation = {
  LOGISTIC: function (x, derivate) {
    var fx = 1 / (1 + Math.exp(-x));
    if (!derivate) return fx;
    return fx * (1 - fx);
  },
  TANH: function (x, derivate) {
    if (derivate) return 1 - Math.pow(Math.tanh(x), 2);
    return Math.tanh(x);
  },
  IDENTITY: function (x, derivate) {
    return derivate ? 1 : x;
  },
  STEP: function (x, derivate) {
    return derivate ? 0 : x > 0 ? 1 : 0;
  },
  RELU: function (x, derivate) {
    if (derivate) return x > 0 ? 1 : 0;
    return x > 0 ? x : 0;
  },
  SOFTSIGN: function (x, derivate) {
    var d = 1 + Math.abs(x);
    if (derivate) return x / Math.pow(d, 2);
    return x / d;
  },
  SINUSOID: function (x, derivate) {
    if (derivate) return Math.cos(x);
    return Math.sin(x);
  },
  GAUSSIAN: function (x, derivate) {
    var d = Math.exp(-Math.pow(x, 2));
    if (derivate) return -2 * x * d;
    return d;
  },
  BENT_IDENTITY: function (x, derivate) {
    var d = Math.sqrt(Math.pow(x, 2) + 1);
    if (derivate) return x / (2 * d) + 1;
    return (d - 1) / 2 + x;
  },
  BIPOLAR: function (x, derivate) {
    return derivate ? 0 : x > 0 ? 1 : -1;
  },
  BIPOLAR_SIGMOID: function (x, derivate) {
    var d = 2 / (1 + Math.exp(-x)) - 1;
    if (derivate) return 1 / 2 * (1 + d) * (1 - d);
    return d;
  },
  HARD_TANH: function (x, derivate) {
    if (derivate) return x > -1 && x < 1 ? 1 : 0;
    return Math.max(-1, Math.min(1, x));
  },
  ABSOLUTE: function (x, derivate) {
    if (derivate) return x < 0 ? -1 : 1;
    return Math.abs(x);
  },
  INVERSE: function (x, derivate) {
    if (derivate) return -1;
    return 1 - x;
  },
  // https://arxiv.org/pdf/1706.02515.pdf
  SELU: function (x, derivate) {
    var alpha = 1.6732632423543772848170429916717;
    var scale = 1.0507009873554804934193349852946;
    var fx = x > 0 ? x : alpha * Math.exp(x) - alpha;
    if (derivate) { return x > 0 ? scale : (fx + alpha) * scale; }
    return fx * scale;
  }
};

/* Export */
module.exports = activation;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/connection.js":
/*!**********************************************************!*\
  !*** ./node_modules/neataptic/src/methods/connection.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                    CONNECTION
*******************************************************************************/

// Specifies in what manner two groups are connected
var connection = {
  ALL_TO_ALL: {
    name: 'OUTPUT'
  },
  ALL_TO_ELSE: {
    name: 'INPUT'
  },
  ONE_TO_ONE: {
    name: 'SELF'
  }
};

/* Export */
module.exports = connection;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/cost.js":
/*!****************************************************!*\
  !*** ./node_modules/neataptic/src/methods/cost.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                    COST FUNCTIONS
*******************************************************************************/

// https://en.wikipedia.org/wiki/Loss_function
var cost = {
  // Cross entropy error
  CROSS_ENTROPY: function (target, output) {
    var error = 0;
    for (var i = 0; i < output.length; i++) {
      // Avoid negative and zero numbers, use 1e-15 http://bit.ly/2p5W29A
      error -= target[i] * Math.log(Math.max(output[i], 1e-15)) + (1 - target[i]) * Math.log(1 - Math.max(output[i], 1e-15));
    }
    return error / output.length;
  },
  // Mean Squared Error
  MSE: function (target, output) {
    var error = 0;
    for (var i = 0; i < output.length; i++) {
      error += Math.pow(target[i] - output[i], 2);
    }

    return error / output.length;
  },
  // Binary error
  BINARY: function (target, output) {
    var misses = 0;
    for (var i = 0; i < output.length; i++) {
      misses += Math.round(target[i] * 2) !== Math.round(output[i] * 2);
    }

    return misses;
  },
  // Mean Absolute Error
  MAE: function (target, output) {
    var error = 0;
    for (var i = 0; i < output.length; i++) {
      error += Math.abs(target[i] - output[i]);
    }

    return error / output.length;
  },
  // Mean Absolute Percentage Error
  MAPE: function (target, output) {
    var error = 0;
    for (var i = 0; i < output.length; i++) {
      error += Math.abs((output[i] - target[i]) / Math.max(target[i], 1e-15));
    }

    return error / output.length;
  },
  // Mean Squared Logarithmic Error
  MSLE: function (target, output) {
    var error = 0;
    for (var i = 0; i < output.length; i++) {
      error += Math.log(Math.max(target[i], 1e-15)) - Math.log(Math.max(output[i], 1e-15));
    }

    return error;
  },
  // Hinge loss, for classifiers
  HINGE: function (target, output) {
    var error = 0;
    for (var i = 0; i < output.length; i++) {
      error += Math.max(0, 1 - target[i] * output[i]);
    }

    return error;
  }
};

/* Export */
module.exports = cost;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/crossover.js":
/*!*********************************************************!*\
  !*** ./node_modules/neataptic/src/methods/crossover.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                      CROSSOVER
*******************************************************************************/

// https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
var crossover = {
  SINGLE_POINT: {
    name: 'SINGLE_POINT',
    config: [0.4]
  },
  TWO_POINT: {
    name: 'TWO_POINT',
    config: [0.4, 0.9]
  },
  UNIFORM: {
    name: 'UNIFORM'
  },
  AVERAGE: {
    name: 'AVERAGE'
  }
};

/* Export */
module.exports = crossover;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/gating.js":
/*!******************************************************!*\
  !*** ./node_modules/neataptic/src/methods/gating.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                    GATING
*******************************************************************************/

// Specifies how to gate a connection between two groups of multiple neurons
var gating = {
  OUTPUT: {
    name: 'OUTPUT'
  },
  INPUT: {
    name: 'INPUT'
  },
  SELF: {
    name: 'SELF'
  }
};

/* Export */
module.exports = gating;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/methods.js":
/*!*******************************************************!*\
  !*** ./node_modules/neataptic/src/methods/methods.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*******************************************************************************
                                  METHODS
*******************************************************************************/

var methods = {
  activation: __webpack_require__(/*! ./activation */ "./node_modules/neataptic/src/methods/activation.js"),
  mutation: __webpack_require__(/*! ./mutation */ "./node_modules/neataptic/src/methods/mutation.js"),
  selection: __webpack_require__(/*! ./selection */ "./node_modules/neataptic/src/methods/selection.js"),
  crossover: __webpack_require__(/*! ./crossover */ "./node_modules/neataptic/src/methods/crossover.js"),
  cost: __webpack_require__(/*! ./cost */ "./node_modules/neataptic/src/methods/cost.js"),
  gating: __webpack_require__(/*! ./gating */ "./node_modules/neataptic/src/methods/gating.js"),
  connection: __webpack_require__(/*! ./connection */ "./node_modules/neataptic/src/methods/connection.js"),
  rate: __webpack_require__(/*! ./rate */ "./node_modules/neataptic/src/methods/rate.js")
};

/** Export */
module.exports = methods;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/mutation.js":
/*!********************************************************!*\
  !*** ./node_modules/neataptic/src/methods/mutation.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Import */
var activation = __webpack_require__(/*! ./activation */ "./node_modules/neataptic/src/methods/activation.js");

/*******************************************************************************
                                      MUTATION
*******************************************************************************/

// https://en.wikipedia.org/wiki/mutation_(genetic_algorithm)
var mutation = {
  ADD_NODE: {
    name: 'ADD_NODE'
  },
  SUB_NODE: {
    name: 'SUB_NODE',
    keep_gates: true
  },
  ADD_CONN: {
    name: 'ADD_CONN'
  },
  SUB_CONN: {
    name: 'REMOVE_CONN'
  },
  MOD_WEIGHT: {
    name: 'MOD_WEIGHT',
    min: -1,
    max: 1
  },
  MOD_BIAS: {
    name: 'MOD_BIAS',
    min: -1,
    max: 1
  },
  MOD_ACTIVATION: {
    name: 'MOD_ACTIVATION',
    mutateOutput: true,
    allowed: [
      activation.LOGISTIC,
      activation.TANH,
      activation.RELU,
      activation.IDENTITY,
      activation.STEP,
      activation.SOFTSIGN,
      activation.SINUSOID,
      activation.GAUSSIAN,
      activation.BENT_IDENTITY,
      activation.BIPOLAR,
      activation.BIPOLAR_SIGMOID,
      activation.HARD_TANH,
      activation.ABSOLUTE,
      activation.INVERSE,
      activation.SELU
    ]
  },
  ADD_SELF_CONN: {
    name: 'ADD_SELF_CONN'
  },
  SUB_SELF_CONN: {
    name: 'SUB_SELF_CONN'
  },
  ADD_GATE: {
    name: 'ADD_GATE'
  },
  SUB_GATE: {
    name: 'SUB_GATE'
  },
  ADD_BACK_CONN: {
    name: 'ADD_BACK_CONN'
  },
  SUB_BACK_CONN: {
    name: 'SUB_BACK_CONN'
  },
  SWAP_NODES: {
    name: 'SWAP_NODES',
    mutateOutput: true
  }
};

mutation.ALL = [
  mutation.ADD_NODE,
  mutation.SUB_NODE,
  mutation.ADD_CONN,
  mutation.SUB_CONN,
  mutation.MOD_WEIGHT,
  mutation.MOD_BIAS,
  mutation.MOD_ACTIVATION,
  mutation.ADD_GATE,
  mutation.SUB_GATE,
  mutation.ADD_SELF_CONN,
  mutation.SUB_SELF_CONN,
  mutation.ADD_BACK_CONN,
  mutation.SUB_BACK_CONN,
  mutation.SWAP_NODES
];

mutation.FFW = [
  mutation.ADD_NODE,
  mutation.SUB_NODE,
  mutation.ADD_CONN,
  mutation.SUB_CONN,
  mutation.MOD_WEIGHT,
  mutation.MOD_BIAS,
  mutation.MOD_ACTIVATION,
  mutation.SWAP_NODES
];

/* Export */
module.exports = mutation;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/rate.js":
/*!****************************************************!*\
  !*** ./node_modules/neataptic/src/methods/rate.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                      RATE
*******************************************************************************/

// https://stackoverflow.com/questions/30033096/what-is-lr-policy-in-caffe/30045244
var rate = {
  FIXED: function () {
    var func = function (baseRate, iteration) { return baseRate; };
    return func;
  },
  STEP: function (gamma, stepSize) {
    gamma = gamma || 0.9;
    stepSize = stepSize || 100;

    var func = function (baseRate, iteration) {
      return baseRate * Math.pow(gamma, Math.floor(iteration / stepSize));
    };

    return func;
  },
  EXP: function (gamma) {
    gamma = gamma || 0.999;

    var func = function (baseRate, iteration) {
      return baseRate * Math.pow(gamma, iteration);
    };

    return func;
  },
  INV: function (gamma, power) {
    gamma = gamma || 0.001;
    power = power || 2;

    var func = function (baseRate, iteration) {
      return baseRate * Math.pow(1 + gamma * iteration, -power);
    };

    return func;
  }
};

/* Export */
module.exports = rate;


/***/ }),

/***/ "./node_modules/neataptic/src/methods/selection.js":
/*!*********************************************************!*\
  !*** ./node_modules/neataptic/src/methods/selection.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*******************************************************************************
                                      SELECTION
*******************************************************************************/

// https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)

var selection = {
  FITNESS_PROPORTIONATE: {
    name: 'FITNESS_PROPORTIONATE'
  },
  POWER: {
    name: 'POWER',
    power: 4
  },
  TOURNAMENT: {
    name: 'TOURNAMENT',
    size: 5,
    probability: 0.5
  }
};

/* Export */
module.exports = selection;


/***/ }),

/***/ "./node_modules/neataptic/src/multithreading/multi.js":
/*!************************************************************!*\
  !*** ./node_modules/neataptic/src/multithreading/multi.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*******************************************************************************
                                MULTITHREADING
*******************************************************************************/

var multi = {
  /** Workers */
  workers: __webpack_require__(/*! ./workers/workers */ "./node_modules/neataptic/src/multithreading/workers/workers.js"),

  /** Serializes a dataset */
  serializeDataSet: function (dataSet) {
    var serialized = [dataSet[0].input.length, dataSet[0].output.length];

    for (var i = 0; i < dataSet.length; i++) {
      var j;
      for (j = 0; j < serialized[0]; j++) {
        serialized.push(dataSet[i].input[j]);
      }
      for (j = 0; j < serialized[1]; j++) {
        serialized.push(dataSet[i].output[j]);
      }
    }

    return serialized;
  },

  /** Activate a serialized network */
  activateSerializedNetwork: function (input, A, S, data, F) {
    for (var i = 0; i < data[0]; i++) A[i] = input[i];
    for (i = 2; i < data.length; i++) {
      let index = data[i++];
      let bias = data[i++];
      let squash = data[i++];
      let selfweight = data[i++];
      let selfgater = data[i++];

      S[index] = (selfgater === -1 ? 1 : A[selfgater]) * selfweight * S[index] + bias;

      while (data[i] !== -2) {
        S[index] += A[data[i++]] * data[i++] * (data[i++] === -1 ? 1 : A[data[i - 1]]);
      }
      A[index] = F[squash](S[index]);
    }

    var output = [];
    for (i = A.length - data[1]; i < A.length; i++) output.push(A[i]);
    return output;
  },

  /** Deserializes a dataset to an array of arrays */
  deserializeDataSet: function (serializedSet) {
    var set = [];

    var sampleSize = serializedSet[0] + serializedSet[1];
    for (var i = 0; i < (serializedSet.length - 2) / sampleSize; i++) {
      let input = [];
      for (var j = 2 + i * sampleSize; j < 2 + i * sampleSize + serializedSet[0]; j++) {
        input.push(serializedSet[j]);
      }
      let output = [];
      for (j = 2 + i * sampleSize + serializedSet[0]; j < 2 + i * sampleSize + sampleSize; j++) {
        output.push(serializedSet[j]);
      }
      set.push(input);
      set.push(output);
    }

    return set;
  },

  /** A list of compiled activation functions in a certain order */
  activations: [
    function (x) { return 1 / (1 + Math.exp(-x)); },
    function (x) { return Math.tanh(x); },
    function (x) { return x; },
    function (x) { return x > 0 ? 1 : 0; },
    function (x) { return x > 0 ? x : 0; },
    function (x) { return x / (1 + Math.abs(x)); },
    function (x) { return Math.sin(x); },
    function (x) { return Math.exp(-Math.pow(x, 2)); },
    function (x) { return (Math.sqrt(Math.pow(x, 2) + 1) - 1) / 2 + x; },
    function (x) { return x > 0 ? 1 : -1; },
    function (x) { return 2 / (1 + Math.exp(-x)) - 1; },
    function (x) { return Math.max(-1, Math.min(1, x)); },
    function (x) { return Math.abs(x); },
    function (x) { return 1 - x; },
    function (x) {
      var a = 1.6732632423543772848170429916717;
      return (x > 0 ? x : a * Math.exp(x) - a) * 1.0507009873554804934193349852946;
    }
  ]
};

multi.testSerializedSet = function (set, cost, A, S, data, F) {
  // Calculate how much samples are in the set
  var error = 0;
  for (var i = 0; i < set.length; i += 2) {
    let output = multi.activateSerializedNetwork(set[i], A, S, data, F);
    error += cost(set[i + 1], output);
  }

  return error / (set.length / 2);
};

/* Export */
for (var i in multi) {
  module.exports[i] = multi[i];
}


/***/ }),

/***/ "./node_modules/neataptic/src/multithreading/workers/browser/testworker.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/neataptic/src/multithreading/workers/browser/testworker.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Export */
module.exports = TestWorker;

/* Import */
var multi = __webpack_require__(/*! ../../multi */ "./node_modules/neataptic/src/multithreading/multi.js");

/*******************************************************************************
                                WEBWORKER
*******************************************************************************/

function TestWorker (dataSet, cost) {
  var blob = new Blob([this._createBlobString(cost)]);
  this.url = window.URL.createObjectURL(blob);
  this.worker = new Worker(this.url);

  var data = { set: new Float64Array(dataSet).buffer };
  this.worker.postMessage(data, [data.set]);
}

TestWorker.prototype = {
  evaluate: function (network) {
    return new Promise((resolve, reject) => {
      var serialized = network.serialize();

      var data = {
        activations: new Float64Array(serialized[0]).buffer,
        states: new Float64Array(serialized[1]).buffer,
        conns: new Float64Array(serialized[2]).buffer
      };

      this.worker.onmessage = function (e) {
        var error = new Float64Array(e.data.buffer)[0];
        resolve(error);
      };

      this.worker.postMessage(data, [data.activations, data.states, data.conns]);
    });
  },

  terminate: function () {
    this.worker.terminate();
    window.URL.revokeObjectURL(this.url);
  },

  _createBlobString: function (cost) {
    var source = `
      var F = [${multi.activations.toString()}];
      var cost = ${cost.toString()};
      var multi = {
        deserializeDataSet: ${multi.deserializeDataSet.toString()},
        testSerializedSet: ${multi.testSerializedSet.toString()},
        activateSerializedNetwork: ${multi.activateSerializedNetwork.toString()}
      };

      this.onmessage = function (e) {
        if(typeof e.data.set === 'undefined'){
          var A = new Float64Array(e.data.activations);
          var S = new Float64Array(e.data.states);
          var data = new Float64Array(e.data.conns);

          var error = multi.testSerializedSet(set, cost, A, S, data, F);

          var answer = { buffer: new Float64Array([error ]).buffer };
          postMessage(answer, [answer.buffer]);
        } else {
          set = multi.deserializeDataSet(new Float64Array(e.data.set));
        }
      };`;

    return source;
  }
};


/***/ }),

/***/ "./node_modules/neataptic/src/multithreading/workers/node/testworker.js":
/*!******************************************************************************!*\
  !*** ./node_modules/neataptic/src/multithreading/workers/node/testworker.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {/* Export */
module.exports = TestWorker;

/* Import */
var cp = __webpack_require__(/*! child_process */ "./node_modules/node-libs-browser/mock/empty.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");

/*******************************************************************************
                                WEBWORKER
*******************************************************************************/

function TestWorker (dataSet, cost) {
  this.worker = cp.fork(path.join(__dirname, '/worker'));

  this.worker.send({ set: dataSet, cost: cost.name });
}

TestWorker.prototype = {
  evaluate: function (network) {
    return new Promise((resolve, reject) => {
      var serialized = network.serialize();

      var data = {
        activations: serialized[0],
        states: serialized[1],
        conns: serialized[2]
      };

      var _that = this.worker;
      this.worker.on('message', function callback (e) {
        _that.removeListener('message', callback);
        resolve(e);
      });

      this.worker.send(data);
    });
  },

  terminate: function () {
    this.worker.kill();
  }
};

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./node_modules/neataptic/src/multithreading/workers/workers.js":
/*!**********************************************************************!*\
  !*** ./node_modules/neataptic/src/multithreading/workers/workers.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*******************************************************************************
                                  WORKERS
*******************************************************************************/

var workers = {
  node: {
    TestWorker: __webpack_require__(/*! ./node/testworker */ "./node_modules/neataptic/src/multithreading/workers/node/testworker.js")
  },
  browser: {
    TestWorker: __webpack_require__(/*! ./browser/testworker */ "./node_modules/neataptic/src/multithreading/workers/browser/testworker.js")
  }
};

/** Export */
module.exports = workers;


/***/ }),

/***/ "./node_modules/neataptic/src/neat.js":
/*!********************************************!*\
  !*** ./node_modules/neataptic/src/neat.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Export */
module.exports = Neat;

/* Import */
var Network = __webpack_require__(/*! ./architecture/network */ "./node_modules/neataptic/src/architecture/network.js");
var methods = __webpack_require__(/*! ./methods/methods */ "./node_modules/neataptic/src/methods/methods.js");
var config = __webpack_require__(/*! ./config */ "./node_modules/neataptic/src/config.js");

/* Easier variable naming */
var selection = methods.selection;

/*******************************************************************************
                                         NEAT
*******************************************************************************/

function Neat (input, output, fitness, options) {
  this.input = input; // The input size of the networks
  this.output = output; // The output size of the networks
  this.fitness = fitness; // The fitness function to evaluate the networks

  // Configure options
  options = options || {};
  this.equal = options.equal || false;
  this.clear = options.clear || false;
  this.popsize = options.popsize || 50;
  this.elitism = options.elitism || 0;
  this.provenance = options.provenance || 0;
  this.mutationRate = options.mutationRate || 0.3;
  this.mutationAmount = options.mutationAmount || 1;

  this.fitnessPopulation = options.fitnessPopulation || false;

  this.selection = options.selection || methods.selection.POWER;
  this.crossover = options.crossover || [
    methods.crossover.SINGLE_POINT,
    methods.crossover.TWO_POINT,
    methods.crossover.UNIFORM,
    methods.crossover.AVERAGE
  ];
  this.mutation = options.mutation || methods.mutation.FFW;

  this.template = options.network || false;

  this.maxNodes = options.maxNodes || Infinity;
  this.maxConns = options.maxConns || Infinity;
  this.maxGates = options.maxGates || Infinity;

  // Custom mutation selection function if given
  this.selectMutationMethod = typeof options.mutationSelection === 'function' ? options.mutationSelection.bind(this) : this.selectMutationMethod;

  // Generation counter
  this.generation = 0;

  // Initialise the genomes
  this.createPool(this.template);
}

Neat.prototype = {
  /**
   * Create the initial pool of genomes
   */
  createPool: function (network) {
    this.population = [];

    for (var i = 0; i < this.popsize; i++) {
      var copy;
      if (this.template) {
        copy = Network.fromJSON(network.toJSON());
      } else {
        copy = new Network(this.input, this.output);
      }
      copy.score = undefined;
      this.population.push(copy);
    }
  },

  /**
   * Evaluates, selects, breeds and mutates population
   */
  evolve: async function () {
    // Check if evaluated, sort the population
    if (typeof this.population[this.population.length - 1].score === 'undefined') {
      await this.evaluate();
    }
    this.sort();

    var fittest = Network.fromJSON(this.population[0].toJSON());
    fittest.score = this.population[0].score;

    var newPopulation = [];

    // Elitism
    var elitists = [];
    for (var i = 0; i < this.elitism; i++) {
      elitists.push(this.population[i]);
    }

    // Provenance
    for (i = 0; i < this.provenance; i++) {
      newPopulation.push(Network.fromJSON(this.template.toJSON()));
    }

    // Breed the next individuals
    for (i = 0; i < this.popsize - this.elitism - this.provenance; i++) {
      newPopulation.push(this.getOffspring());
    }

    // Replace the old population with the new population
    this.population = newPopulation;
    this.mutate();

    this.population.push(...elitists);

    // Reset the scores
    for (i = 0; i < this.population.length; i++) {
      this.population[i].score = undefined;
    }

    this.generation++;

    return fittest;
  },

  /**
   * Breeds two parents into an offspring, population MUST be surted
   */
  getOffspring: function () {
    var parent1 = this.getParent();
    var parent2 = this.getParent();

    return Network.crossOver(parent1, parent2, this.equal);
  },

  /**
   * Selects a random mutation method for a genome according to the parameters
   */
  selectMutationMethod: function (genome) {
    var mutationMethod = this.mutation[Math.floor(Math.random() * this.mutation.length)];

    if (mutationMethod === methods.mutation.ADD_NODE && genome.nodes.length >= this.maxNodes) {
      if (config.warnings) console.warn('maxNodes exceeded!');
      return;
    }

    if (mutationMethod === methods.mutation.ADD_CONN && genome.connections.length >= this.maxConns) {
      if (config.warnings) console.warn('maxConns exceeded!');
      return;
    }

    if (mutationMethod === methods.mutation.ADD_GATE && genome.gates.length >= this.maxGates) {
      if (config.warnings) console.warn('maxGates exceeded!');
      return;
    }

    return mutationMethod;
  },

  /**
   * Mutates the given (or current) population
   */
  mutate: function () {
    // Elitist genomes should not be included
    for (var i = 0; i < this.population.length; i++) {
      if (Math.random() <= this.mutationRate) {
        for (var j = 0; j < this.mutationAmount; j++) {
          var mutationMethod = this.selectMutationMethod(this.population[i]);
          this.population[i].mutate(mutationMethod);
        }
      }
    }
  },

  /**
   * Evaluates the current population
   */
  evaluate: async function () {
    var i;
    if (this.fitnessPopulation) {
      if (this.clear) {
        for (i = 0; i < this.population.length; i++) {
          this.population[i].clear();
        }
      }
      await this.fitness(this.population);
    } else {
      for (i = 0; i < this.population.length; i++) {
        var genome = this.population[i];
        if (this.clear) genome.clear();
        genome.score = await this.fitness(genome);
      }
    }
  },

  /**
   * Sorts the population by score
   */
  sort: function () {
    this.population.sort(function (a, b) {
      return b.score - a.score;
    });
  },

  /**
   * Returns the fittest genome of the current population
   */
  getFittest: function () {
    // Check if evaluated
    if (typeof this.population[this.population.length - 1].score === 'undefined') {
      this.evaluate();
    }
    if (this.population[0].score < this.population[1].score) {
      this.sort();
    }

    return this.population[0];
  },

  /**
   * Returns the average fitness of the current population
   */
  getAverage: function () {
    if (typeof this.population[this.population.length - 1].score === 'undefined') {
      this.evaluate();
    }

    var score = 0;
    for (var i = 0; i < this.population.length; i++) {
      score += this.population[i].score;
    }

    return score / this.population.length;
  },

  /**
   * Gets a genome based on the selection function
   * @return {Network} genome
   */
  getParent: function () {
    var i;
    switch (this.selection) {
      case selection.POWER:
        if (this.population[0].score < this.population[1].score) this.sort();

        var index = Math.floor(Math.pow(Math.random(), this.selection.power) * this.population.length);
        return this.population[index];
      case selection.FITNESS_PROPORTIONATE:
        // As negative fitnesses are possible
        // https://stackoverflow.com/questions/16186686/genetic-algorithm-handling-negative-fitness-values
        // this is unnecessarily run for every individual, should be changed

        var totalFitness = 0;
        var minimalFitness = 0;
        for (i = 0; i < this.population.length; i++) {
          var score = this.population[i].score;
          minimalFitness = score < minimalFitness ? score : minimalFitness;
          totalFitness += score;
        }

        minimalFitness = Math.abs(minimalFitness);
        totalFitness += minimalFitness * this.population.length;

        var random = Math.random() * totalFitness;
        var value = 0;

        for (i = 0; i < this.population.length; i++) {
          let genome = this.population[i];
          value += genome.score + minimalFitness;
          if (random < value) return genome;
        }

        // if all scores equal, return random genome
        return this.population[Math.floor(Math.random() * this.population.length)];
      case selection.TOURNAMENT:
        if (this.selection.size > this.popsize) {
          throw new Error('Your tournament size should be lower than the population size, please change methods.selection.TOURNAMENT.size');
        }

        // Create a tournament
        var individuals = [];
        for (i = 0; i < this.selection.size; i++) {
          let random = this.population[Math.floor(Math.random() * this.population.length)];
          individuals.push(random);
        }

        // Sort the tournament individuals by score
        individuals.sort(function (a, b) {
          return b.score - a.score;
        });

        // Select an individual
        for (i = 0; i < this.selection.size; i++) {
          if (Math.random() < this.selection.probability || i === this.selection.size - 1) {
            return individuals[i];
          }
        }
    }
  },

  /**
   * Export the current population to a json object
   */
  export: function () {
    var json = [];
    for (var i = 0; i < this.population.length; i++) {
      var genome = this.population[i];
      json.push(genome.toJSON());
    }

    return json;
  },

  /**
   * Import population from a json object
   */
  import: function (json) {
    var population = [];
    for (var i = 0; i < json.length; i++) {
      var genome = json[i];
      population.push(Network.fromJSON(genome));
    }
    this.population = population;
    this.popsize = population.length;
  }
};


/***/ }),

/***/ "./node_modules/neataptic/src/neataptic.js":
/*!*************************************************!*\
  !*** ./node_modules/neataptic/src/neataptic.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var Neataptic = {
  methods: __webpack_require__(/*! ./methods/methods */ "./node_modules/neataptic/src/methods/methods.js"),
  Connection: __webpack_require__(/*! ./architecture/connection */ "./node_modules/neataptic/src/architecture/connection.js"),
  architect: __webpack_require__(/*! ./architecture/architect */ "./node_modules/neataptic/src/architecture/architect.js"),
  Network: __webpack_require__(/*! ./architecture/network */ "./node_modules/neataptic/src/architecture/network.js"),
  config: __webpack_require__(/*! ./config */ "./node_modules/neataptic/src/config.js"),
  Group: __webpack_require__(/*! ./architecture/group */ "./node_modules/neataptic/src/architecture/group.js"),
  Layer: __webpack_require__(/*! ./architecture/layer */ "./node_modules/neataptic/src/architecture/layer.js"),
  Node: __webpack_require__(/*! ./architecture/node */ "./node_modules/neataptic/src/architecture/node.js"),
  Neat: __webpack_require__(/*! ./neat */ "./node_modules/neataptic/src/neat.js"),
  multi: __webpack_require__(/*! ./multithreading/multi */ "./node_modules/neataptic/src/multithreading/multi.js")
};

// CommonJS & AMD
if (true) {
  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () { return Neataptic; }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

// Node.js
if ( true && module.exports) {
  module.exports = Neataptic;
}

// Browser
if (typeof window === 'object') {
  (function () {
    var old = window['neataptic'];
    Neataptic.ninja = function () {
      window['neataptic'] = old;
      return Neataptic;
    };
  })();

  window['neataptic'] = Neataptic;
}


/***/ }),

/***/ "./node_modules/node-libs-browser/mock/empty.js":
/*!******************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/empty.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/os-browserify/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/os-browserify/browser.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};


/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/data.ts":
/*!*********************!*\
  !*** ./src/data.ts ***!
  \*********************/
/*! exports provided: coords, roads */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coords", function() { return coords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roads", function() { return roads; });
// Key:  {Name, x, y}
const coords = {
    "A": { "Name": "Anjas hus", x: 900, y: 150 },
    "B": { "Name": "Bobs hus", x: 1000, y: 400 },
    "C": { "Name": "Anjas sommerhus", x: 1100, y: 100 },
    "D": { "Name": "Daniels hus", x: 450, y: 600 },
    "E": { "Name": "Emmas hus", x: 250, y: 590 },
    "F": { "Name": "Gretes gård", x: 120, y: 160 },
    "G": { "Name": "Gretes hus", x: 120, y: 360 },
    "H": { "Name": "Gretes butik", x: 350, y: 400 },
    "P": { "Name": "Postcenter", x: 600, y: 100 },
    "S": { "Name": "Shoppingcenter", x: 500, y: 150 },
    "Z": { "Name": "ZBC HTX", x: 600, y: 350 }
};
// Each element is an array of length 2 that defines starting point and ending point of a road
const roads = [
    ["A", "B"],
    ["A", "C"],
    ["A", "P"],
    ["B", "Z"],
    ["D", "E"],
    ["D", "Z"],
    ["E", "G"],
    ["G", "F"],
    ["G", "H"],
    ["G", "S"],
    ["S", "P"],
    ["S", "H"],
    ["S", "Z"],
    ["H", "Z"],
    ["F", "S"]
];


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _visual__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./visual */ "./src/visual.ts");
/* harmony import */ var _robot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./robot */ "./src/robot.ts");
/* harmony import */ var _packages__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./packages */ "./src/packages.ts");
/* harmony import */ var _neat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./neat */ "./src/neat.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");





let robot = new _robot__WEBPACK_IMPORTED_MODULE_1__["Robot"]("A", Object(_packages__WEBPACK_IMPORTED_MODULE_2__["GeneratePackages"])(50), undefined);
Object(_visual__WEBPACK_IMPORTED_MODULE_0__["redraw"])(robot);
let neat = new _neat__WEBPACK_IMPORTED_MODULE_3__["NeuroEvolution"]();
console.log(Object(_utility__WEBPACK_IMPORTED_MODULE_4__["find_path"])("A", "A"));
neat.startEvaluation();
let robot_interval = setInterval(() => {
    neat.update();
    Object(_visual__WEBPACK_IMPORTED_MODULE_0__["redraw"])(neat.robots[0]);
}, 10);


/***/ }),

/***/ "./src/neat.ts":
/*!*********************!*\
  !*** ./src/neat.ts ***!
  \*********************/
/*! exports provided: NeuroEvolution */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NeuroEvolution", function() { return NeuroEvolution; });
/* harmony import */ var neataptic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! neataptic */ "./node_modules/neataptic/src/neataptic.js");
/* harmony import */ var neataptic__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(neataptic__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data */ "./src/data.ts");
/* harmony import */ var _packages__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./packages */ "./src/packages.ts");
/* harmony import */ var _robot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./robot */ "./src/robot.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");
//@ts-ignore





var Neat = neataptic__WEBPACK_IMPORTED_MODULE_0___default.a.Neat;
var Methods = neataptic__WEBPACK_IMPORTED_MODULE_0___default.a.methods;
var Config = neataptic__WEBPACK_IMPORTED_MODULE_0___default.a.Config;
var Architect = neataptic__WEBPACK_IMPORTED_MODULE_0___default.a.architect;
// Network settings
const INPUT_SIZE = 33;
const START_HIDDEN_SIZE = 50;
const OUTPUT_SIZE = 11;
// GA settings
var PACKAGES_PER_PLAYER = 2;
var PLAYER_AMOUNT = 50;
var ITERATIONS = 250;
var MUTATION_RATE = 0.3;
var ELITISM = Math.round(0.3 * PLAYER_AMOUNT);
class NeuroEvolution {
    constructor() {
        this.highestScore = -100000;
        this.neat = new Neat(INPUT_SIZE, OUTPUT_SIZE, null, {
            mutation: Methods.mutation.ALL,
            popsize: PLAYER_AMOUNT,
            mutationRate: MUTATION_RATE,
            elitism: ELITISM,
            network: new Architect.Random(INPUT_SIZE, START_HIDDEN_SIZE, OUTPUT_SIZE)
        });
    }
    update() {
        let allRobotsFinished = true;
        for (let robot of this.robots) {
            // If the robot has delivered all of its packages, then we can just move to the next robot
            if (robot.packages.length == 0) {
                robot.brain.score = -robot.totalMoves;
                if (robot.brain.score > this.highestScore)
                    this.highestScore = robot.brain.score;
                continue;
            }
            // If the robot has made too many moves, then we can just declare it finished and give it a bad score
            if (robot.totalMoves > 500) {
                robot.brain.score = -1000 - robot.packages.length;
                if (robot.brain.score > this.highestScore)
                    this.highestScore = robot.brain.score;
                continue;
            }
            allRobotsFinished = false;
            // Let this be the input for the neural network
            let input = [];
            // The first 11 elements shall descripe the robotlocation, 
            // where the robotlocation is designated with a 1
            for (let loc in _data__WEBPACK_IMPORTED_MODULE_1__["coords"]) {
                if (loc === robot.robotLocation)
                    input.push(1);
                else
                    input.push(0);
            }
            // The next 11 elements shall describe the distribution of package location and destination among the points
            // each location has a value between 0 and 1, descriping the percantage of the total packages on that point
            let packageLocationAmount = [];
            let packageDestinationAmount = [];
            // Fill arrays
            for (let j = 0; j < 11; j++) {
                packageLocationAmount.push(0);
                packageDestinationAmount.push(0);
            }
            // Set total packages
            for (let thisPackage of robot.packages) {
                packageLocationAmount[Object.keys(_data__WEBPACK_IMPORTED_MODULE_1__["coords"]).indexOf(thisPackage.current)]++;
                packageDestinationAmount[Object.keys(_data__WEBPACK_IMPORTED_MODULE_1__["coords"]).indexOf(thisPackage.destination)]++;
            }
            // Normalize
            for (let i in packageLocationAmount) {
                packageLocationAmount[i] = packageLocationAmount[i] / robot.packages.length;
                packageDestinationAmount[i] = packageDestinationAmount[i] / robot.packages.length;
            }
            // Concat to input
            input.push(...packageLocationAmount);
            input.push(...packageDestinationAmount);
            // Generate outputs
            let output = robot.brain.activate(input);
            // Pick the location with the highest probability:
            let highestProb = Math.max.apply(Math, output);
            // Find it the index in the output, and convert it to a letter
            let chosenLocation = Object.keys(_data__WEBPACK_IMPORTED_MODULE_1__["coords"])[output.indexOf(highestProb)];
            // If we chose to move to the current position, we should just increment move counter
            if (chosenLocation == robot.robotLocation) {
                robot.totalMoves++;
                console.log("Same");
                continue;
            }
            // Since the chosen is not necesarily one of the neigbours, we use pathfinding to generate the next move
            let best_path = Object(_utility__WEBPACK_IMPORTED_MODULE_4__["find_path"])(robot.robotLocation, chosenLocation);
            let nextMove = best_path.reverse()[1];
            robot.move(nextMove);
        }
        if (allRobotsFinished)
            this.endEvaluation();
    }
    /** Start the evaluation of the current generation */
    startEvaluation() {
        this.robots = [];
        this.highestScore = -100000;
        for (var genome in this.neat.population) {
            genome = this.neat.population[genome];
            this.robots.push(new _robot__WEBPACK_IMPORTED_MODULE_3__["Robot"]("A", Object(_packages__WEBPACK_IMPORTED_MODULE_2__["GeneratePackages"])(PACKAGES_PER_PLAYER), genome));
        }
    }
    /** End the evaluation of the current generation */
    endEvaluation() {
        console.log('Generation:', this.neat.generation, '- average score:', this.neat.getAverage(), ' highest score:', this.highestScore);
        this.neat.sort();
        var newPopulation = [];
        // Elitism
        for (var i = 0; i < this.neat.elitism; i++) {
            newPopulation.push(this.neat.population[i]);
        }
        // Breed the next individuals
        for (var i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
            newPopulation.push(this.neat.getOffspring());
        }
        // Replace the old population with the new population
        this.neat.population = newPopulation;
        this.neat.mutate();
        this.neat.generation++;
        this.startEvaluation();
    }
}


/***/ }),

/***/ "./src/packages.ts":
/*!*************************!*\
  !*** ./src/packages.ts ***!
  \*************************/
/*! exports provided: GeneratePackages */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GeneratePackages", function() { return GeneratePackages; });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/data.ts");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");


function GeneratePackages(n) {
    let random_packages = [];
    let locations = Object.keys(_data__WEBPACK_IMPORTED_MODULE_0__["coords"]);
    for (let i = 0; i < n; i++) {
        let some_package = { current: "", destination: "" };
        some_package.current = locations[Object(_utility__WEBPACK_IMPORTED_MODULE_1__["randomIntFromInterval"])(0, locations.length - 1)];
        let destination = some_package.current;
        while (destination == some_package.current)
            destination = locations[Object(_utility__WEBPACK_IMPORTED_MODULE_1__["randomIntFromInterval"])(0, locations.length - 1)];
        some_package.destination = destination;
        random_packages.push(some_package);
    }
    return random_packages;
}


/***/ }),

/***/ "./src/robot.ts":
/*!**********************!*\
  !*** ./src/robot.ts ***!
  \**********************/
/*! exports provided: Robot, randomRobot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Robot", function() { return Robot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomRobot", function() { return randomRobot; });
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility */ "./src/utility.ts");

class Robot {
    constructor(startLocation, startPackages, genome) {
        this.totalMoves = 0;
        this.robotLocation = startLocation;
        this.packages = startPackages;
        this.brain = genome;
    }
    move(to) {
        // Check if robot loc is connected to to
        let connections = Object(_utility__WEBPACK_IMPORTED_MODULE_0__["build_connections"])();
        if (!connections[this.robotLocation].includes(to)) {
            console.log("ERROR: tried to move robot to non neighbouring location");
            return;
        }
        this.packages.forEach((element, index) => {
            // Any packages on the this location will be moved to the next loc
            if (element.current == this.robotLocation) {
                element.current = to;
            }
        });
        this.packages = this.packages.filter((element) => {
            return element.current != element.destination;
        });
        this.robotLocation = to;
        this.totalMoves++;
    }
}
function randomRobot(some_robot) {
    let next_move = "";
    // Get neighbours
    let connections = Object(_utility__WEBPACK_IMPORTED_MODULE_0__["build_connections"])();
    let neighbours = connections[some_robot.robotLocation];
    // Pick move
    next_move = neighbours[Object(_utility__WEBPACK_IMPORTED_MODULE_0__["randomIntFromInterval"])(0, neighbours.length - 1)];
    return next_move;
}


/***/ }),

/***/ "./src/utility.ts":
/*!************************!*\
  !*** ./src/utility.ts ***!
  \************************/
/*! exports provided: build_connections, randomIntFromInterval, find_path */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "build_connections", function() { return build_connections; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomIntFromInterval", function() { return randomIntFromInterval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find_path", function() { return find_path; });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/data.ts");

// Build connection object, each key (location) should contain an array of all connected locations
function build_connections() {
    var connections = {};
    for (let k in _data__WEBPACK_IMPORTED_MODULE_0__["coords"]) {
        connections[k] = [];
        for (let r in _data__WEBPACK_IMPORTED_MODULE_0__["roads"]) {
            if (_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][0] == k)
                connections[k].push(_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][1]);
            else if (_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][1] == k)
                connections[k].push(_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][0]);
        }
    }
    return connections;
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function nodeToIndex(node) {
    return Object.keys(_data__WEBPACK_IMPORTED_MODULE_0__["coords"]).indexOf(node);
}
function indexToNode(index) {
    return Object.keys(_data__WEBPACK_IMPORTED_MODULE_0__["coords"])[index];
}
function find_path(from, to) {
    let src = Object.keys(_data__WEBPACK_IMPORTED_MODULE_0__["coords"]).indexOf(from);
    let dest = Object.keys(_data__WEBPACK_IMPORTED_MODULE_0__["coords"]).indexOf(to);
    //console.log("SRC: " + from);
    //console.log("DEST: " + to);
    let numNodes = 11;
    let graph = {};
    for (let k in _data__WEBPACK_IMPORTED_MODULE_0__["coords"]) {
        graph[nodeToIndex(k)] = [];
        for (let r in _data__WEBPACK_IMPORTED_MODULE_0__["roads"]) {
            if (_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][0] == k)
                graph[nodeToIndex(k)].push(nodeToIndex(_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][1]));
            else if (_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][1] == k)
                graph[nodeToIndex(k)].push(nodeToIndex(_data__WEBPACK_IMPORTED_MODULE_0__["roads"][r][0]));
        }
    }
    let pred = [];
    let dist = [];
    if (BFS(graph, numNodes, src, dest, pred, dist) == false) {
        //console.log("No available path");
        return;
    }
    // vector path stores the shortest path
    let path = [];
    let crawl = dest;
    path.push(indexToNode(crawl));
    while (pred[crawl] != -1) {
        path.push(indexToNode(pred[crawl]));
        crawl = pred[crawl];
    }
    // distance from source is in distance array
    //console.log("Shortest path length is : " + dist[dest])
    // printing path from source to destination
    //console.log("Path is: " + path);
    return path;
}
function BFS(graph, numNodes, src, dest, pred, dist) {
    var queue = [];
    var visited = [];
    for (let i = 0; i < numNodes; i++) {
        visited.push(false);
        dist.push(Number.MAX_SAFE_INTEGER);
        pred.push(-1);
    }
    visited[src] = true;
    dist[src] = 0;
    queue.push(src);
    // standard BFS algorithm
    while (queue.length != 0) {
        let u = queue[0];
        queue.shift();
        for (let i = 0; i < graph[u].length; i++) {
            if (visited[graph[u][i]] == false) {
                visited[graph[u][i]] = true;
                dist[graph[u][i]] = dist[u] + 1;
                pred[graph[u][i]] = u;
                queue.push(graph[u][i]);
                // We stop BFS when we find
                // destination.
                //console.log(Object.keys(coords)[graph[u][i]]);
                if (Math.abs(graph[u][i] - dest) < 0.01)
                    return true;
            }
        }
    }
    return false;
}


/***/ }),

/***/ "./src/visual.ts":
/*!***********************!*\
  !*** ./src/visual.ts ***!
  \***********************/
/*! exports provided: redraw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "redraw", function() { return redraw; });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/data.ts");

// TODO: Should this be moved to an external configuration file?
const LOCATION_SIZE = 20;
const LOCATION_TEXT_SIZE = "25px";
const ROAD_WIDTH = 5;
const LOCATION_COLOR = "black";
const LOCATION_TEXT_COLOR = "white";
const ROAD_COLOR = "black";
const ROBOT_COLOR = "blue";
// Get canvas from html
const canvas = document.querySelector("#town");
const ctx = canvas.getContext("2d");
ctx.scale(2, 2);
function redraw(robot) {
    // Store the current transformation matrix
    ctx.save();
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Restore the transform
    ctx.restore();
    drawRoads();
    drawLocations(robot.robotLocation);
    drawAllPackages(robot.packages);
}
// Paint a small filled circle on the canvas for each key (location) in coords (randomly placed)
function drawLocations(robot_location) {
    for (let k in _data__WEBPACK_IMPORTED_MODULE_0__["coords"]) {
        ctx.beginPath();
        ctx.arc(_data__WEBPACK_IMPORTED_MODULE_0__["coords"][k].x, _data__WEBPACK_IMPORTED_MODULE_0__["coords"][k].y, LOCATION_SIZE, 0, 2 * Math.PI);
        if (k == robot_location)
            ctx.fillStyle = ROBOT_COLOR;
        else
            ctx.fillStyle = LOCATION_COLOR;
        ctx.fill();
        ctx.font = LOCATION_TEXT_SIZE + " Comic Sans MS";
        ctx.fillStyle = LOCATION_TEXT_COLOR;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(k, _data__WEBPACK_IMPORTED_MODULE_0__["coords"][k].x, _data__WEBPACK_IMPORTED_MODULE_0__["coords"][k].y);
    }
}
function drawRoads() {
    for (let k in _data__WEBPACK_IMPORTED_MODULE_0__["roads"]) {
        drawRoad(_data__WEBPACK_IMPORTED_MODULE_0__["roads"][k][0], _data__WEBPACK_IMPORTED_MODULE_0__["roads"][k][1]);
    }
}
function drawRoad(from, to) {
    ctx.beginPath();
    ctx.moveTo(_data__WEBPACK_IMPORTED_MODULE_0__["coords"][from].x, _data__WEBPACK_IMPORTED_MODULE_0__["coords"][from].y);
    ctx.lineTo(_data__WEBPACK_IMPORTED_MODULE_0__["coords"][to].x, _data__WEBPACK_IMPORTED_MODULE_0__["coords"][to].y);
    ctx.lineWidth = ROAD_WIDTH;
    ctx.strokeStyle = ROAD_COLOR;
    ctx.stroke();
}
// // https://stackoverflow.com/a/13901170
function drawPackages(centerX, centerY, packs) {
    // value of theta corresponding to end of last coil
    const coils = 6;
    const radius = 150;
    const rotation = Math.PI * 1.5;
    const thetaMax = coils * 2 * Math.PI;
    // How far to step away from center for each side.
    const awayStep = radius / thetaMax;
    // distance between points to plot
    const chord = 30;
    let i = 0;
    for (let theta = chord / awayStep; theta <= thetaMax;) {
        // How far away from center
        const away = awayStep * theta;
        //
        // How far around the center.
        const around = theta + rotation;
        //
        // Convert 'around' and 'away' to X and Y.
        const x = centerX + Math.cos(around) * away;
        const y = centerY + Math.sin(around) * away;
        // Now that you know it, do it.
        if (i < packs.length) {
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.font = "13px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(packs[i], x, y);
        }
        // to a first approximation, the points are on a circle
        // so the angle between them is chord/radius
        theta += chord / away;
        i++;
    }
}
function drawAllPackages(packages) {
    for (let k in _data__WEBPACK_IMPORTED_MODULE_0__["coords"]) {
        var packs = [];
        for (let p of packages) {
            if (k == p.current)
                packs.push(p.destination);
        }
        drawPackages(_data__WEBPACK_IMPORTED_MODULE_0__["coords"][k].x, _data__WEBPACK_IMPORTED_MODULE_0__["coords"][k].y, packs);
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvYXJjaGl0ZWN0dXJlL2FyY2hpdGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9hcmNoaXRlY3R1cmUvY29ubmVjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9hcmNoaXRlY3R1cmUvZ3JvdXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvYXJjaGl0ZWN0dXJlL2xheWVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9uZWF0YXB0aWMvc3JjL2FyY2hpdGVjdHVyZS9uZXR3b3JrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9uZWF0YXB0aWMvc3JjL2FyY2hpdGVjdHVyZS9ub2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9uZWF0YXB0aWMvc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9tZXRob2RzL2FjdGl2YXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbWV0aG9kcy9jb25uZWN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9uZWF0YXB0aWMvc3JjL21ldGhvZHMvY29zdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9tZXRob2RzL2Nyb3Nzb3Zlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9tZXRob2RzL2dhdGluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9tZXRob2RzL21ldGhvZHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbWV0aG9kcy9tdXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmVhdGFwdGljL3NyYy9tZXRob2RzL3JhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbWV0aG9kcy9zZWxlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbXVsdGl0aHJlYWRpbmcvbXVsdGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbXVsdGl0aHJlYWRpbmcvd29ya2Vycy9icm93c2VyL3Rlc3R3b3JrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbXVsdGl0aHJlYWRpbmcvd29ya2Vycy9ub2RlL3Rlc3R3b3JrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbXVsdGl0aHJlYWRpbmcvd29ya2Vycy93b3JrZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9uZWF0YXB0aWMvc3JjL25lYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25lYXRhcHRpYy9zcmMvbmVhdGFwdGljLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vcy1icm93c2VyaWZ5L2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9kYXRhLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9uZWF0LnRzIiwid2VicGFjazovLy8uL3NyYy9wYWNrYWdlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcm9ib3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxpdHkudHMiLCJ3ZWJw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QUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQix1QkFBdUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0NBQStDOztBQUUvQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxZQUFZO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FB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QUFFQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDOWFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw2Q0FBNkM7QUFDaEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdTQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7Ozs7Ozs7O0FDdkx0QztBQUFBO0FBQUE7QUFBQSxxQkFBcUI7QUFDZCxNQUFNLE1BQU0sR0FBRztJQUNsQixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRyxHQUFHLEVBQUUsQ0FBQyxFQUFHLEdBQUcsRUFBQztJQUM1QyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJ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LENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDakQ7QUFDTCxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiLyogSW1wb3J0ICovXHJcbnZhciBtZXRob2RzID0gcmVxdWlyZSgnLi4vbWV0aG9kcy9tZXRob2RzJyk7XHJcbnZhciBOZXR3b3JrID0gcmVxdWlyZSgnLi9uZXR3b3JrJyk7XHJcbnZhciBHcm91cCA9IHJlcXVpcmUoJy4vZ3JvdXAnKTtcclxudmFyIExheWVyID0gcmVxdWlyZSgnLi9sYXllcicpO1xyXG52YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyY2hpdGVjdFxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxudmFyIGFyY2hpdGVjdCA9IHtcclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RzIGEgbmV0d29yayBmcm9tIGEgZ2l2ZW4gYXJyYXkgb2YgY29ubmVjdGVkIG5vZGVzXHJcbiAgICovXHJcbiAgQ29uc3RydWN0OiBmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgLy8gQ3JlYXRlIGEgbmV0d29ya1xyXG4gICAgdmFyIG5ldHdvcmsgPSBuZXcgTmV0d29yaygwLCAwKTtcclxuXHJcbiAgICAvLyBUcmFuc2Zvcm0gYWxsIGdyb3VwcyBpbnRvIG5vZGVzXHJcbiAgICB2YXIgbm9kZXMgPSBbXTtcclxuXHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBqO1xyXG4gICAgICBpZiAobGlzdFtpXSBpbnN0YW5jZW9mIEdyb3VwKSB7XHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGxpc3RbaV0ubm9kZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIG5vZGVzLnB1c2gobGlzdFtpXS5ub2Rlc1tqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGxpc3RbaV0gaW5zdGFuY2VvZiBMYXllcikge1xyXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBsaXN0W2ldLm5vZGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGxpc3RbaV0ubm9kZXNbal0ubm9kZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgbm9kZXMucHVzaChsaXN0W2ldLm5vZGVzW2pdLm5vZGVzW2tdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAobGlzdFtpXSBpbnN0YW5jZW9mIE5vZGUpIHtcclxuICAgICAgICBub2Rlcy5wdXNoKGxpc3RbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIGlucHV0IGFuZCBvdXRwdXQgbm9kZXNcclxuICAgIHZhciBpbnB1dHMgPSBbXTtcclxuICAgIHZhciBvdXRwdXRzID0gW107XHJcbiAgICBmb3IgKGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBpZiAobm9kZXNbaV0udHlwZSA9PT0gJ291dHB1dCcgfHwgbm9kZXNbaV0uY29ubmVjdGlvbnMub3V0Lmxlbmd0aCArIG5vZGVzW2ldLmNvbm5lY3Rpb25zLmdhdGVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIG5vZGVzW2ldLnR5cGUgPSAnb3V0cHV0JztcclxuICAgICAgICBuZXR3b3JrLm91dHB1dCsrO1xyXG4gICAgICAgIG91dHB1dHMucHVzaChub2Rlc1tpXSk7XHJcbiAgICAgICAgbm9kZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICB9IGVsc2UgaWYgKG5vZGVzW2ldLnR5cGUgPT09ICdpbnB1dCcgfHwgIW5vZGVzW2ldLmNvbm5lY3Rpb25zLmluLmxlbmd0aCkge1xyXG4gICAgICAgIG5vZGVzW2ldLnR5cGUgPSAnaW5wdXQnO1xyXG4gICAgICAgIG5ldHdvcmsuaW5wdXQrKztcclxuICAgICAgICBpbnB1dHMucHVzaChub2Rlc1tpXSk7XHJcbiAgICAgICAgbm9kZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW5wdXQgbm9kZXMgYXJlIGFsd2F5cyBmaXJzdCwgb3V0cHV0IG5vZGVzIGFyZSBhbHdheXMgbGFzdFxyXG4gICAgbm9kZXMgPSBpbnB1dHMuY29uY2F0KG5vZGVzKS5jb25jYXQob3V0cHV0cyk7XHJcblxyXG4gICAgaWYgKG5ldHdvcmsuaW5wdXQgPT09IDAgfHwgbmV0d29yay5vdXRwdXQgPT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiBub2RlcyBoYXZlIG5vIGNsZWFyIGlucHV0L291dHB1dCBub2RlIScpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgajtcclxuICAgICAgZm9yIChqID0gMDsgaiA8IG5vZGVzW2ldLmNvbm5lY3Rpb25zLm91dC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIG5ldHdvcmsuY29ubmVjdGlvbnMucHVzaChub2Rlc1tpXS5jb25uZWN0aW9ucy5vdXRbal0pO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoaiA9IDA7IGogPCBub2Rlc1tpXS5jb25uZWN0aW9ucy5nYXRlZC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIG5ldHdvcmsuZ2F0ZXMucHVzaChub2Rlc1tpXS5jb25uZWN0aW9ucy5nYXRlZFtqXSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5vZGVzW2ldLmNvbm5lY3Rpb25zLnNlbGYud2VpZ2h0ICE9PSAwKSB7XHJcbiAgICAgICAgbmV0d29yay5zZWxmY29ubnMucHVzaChub2Rlc1tpXS5jb25uZWN0aW9ucy5zZWxmKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5ldHdvcmsubm9kZXMgPSBub2RlcztcclxuXHJcbiAgICByZXR1cm4gbmV0d29yaztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbXVsdGlsYXllciBwZXJjZXB0cm9uIChNTFApXHJcbiAgICovXHJcbiAgUGVyY2VwdHJvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gQ29udmVydCBhcmd1bWVudHMgdG8gQXJyYXlcclxuICAgIHZhciBsYXllcnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgaWYgKGxheWVycy5sZW5ndGggPCAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgdG8gc3BlY2lmeSBhdCBsZWFzdCAzIGxheWVycycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENyZWF0ZSBhIGxpc3Qgb2Ygbm9kZXMvZ3JvdXBzXHJcbiAgICB2YXIgbm9kZXMgPSBbXTtcclxuICAgIG5vZGVzLnB1c2gobmV3IEdyb3VwKGxheWVyc1swXSkpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBsYXllciA9IGxheWVyc1tpXTtcclxuICAgICAgbGF5ZXIgPSBuZXcgR3JvdXAobGF5ZXIpO1xyXG4gICAgICBub2Rlcy5wdXNoKGxheWVyKTtcclxuICAgICAgbm9kZXNbaSAtIDFdLmNvbm5lY3Qobm9kZXNbaV0sIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb25zdHJ1Y3QgdGhlIG5ldHdvcmtcclxuICAgIHJldHVybiBhcmNoaXRlY3QuQ29uc3RydWN0KG5vZGVzKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgcmFuZG9tbHkgY29ubmVjdGVkIG5ldHdvcmtcclxuICAgKi9cclxuICBSYW5kb206IGZ1bmN0aW9uIChpbnB1dCwgaGlkZGVuLCBvdXRwdXQsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIHZhciBjb25uZWN0aW9ucyA9IG9wdGlvbnMuY29ubmVjdGlvbnMgfHwgaGlkZGVuICogMjtcclxuICAgIHZhciBiYWNrY29ubmVjdGlvbnMgPSBvcHRpb25zLmJhY2tjb25uZWN0aW9ucyB8fCAwO1xyXG4gICAgdmFyIHNlbGZjb25uZWN0aW9ucyA9IG9wdGlvbnMuc2VsZmNvbm5lY3Rpb25zIHx8IDA7XHJcbiAgICB2YXIgZ2F0ZXMgPSBvcHRpb25zLmdhdGVzIHx8IDA7XHJcblxyXG4gICAgdmFyIG5ldHdvcmsgPSBuZXcgTmV0d29yayhpbnB1dCwgb3V0cHV0KTtcclxuXHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBoaWRkZW47IGkrKykge1xyXG4gICAgICBuZXR3b3JrLm11dGF0ZShtZXRob2RzLm11dGF0aW9uLkFERF9OT0RFKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY29ubmVjdGlvbnMgLSBoaWRkZW47IGkrKykge1xyXG4gICAgICBuZXR3b3JrLm11dGF0ZShtZXRob2RzLm11dGF0aW9uLkFERF9DT05OKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYmFja2Nvbm5lY3Rpb25zOyBpKyspIHtcclxuICAgICAgbmV0d29yay5tdXRhdGUobWV0aG9kcy5tdXRhdGlvbi5BRERfQkFDS19DT05OKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgc2VsZmNvbm5lY3Rpb25zOyBpKyspIHtcclxuICAgICAgbmV0d29yay5tdXRhdGUobWV0aG9kcy5tdXRhdGlvbi5BRERfU0VMRl9DT05OKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZ2F0ZXM7IGkrKykge1xyXG4gICAgICBuZXR3b3JrLm11dGF0ZShtZXRob2RzLm11dGF0aW9uLkFERF9HQVRFKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV0d29yaztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbG9uZyBzaG9ydC10ZXJtIG1lbW9yeSBuZXR3b3JrXHJcbiAgICovXHJcbiAgTFNUTTogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgaWYgKGFyZ3MubGVuZ3RoIDwgMykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBoYXZlIHRvIHNwZWNpZnkgYXQgbGVhc3QgMyBsYXllcnMnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGFzdCA9IGFyZ3MucG9wKCk7XHJcblxyXG4gICAgdmFyIG91dHB1dExheWVyO1xyXG4gICAgaWYgKHR5cGVvZiBsYXN0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICBvdXRwdXRMYXllciA9IG5ldyBHcm91cChsYXN0KTtcclxuICAgICAgbGFzdCA9IHt9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0cHV0TGF5ZXIgPSBuZXcgR3JvdXAoYXJncy5wb3AoKSk7IC8vIGxhc3QgYXJndW1lbnRcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXRMYXllci5zZXQoe1xyXG4gICAgICB0eXBlOiAnb3V0cHV0J1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcclxuICAgIG9wdGlvbnMubWVtb3J5VG9NZW1vcnkgPSBsYXN0Lm1lbW9yeVRvTWVtb3J5IHx8IGZhbHNlO1xyXG4gICAgb3B0aW9ucy5vdXRwdXRUb01lbW9yeSA9IGxhc3Qub3V0cHV0VG9NZW1vcnkgfHwgZmFsc2U7XHJcbiAgICBvcHRpb25zLm91dHB1dFRvR2F0ZXMgPSBsYXN0Lm91dHB1dFRvR2F0ZXMgfHwgZmFsc2U7XHJcbiAgICBvcHRpb25zLmlucHV0VG9PdXRwdXQgPSBsYXN0LmlucHV0VG9PdXRwdXQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBsYXN0LmlucHV0VG9PdXRwdXQ7XHJcbiAgICBvcHRpb25zLmlucHV0VG9EZWVwID0gbGFzdC5pbnB1dFRvRGVlcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGxhc3QuaW5wdXRUb0RlZXA7XHJcblxyXG4gICAgdmFyIGlucHV0TGF5ZXIgPSBuZXcgR3JvdXAoYXJncy5zaGlmdCgpKTsgLy8gZmlyc3QgYXJndW1lbnRcclxuICAgIGlucHV0TGF5ZXIuc2V0KHtcclxuICAgICAgdHlwZTogJ2lucHV0J1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGJsb2NrcyA9IGFyZ3M7IC8vIGFsbCB0aGUgYXJndW1lbnRzIGluIHRoZSBtaWRkbGVcclxuXHJcbiAgICB2YXIgbm9kZXMgPSBbXTtcclxuICAgIG5vZGVzLnB1c2goaW5wdXRMYXllcik7XHJcblxyXG4gICAgdmFyIHByZXZpb3VzID0gaW5wdXRMYXllcjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBibG9jayA9IGJsb2Nrc1tpXTtcclxuXHJcbiAgICAgIC8vIEluaXQgcmVxdWlyZWQgbm9kZXMgKGluIGFjdGl2YXRpb24gb3JkZXIpXHJcbiAgICAgIHZhciBpbnB1dEdhdGUgPSBuZXcgR3JvdXAoYmxvY2spO1xyXG4gICAgICB2YXIgZm9yZ2V0R2F0ZSA9IG5ldyBHcm91cChibG9jayk7XHJcbiAgICAgIHZhciBtZW1vcnlDZWxsID0gbmV3IEdyb3VwKGJsb2NrKTtcclxuICAgICAgdmFyIG91dHB1dEdhdGUgPSBuZXcgR3JvdXAoYmxvY2spO1xyXG4gICAgICB2YXIgb3V0cHV0QmxvY2sgPSBpID09PSBibG9ja3MubGVuZ3RoIC0gMSA/IG91dHB1dExheWVyIDogbmV3IEdyb3VwKGJsb2NrKTtcclxuXHJcbiAgICAgIGlucHV0R2F0ZS5zZXQoe1xyXG4gICAgICAgIGJpYXM6IDFcclxuICAgICAgfSk7XHJcbiAgICAgIGZvcmdldEdhdGUuc2V0KHtcclxuICAgICAgICBiaWFzOiAxXHJcbiAgICAgIH0pO1xyXG4gICAgICBvdXRwdXRHYXRlLnNldCh7XHJcbiAgICAgICAgYmlhczogMVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIENvbm5lY3QgdGhlIGlucHV0IHdpdGggYWxsIHRoZSBub2Rlc1xyXG4gICAgICB2YXIgaW5wdXQgPSBwcmV2aW91cy5jb25uZWN0KG1lbW9yeUNlbGwsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgcHJldmlvdXMuY29ubmVjdChpbnB1dEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgcHJldmlvdXMuY29ubmVjdChvdXRwdXRHYXRlLCBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0FMTCk7XHJcbiAgICAgIHByZXZpb3VzLmNvbm5lY3QoZm9yZ2V0R2F0ZSwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG5cclxuICAgICAgLy8gU2V0IHVwIGludGVybmFsIGNvbm5lY3Rpb25zXHJcbiAgICAgIG1lbW9yeUNlbGwuY29ubmVjdChpbnB1dEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgbWVtb3J5Q2VsbC5jb25uZWN0KGZvcmdldEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgbWVtb3J5Q2VsbC5jb25uZWN0KG91dHB1dEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgdmFyIGZvcmdldCA9IG1lbW9yeUNlbGwuY29ubmVjdChtZW1vcnlDZWxsLCBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORSk7XHJcbiAgICAgIHZhciBvdXRwdXQgPSBtZW1vcnlDZWxsLmNvbm5lY3Qob3V0cHV0QmxvY2ssIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuXHJcbiAgICAgIC8vIFNldCB1cCBnYXRlc1xyXG4gICAgICBpbnB1dEdhdGUuZ2F0ZShpbnB1dCwgbWV0aG9kcy5nYXRpbmcuSU5QVVQpO1xyXG4gICAgICBmb3JnZXRHYXRlLmdhdGUoZm9yZ2V0LCBtZXRob2RzLmdhdGluZy5TRUxGKTtcclxuICAgICAgb3V0cHV0R2F0ZS5nYXRlKG91dHB1dCwgbWV0aG9kcy5nYXRpbmcuT1VUUFVUKTtcclxuXHJcbiAgICAgIC8vIElucHV0IHRvIGFsbCBtZW1vcnkgY2VsbHNcclxuICAgICAgaWYgKG9wdGlvbnMuaW5wdXRUb0RlZXAgJiYgaSA+IDApIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSBpbnB1dExheWVyLmNvbm5lY3QobWVtb3J5Q2VsbCwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG4gICAgICAgIGlucHV0R2F0ZS5nYXRlKGlucHV0LCBtZXRob2RzLmdhdGluZy5JTlBVVCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE9wdGlvbmFsIGNvbm5lY3Rpb25zXHJcbiAgICAgIGlmIChvcHRpb25zLm1lbW9yeVRvTWVtb3J5KSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gbWVtb3J5Q2VsbC5jb25uZWN0KG1lbW9yeUNlbGwsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fRUxTRSk7XHJcbiAgICAgICAgaW5wdXRHYXRlLmdhdGUoaW5wdXQsIG1ldGhvZHMuZ2F0aW5nLklOUFVUKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMub3V0cHV0VG9NZW1vcnkpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSBvdXRwdXRMYXllci5jb25uZWN0KG1lbW9yeUNlbGwsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgICBpbnB1dEdhdGUuZ2F0ZShpbnB1dCwgbWV0aG9kcy5nYXRpbmcuSU5QVVQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5vdXRwdXRUb0dhdGVzKSB7XHJcbiAgICAgICAgb3V0cHV0TGF5ZXIuY29ubmVjdChpbnB1dEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgICBvdXRwdXRMYXllci5jb25uZWN0KGZvcmdldEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgICBvdXRwdXRMYXllci5jb25uZWN0KG91dHB1dEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWRkIHRvIGFycmF5XHJcbiAgICAgIG5vZGVzLnB1c2goaW5wdXRHYXRlKTtcclxuICAgICAgbm9kZXMucHVzaChmb3JnZXRHYXRlKTtcclxuICAgICAgbm9kZXMucHVzaChtZW1vcnlDZWxsKTtcclxuICAgICAgbm9kZXMucHVzaChvdXRwdXRHYXRlKTtcclxuICAgICAgaWYgKGkgIT09IGJsb2Nrcy5sZW5ndGggLSAxKSBub2Rlcy5wdXNoKG91dHB1dEJsb2NrKTtcclxuXHJcbiAgICAgIHByZXZpb3VzID0gb3V0cHV0QmxvY2s7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW5wdXQgdG8gb3V0cHV0IGRpcmVjdCBjb25uZWN0aW9uXHJcbiAgICBpZiAob3B0aW9ucy5pbnB1dFRvT3V0cHV0KSB7XHJcbiAgICAgIGlucHV0TGF5ZXIuY29ubmVjdChvdXRwdXRMYXllciwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGVzLnB1c2gob3V0cHV0TGF5ZXIpO1xyXG4gICAgcmV0dXJuIGFyY2hpdGVjdC5Db25zdHJ1Y3Qobm9kZXMpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBnYXRlZCByZWN1cnJlbnQgdW5pdCBuZXR3b3JrXHJcbiAgICovXHJcbiAgR1JVOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPCAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGVub3VnaCBsYXllcnMgKG1pbmltdW0gMykgISEnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5wdXRMYXllciA9IG5ldyBHcm91cChhcmdzLnNoaWZ0KCkpOyAvLyBmaXJzdCBhcmd1bWVudFxyXG4gICAgdmFyIG91dHB1dExheWVyID0gbmV3IEdyb3VwKGFyZ3MucG9wKCkpOyAvLyBsYXN0IGFyZ3VtZW50XHJcbiAgICB2YXIgYmxvY2tzID0gYXJnczsgLy8gYWxsIHRoZSBhcmd1bWVudHMgaW4gdGhlIG1pZGRsZVxyXG5cclxuICAgIHZhciBub2RlcyA9IFtdO1xyXG4gICAgbm9kZXMucHVzaChpbnB1dExheWVyKTtcclxuXHJcbiAgICB2YXIgcHJldmlvdXMgPSBpbnB1dExheWVyO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGxheWVyID0gbmV3IExheWVyLkdSVShibG9ja3NbaV0pO1xyXG4gICAgICBwcmV2aW91cy5jb25uZWN0KGxheWVyKTtcclxuICAgICAgcHJldmlvdXMgPSBsYXllcjtcclxuXHJcbiAgICAgIG5vZGVzLnB1c2gobGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZpb3VzLmNvbm5lY3Qob3V0cHV0TGF5ZXIpO1xyXG4gICAgbm9kZXMucHVzaChvdXRwdXRMYXllcik7XHJcblxyXG4gICAgcmV0dXJuIGFyY2hpdGVjdC5Db25zdHJ1Y3Qobm9kZXMpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBob3BmaWVsZCBuZXR3b3JrIG9mIHRoZSBnaXZlbiBzaXplXHJcbiAgICovXHJcbiAgSG9wZmllbGQ6IGZ1bmN0aW9uIChzaXplKSB7XHJcbiAgICB2YXIgaW5wdXQgPSBuZXcgR3JvdXAoc2l6ZSk7XHJcbiAgICB2YXIgb3V0cHV0ID0gbmV3IEdyb3VwKHNpemUpO1xyXG5cclxuICAgIGlucHV0LmNvbm5lY3Qob3V0cHV0LCBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0FMTCk7XHJcblxyXG4gICAgaW5wdXQuc2V0KHtcclxuICAgICAgdHlwZTogJ2lucHV0J1xyXG4gICAgfSk7XHJcbiAgICBvdXRwdXQuc2V0KHtcclxuICAgICAgc3F1YXNoOiBtZXRob2RzLmFjdGl2YXRpb24uU1RFUCxcclxuICAgICAgdHlwZTogJ291dHB1dCdcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBuZXR3b3JrID0gbmV3IGFyY2hpdGVjdC5Db25zdHJ1Y3QoW2lucHV0LCBvdXRwdXRdKTtcclxuXHJcbiAgICByZXR1cm4gbmV0d29yaztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgTkFSWCBuZXR3b3JrIChyZW1lbWJlciBwcmV2aW91cyBpbnB1dHMvb3V0cHV0cylcclxuICAgKi9cclxuICBOQVJYOiBmdW5jdGlvbiAoaW5wdXRTaXplLCBoaWRkZW5MYXllcnMsIG91dHB1dFNpemUsIHByZXZpb3VzSW5wdXQsIHByZXZpb3VzT3V0cHV0KSB7XHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaGlkZGVuTGF5ZXJzKSkge1xyXG4gICAgICBoaWRkZW5MYXllcnMgPSBbaGlkZGVuTGF5ZXJzXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbm9kZXMgPSBbXTtcclxuXHJcbiAgICB2YXIgaW5wdXQgPSBuZXcgTGF5ZXIuRGVuc2UoaW5wdXRTaXplKTtcclxuICAgIHZhciBpbnB1dE1lbW9yeSA9IG5ldyBMYXllci5NZW1vcnkoaW5wdXRTaXplLCBwcmV2aW91c0lucHV0KTtcclxuICAgIHZhciBoaWRkZW4gPSBbXTtcclxuICAgIHZhciBvdXRwdXQgPSBuZXcgTGF5ZXIuRGVuc2Uob3V0cHV0U2l6ZSk7XHJcbiAgICB2YXIgb3V0cHV0TWVtb3J5ID0gbmV3IExheWVyLk1lbW9yeShvdXRwdXRTaXplLCBwcmV2aW91c091dHB1dCk7XHJcblxyXG4gICAgbm9kZXMucHVzaChpbnB1dCk7XHJcbiAgICBub2Rlcy5wdXNoKG91dHB1dE1lbW9yeSk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaWRkZW5MYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGhpZGRlbkxheWVyID0gbmV3IExheWVyLkRlbnNlKGhpZGRlbkxheWVyc1tpXSk7XHJcbiAgICAgIGhpZGRlbi5wdXNoKGhpZGRlbkxheWVyKTtcclxuICAgICAgbm9kZXMucHVzaChoaWRkZW5MYXllcik7XHJcbiAgICAgIGlmICh0eXBlb2YgaGlkZGVuW2kgLSAxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBoaWRkZW5baSAtIDFdLmNvbm5lY3QoaGlkZGVuTGF5ZXIsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5vZGVzLnB1c2goaW5wdXRNZW1vcnkpO1xyXG4gICAgbm9kZXMucHVzaChvdXRwdXQpO1xyXG5cclxuICAgIGlucHV0LmNvbm5lY3QoaGlkZGVuWzBdLCBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0FMTCk7XHJcbiAgICBpbnB1dC5jb25uZWN0KGlucHV0TWVtb3J5LCBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORSwgMSk7XHJcbiAgICBpbnB1dE1lbW9yeS5jb25uZWN0KGhpZGRlblswXSwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG4gICAgaGlkZGVuW2hpZGRlbi5sZW5ndGggLSAxXS5jb25uZWN0KG91dHB1dCwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG4gICAgb3V0cHV0LmNvbm5lY3Qob3V0cHV0TWVtb3J5LCBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORSwgMSk7XHJcbiAgICBvdXRwdXRNZW1vcnkuY29ubmVjdChoaWRkZW5bMF0sIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuXHJcbiAgICBpbnB1dC5zZXQoe1xyXG4gICAgICB0eXBlOiAnaW5wdXQnXHJcbiAgICB9KTtcclxuICAgIG91dHB1dC5zZXQoe1xyXG4gICAgICB0eXBlOiAnb3V0cHV0J1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGFyY2hpdGVjdC5Db25zdHJ1Y3Qobm9kZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qIEV4cG9ydCAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFyY2hpdGVjdDtcclxuIiwiLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gQ29ubmVjdGlvbjtcclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ09OTkVDVElPTlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gQ29ubmVjdGlvbiAoZnJvbSwgdG8sIHdlaWdodCkge1xyXG4gIHRoaXMuZnJvbSA9IGZyb207XHJcbiAgdGhpcy50byA9IHRvO1xyXG4gIHRoaXMuZ2FpbiA9IDE7XHJcblxyXG4gIHRoaXMud2VpZ2h0ID0gKHR5cGVvZiB3ZWlnaHQgPT09ICd1bmRlZmluZWQnKSA/IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjEgOiB3ZWlnaHQ7XHJcblxyXG4gIHRoaXMuZ2F0ZXIgPSBudWxsO1xyXG4gIHRoaXMuZWxlZ2liaWxpdHkgPSAwO1xyXG5cclxuICAvLyBGb3IgdHJhY2tpbmcgbW9tZW50dW1cclxuICB0aGlzLnByZXZpb3VzRGVsdGFXZWlnaHQgPSAwO1xyXG5cclxuICAvLyBCYXRjaCB0cmFpbmluZ1xyXG4gIHRoaXMudG90YWxEZWx0YVdlaWdodCA9IDA7XHJcblxyXG4gIHRoaXMueHRyYWNlID0ge1xyXG4gICAgbm9kZXM6IFtdLFxyXG4gICAgdmFsdWVzOiBbXVxyXG4gIH07XHJcbn1cclxuXHJcbkNvbm5lY3Rpb24ucHJvdG90eXBlID0ge1xyXG4gIC8qKlxyXG4gICAqIENvbnZlcnRzIHRoZSBjb25uZWN0aW9uIHRvIGEganNvbiBvYmplY3RcclxuICAgKi9cclxuICB0b0pTT046IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBqc29uID0ge1xyXG4gICAgICB3ZWlnaHQ6IHRoaXMud2VpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBqc29uO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGlubm92YXRpb24gSURcclxuICogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGFpcmluZ19mdW5jdGlvbiAoQ2FudG9yIHBhaXJpbmcgZnVuY3Rpb24pXHJcbiAqL1xyXG5Db25uZWN0aW9uLmlubm92YXRpb25JRCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgcmV0dXJuIDEgLyAyICogKGEgKyBiKSAqIChhICsgYiArIDEpICsgYjtcclxufTtcclxuIiwiLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gR3JvdXA7XHJcblxyXG4vKiBJbXBvcnQgKi9cclxudmFyIG1ldGhvZHMgPSByZXF1aXJlKCcuLi9tZXRob2RzL21ldGhvZHMnKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xyXG52YXIgTGF5ZXIgPSByZXF1aXJlKCcuL2xheWVyJyk7XHJcbnZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdyb3VwXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5mdW5jdGlvbiBHcm91cCAoc2l6ZSkge1xyXG4gIHRoaXMubm9kZXMgPSBbXTtcclxuICB0aGlzLmNvbm5lY3Rpb25zID0ge1xyXG4gICAgaW46IFtdLFxyXG4gICAgb3V0OiBbXSxcclxuICAgIHNlbGY6IFtdXHJcbiAgfTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuICAgIHRoaXMubm9kZXMucHVzaChuZXcgTm9kZSgpKTtcclxuICB9XHJcbn1cclxuXHJcbkdyb3VwLnByb3RvdHlwZSA9IHtcclxuICAvKipcclxuICAgKiBBY3RpdmF0ZXMgYWxsIHRoZSBub2RlcyBpbiB0aGUgZ3JvdXBcclxuICAgKi9cclxuICBhY3RpdmF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICB2YXIgdmFsdWVzID0gW107XHJcblxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUubGVuZ3RoICE9PSB0aGlzLm5vZGVzLmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FycmF5IHdpdGggdmFsdWVzIHNob3VsZCBiZSBzYW1lIGFzIHRoZSBhbW91bnQgb2Ygbm9kZXMhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBhY3RpdmF0aW9uO1xyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGFjdGl2YXRpb24gPSB0aGlzLm5vZGVzW2ldLmFjdGl2YXRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWN0aXZhdGlvbiA9IHRoaXMubm9kZXNbaV0uYWN0aXZhdGUodmFsdWVbaV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YWx1ZXMucHVzaChhY3RpdmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFByb3BhZ2F0ZXMgYWxsIHRoZSBub2RlIGluIHRoZSBncm91cFxyXG4gICAqL1xyXG4gIHByb3BhZ2F0ZTogZnVuY3Rpb24gKHJhdGUsIG1vbWVudHVtLCB0YXJnZXQpIHtcclxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSAndW5kZWZpbmVkJyAmJiB0YXJnZXQubGVuZ3RoICE9PSB0aGlzLm5vZGVzLmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FycmF5IHdpdGggdmFsdWVzIHNob3VsZCBiZSBzYW1lIGFzIHRoZSBhbW91bnQgb2Ygbm9kZXMhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IHRoaXMubm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tpXS5wcm9wYWdhdGUocmF0ZSwgbW9tZW50dW0sIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubm9kZXNbaV0ucHJvcGFnYXRlKHJhdGUsIG1vbWVudHVtLCB0cnVlLCB0YXJnZXRbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29ubmVjdHMgdGhlIG5vZGVzIGluIHRoaXMgZ3JvdXAgdG8gbm9kZXMgaW4gYW5vdGhlciBncm91cCBvciBqdXN0IGEgbm9kZVxyXG4gICAqL1xyXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uICh0YXJnZXQsIG1ldGhvZCwgd2VpZ2h0KSB7XHJcbiAgICB2YXIgY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIHZhciBpLCBqO1xyXG4gICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEdyb3VwKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGlmICh0aGlzICE9PSB0YXJnZXQpIHtcclxuICAgICAgICAgIGlmIChjb25maWcud2FybmluZ3MpIGNvbnNvbGUud2FybignTm8gZ3JvdXAgY29ubmVjdGlvbiBzcGVjaWZpZWQsIHVzaW5nIEFMTF9UT19BTEwnKTtcclxuICAgICAgICAgIG1ldGhvZCA9IG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnLndhcm5pbmdzKSBjb25zb2xlLndhcm4oJ05vIGdyb3VwIGNvbm5lY3Rpb24gc3BlY2lmaWVkLCB1c2luZyBPTkVfVE9fT05FJyk7XHJcbiAgICAgICAgICBtZXRob2QgPSBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1ldGhvZCA9PT0gbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwgfHwgbWV0aG9kID09PSBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0VMU0UpIHtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IHRhcmdldC5ub2Rlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0VMU0UgJiYgdGhpcy5ub2Rlc1tpXSA9PT0gdGFyZ2V0Lm5vZGVzW2pdKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IGNvbm5lY3Rpb24gPSB0aGlzLm5vZGVzW2ldLmNvbm5lY3QodGFyZ2V0Lm5vZGVzW2pdLCB3ZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLm91dC5wdXNoKGNvbm5lY3Rpb25bMF0pO1xyXG4gICAgICAgICAgICB0YXJnZXQuY29ubmVjdGlvbnMuaW4ucHVzaChjb25uZWN0aW9uWzBdKTtcclxuICAgICAgICAgICAgY29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uWzBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORSkge1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGVzLmxlbmd0aCAhPT0gdGFyZ2V0Lm5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGcm9tIGFuZCBUbyBncm91cCBtdXN0IGJlIHRoZSBzYW1lIHNpemUhJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgbGV0IGNvbm5lY3Rpb24gPSB0aGlzLm5vZGVzW2ldLmNvbm5lY3QodGFyZ2V0Lm5vZGVzW2ldLCB3ZWlnaHQpO1xyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5zZWxmLnB1c2goY29ubmVjdGlvblswXSk7XHJcbiAgICAgICAgICBjb25uZWN0aW9ucy5wdXNoKGNvbm5lY3Rpb25bMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBMYXllcikge1xyXG4gICAgICBjb25uZWN0aW9ucyA9IHRhcmdldC5pbnB1dCh0aGlzLCBtZXRob2QsIHdlaWdodCk7XHJcbiAgICB9IGVsc2UgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29ubmVjdGlvbiA9IHRoaXMubm9kZXNbaV0uY29ubmVjdCh0YXJnZXQsIHdlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5vdXQucHVzaChjb25uZWN0aW9uWzBdKTtcclxuICAgICAgICBjb25uZWN0aW9ucy5wdXNoKGNvbm5lY3Rpb25bMF0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbm5lY3Rpb25zO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2Ugbm9kZXMgZnJvbSB0aGlzIGdyb3VwIGdhdGUgdGhlIGdpdmVuIGNvbm5lY3Rpb24ocylcclxuICAgKi9cclxuICBnYXRlOiBmdW5jdGlvbiAoY29ubmVjdGlvbnMsIG1ldGhvZCkge1xyXG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgR2F0aW5nLklOUFVULCBHYXRpbmcuT1VUUFVUJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbm5lY3Rpb25zKSkge1xyXG4gICAgICBjb25uZWN0aW9ucyA9IFtjb25uZWN0aW9uc107XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5vZGVzMSA9IFtdO1xyXG4gICAgdmFyIG5vZGVzMiA9IFtdO1xyXG5cclxuICAgIHZhciBpLCBqO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb25uZWN0aW9uID0gY29ubmVjdGlvbnNbaV07XHJcbiAgICAgIGlmICghbm9kZXMxLmluY2x1ZGVzKGNvbm5lY3Rpb24uZnJvbSkpIG5vZGVzMS5wdXNoKGNvbm5lY3Rpb24uZnJvbSk7XHJcbiAgICAgIGlmICghbm9kZXMyLmluY2x1ZGVzKGNvbm5lY3Rpb24udG8pKSBub2RlczIucHVzaChjb25uZWN0aW9uLnRvKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xyXG4gICAgICBjYXNlIG1ldGhvZHMuZ2F0aW5nLklOUFVUOlxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBub2RlczIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBub2RlID0gbm9kZXMyW2ldO1xyXG4gICAgICAgICAgbGV0IGdhdGVyID0gdGhpcy5ub2Rlc1tpICUgdGhpcy5ub2Rlcy5sZW5ndGhdO1xyXG5cclxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBub2RlLmNvbm5lY3Rpb25zLmluLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25uID0gbm9kZS5jb25uZWN0aW9ucy5pbltqXTtcclxuICAgICAgICAgICAgaWYgKGNvbm5lY3Rpb25zLmluY2x1ZGVzKGNvbm4pKSB7XHJcbiAgICAgICAgICAgICAgZ2F0ZXIuZ2F0ZShjb25uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBtZXRob2RzLmdhdGluZy5PVVRQVVQ6XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5vZGVzMS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgbGV0IG5vZGUgPSBub2RlczFbaV07XHJcbiAgICAgICAgICBsZXQgZ2F0ZXIgPSB0aGlzLm5vZGVzW2kgJSB0aGlzLm5vZGVzLmxlbmd0aF07XHJcblxyXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IG5vZGUuY29ubmVjdGlvbnMub3V0Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25uID0gbm9kZS5jb25uZWN0aW9ucy5vdXRbal07XHJcbiAgICAgICAgICAgIGlmIChjb25uZWN0aW9ucy5pbmNsdWRlcyhjb25uKSkge1xyXG4gICAgICAgICAgICAgIGdhdGVyLmdhdGUoY29ubik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbWV0aG9kcy5nYXRpbmcuU0VMRjpcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZXMxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgbm9kZSA9IG5vZGVzMVtpXTtcclxuICAgICAgICAgIGxldCBnYXRlciA9IHRoaXMubm9kZXNbaSAlIHRoaXMubm9kZXMubGVuZ3RoXTtcclxuXHJcbiAgICAgICAgICBpZiAoY29ubmVjdGlvbnMuaW5jbHVkZXMobm9kZS5jb25uZWN0aW9ucy5zZWxmKSkge1xyXG4gICAgICAgICAgICBnYXRlci5nYXRlKG5vZGUuY29ubmVjdGlvbnMuc2VsZik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgZm9yIGV2ZXJ5IG5vZGVcclxuICAgKi9cclxuICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZXMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlcy5iaWFzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMubm9kZXNbaV0uYmlhcyA9IHZhbHVlcy5iaWFzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm5vZGVzW2ldLnNxdWFzaCA9IHZhbHVlcy5zcXVhc2ggfHwgdGhpcy5ub2Rlc1tpXS5zcXVhc2g7XHJcbiAgICAgIHRoaXMubm9kZXNbaV0udHlwZSA9IHZhbHVlcy50eXBlIHx8IHRoaXMubm9kZXNbaV0udHlwZTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBEaXNjb25uZWN0cyBhbGwgbm9kZXMgZnJvbSB0aGlzIGdyb3VwIGZyb20gYW5vdGhlciBnaXZlbiBncm91cC9ub2RlXHJcbiAgICovXHJcbiAgZGlzY29ubmVjdDogZnVuY3Rpb24gKHRhcmdldCwgdHdvc2lkZWQpIHtcclxuICAgIHR3b3NpZGVkID0gdHdvc2lkZWQgfHwgZmFsc2U7XHJcblxyXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgZGlzY29ubmVjdCB3aWxsIHJldHVybiBhIGNvbm5lY3Rpb24gc28gaW5kZXhPZiBjYW4gYmUgdXNlZFxyXG4gICAgdmFyIGksIGosIGs7XHJcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgR3JvdXApIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGFyZ2V0Lm5vZGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICB0aGlzLm5vZGVzW2ldLmRpc2Nvbm5lY3QodGFyZ2V0Lm5vZGVzW2pdLCB0d29zaWRlZCk7XHJcblxyXG4gICAgICAgICAgZm9yIChrID0gdGhpcy5jb25uZWN0aW9ucy5vdXQubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcclxuICAgICAgICAgICAgbGV0IGNvbm4gPSB0aGlzLmNvbm5lY3Rpb25zLm91dFtrXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb25uLmZyb20gPT09IHRoaXMubm9kZXNbaV0gJiYgY29ubi50byA9PT0gdGFyZ2V0Lm5vZGVzW2pdKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5vdXQuc3BsaWNlKGssIDEpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHR3b3NpZGVkKSB7XHJcbiAgICAgICAgICAgIGZvciAoayA9IHRoaXMuY29ubmVjdGlvbnMuaW4ubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcclxuICAgICAgICAgICAgICBsZXQgY29ubiA9IHRoaXMuY29ubmVjdGlvbnMuaW5ba107XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjb25uLmZyb20gPT09IHRhcmdldC5ub2Rlc1tqXSAmJiBjb25uLnRvID09PSB0aGlzLm5vZGVzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmluLnNwbGljZShrLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tpXS5kaXNjb25uZWN0KHRhcmdldCwgdHdvc2lkZWQpO1xyXG5cclxuICAgICAgICBmb3IgKGogPSB0aGlzLmNvbm5lY3Rpb25zLm91dC5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xyXG4gICAgICAgICAgbGV0IGNvbm4gPSB0aGlzLmNvbm5lY3Rpb25zLm91dFtqXTtcclxuXHJcbiAgICAgICAgICBpZiAoY29ubi5mcm9tID09PSB0aGlzLm5vZGVzW2ldICYmIGNvbm4udG8gPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLm91dC5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR3b3NpZGVkKSB7XHJcbiAgICAgICAgICBmb3IgKGogPSB0aGlzLmNvbm5lY3Rpb25zLmluLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uID0gdGhpcy5jb25uZWN0aW9ucy5pbltqXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb25uLmZyb20gPT09IHRhcmdldCAmJiBjb25uLnRvID09PSB0aGlzLm5vZGVzW2ldKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5pbi5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDbGVhciB0aGUgY29udGV4dCBvZiB0aGlzIGdyb3VwXHJcbiAgICovXHJcbiAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLm5vZGVzW2ldLmNsZWFyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG4iLCIvKiBFeHBvcnQgKi9cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllcjtcclxuXHJcbi8qIEltcG9ydCAqL1xyXG52YXIgbWV0aG9kcyA9IHJlcXVpcmUoJy4uL21ldGhvZHMvbWV0aG9kcycpO1xyXG52YXIgR3JvdXAgPSByZXF1aXJlKCcuL2dyb3VwJyk7XHJcbnZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdyb3VwXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5mdW5jdGlvbiBMYXllciAoKSB7XHJcbiAgdGhpcy5vdXRwdXQgPSBudWxsO1xyXG5cclxuICB0aGlzLm5vZGVzID0gW107XHJcbiAgdGhpcy5jb25uZWN0aW9ucyA9IHsgaW46IFtdLFxyXG4gICAgb3V0OiBbXSxcclxuICAgIHNlbGY6IFtdXHJcbiAgfTtcclxufVxyXG5cclxuTGF5ZXIucHJvdG90eXBlID0ge1xyXG4gIC8qKlxyXG4gICAqIEFjdGl2YXRlcyBhbGwgdGhlIG5vZGVzIGluIHRoZSBncm91cFxyXG4gICAqL1xyXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIHZhciB2YWx1ZXMgPSBbXTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZS5sZW5ndGggIT09IHRoaXMubm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJyYXkgd2l0aCB2YWx1ZXMgc2hvdWxkIGJlIHNhbWUgYXMgdGhlIGFtb3VudCBvZiBub2RlcyEnKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGFjdGl2YXRpb247XHJcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgYWN0aXZhdGlvbiA9IHRoaXMubm9kZXNbaV0uYWN0aXZhdGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhY3RpdmF0aW9uID0gdGhpcy5ub2Rlc1tpXS5hY3RpdmF0ZSh2YWx1ZVtpXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhbHVlcy5wdXNoKGFjdGl2YXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUHJvcGFnYXRlcyBhbGwgdGhlIG5vZGUgaW4gdGhlIGdyb3VwXHJcbiAgICovXHJcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbiAocmF0ZSwgbW9tZW50dW0sIHRhcmdldCkge1xyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICd1bmRlZmluZWQnICYmIHRhcmdldC5sZW5ndGggIT09IHRoaXMubm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJyYXkgd2l0aCB2YWx1ZXMgc2hvdWxkIGJlIHNhbWUgYXMgdGhlIGFtb3VudCBvZiBub2RlcyEnKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpID0gdGhpcy5ub2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLm5vZGVzW2ldLnByb3BhZ2F0ZShyYXRlLCBtb21lbnR1bSwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tpXS5wcm9wYWdhdGUocmF0ZSwgbW9tZW50dW0sIHRydWUsIHRhcmdldFtpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDb25uZWN0cyB0aGUgbm9kZXMgaW4gdGhpcyBncm91cCB0byBub2RlcyBpbiBhbm90aGVyIGdyb3VwIG9yIGp1c3QgYSBub2RlXHJcbiAgICovXHJcbiAgY29ubmVjdDogZnVuY3Rpb24gKHRhcmdldCwgbWV0aG9kLCB3ZWlnaHQpIHtcclxuICAgIHZhciBjb25uZWN0aW9ucztcclxuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBHcm91cCB8fCB0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSB7XHJcbiAgICAgIGNvbm5lY3Rpb25zID0gdGhpcy5vdXRwdXQuY29ubmVjdCh0YXJnZXQsIG1ldGhvZCwgd2VpZ2h0KTtcclxuICAgIH0gZWxzZSBpZiAodGFyZ2V0IGluc3RhbmNlb2YgTGF5ZXIpIHtcclxuICAgICAgY29ubmVjdGlvbnMgPSB0YXJnZXQuaW5wdXQodGhpcywgbWV0aG9kLCB3ZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb25uZWN0aW9ucztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIG5vZGVzIGZyb20gdGhpcyBncm91cCBnYXRlIHRoZSBnaXZlbiBjb25uZWN0aW9uKHMpXHJcbiAgICovXHJcbiAgZ2F0ZTogZnVuY3Rpb24gKGNvbm5lY3Rpb25zLCBtZXRob2QpIHtcclxuICAgIHRoaXMub3V0cHV0LmdhdGUoY29ubmVjdGlvbnMsIG1ldGhvZCk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBmb3IgZXZlcnkgbm9kZVxyXG4gICAqL1xyXG4gIHNldDogZnVuY3Rpb24gKHZhbHVlcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuXHJcbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgTm9kZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVzLmJpYXMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBub2RlLmJpYXMgPSB2YWx1ZXMuYmlhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5vZGUuc3F1YXNoID0gdmFsdWVzLnNxdWFzaCB8fCBub2RlLnNxdWFzaDtcclxuICAgICAgICBub2RlLnR5cGUgPSB2YWx1ZXMudHlwZSB8fCBub2RlLnR5cGU7XHJcbiAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEdyb3VwKSB7XHJcbiAgICAgICAgbm9kZS5zZXQodmFsdWVzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIERpc2Nvbm5lY3RzIGFsbCBub2RlcyBmcm9tIHRoaXMgZ3JvdXAgZnJvbSBhbm90aGVyIGdpdmVuIGdyb3VwL25vZGVcclxuICAgKi9cclxuICBkaXNjb25uZWN0OiBmdW5jdGlvbiAodGFyZ2V0LCB0d29zaWRlZCkge1xyXG4gICAgdHdvc2lkZWQgPSB0d29zaWRlZCB8fCBmYWxzZTtcclxuXHJcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBkaXNjb25uZWN0IHdpbGwgcmV0dXJuIGEgY29ubmVjdGlvbiBzbyBpbmRleE9mIGNhbiBiZSB1c2VkXHJcbiAgICB2YXIgaSwgaiwgaztcclxuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBHcm91cCkge1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0YXJnZXQubm9kZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIHRoaXMubm9kZXNbaV0uZGlzY29ubmVjdCh0YXJnZXQubm9kZXNbal0sIHR3b3NpZGVkKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGsgPSB0aGlzLmNvbm5lY3Rpb25zLm91dC5sZW5ndGggLSAxOyBrID49IDA7IGstLSkge1xyXG4gICAgICAgICAgICBsZXQgY29ubiA9IHRoaXMuY29ubmVjdGlvbnMub3V0W2tdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbm4uZnJvbSA9PT0gdGhpcy5ub2Rlc1tpXSAmJiBjb25uLnRvID09PSB0YXJnZXQubm9kZXNbal0pIHtcclxuICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLm91dC5zcGxpY2UoaywgMSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodHdvc2lkZWQpIHtcclxuICAgICAgICAgICAgZm9yIChrID0gdGhpcy5jb25uZWN0aW9ucy5pbi5sZW5ndGggLSAxOyBrID49IDA7IGstLSkge1xyXG4gICAgICAgICAgICAgIGxldCBjb25uID0gdGhpcy5jb25uZWN0aW9ucy5pbltrXTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNvbm4uZnJvbSA9PT0gdGFyZ2V0Lm5vZGVzW2pdICYmIGNvbm4udG8gPT09IHRoaXMubm9kZXNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMuaW4uc3BsaWNlKGssIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLm5vZGVzW2ldLmRpc2Nvbm5lY3QodGFyZ2V0LCB0d29zaWRlZCk7XHJcblxyXG4gICAgICAgIGZvciAoaiA9IHRoaXMuY29ubmVjdGlvbnMub3V0Lmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XHJcbiAgICAgICAgICBsZXQgY29ubiA9IHRoaXMuY29ubmVjdGlvbnMub3V0W2pdO1xyXG5cclxuICAgICAgICAgIGlmIChjb25uLmZyb20gPT09IHRoaXMubm9kZXNbaV0gJiYgY29ubi50byA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMub3V0LnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHdvc2lkZWQpIHtcclxuICAgICAgICAgIGZvciAoayA9IHRoaXMuY29ubmVjdGlvbnMuaW4ubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcclxuICAgICAgICAgICAgbGV0IGNvbm4gPSB0aGlzLmNvbm5lY3Rpb25zLmluW2tdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbm4uZnJvbSA9PT0gdGFyZ2V0ICYmIGNvbm4udG8gPT09IHRoaXMubm9kZXNbaV0pIHtcclxuICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmluLnNwbGljZShrLCAxKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIHRoZSBjb250ZXh0IG9mIHRoaXMgZ3JvdXBcclxuICAgKi9cclxuICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMubm9kZXNbaV0uY2xlYXIoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5MYXllci5EZW5zZSA9IGZ1bmN0aW9uIChzaXplKSB7XHJcbiAgLy8gQ3JlYXRlIHRoZSBsYXllclxyXG4gIHZhciBsYXllciA9IG5ldyBMYXllcigpO1xyXG5cclxuICAvLyBJbml0IHJlcXVpcmVkIG5vZGVzIChpbiBhY3RpdmF0aW9uIG9yZGVyKVxyXG4gIHZhciBibG9jayA9IG5ldyBHcm91cChzaXplKTtcclxuXHJcbiAgbGF5ZXIubm9kZXMucHVzaChibG9jayk7XHJcbiAgbGF5ZXIub3V0cHV0ID0gYmxvY2s7XHJcblxyXG4gIGxheWVyLmlucHV0ID0gZnVuY3Rpb24gKGZyb20sIG1ldGhvZCwgd2VpZ2h0KSB7XHJcbiAgICBpZiAoZnJvbSBpbnN0YW5jZW9mIExheWVyKSBmcm9tID0gZnJvbS5vdXRwdXQ7XHJcbiAgICBtZXRob2QgPSBtZXRob2QgfHwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEw7XHJcbiAgICByZXR1cm4gZnJvbS5jb25uZWN0KGJsb2NrLCBtZXRob2QsIHdlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxheWVyO1xyXG59O1xyXG5cclxuTGF5ZXIuTFNUTSA9IGZ1bmN0aW9uIChzaXplKSB7XHJcbiAgLy8gQ3JlYXRlIHRoZSBsYXllclxyXG4gIHZhciBsYXllciA9IG5ldyBMYXllcigpO1xyXG5cclxuICAvLyBJbml0IHJlcXVpcmVkIG5vZGVzIChpbiBhY3RpdmF0aW9uIG9yZGVyKVxyXG4gIHZhciBpbnB1dEdhdGUgPSBuZXcgR3JvdXAoc2l6ZSk7XHJcbiAgdmFyIGZvcmdldEdhdGUgPSBuZXcgR3JvdXAoc2l6ZSk7XHJcbiAgdmFyIG1lbW9yeUNlbGwgPSBuZXcgR3JvdXAoc2l6ZSk7XHJcbiAgdmFyIG91dHB1dEdhdGUgPSBuZXcgR3JvdXAoc2l6ZSk7XHJcbiAgdmFyIG91dHB1dEJsb2NrID0gbmV3IEdyb3VwKHNpemUpO1xyXG5cclxuICBpbnB1dEdhdGUuc2V0KHtcclxuICAgIGJpYXM6IDFcclxuICB9KTtcclxuICBmb3JnZXRHYXRlLnNldCh7XHJcbiAgICBiaWFzOiAxXHJcbiAgfSk7XHJcbiAgb3V0cHV0R2F0ZS5zZXQoe1xyXG4gICAgYmlhczogMVxyXG4gIH0pO1xyXG5cclxuICAvLyBTZXQgdXAgaW50ZXJuYWwgY29ubmVjdGlvbnNcclxuICBtZW1vcnlDZWxsLmNvbm5lY3QoaW5wdXRHYXRlLCBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0FMTCk7XHJcbiAgbWVtb3J5Q2VsbC5jb25uZWN0KGZvcmdldEdhdGUsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuICBtZW1vcnlDZWxsLmNvbm5lY3Qob3V0cHV0R2F0ZSwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG4gIHZhciBmb3JnZXQgPSBtZW1vcnlDZWxsLmNvbm5lY3QobWVtb3J5Q2VsbCwgbWV0aG9kcy5jb25uZWN0aW9uLk9ORV9UT19PTkUpO1xyXG4gIHZhciBvdXRwdXQgPSBtZW1vcnlDZWxsLmNvbm5lY3Qob3V0cHV0QmxvY2ssIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuXHJcbiAgLy8gU2V0IHVwIGdhdGVzXHJcbiAgZm9yZ2V0R2F0ZS5nYXRlKGZvcmdldCwgbWV0aG9kcy5nYXRpbmcuU0VMRik7XHJcbiAgb3V0cHV0R2F0ZS5nYXRlKG91dHB1dCwgbWV0aG9kcy5nYXRpbmcuT1VUUFVUKTtcclxuXHJcbiAgLy8gQWRkIHRvIG5vZGVzIGFycmF5XHJcbiAgbGF5ZXIubm9kZXMgPSBbaW5wdXRHYXRlLCBmb3JnZXRHYXRlLCBtZW1vcnlDZWxsLCBvdXRwdXRHYXRlLCBvdXRwdXRCbG9ja107XHJcblxyXG4gIC8vIERlZmluZSBvdXRwdXRcclxuICBsYXllci5vdXRwdXQgPSBvdXRwdXRCbG9jaztcclxuXHJcbiAgbGF5ZXIuaW5wdXQgPSBmdW5jdGlvbiAoZnJvbSwgbWV0aG9kLCB3ZWlnaHQpIHtcclxuICAgIGlmIChmcm9tIGluc3RhbmNlb2YgTGF5ZXIpIGZyb20gPSBmcm9tLm91dHB1dDtcclxuICAgIG1ldGhvZCA9IG1ldGhvZCB8fCBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0FMTDtcclxuICAgIHZhciBjb25uZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIHZhciBpbnB1dCA9IGZyb20uY29ubmVjdChtZW1vcnlDZWxsLCBtZXRob2QsIHdlaWdodCk7XHJcbiAgICBjb25uZWN0aW9ucyA9IGNvbm5lY3Rpb25zLmNvbmNhdChpbnB1dCk7XHJcblxyXG4gICAgY29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucy5jb25jYXQoZnJvbS5jb25uZWN0KGlucHV0R2F0ZSwgbWV0aG9kLCB3ZWlnaHQpKTtcclxuICAgIGNvbm5lY3Rpb25zID0gY29ubmVjdGlvbnMuY29uY2F0KGZyb20uY29ubmVjdChvdXRwdXRHYXRlLCBtZXRob2QsIHdlaWdodCkpO1xyXG4gICAgY29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucy5jb25jYXQoZnJvbS5jb25uZWN0KGZvcmdldEdhdGUsIG1ldGhvZCwgd2VpZ2h0KSk7XHJcblxyXG4gICAgaW5wdXRHYXRlLmdhdGUoaW5wdXQsIG1ldGhvZHMuZ2F0aW5nLklOUFVUKTtcclxuXHJcbiAgICByZXR1cm4gY29ubmVjdGlvbnM7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxheWVyO1xyXG59O1xyXG5cclxuTGF5ZXIuR1JVID0gZnVuY3Rpb24gKHNpemUpIHtcclxuICAvLyBDcmVhdGUgdGhlIGxheWVyXHJcbiAgdmFyIGxheWVyID0gbmV3IExheWVyKCk7XHJcblxyXG4gIHZhciB1cGRhdGVHYXRlID0gbmV3IEdyb3VwKHNpemUpO1xyXG4gIHZhciBpbnZlcnNlVXBkYXRlR2F0ZSA9IG5ldyBHcm91cChzaXplKTtcclxuICB2YXIgcmVzZXRHYXRlID0gbmV3IEdyb3VwKHNpemUpO1xyXG4gIHZhciBtZW1vcnlDZWxsID0gbmV3IEdyb3VwKHNpemUpO1xyXG4gIHZhciBvdXRwdXQgPSBuZXcgR3JvdXAoc2l6ZSk7XHJcbiAgdmFyIHByZXZpb3VzT3V0cHV0ID0gbmV3IEdyb3VwKHNpemUpO1xyXG5cclxuICBwcmV2aW91c091dHB1dC5zZXQoe1xyXG4gICAgYmlhczogMCxcclxuICAgIHNxdWFzaDogbWV0aG9kcy5hY3RpdmF0aW9uLklERU5USVRZLFxyXG4gICAgdHlwZTogJ2NvbnN0YW50J1xyXG4gIH0pO1xyXG4gIG1lbW9yeUNlbGwuc2V0KHtcclxuICAgIHNxdWFzaDogbWV0aG9kcy5hY3RpdmF0aW9uLlRBTkhcclxuICB9KTtcclxuICBpbnZlcnNlVXBkYXRlR2F0ZS5zZXQoe1xyXG4gICAgYmlhczogMCxcclxuICAgIHNxdWFzaDogbWV0aG9kcy5hY3RpdmF0aW9uLklOVkVSU0UsXHJcbiAgICB0eXBlOiAnY29uc3RhbnQnXHJcbiAgfSk7XHJcbiAgdXBkYXRlR2F0ZS5zZXQoe1xyXG4gICAgYmlhczogMVxyXG4gIH0pO1xyXG4gIHJlc2V0R2F0ZS5zZXQoe1xyXG4gICAgYmlhczogMFxyXG4gIH0pO1xyXG5cclxuICAvLyBVcGRhdGUgZ2F0ZSBjYWxjdWxhdGlvblxyXG4gIHByZXZpb3VzT3V0cHV0LmNvbm5lY3QodXBkYXRlR2F0ZSwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG5cclxuICAvLyBJbnZlcnNlIHVwZGF0ZSBnYXRlIGNhbGN1bGF0aW9uXHJcbiAgdXBkYXRlR2F0ZS5jb25uZWN0KGludmVyc2VVcGRhdGVHYXRlLCBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORSwgMSk7XHJcblxyXG4gIC8vIFJlc2V0IGdhdGUgY2FsY3VsYXRpb25cclxuICBwcmV2aW91c091dHB1dC5jb25uZWN0KHJlc2V0R2F0ZSwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG5cclxuICAvLyBNZW1vcnkgY2FsY3VsYXRpb25cclxuICB2YXIgcmVzZXQgPSBwcmV2aW91c091dHB1dC5jb25uZWN0KG1lbW9yeUNlbGwsIG1ldGhvZHMuY29ubmVjdGlvbi5BTExfVE9fQUxMKTtcclxuXHJcbiAgcmVzZXRHYXRlLmdhdGUocmVzZXQsIG1ldGhvZHMuZ2F0aW5nLk9VVFBVVCk7IC8vIGdhdGVcclxuXHJcbiAgLy8gT3V0cHV0IGNhbGN1bGF0aW9uXHJcbiAgdmFyIHVwZGF0ZTEgPSBwcmV2aW91c091dHB1dC5jb25uZWN0KG91dHB1dCwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG4gIHZhciB1cGRhdGUyID0gbWVtb3J5Q2VsbC5jb25uZWN0KG91dHB1dCwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEwpO1xyXG5cclxuICB1cGRhdGVHYXRlLmdhdGUodXBkYXRlMSwgbWV0aG9kcy5nYXRpbmcuT1VUUFVUKTtcclxuICBpbnZlcnNlVXBkYXRlR2F0ZS5nYXRlKHVwZGF0ZTIsIG1ldGhvZHMuZ2F0aW5nLk9VVFBVVCk7XHJcblxyXG4gIC8vIFByZXZpb3VzIG91dHB1dCBjYWxjdWxhdGlvblxyXG4gIG91dHB1dC5jb25uZWN0KHByZXZpb3VzT3V0cHV0LCBtZXRob2RzLmNvbm5lY3Rpb24uT05FX1RPX09ORSwgMSk7XHJcblxyXG4gIC8vIEFkZCB0byBub2RlcyBhcnJheVxyXG4gIGxheWVyLm5vZGVzID0gW3VwZGF0ZUdhdGUsIGludmVyc2VVcGRhdGVHYXRlLCByZXNldEdhdGUsIG1lbW9yeUNlbGwsIG91dHB1dCwgcHJldmlvdXNPdXRwdXRdO1xyXG5cclxuICBsYXllci5vdXRwdXQgPSBvdXRwdXQ7XHJcblxyXG4gIGxheWVyLmlucHV0ID0gZnVuY3Rpb24gKGZyb20sIG1ldGhvZCwgd2VpZ2h0KSB7XHJcbiAgICBpZiAoZnJvbSBpbnN0YW5jZW9mIExheWVyKSBmcm9tID0gZnJvbS5vdXRwdXQ7XHJcbiAgICBtZXRob2QgPSBtZXRob2QgfHwgbWV0aG9kcy5jb25uZWN0aW9uLkFMTF9UT19BTEw7XHJcbiAgICB2YXIgY29ubmVjdGlvbnMgPSBbXTtcclxuXHJcbiAgICBjb25uZWN0aW9ucyA9IGNvbm5lY3Rpb25zLmNvbmNhdChmcm9tLmNvbm5lY3QodXBkYXRlR2F0ZSwgbWV0aG9kLCB3ZWlnaHQpKTtcclxuICAgIGNvbm5lY3Rpb25zID0gY29ubmVjdGlvbnMuY29uY2F0KGZyb20uY29ubmVjdChyZXNldEdhdGUsIG1ldGhvZCwgd2VpZ2h0KSk7XHJcbiAgICBjb25uZWN0aW9ucyA9IGNvbm5lY3Rpb25zLmNvbmNhdChmcm9tLmNvbm5lY3QobWVtb3J5Q2VsbCwgbWV0aG9kLCB3ZWlnaHQpKTtcclxuXHJcbiAgICByZXR1cm4gY29ubmVjdGlvbnM7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxheWVyO1xyXG59O1xyXG5cclxuTGF5ZXIuTWVtb3J5ID0gZnVuY3Rpb24gKHNpemUsIG1lbW9yeSkge1xyXG4gIC8vIENyZWF0ZSB0aGUgbGF5ZXJcclxuICB2YXIgbGF5ZXIgPSBuZXcgTGF5ZXIoKTtcclxuICAvLyBCZWNhdXNlIHRoZSBvdXRwdXQgY2FuIG9ubHkgYmUgb25lIGdyb3VwLCB3ZSBoYXZlIHRvIHB1dCB0aGUgbm9kZXMgYWxsIGluIMOzbmUgZ3JvdXBcclxuXHJcbiAgdmFyIHByZXZpb3VzID0gbnVsbDtcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgbWVtb3J5OyBpKyspIHtcclxuICAgIHZhciBibG9jayA9IG5ldyBHcm91cChzaXplKTtcclxuXHJcbiAgICBibG9jay5zZXQoe1xyXG4gICAgICBzcXVhc2g6IG1ldGhvZHMuYWN0aXZhdGlvbi5JREVOVElUWSxcclxuICAgICAgYmlhczogMCxcclxuICAgICAgdHlwZTogJ2NvbnN0YW50J1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHByZXZpb3VzICE9IG51bGwpIHtcclxuICAgICAgcHJldmlvdXMuY29ubmVjdChibG9jaywgbWV0aG9kcy5jb25uZWN0aW9uLk9ORV9UT19PTkUsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxheWVyLm5vZGVzLnB1c2goYmxvY2spO1xyXG4gICAgcHJldmlvdXMgPSBibG9jaztcclxuICB9XHJcblxyXG4gIGxheWVyLm5vZGVzLnJldmVyc2UoKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGxheWVyLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsYXllci5ub2Rlc1tpXS5ub2Rlcy5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBCZWNhdXNlIG91dHB1dCBjYW4gb25seSBiZSDDs25lIGdyb3VwLCBmaXQgYWxsIG1lbW9yeSBub2RlcyBpbiDDs25lIGdyb3VwXHJcbiAgdmFyIG91dHB1dEdyb3VwID0gbmV3IEdyb3VwKDApO1xyXG4gIGZvciAodmFyIGdyb3VwIGluIGxheWVyLm5vZGVzKSB7XHJcbiAgICBvdXRwdXRHcm91cC5ub2RlcyA9IG91dHB1dEdyb3VwLm5vZGVzLmNvbmNhdChsYXllci5ub2Rlc1tncm91cF0ubm9kZXMpO1xyXG4gIH1cclxuICBsYXllci5vdXRwdXQgPSBvdXRwdXRHcm91cDtcclxuXHJcbiAgbGF5ZXIuaW5wdXQgPSBmdW5jdGlvbiAoZnJvbSwgbWV0aG9kLCB3ZWlnaHQpIHtcclxuICAgIGlmIChmcm9tIGluc3RhbmNlb2YgTGF5ZXIpIGZyb20gPSBmcm9tLm91dHB1dDtcclxuICAgIG1ldGhvZCA9IG1ldGhvZCB8fCBtZXRob2RzLmNvbm5lY3Rpb24uQUxMX1RPX0FMTDtcclxuXHJcbiAgICBpZiAoZnJvbS5ub2Rlcy5sZW5ndGggIT09IGxheWVyLm5vZGVzW2xheWVyLm5vZGVzLmxlbmd0aCAtIDFdLm5vZGVzLmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ByZXZpb3VzIGxheWVyIHNpemUgbXVzdCBiZSBzYW1lIGFzIG1lbW9yeSBzaXplJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZyb20uY29ubmVjdChsYXllci5ub2Rlc1tsYXllci5ub2Rlcy5sZW5ndGggLSAxXSwgbWV0aG9kcy5jb25uZWN0aW9uLk9ORV9UT19PTkUsIDEpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBsYXllcjtcclxufTtcclxuIiwiLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gTmV0d29yaztcclxuXHJcbi8qIEltcG9ydCAqL1xyXG52YXIgbXVsdGkgPSByZXF1aXJlKCcuLi9tdWx0aXRocmVhZGluZy9tdWx0aScpO1xyXG52YXIgbWV0aG9kcyA9IHJlcXVpcmUoJy4uL21ldGhvZHMvbWV0aG9kcycpO1xyXG52YXIgQ29ubmVjdGlvbiA9IHJlcXVpcmUoJy4vY29ubmVjdGlvbicpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyk7XHJcbnZhciBOZWF0ID0gcmVxdWlyZSgnLi4vbmVhdCcpO1xyXG52YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cclxuLyogRWFzaWVyIHZhcmlhYmxlIG5hbWluZyAqL1xyXG52YXIgbXV0YXRpb24gPSBtZXRob2RzLm11dGF0aW9uO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTkVUV09SS1xyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gTmV0d29yayAoaW5wdXQsIG91dHB1dCkge1xyXG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBvdXRwdXQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGlucHV0IG9yIG91dHB1dCBzaXplIGdpdmVuJyk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XHJcblxyXG4gIC8vIFN0b3JlIGFsbCB0aGUgbm9kZSBhbmQgY29ubmVjdGlvbiBnZW5lc1xyXG4gIHRoaXMubm9kZXMgPSBbXTsgLy8gU3RvcmVkIGluIGFjdGl2YXRpb24gb3JkZXJcclxuICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgdGhpcy5nYXRlcyA9IFtdO1xyXG4gIHRoaXMuc2VsZmNvbm5zID0gW107XHJcblxyXG4gIC8vIFJlZ3VsYXJpemF0aW9uXHJcbiAgdGhpcy5kcm9wb3V0ID0gMDtcclxuXHJcbiAgLy8gQ3JlYXRlIGlucHV0IGFuZCBvdXRwdXQgbm9kZXNcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5pbnB1dCArIHRoaXMub3V0cHV0OyBpKyspIHtcclxuICAgIHZhciB0eXBlID0gaSA8IHRoaXMuaW5wdXQgPyAnaW5wdXQnIDogJ291dHB1dCc7XHJcbiAgICB0aGlzLm5vZGVzLnB1c2gobmV3IE5vZGUodHlwZSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29ubmVjdCBpbnB1dCBub2RlcyB3aXRoIG91dHB1dCBub2RlcyBkaXJlY3RseVxyXG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLmlucHV0OyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSB0aGlzLmlucHV0OyBqIDwgdGhpcy5vdXRwdXQgKyB0aGlzLmlucHV0OyBqKyspIHtcclxuICAgICAgLy8gaHR0cHM6Ly9zdGF0cy5zdGFja2V4Y2hhbmdlLmNvbS9hLzI0ODA0MC8xNDc5MzFcclxuICAgICAgdmFyIHdlaWdodCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLmlucHV0ICogTWF0aC5zcXJ0KDIgLyB0aGlzLmlucHV0KTtcclxuICAgICAgdGhpcy5jb25uZWN0KHRoaXMubm9kZXNbaV0sIHRoaXMubm9kZXNbal0sIHdlaWdodCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5OZXR3b3JrLnByb3RvdHlwZSA9IHtcclxuICAvKipcclxuICAgKiBBY3RpdmF0ZXMgdGhlIG5ldHdvcmtcclxuICAgKi9cclxuICBhY3RpdmF0ZTogZnVuY3Rpb24gKGlucHV0LCB0cmFpbmluZykge1xyXG4gICAgdmFyIG91dHB1dCA9IFtdO1xyXG5cclxuICAgIC8vIEFjdGl2YXRlIG5vZGVzIGNocm9ub2xvZ2ljYWxseVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLm5vZGVzW2ldLnR5cGUgPT09ICdpbnB1dCcpIHtcclxuICAgICAgICB0aGlzLm5vZGVzW2ldLmFjdGl2YXRlKGlucHV0W2ldKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm5vZGVzW2ldLnR5cGUgPT09ICdvdXRwdXQnKSB7XHJcbiAgICAgICAgdmFyIGFjdGl2YXRpb24gPSB0aGlzLm5vZGVzW2ldLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgb3V0cHV0LnB1c2goYWN0aXZhdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRyYWluaW5nKSB0aGlzLm5vZGVzW2ldLm1hc2sgPSBNYXRoLnJhbmRvbSgpIDwgdGhpcy5kcm9wb3V0ID8gMCA6IDE7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tpXS5hY3RpdmF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBY3RpdmF0ZXMgdGhlIG5ldHdvcmsgd2l0aG91dCBjYWxjdWxhdGluZyBlbGVnaWJpbGl0eSB0cmFjZXMgYW5kIHN1Y2hcclxuICAgKi9cclxuICBub1RyYWNlQWN0aXZhdGU6IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgdmFyIG91dHB1dCA9IFtdO1xyXG5cclxuICAgIC8vIEFjdGl2YXRlIG5vZGVzIGNocm9ub2xvZ2ljYWxseVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLm5vZGVzW2ldLnR5cGUgPT09ICdpbnB1dCcpIHtcclxuICAgICAgICB0aGlzLm5vZGVzW2ldLm5vVHJhY2VBY3RpdmF0ZShpbnB1dFtpXSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ub2Rlc1tpXS50eXBlID09PSAnb3V0cHV0Jykge1xyXG4gICAgICAgIHZhciBhY3RpdmF0aW9uID0gdGhpcy5ub2Rlc1tpXS5ub1RyYWNlQWN0aXZhdGUoKTtcclxuICAgICAgICBvdXRwdXQucHVzaChhY3RpdmF0aW9uKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm5vZGVzW2ldLm5vVHJhY2VBY3RpdmF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBCYWNrcHJvcGFnYXRlIHRoZSBuZXR3b3JrXHJcbiAgICovXHJcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbiAocmF0ZSwgbW9tZW50dW0sIHVwZGF0ZSwgdGFyZ2V0KSB7XHJcbiAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgdGFyZ2V0Lmxlbmd0aCAhPT0gdGhpcy5vdXRwdXQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXRwdXQgdGFyZ2V0IGxlbmd0aCBzaG91bGQgbWF0Y2ggbmV0d29yayBvdXRwdXQgbGVuZ3RoJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHRhcmdldEluZGV4ID0gdGFyZ2V0Lmxlbmd0aDtcclxuXHJcbiAgICAvLyBQcm9wYWdhdGUgb3V0cHV0IG5vZGVzXHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSA9IHRoaXMubm9kZXMubGVuZ3RoIC0gMTsgaSA+PSB0aGlzLm5vZGVzLmxlbmd0aCAtIHRoaXMub3V0cHV0OyBpLS0pIHtcclxuICAgICAgdGhpcy5ub2Rlc1tpXS5wcm9wYWdhdGUocmF0ZSwgbW9tZW50dW0sIHVwZGF0ZSwgdGFyZ2V0Wy0tdGFyZ2V0SW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcm9wYWdhdGUgaGlkZGVuIGFuZCBpbnB1dCBub2Rlc1xyXG4gICAgZm9yIChpID0gdGhpcy5ub2Rlcy5sZW5ndGggLSB0aGlzLm91dHB1dCAtIDE7IGkgPj0gdGhpcy5pbnB1dDsgaS0tKSB7XHJcbiAgICAgIHRoaXMubm9kZXNbaV0ucHJvcGFnYXRlKHJhdGUsIG1vbWVudHVtLCB1cGRhdGUpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIHRoZSBjb250ZXh0IG9mIHRoZSBuZXR3b3JrXHJcbiAgICovXHJcbiAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLm5vZGVzW2ldLmNsZWFyKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29ubmVjdHMgdGhlIGZyb20gbm9kZSB0byB0aGUgdG8gbm9kZVxyXG4gICAqL1xyXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uIChmcm9tLCB0bywgd2VpZ2h0KSB7XHJcbiAgICB2YXIgY29ubmVjdGlvbnMgPSBmcm9tLmNvbm5lY3QodG8sIHdlaWdodCk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25uZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY29ubmVjdGlvbiA9IGNvbm5lY3Rpb25zW2ldO1xyXG4gICAgICBpZiAoZnJvbSAhPT0gdG8pIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2goY29ubmVjdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZWxmY29ubnMucHVzaChjb25uZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb25uZWN0aW9ucztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBEaXNjb25uZWN0cyB0aGUgZnJvbSBub2RlIGZyb20gdGhlIHRvIG5vZGVcclxuICAgKi9cclxuICBkaXNjb25uZWN0OiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcclxuICAgIC8vIERlbGV0ZSB0aGUgY29ubmVjdGlvbiBpbiB0aGUgbmV0d29yaydzIGNvbm5lY3Rpb24gYXJyYXlcclxuICAgIHZhciBjb25uZWN0aW9ucyA9IGZyb20gPT09IHRvID8gdGhpcy5zZWxmY29ubnMgOiB0aGlzLmNvbm5lY3Rpb25zO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNvbm5lY3Rpb24gPSBjb25uZWN0aW9uc1tpXTtcclxuICAgICAgaWYgKGNvbm5lY3Rpb24uZnJvbSA9PT0gZnJvbSAmJiBjb25uZWN0aW9uLnRvID09PSB0bykge1xyXG4gICAgICAgIGlmIChjb25uZWN0aW9uLmdhdGVyICE9PSBudWxsKSB0aGlzLnVuZ2F0ZShjb25uZWN0aW9uKTtcclxuICAgICAgICBjb25uZWN0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWxldGUgdGhlIGNvbm5lY3Rpb24gYXQgdGhlIHNlbmRpbmcgYW5kIHJlY2VpdmluZyBuZXVyb25cclxuICAgIGZyb20uZGlzY29ubmVjdCh0byk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogR2F0ZSBhIGNvbm5lY3Rpb24gd2l0aCBhIG5vZGVcclxuICAgKi9cclxuICBnYXRlOiBmdW5jdGlvbiAobm9kZSwgY29ubmVjdGlvbikge1xyXG4gICAgaWYgKHRoaXMubm9kZXMuaW5kZXhPZihub2RlKSA9PT0gLTEpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG5vZGUgaXMgbm90IHBhcnQgb2YgdGhlIG5ldHdvcmshJyk7XHJcbiAgICB9IGVsc2UgaWYgKGNvbm5lY3Rpb24uZ2F0ZXIgIT0gbnVsbCkge1xyXG4gICAgICBpZiAoY29uZmlnLndhcm5pbmdzKSBjb25zb2xlLndhcm4oJ1RoaXMgY29ubmVjdGlvbiBpcyBhbHJlYWR5IGdhdGVkIScpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBub2RlLmdhdGUoY29ubmVjdGlvbik7XHJcbiAgICB0aGlzLmdhdGVzLnB1c2goY29ubmVjdGlvbik7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogIFJlbW92ZSB0aGUgZ2F0ZSBvZiBhIGNvbm5lY3Rpb25cclxuICAgKi9cclxuICB1bmdhdGU6IGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XHJcbiAgICB2YXIgaW5kZXggPSB0aGlzLmdhdGVzLmluZGV4T2YoY29ubmVjdGlvbik7XHJcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBjb25uZWN0aW9uIGlzIG5vdCBnYXRlZCEnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdhdGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICBjb25uZWN0aW9uLmdhdGVyLnVuZ2F0ZShjb25uZWN0aW9uKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiAgUmVtb3ZlcyBhIG5vZGUgZnJvbSB0aGUgbmV0d29ya1xyXG4gICAqL1xyXG4gIHJlbW92ZTogZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIHZhciBpbmRleCA9IHRoaXMubm9kZXMuaW5kZXhPZihub2RlKTtcclxuXHJcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBub2RlIGRvZXMgbm90IGV4aXN0IGluIHRoZSBuZXR3b3JrIScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEtlZXAgdHJhY2sgb2YgZ2F0ZXJzXHJcbiAgICB2YXIgZ2F0ZXJzID0gW107XHJcblxyXG4gICAgLy8gUmVtb3ZlIHNlbGZjb25uZWN0aW9ucyBmcm9tIHRoaXMuc2VsZmNvbm5zXHJcbiAgICB0aGlzLmRpc2Nvbm5lY3Qobm9kZSwgbm9kZSk7XHJcblxyXG4gICAgLy8gR2V0IGFsbCBpdHMgaW5wdXR0aW5nIG5vZGVzXHJcbiAgICB2YXIgaW5wdXRzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gbm9kZS5jb25uZWN0aW9ucy5pbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBsZXQgY29ubmVjdGlvbiA9IG5vZGUuY29ubmVjdGlvbnMuaW5baV07XHJcbiAgICAgIGlmIChtdXRhdGlvbi5TVUJfTk9ERS5rZWVwX2dhdGVzICYmIGNvbm5lY3Rpb24uZ2F0ZXIgIT09IG51bGwgJiYgY29ubmVjdGlvbi5nYXRlciAhPT0gbm9kZSkge1xyXG4gICAgICAgIGdhdGVycy5wdXNoKGNvbm5lY3Rpb24uZ2F0ZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlucHV0cy5wdXNoKGNvbm5lY3Rpb24uZnJvbSk7XHJcbiAgICAgIHRoaXMuZGlzY29ubmVjdChjb25uZWN0aW9uLmZyb20sIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCBhbGwgaXRzIG91dHB1dGluZyBub2Rlc1xyXG4gICAgdmFyIG91dHB1dHMgPSBbXTtcclxuICAgIGZvciAoaSA9IG5vZGUuY29ubmVjdGlvbnMub3V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIGxldCBjb25uZWN0aW9uID0gbm9kZS5jb25uZWN0aW9ucy5vdXRbaV07XHJcbiAgICAgIGlmIChtdXRhdGlvbi5TVUJfTk9ERS5rZWVwX2dhdGVzICYmIGNvbm5lY3Rpb24uZ2F0ZXIgIT09IG51bGwgJiYgY29ubmVjdGlvbi5nYXRlciAhPT0gbm9kZSkge1xyXG4gICAgICAgIGdhdGVycy5wdXNoKGNvbm5lY3Rpb24uZ2F0ZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIG91dHB1dHMucHVzaChjb25uZWN0aW9uLnRvKTtcclxuICAgICAgdGhpcy5kaXNjb25uZWN0KG5vZGUsIGNvbm5lY3Rpb24udG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbm5lY3QgdGhlIGlucHV0IG5vZGVzIHRvIHRoZSBvdXRwdXQgbm9kZXMgKGlmIG5vdCBhbHJlYWR5IGNvbm5lY3RlZClcclxuICAgIHZhciBjb25uZWN0aW9ucyA9IFtdO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgaW5wdXQgPSBpbnB1dHNbaV07XHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb3V0cHV0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBvdXRwdXRzW2pdO1xyXG4gICAgICAgIGlmICghaW5wdXQuaXNQcm9qZWN0aW5nVG8ob3V0cHV0KSkge1xyXG4gICAgICAgICAgdmFyIGNvbm4gPSB0aGlzLmNvbm5lY3QoaW5wdXQsIG91dHB1dCk7XHJcbiAgICAgICAgICBjb25uZWN0aW9ucy5wdXNoKGNvbm5bMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEdhdGUgcmFuZG9tIGNvbm5lY3Rpb25zIHdpdGggZ2F0ZXJzXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZ2F0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChjb25uZWN0aW9ucy5sZW5ndGggPT09IDApIGJyZWFrO1xyXG5cclxuICAgICAgbGV0IGdhdGVyID0gZ2F0ZXJzW2ldO1xyXG4gICAgICBsZXQgY29ubkluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29ubmVjdGlvbnMubGVuZ3RoKTtcclxuXHJcbiAgICAgIHRoaXMuZ2F0ZShnYXRlciwgY29ubmVjdGlvbnNbY29ubkluZGV4XSk7XHJcbiAgICAgIGNvbm5lY3Rpb25zLnNwbGljZShjb25uSW5kZXgsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBnYXRlZCBjb25uZWN0aW9ucyBnYXRlZCBieSB0aGlzIG5vZGVcclxuICAgIGZvciAoaSA9IG5vZGUuY29ubmVjdGlvbnMuZ2F0ZWQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgbGV0IGNvbm4gPSBub2RlLmNvbm5lY3Rpb25zLmdhdGVkW2ldO1xyXG4gICAgICB0aGlzLnVuZ2F0ZShjb25uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgc2VsZmNvbm5lY3Rpb25cclxuICAgIHRoaXMuZGlzY29ubmVjdChub2RlLCBub2RlKTtcclxuXHJcbiAgICAvLyBSZW1vdmUgdGhlIG5vZGUgZnJvbSB0aGlzLm5vZGVzXHJcbiAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTXV0YXRlcyB0aGUgbmV0d29yayB3aXRoIHRoZSBnaXZlbiBtZXRob2RcclxuICAgKi9cclxuICBtdXRhdGU6IGZ1bmN0aW9uIChtZXRob2QpIHtcclxuICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIChjb3JyZWN0KSBtdXRhdGUgbWV0aG9kIGdpdmVuIScpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpLCBqO1xyXG4gICAgc3dpdGNoIChtZXRob2QpIHtcclxuICAgICAgY2FzZSBtdXRhdGlvbi5BRERfTk9ERTpcclxuICAgICAgICAvLyBMb29rIGZvciBhbiBleGlzdGluZyBjb25uZWN0aW9uIGFuZCBwbGFjZSBhIG5vZGUgaW4gYmV0d2VlblxyXG4gICAgICAgIHZhciBjb25uZWN0aW9uID0gdGhpcy5jb25uZWN0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbm5lY3Rpb25zLmxlbmd0aCldO1xyXG4gICAgICAgIHZhciBnYXRlciA9IGNvbm5lY3Rpb24uZ2F0ZXI7XHJcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0KGNvbm5lY3Rpb24uZnJvbSwgY29ubmVjdGlvbi50byk7XHJcblxyXG4gICAgICAgIC8vIEluc2VydCB0aGUgbmV3IG5vZGUgcmlnaHQgYmVmb3JlIHRoZSBvbGQgY29ubmVjdGlvbi50b1xyXG4gICAgICAgIHZhciB0b0luZGV4ID0gdGhpcy5ub2Rlcy5pbmRleE9mKGNvbm5lY3Rpb24udG8pO1xyXG4gICAgICAgIHZhciBub2RlID0gbmV3IE5vZGUoJ2hpZGRlbicpO1xyXG5cclxuICAgICAgICAvLyBSYW5kb20gc3F1YXNoIGZ1bmN0aW9uXHJcbiAgICAgICAgbm9kZS5tdXRhdGUobXV0YXRpb24uTU9EX0FDVElWQVRJT04pO1xyXG5cclxuICAgICAgICAvLyBQbGFjZSBpdCBpbiB0aGlzLm5vZGVzXHJcbiAgICAgICAgdmFyIG1pbkJvdW5kID0gTWF0aC5taW4odG9JbmRleCwgdGhpcy5ub2Rlcy5sZW5ndGggLSB0aGlzLm91dHB1dCk7XHJcbiAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UobWluQm91bmQsIDAsIG5vZGUpO1xyXG5cclxuICAgICAgICAvLyBOb3cgY3JlYXRlIHR3byBuZXcgY29ubmVjdGlvbnNcclxuICAgICAgICB2YXIgbmV3Q29ubjEgPSB0aGlzLmNvbm5lY3QoY29ubmVjdGlvbi5mcm9tLCBub2RlKVswXTtcclxuICAgICAgICB2YXIgbmV3Q29ubjIgPSB0aGlzLmNvbm5lY3Qobm9kZSwgY29ubmVjdGlvbi50bylbMF07XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBvcmlnaW5hbCBjb25uZWN0aW9uIHdhcyBnYXRlZFxyXG4gICAgICAgIGlmIChnYXRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLmdhdGUoZ2F0ZXIsIE1hdGgucmFuZG9tKCkgPj0gMC41ID8gbmV3Q29ubjEgOiBuZXdDb25uMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG11dGF0aW9uLlNVQl9OT0RFOlxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBub2RlcyBsZWZ0IHRvIHJlbW92ZVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVzLmxlbmd0aCA9PT0gdGhpcy5pbnB1dCArIHRoaXMub3V0cHV0KSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnLndhcm5pbmdzKSBjb25zb2xlLndhcm4oJ05vIG1vcmUgbm9kZXMgbGVmdCB0byByZW1vdmUhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNlbGVjdCBhIG5vZGUgd2hpY2ggaXNuJ3QgYW4gaW5wdXQgb3Igb3V0cHV0IG5vZGVcclxuICAgICAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5ub2Rlcy5sZW5ndGggLSB0aGlzLm91dHB1dCAtIHRoaXMuaW5wdXQpICsgdGhpcy5pbnB1dCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUodGhpcy5ub2Rlc1tpbmRleF0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG11dGF0aW9uLkFERF9DT05OOlxyXG4gICAgICAgIC8vIENyZWF0ZSBhbiBhcnJheSBvZiBhbGwgdW5jcmVhdGVkIChmZWVkZm9yd2FyZCkgY29ubmVjdGlvbnNcclxuICAgICAgICB2YXIgYXZhaWxhYmxlID0gW107XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoIC0gdGhpcy5vdXRwdXQ7IGkrKykge1xyXG4gICAgICAgICAgbGV0IG5vZGUxID0gdGhpcy5ub2Rlc1tpXTtcclxuICAgICAgICAgIGZvciAoaiA9IE1hdGgubWF4KGkgKyAxLCB0aGlzLmlucHV0KTsgaiA8IHRoaXMubm9kZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGUyID0gdGhpcy5ub2Rlc1tqXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlMS5pc1Byb2plY3RpbmdUbyhub2RlMikpIGF2YWlsYWJsZS5wdXNoKFtub2RlMSwgbm9kZTJdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhdmFpbGFibGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnLndhcm5pbmdzKSBjb25zb2xlLndhcm4oJ05vIG1vcmUgY29ubmVjdGlvbnMgdG8gYmUgbWFkZSEnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhaXIgPSBhdmFpbGFibGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXZhaWxhYmxlLmxlbmd0aCldO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdChwYWlyWzBdLCBwYWlyWzFdKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBtdXRhdGlvbi5TVUJfQ09OTjpcclxuICAgICAgICAvLyBMaXN0IG9mIHBvc3NpYmxlIGNvbm5lY3Rpb25zIHRoYXQgY2FuIGJlIHJlbW92ZWRcclxuICAgICAgICB2YXIgcG9zc2libGUgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBjb25uID0gdGhpcy5jb25uZWN0aW9uc1tpXTtcclxuICAgICAgICAgIC8vIENoZWNrIGlmIGl0IGlzIG5vdCBkaXNhYmxpbmcgYSBub2RlXHJcbiAgICAgICAgICBpZiAoY29ubi5mcm9tLmNvbm5lY3Rpb25zLm91dC5sZW5ndGggPiAxICYmIGNvbm4udG8uY29ubmVjdGlvbnMuaW4ubGVuZ3RoID4gMSAmJiB0aGlzLm5vZGVzLmluZGV4T2YoY29ubi50bykgPiB0aGlzLm5vZGVzLmluZGV4T2YoY29ubi5mcm9tKSkge1xyXG4gICAgICAgICAgICBwb3NzaWJsZS5wdXNoKGNvbm4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc3NpYmxlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBjb25uZWN0aW9ucyB0byByZW1vdmUhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByYW5kb21Db25uID0gcG9zc2libGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGUubGVuZ3RoKV07XHJcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0KHJhbmRvbUNvbm4uZnJvbSwgcmFuZG9tQ29ubi50byk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uTU9EX1dFSUdIVDpcclxuICAgICAgICB2YXIgYWxsY29ubmVjdGlvbnMgPSB0aGlzLmNvbm5lY3Rpb25zLmNvbmNhdCh0aGlzLnNlbGZjb25ucyk7XHJcblxyXG4gICAgICAgIHZhciBjb25uZWN0aW9uID0gYWxsY29ubmVjdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWxsY29ubmVjdGlvbnMubGVuZ3RoKV07XHJcbiAgICAgICAgdmFyIG1vZGlmaWNhdGlvbiA9IE1hdGgucmFuZG9tKCkgKiAobWV0aG9kLm1heCAtIG1ldGhvZC5taW4pICsgbWV0aG9kLm1pbjtcclxuICAgICAgICBjb25uZWN0aW9uLndlaWdodCArPSBtb2RpZmljYXRpb247XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uTU9EX0JJQVM6XHJcbiAgICAgICAgLy8gSGFzIG5vIGVmZmVjdCBvbiBpbnB1dCBub2RlLCBzbyB0aGV5IGFyZSBleGNsdWRlZFxyXG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLm5vZGVzLmxlbmd0aCAtIHRoaXMuaW5wdXQpICsgdGhpcy5pbnB1dCk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2luZGV4XTtcclxuICAgICAgICBub2RlLm11dGF0ZShtZXRob2QpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG11dGF0aW9uLk1PRF9BQ1RJVkFUSU9OOlxyXG4gICAgICAgIC8vIEhhcyBubyBlZmZlY3Qgb24gaW5wdXQgbm9kZSwgc28gdGhleSBhcmUgZXhjbHVkZWRcclxuICAgICAgICBpZiAoIW1ldGhvZC5tdXRhdGVPdXRwdXQgJiYgdGhpcy5pbnB1dCArIHRoaXMub3V0cHV0ID09PSB0aGlzLm5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBub2RlcyB0aGF0IGFsbG93IG11dGF0aW9uIG9mIGFjdGl2YXRpb24gZnVuY3Rpb24nKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMubm9kZXMubGVuZ3RoIC0gKG1ldGhvZC5tdXRhdGVPdXRwdXQgPyAwIDogdGhpcy5vdXRwdXQpIC0gdGhpcy5pbnB1dCkgKyB0aGlzLmlucHV0KTtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZXNbaW5kZXhdO1xyXG5cclxuICAgICAgICBub2RlLm11dGF0ZShtZXRob2QpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG11dGF0aW9uLkFERF9TRUxGX0NPTk46XHJcbiAgICAgICAgLy8gQ2hlY2sgd2hpY2ggbm9kZXMgYXJlbid0IHNlbGZjb25uZWN0ZWQgeWV0XHJcbiAgICAgICAgdmFyIHBvc3NpYmxlID0gW107XHJcbiAgICAgICAgZm9yIChpID0gdGhpcy5pbnB1dDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuICAgICAgICAgIGlmIChub2RlLmNvbm5lY3Rpb25zLnNlbGYud2VpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHBvc3NpYmxlLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocG9zc2libGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnLndhcm5pbmdzKSBjb25zb2xlLndhcm4oJ05vIG1vcmUgc2VsZi1jb25uZWN0aW9ucyB0byBhZGQhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNlbGVjdCBhIHJhbmRvbSBub2RlXHJcbiAgICAgICAgdmFyIG5vZGUgPSBwb3NzaWJsZVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZS5sZW5ndGgpXTtcclxuXHJcbiAgICAgICAgLy8gQ29ubmVjdCBpdCB0byBoaW1zZWxmXHJcbiAgICAgICAgdGhpcy5jb25uZWN0KG5vZGUsIG5vZGUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG11dGF0aW9uLlNVQl9TRUxGX0NPTk46XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZmNvbm5zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBtb3JlIHNlbGYtY29ubmVjdGlvbnMgdG8gcmVtb3ZlIScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb25uID0gdGhpcy5zZWxmY29ubnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zZWxmY29ubnMubGVuZ3RoKV07XHJcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0KGNvbm4uZnJvbSwgY29ubi50byk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uQUREX0dBVEU6XHJcbiAgICAgICAgdmFyIGFsbGNvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5jb25jYXQodGhpcy5zZWxmY29ubnMpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBsaXN0IG9mIGFsbCBub24tZ2F0ZWQgY29ubmVjdGlvbnNcclxuICAgICAgICB2YXIgcG9zc2libGUgPSBbXTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYWxsY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBjb25uID0gYWxsY29ubmVjdGlvbnNbaV07XHJcbiAgICAgICAgICBpZiAoY29ubi5nYXRlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBwb3NzaWJsZS5wdXNoKGNvbm4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc3NpYmxlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBtb3JlIGNvbm5lY3Rpb25zIHRvIGdhdGUhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNlbGVjdCBhIHJhbmRvbSBnYXRlciBub2RlIGFuZCBjb25uZWN0aW9uLCBjYW4ndCBiZSBnYXRlZCBieSBpbnB1dFxyXG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLm5vZGVzLmxlbmd0aCAtIHRoaXMuaW5wdXQpICsgdGhpcy5pbnB1dCk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2luZGV4XTtcclxuICAgICAgICB2YXIgY29ubiA9IHBvc3NpYmxlW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlLmxlbmd0aCldO1xyXG5cclxuICAgICAgICAvLyBHYXRlIHRoZSBjb25uZWN0aW9uIHdpdGggdGhlIG5vZGVcclxuICAgICAgICB0aGlzLmdhdGUobm9kZSwgY29ubik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uU1VCX0dBVEU6XHJcbiAgICAgICAgLy8gU2VsZWN0IGEgcmFuZG9tIGdhdGVkIGNvbm5lY3Rpb25cclxuICAgICAgICBpZiAodGhpcy5nYXRlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGlmIChjb25maWcud2FybmluZ3MpIGNvbnNvbGUud2FybignTm8gbW9yZSBjb25uZWN0aW9ucyB0byB1bmdhdGUhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2F0ZXMubGVuZ3RoKTtcclxuICAgICAgICB2YXIgZ2F0ZWRjb25uID0gdGhpcy5nYXRlc1tpbmRleF07XHJcblxyXG4gICAgICAgIHRoaXMudW5nYXRlKGdhdGVkY29ubik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uQUREX0JBQ0tfQ09OTjpcclxuICAgICAgICAvLyBDcmVhdGUgYW4gYXJyYXkgb2YgYWxsIHVuY3JlYXRlZCAoYmFja2ZlZCkgY29ubmVjdGlvbnNcclxuICAgICAgICB2YXIgYXZhaWxhYmxlID0gW107XHJcbiAgICAgICAgZm9yIChpID0gdGhpcy5pbnB1dDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBub2RlMSA9IHRoaXMubm9kZXNbaV07XHJcbiAgICAgICAgICBmb3IgKGogPSB0aGlzLmlucHV0OyBqIDwgaTsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlMiA9IHRoaXMubm9kZXNbal07XHJcbiAgICAgICAgICAgIGlmICghbm9kZTEuaXNQcm9qZWN0aW5nVG8obm9kZTIpKSBhdmFpbGFibGUucHVzaChbbm9kZTEsIG5vZGUyXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYXZhaWxhYmxlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBtb3JlIGNvbm5lY3Rpb25zIHRvIGJlIG1hZGUhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYWlyID0gYXZhaWxhYmxlW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGF2YWlsYWJsZS5sZW5ndGgpXTtcclxuICAgICAgICB0aGlzLmNvbm5lY3QocGFpclswXSwgcGFpclsxXSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uU1VCX0JBQ0tfQ09OTjpcclxuICAgICAgICAvLyBMaXN0IG9mIHBvc3NpYmxlIGNvbm5lY3Rpb25zIHRoYXQgY2FuIGJlIHJlbW92ZWRcclxuICAgICAgICB2YXIgcG9zc2libGUgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBjb25uID0gdGhpcy5jb25uZWN0aW9uc1tpXTtcclxuICAgICAgICAgIC8vIENoZWNrIGlmIGl0IGlzIG5vdCBkaXNhYmxpbmcgYSBub2RlXHJcbiAgICAgICAgICBpZiAoY29ubi5mcm9tLmNvbm5lY3Rpb25zLm91dC5sZW5ndGggPiAxICYmIGNvbm4udG8uY29ubmVjdGlvbnMuaW4ubGVuZ3RoID4gMSAmJiB0aGlzLm5vZGVzLmluZGV4T2YoY29ubi5mcm9tKSA+IHRoaXMubm9kZXMuaW5kZXhPZihjb25uLnRvKSkge1xyXG4gICAgICAgICAgICBwb3NzaWJsZS5wdXNoKGNvbm4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc3NpYmxlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBjb25uZWN0aW9ucyB0byByZW1vdmUhJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByYW5kb21Db25uID0gcG9zc2libGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGUubGVuZ3RoKV07XHJcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0KHJhbmRvbUNvbm4uZnJvbSwgcmFuZG9tQ29ubi50byk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbXV0YXRpb24uU1dBUF9OT0RFUzpcclxuICAgICAgICAvLyBIYXMgbm8gZWZmZWN0IG9uIGlucHV0IG5vZGUsIHNvIHRoZXkgYXJlIGV4Y2x1ZGVkXHJcbiAgICAgICAgaWYgKChtZXRob2QubXV0YXRlT3V0cHV0ICYmIHRoaXMubm9kZXMubGVuZ3RoIC0gdGhpcy5pbnB1dCA8IDIpIHx8XHJcbiAgICAgICAgICAoIW1ldGhvZC5tdXRhdGVPdXRwdXQgJiYgdGhpcy5ub2Rlcy5sZW5ndGggLSB0aGlzLmlucHV0IC0gdGhpcy5vdXRwdXQgPCAyKSkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdObyBub2RlcyB0aGF0IGFsbG93IHN3YXBwaW5nIG9mIGJpYXMgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb24nKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMubm9kZXMubGVuZ3RoIC0gKG1ldGhvZC5tdXRhdGVPdXRwdXQgPyAwIDogdGhpcy5vdXRwdXQpIC0gdGhpcy5pbnB1dCkgKyB0aGlzLmlucHV0KTtcclxuICAgICAgICB2YXIgbm9kZTEgPSB0aGlzLm5vZGVzW2luZGV4XTtcclxuICAgICAgICBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLm5vZGVzLmxlbmd0aCAtIChtZXRob2QubXV0YXRlT3V0cHV0ID8gMCA6IHRoaXMub3V0cHV0KSAtIHRoaXMuaW5wdXQpICsgdGhpcy5pbnB1dCk7XHJcbiAgICAgICAgdmFyIG5vZGUyID0gdGhpcy5ub2Rlc1tpbmRleF07XHJcblxyXG4gICAgICAgIHZhciBiaWFzVGVtcCA9IG5vZGUxLmJpYXM7XHJcbiAgICAgICAgdmFyIHNxdWFzaFRlbXAgPSBub2RlMS5zcXVhc2g7XHJcblxyXG4gICAgICAgIG5vZGUxLmJpYXMgPSBub2RlMi5iaWFzO1xyXG4gICAgICAgIG5vZGUxLnNxdWFzaCA9IG5vZGUyLnNxdWFzaDtcclxuICAgICAgICBub2RlMi5iaWFzID0gYmlhc1RlbXA7XHJcbiAgICAgICAgbm9kZTIuc3F1YXNoID0gc3F1YXNoVGVtcDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUcmFpbiB0aGUgZ2l2ZW4gc2V0IHRvIHRoaXMgbmV0d29ya1xyXG4gICAqL1xyXG4gIHRyYWluOiBmdW5jdGlvbiAoc2V0LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoc2V0WzBdLmlucHV0Lmxlbmd0aCAhPT0gdGhpcy5pbnB1dCB8fCBzZXRbMF0ub3V0cHV0Lmxlbmd0aCAhPT0gdGhpcy5vdXRwdXQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhc2V0IGlucHV0L291dHB1dCBzaXplIHNob3VsZCBiZSBzYW1lIGFzIG5ldHdvcmsgaW5wdXQvb3V0cHV0IHNpemUhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgLy8gV2FybmluZyBtZXNzYWdlc1xyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJhdGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGlmIChjb25maWcud2FybmluZ3MpIGNvbnNvbGUud2FybignVXNpbmcgZGVmYXVsdCBsZWFybmluZyByYXRlLCBwbGVhc2UgZGVmaW5lIGEgcmF0ZSEnKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5pdGVyYXRpb25zID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBpZiAoY29uZmlnLndhcm5pbmdzKSBjb25zb2xlLndhcm4oJ05vIHRhcmdldCBpdGVyYXRpb25zIGdpdmVuLCBydW5uaW5nIHVudGlsIGVycm9yIGlzIHJlYWNoZWQhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVhZCB0aGUgb3B0aW9uc1xyXG4gICAgdmFyIHRhcmdldEVycm9yID0gb3B0aW9ucy5lcnJvciB8fCAwLjA1O1xyXG4gICAgdmFyIGNvc3QgPSBvcHRpb25zLmNvc3QgfHwgbWV0aG9kcy5jb3N0Lk1TRTtcclxuICAgIHZhciBiYXNlUmF0ZSA9IG9wdGlvbnMucmF0ZSB8fCAwLjM7XHJcbiAgICB2YXIgZHJvcG91dCA9IG9wdGlvbnMuZHJvcG91dCB8fCAwO1xyXG4gICAgdmFyIG1vbWVudHVtID0gb3B0aW9ucy5tb21lbnR1bSB8fCAwO1xyXG4gICAgdmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuYmF0Y2hTaXplIHx8IDE7IC8vIG9ubGluZSBsZWFybmluZ1xyXG4gICAgdmFyIHJhdGVQb2xpY3kgPSBvcHRpb25zLnJhdGVQb2xpY3kgfHwgbWV0aG9kcy5yYXRlLkZJWEVEKCk7XHJcblxyXG4gICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICBpZiAoYmF0Y2hTaXplID4gc2V0Lmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhdGNoIHNpemUgbXVzdCBiZSBzbWFsbGVyIG9yIGVxdWFsIHRvIGRhdGFzZXQgbGVuZ3RoIScpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pdGVyYXRpb25zID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0aW9ucy5lcnJvciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgb2YgdGhlIGZvbGxvd2luZyBvcHRpb25zIG11c3QgYmUgc3BlY2lmaWVkOiBlcnJvciwgaXRlcmF0aW9ucycpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5lcnJvciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGFyZ2V0RXJyb3IgPSAtMTsgLy8gcnVuIHVudGlsIGl0ZXJhdGlvbnNcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaXRlcmF0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgb3B0aW9ucy5pdGVyYXRpb25zID0gMDsgLy8gcnVuIHVudGlsIHRhcmdldCBlcnJvclxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNhdmUgdG8gbmV0d29ya1xyXG4gICAgdGhpcy5kcm9wb3V0ID0gZHJvcG91dDtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5jcm9zc1ZhbGlkYXRlKSB7XHJcbiAgICAgIGxldCBudW1UcmFpbiA9IE1hdGguY2VpbCgoMSAtIG9wdGlvbnMuY3Jvc3NWYWxpZGF0ZS50ZXN0U2l6ZSkgKiBzZXQubGVuZ3RoKTtcclxuICAgICAgdmFyIHRyYWluU2V0ID0gc2V0LnNsaWNlKDAsIG51bVRyYWluKTtcclxuICAgICAgdmFyIHRlc3RTZXQgPSBzZXQuc2xpY2UobnVtVHJhaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExvb3BzIHRoZSB0cmFpbmluZyBwcm9jZXNzXHJcbiAgICB2YXIgY3VycmVudFJhdGUgPSBiYXNlUmF0ZTtcclxuICAgIHZhciBpdGVyYXRpb24gPSAwO1xyXG4gICAgdmFyIGVycm9yID0gMTtcclxuXHJcbiAgICB2YXIgaSwgaiwgeDtcclxuICAgIHdoaWxlIChlcnJvciA+IHRhcmdldEVycm9yICYmIChvcHRpb25zLml0ZXJhdGlvbnMgPT09IDAgfHwgaXRlcmF0aW9uIDwgb3B0aW9ucy5pdGVyYXRpb25zKSkge1xyXG4gICAgICBpZiAob3B0aW9ucy5jcm9zc1ZhbGlkYXRlICYmIGVycm9yIDw9IG9wdGlvbnMuY3Jvc3NWYWxpZGF0ZS50ZXN0RXJyb3IpIGJyZWFrO1xyXG5cclxuICAgICAgaXRlcmF0aW9uKys7XHJcblxyXG4gICAgICAvLyBVcGRhdGUgdGhlIHJhdGVcclxuICAgICAgY3VycmVudFJhdGUgPSByYXRlUG9saWN5KGJhc2VSYXRlLCBpdGVyYXRpb24pO1xyXG5cclxuICAgICAgLy8gQ2hlY2tzIGlmIGNyb3NzIHZhbGlkYXRpb24gaXMgZW5hYmxlZFxyXG4gICAgICBpZiAob3B0aW9ucy5jcm9zc1ZhbGlkYXRlKSB7XHJcbiAgICAgICAgdGhpcy5fdHJhaW5TZXQodHJhaW5TZXQsIGJhdGNoU2l6ZSwgY3VycmVudFJhdGUsIG1vbWVudHVtLCBjb3N0KTtcclxuICAgICAgICBpZiAob3B0aW9ucy5jbGVhcikgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIGVycm9yID0gdGhpcy50ZXN0KHRlc3RTZXQsIGNvc3QpLmVycm9yO1xyXG4gICAgICAgIGlmIChvcHRpb25zLmNsZWFyKSB0aGlzLmNsZWFyKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXJyb3IgPSB0aGlzLl90cmFpblNldChzZXQsIGJhdGNoU2l6ZSwgY3VycmVudFJhdGUsIG1vbWVudHVtLCBjb3N0KTtcclxuICAgICAgICBpZiAob3B0aW9ucy5jbGVhcikgdGhpcy5jbGVhcigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVja3MgZm9yIG9wdGlvbnMgc3VjaCBhcyBzY2hlZHVsZWQgbG9ncyBhbmQgc2h1ZmZsaW5nXHJcbiAgICAgIGlmIChvcHRpb25zLnNodWZmbGUpIHtcclxuICAgICAgICBmb3IgKGosIHgsIGkgPSBzZXQubGVuZ3RoOyBpOyBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSksIHggPSBzZXRbLS1pXSwgc2V0W2ldID0gc2V0W2pdLCBzZXRbal0gPSB4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMubG9nICYmIGl0ZXJhdGlvbiAlIG9wdGlvbnMubG9nID09PSAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2l0ZXJhdGlvbicsIGl0ZXJhdGlvbiwgJ2Vycm9yJywgZXJyb3IsICdyYXRlJywgY3VycmVudFJhdGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5zY2hlZHVsZSAmJiBpdGVyYXRpb24gJSBvcHRpb25zLnNjaGVkdWxlLml0ZXJhdGlvbnMgPT09IDApIHtcclxuICAgICAgICBvcHRpb25zLnNjaGVkdWxlLmZ1bmN0aW9uKHsgZXJyb3I6IGVycm9yLCBpdGVyYXRpb246IGl0ZXJhdGlvbiB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmNsZWFyKSB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgaWYgKGRyb3BvdXQpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5ub2Rlc1tpXS50eXBlID09PSAnaGlkZGVuJyB8fCB0aGlzLm5vZGVzW2ldLnR5cGUgPT09ICdjb25zdGFudCcpIHtcclxuICAgICAgICAgIHRoaXMubm9kZXNbaV0ubWFzayA9IDEgLSB0aGlzLmRyb3BvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZXJyb3I6IGVycm9yLFxyXG4gICAgICBpdGVyYXRpb25zOiBpdGVyYXRpb24sXHJcbiAgICAgIHRpbWU6IERhdGUubm93KCkgLSBzdGFydFxyXG4gICAgfTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtcyBvbmUgdHJhaW5pbmcgZXBvY2ggYW5kIHJldHVybnMgdGhlIGVycm9yXHJcbiAgICogcHJpdmF0ZSBmdW5jdGlvbiB1c2VkIGluIHRoaXMudHJhaW5cclxuICAgKi9cclxuICBfdHJhaW5TZXQ6IGZ1bmN0aW9uIChzZXQsIGJhdGNoU2l6ZSwgY3VycmVudFJhdGUsIG1vbWVudHVtLCBjb3N0RnVuY3Rpb24pIHtcclxuICAgIHZhciBlcnJvclN1bSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgaW5wdXQgPSBzZXRbaV0uaW5wdXQ7XHJcbiAgICAgIHZhciB0YXJnZXQgPSBzZXRbaV0ub3V0cHV0O1xyXG5cclxuICAgICAgdmFyIHVwZGF0ZSA9ICEhKChpICsgMSkgJSBiYXRjaFNpemUgPT09IDAgfHwgKGkgKyAxKSA9PT0gc2V0Lmxlbmd0aCk7XHJcblxyXG4gICAgICB2YXIgb3V0cHV0ID0gdGhpcy5hY3RpdmF0ZShpbnB1dCwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMucHJvcGFnYXRlKGN1cnJlbnRSYXRlLCBtb21lbnR1bSwgdXBkYXRlLCB0YXJnZXQpO1xyXG5cclxuICAgICAgZXJyb3JTdW0gKz0gY29zdEZ1bmN0aW9uKHRhcmdldCwgb3V0cHV0KTtcclxuICAgIH1cclxuICAgIHJldHVybiBlcnJvclN1bSAvIHNldC5sZW5ndGg7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdHMgYSBzZXQgYW5kIHJldHVybnMgdGhlIGVycm9yIGFuZCBlbGFwc2VkIHRpbWVcclxuICAgKi9cclxuICB0ZXN0OiBmdW5jdGlvbiAoc2V0LCBjb3N0ID0gbWV0aG9kcy5jb3N0Lk1TRSkge1xyXG4gICAgLy8gQ2hlY2sgaWYgZHJvcG91dCBpcyBlbmFibGVkLCBzZXQgY29ycmVjdCBtYXNrXHJcbiAgICB2YXIgaTtcclxuICAgIGlmICh0aGlzLmRyb3BvdXQpIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5ub2Rlc1tpXS50eXBlID09PSAnaGlkZGVuJyB8fCB0aGlzLm5vZGVzW2ldLnR5cGUgPT09ICdjb25zdGFudCcpIHtcclxuICAgICAgICAgIHRoaXMubm9kZXNbaV0ubWFzayA9IDEgLSB0aGlzLmRyb3BvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGVycm9yID0gMDtcclxuICAgIHZhciBzdGFydCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHNldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgaW5wdXQgPSBzZXRbaV0uaW5wdXQ7XHJcbiAgICAgIGxldCB0YXJnZXQgPSBzZXRbaV0ub3V0cHV0O1xyXG4gICAgICBsZXQgb3V0cHV0ID0gdGhpcy5ub1RyYWNlQWN0aXZhdGUoaW5wdXQpO1xyXG4gICAgICBlcnJvciArPSBjb3N0KHRhcmdldCwgb3V0cHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBlcnJvciAvPSBzZXQubGVuZ3RoO1xyXG5cclxuICAgIHZhciByZXN1bHRzID0ge1xyXG4gICAgICBlcnJvcjogZXJyb3IsXHJcbiAgICAgIHRpbWU6IERhdGUubm93KCkgLSBzdGFydFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEganNvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhIGdyYXBoIHdpdGggZDMgYW5kIHdlYmNvbGFcclxuICAgKi9cclxuICBncmFwaDogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIHZhciBpbnB1dCA9IDA7XHJcbiAgICB2YXIgb3V0cHV0ID0gMDtcclxuXHJcbiAgICB2YXIganNvbiA9IHtcclxuICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICBsaW5rczogW10sXHJcbiAgICAgIGNvbnN0cmFpbnRzOiBbe1xyXG4gICAgICAgIHR5cGU6ICdhbGlnbm1lbnQnLFxyXG4gICAgICAgIGF4aXM6ICd4JyxcclxuICAgICAgICBvZmZzZXRzOiBbXVxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgdHlwZTogJ2FsaWdubWVudCcsXHJcbiAgICAgICAgYXhpczogJ3knLFxyXG4gICAgICAgIG9mZnNldHM6IFtdXHJcbiAgICAgIH1dXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xyXG5cclxuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ2lucHV0Jykge1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0ID09PSAxKSB7XHJcbiAgICAgICAgICBqc29uLmNvbnN0cmFpbnRzWzBdLm9mZnNldHMucHVzaCh7XHJcbiAgICAgICAgICAgIG5vZGU6IGksXHJcbiAgICAgICAgICAgIG9mZnNldDogMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGpzb24uY29uc3RyYWludHNbMF0ub2Zmc2V0cy5wdXNoKHtcclxuICAgICAgICAgICAgbm9kZTogaSxcclxuICAgICAgICAgICAgb2Zmc2V0OiAwLjggKiB3aWR0aCAvICh0aGlzLmlucHV0IC0gMSkgKiBpbnB1dCsrXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAganNvbi5jb25zdHJhaW50c1sxXS5vZmZzZXRzLnB1c2goe1xyXG4gICAgICAgICAgbm9kZTogaSxcclxuICAgICAgICAgIG9mZnNldDogMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ291dHB1dCcpIHtcclxuICAgICAgICBpZiAodGhpcy5vdXRwdXQgPT09IDEpIHtcclxuICAgICAgICAgIGpzb24uY29uc3RyYWludHNbMF0ub2Zmc2V0cy5wdXNoKHtcclxuICAgICAgICAgICAgbm9kZTogaSxcclxuICAgICAgICAgICAgb2Zmc2V0OiAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAganNvbi5jb25zdHJhaW50c1swXS5vZmZzZXRzLnB1c2goe1xyXG4gICAgICAgICAgICBub2RlOiBpLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDAuOCAqIHdpZHRoIC8gKHRoaXMub3V0cHV0IC0gMSkgKiBvdXRwdXQrK1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpzb24uY29uc3RyYWludHNbMV0ub2Zmc2V0cy5wdXNoKHtcclxuICAgICAgICAgIG5vZGU6IGksXHJcbiAgICAgICAgICBvZmZzZXQ6IC0wLjggKiBoZWlnaHRcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAganNvbi5ub2Rlcy5wdXNoKHtcclxuICAgICAgICBpZDogaSxcclxuICAgICAgICBuYW1lOiBub2RlLnR5cGUgPT09ICdoaWRkZW4nID8gbm9kZS5zcXVhc2gubmFtZSA6IG5vZGUudHlwZS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICAgIGFjdGl2YXRpb246IG5vZGUuYWN0aXZhdGlvbixcclxuICAgICAgICBiaWFzOiBub2RlLmJpYXNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5jb25jYXQodGhpcy5zZWxmY29ubnMpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb25uZWN0aW9uID0gY29ubmVjdGlvbnNbaV07XHJcbiAgICAgIGlmIChjb25uZWN0aW9uLmdhdGVyID09IG51bGwpIHtcclxuICAgICAgICBqc29uLmxpbmtzLnB1c2goe1xyXG4gICAgICAgICAgc291cmNlOiB0aGlzLm5vZGVzLmluZGV4T2YoY29ubmVjdGlvbi5mcm9tKSxcclxuICAgICAgICAgIHRhcmdldDogdGhpcy5ub2Rlcy5pbmRleE9mKGNvbm5lY3Rpb24udG8pLFxyXG4gICAgICAgICAgd2VpZ2h0OiBjb25uZWN0aW9uLndlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEFkZCBhIGdhdGVyICdub2RlJ1xyXG4gICAgICAgIHZhciBpbmRleCA9IGpzb24ubm9kZXMubGVuZ3RoO1xyXG4gICAgICAgIGpzb24ubm9kZXMucHVzaCh7XHJcbiAgICAgICAgICBpZDogaW5kZXgsXHJcbiAgICAgICAgICBhY3RpdmF0aW9uOiBjb25uZWN0aW9uLmdhdGVyLmFjdGl2YXRpb24sXHJcbiAgICAgICAgICBuYW1lOiAnR0FURSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBqc29uLmxpbmtzLnB1c2goe1xyXG4gICAgICAgICAgc291cmNlOiB0aGlzLm5vZGVzLmluZGV4T2YoY29ubmVjdGlvbi5mcm9tKSxcclxuICAgICAgICAgIHRhcmdldDogaW5kZXgsXHJcbiAgICAgICAgICB3ZWlnaHQ6IDEgLyAyICogY29ubmVjdGlvbi53ZWlnaHRcclxuICAgICAgICB9KTtcclxuICAgICAgICBqc29uLmxpbmtzLnB1c2goe1xyXG4gICAgICAgICAgc291cmNlOiBpbmRleCxcclxuICAgICAgICAgIHRhcmdldDogdGhpcy5ub2Rlcy5pbmRleE9mKGNvbm5lY3Rpb24udG8pLFxyXG4gICAgICAgICAgd2VpZ2h0OiAxIC8gMiAqIGNvbm5lY3Rpb24ud2VpZ2h0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAganNvbi5saW5rcy5wdXNoKHtcclxuICAgICAgICAgIHNvdXJjZTogdGhpcy5ub2Rlcy5pbmRleE9mKGNvbm5lY3Rpb24uZ2F0ZXIpLFxyXG4gICAgICAgICAgdGFyZ2V0OiBpbmRleCxcclxuICAgICAgICAgIHdlaWdodDogY29ubmVjdGlvbi5nYXRlci5hY3RpdmF0aW9uLFxyXG4gICAgICAgICAgZ2F0ZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGpzb247XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydCB0aGUgbmV0d29yayB0byBhIGpzb24gb2JqZWN0XHJcbiAgICovXHJcbiAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIganNvbiA9IHtcclxuICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICBjb25uZWN0aW9uczogW10sXHJcbiAgICAgIGlucHV0OiB0aGlzLmlucHV0LFxyXG4gICAgICBvdXRwdXQ6IHRoaXMub3V0cHV0LFxyXG4gICAgICBkcm9wb3V0OiB0aGlzLmRyb3BvdXRcclxuICAgIH07XHJcblxyXG4gICAgLy8gU28gd2UgZG9uJ3QgaGF2ZSB0byB1c2UgZXhwZW5zaXZlIC5pbmRleE9mKClcclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5ub2Rlc1tpXS5pbmRleCA9IGk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xyXG4gICAgICBsZXQgdG9qc29uID0gbm9kZS50b0pTT04oKTtcclxuICAgICAgdG9qc29uLmluZGV4ID0gaTtcclxuICAgICAganNvbi5ub2Rlcy5wdXNoKHRvanNvbik7XHJcblxyXG4gICAgICBpZiAobm9kZS5jb25uZWN0aW9ucy5zZWxmLndlaWdodCAhPT0gMCkge1xyXG4gICAgICAgIGxldCB0b2pzb24gPSBub2RlLmNvbm5lY3Rpb25zLnNlbGYudG9KU09OKCk7XHJcbiAgICAgICAgdG9qc29uLmZyb20gPSBpO1xyXG4gICAgICAgIHRvanNvbi50byA9IGk7XHJcblxyXG4gICAgICAgIHRvanNvbi5nYXRlciA9IG5vZGUuY29ubmVjdGlvbnMuc2VsZi5nYXRlciAhPSBudWxsID8gbm9kZS5jb25uZWN0aW9ucy5zZWxmLmdhdGVyLmluZGV4IDogbnVsbDtcclxuICAgICAgICBqc29uLmNvbm5lY3Rpb25zLnB1c2godG9qc29uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjb25uID0gdGhpcy5jb25uZWN0aW9uc1tpXTtcclxuICAgICAgbGV0IHRvanNvbiA9IGNvbm4udG9KU09OKCk7XHJcbiAgICAgIHRvanNvbi5mcm9tID0gY29ubi5mcm9tLmluZGV4O1xyXG4gICAgICB0b2pzb24udG8gPSBjb25uLnRvLmluZGV4O1xyXG5cclxuICAgICAgdG9qc29uLmdhdGVyID0gY29ubi5nYXRlciAhPSBudWxsID8gY29ubi5nYXRlci5pbmRleCA6IG51bGw7XHJcblxyXG4gICAgICBqc29uLmNvbm5lY3Rpb25zLnB1c2godG9qc29uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ganNvbjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGZvciBldmVyeSBub2RlIGluIHRoaXMgbmV0d29ya1xyXG4gICAqL1xyXG4gIHNldDogZnVuY3Rpb24gKHZhbHVlcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMubm9kZXNbaV0uYmlhcyA9IHZhbHVlcy5iaWFzIHx8IHRoaXMubm9kZXNbaV0uYmlhcztcclxuICAgICAgdGhpcy5ub2Rlc1tpXS5zcXVhc2ggPSB2YWx1ZXMuc3F1YXNoIHx8IHRoaXMubm9kZXNbaV0uc3F1YXNoO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEV2b2x2ZXMgdGhlIG5ldHdvcmsgdG8gcmVhY2ggYSBsb3dlciBlcnJvciBvbiBhIGRhdGFzZXRcclxuICAgKi9cclxuICBldm9sdmU6IGFzeW5jIGZ1bmN0aW9uIChzZXQsIG9wdGlvbnMpIHtcclxuICAgIGlmIChzZXRbMF0uaW5wdXQubGVuZ3RoICE9PSB0aGlzLmlucHV0IHx8IHNldFswXS5vdXRwdXQubGVuZ3RoICE9PSB0aGlzLm91dHB1dCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGFzZXQgaW5wdXQvb3V0cHV0IHNpemUgc2hvdWxkIGJlIHNhbWUgYXMgbmV0d29yayBpbnB1dC9vdXRwdXQgc2l6ZSEnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZWFkIHRoZSBvcHRpb25zXHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHZhciB0YXJnZXRFcnJvciA9IHR5cGVvZiBvcHRpb25zLmVycm9yICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuZXJyb3IgOiAwLjA1O1xyXG4gICAgdmFyIGdyb3d0aCA9IHR5cGVvZiBvcHRpb25zLmdyb3d0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmdyb3d0aCA6IDAuMDAwMTtcclxuICAgIHZhciBjb3N0ID0gb3B0aW9ucy5jb3N0IHx8IG1ldGhvZHMuY29zdC5NU0U7XHJcbiAgICB2YXIgYW1vdW50ID0gb3B0aW9ucy5hbW91bnQgfHwgMTtcclxuXHJcbiAgICB2YXIgdGhyZWFkcyA9IG9wdGlvbnMudGhyZWFkcztcclxuICAgIGlmICh0eXBlb2YgdGhyZWFkcyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7IC8vIE5vZGUuanNcclxuICAgICAgICB0aHJlYWRzID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoO1xyXG4gICAgICB9IGVsc2UgeyAvLyBCcm93c2VyXHJcbiAgICAgICAgdGhyZWFkcyA9IG5hdmlnYXRvci5oYXJkd2FyZUNvbmN1cnJlbmN5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuaXRlcmF0aW9ucyA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdGlvbnMuZXJyb3IgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIG9mIHRoZSBmb2xsb3dpbmcgb3B0aW9ucyBtdXN0IGJlIHNwZWNpZmllZDogZXJyb3IsIGl0ZXJhdGlvbnMnKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZXJyb3IgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRhcmdldEVycm9yID0gLTE7IC8vIHJ1biB1bnRpbCBpdGVyYXRpb25zXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLml0ZXJhdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIG9wdGlvbnMuaXRlcmF0aW9ucyA9IDA7IC8vIHJ1biB1bnRpbCB0YXJnZXQgZXJyb3JcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZml0bmVzc0Z1bmN0aW9uO1xyXG4gICAgaWYgKHRocmVhZHMgPT09IDEpIHtcclxuICAgICAgLy8gQ3JlYXRlIHRoZSBmaXRuZXNzIGZ1bmN0aW9uXHJcbiAgICAgIGZpdG5lc3NGdW5jdGlvbiA9IGZ1bmN0aW9uIChnZW5vbWUpIHtcclxuICAgICAgICB2YXIgc2NvcmUgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcclxuICAgICAgICAgIHNjb3JlIC09IGdlbm9tZS50ZXN0KHNldCwgY29zdCkuZXJyb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzY29yZSAtPSAoZ2Vub21lLm5vZGVzLmxlbmd0aCAtIGdlbm9tZS5pbnB1dCAtIGdlbm9tZS5vdXRwdXQgKyBnZW5vbWUuY29ubmVjdGlvbnMubGVuZ3RoICsgZ2Vub21lLmdhdGVzLmxlbmd0aCkgKiBncm93dGg7XHJcbiAgICAgICAgc2NvcmUgPSBpc05hTihzY29yZSkgPyAtSW5maW5pdHkgOiBzY29yZTsgLy8gdGhpcyBjYW4gY2F1c2UgcHJvYmxlbXMgd2l0aCBmaXRuZXNzIHByb3BvcnRpb25hdGUgc2VsZWN0aW9uXHJcblxyXG4gICAgICAgIHJldHVybiBzY29yZSAvIGFtb3VudDtcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFNlcmlhbGl6ZSB0aGUgZGF0YXNldFxyXG4gICAgICB2YXIgY29udmVydGVkID0gbXVsdGkuc2VyaWFsaXplRGF0YVNldChzZXQpO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIHdvcmtlcnMsIHNlbmQgZGF0YXNldHNcclxuICAgICAgdmFyIHdvcmtlcnMgPSBbXTtcclxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aHJlYWRzOyBpKyspIHtcclxuICAgICAgICAgIHdvcmtlcnMucHVzaChuZXcgbXVsdGkud29ya2Vycy5ub2RlLlRlc3RXb3JrZXIoY29udmVydGVkLCBjb3N0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhyZWFkczsgaSsrKSB7XHJcbiAgICAgICAgICB3b3JrZXJzLnB1c2gobmV3IG11bHRpLndvcmtlcnMuYnJvd3Nlci5UZXN0V29ya2VyKGNvbnZlcnRlZCwgY29zdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZml0bmVzc0Z1bmN0aW9uID0gZnVuY3Rpb24gKHBvcHVsYXRpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgLy8gQ3JlYXRlIGEgcXVldWVcclxuICAgICAgICAgIHZhciBxdWV1ZSA9IHBvcHVsYXRpb24uc2xpY2UoKTtcclxuICAgICAgICAgIHZhciBkb25lID0gMDtcclxuXHJcbiAgICAgICAgICAvLyBTdGFydCB3b3JrZXIgZnVuY3Rpb25cclxuICAgICAgICAgIHZhciBzdGFydFdvcmtlciA9IGZ1bmN0aW9uICh3b3JrZXIpIHtcclxuICAgICAgICAgICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBpZiAoKytkb25lID09PSB0aHJlYWRzKSByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZ2Vub21lID0gcXVldWUuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgIHdvcmtlci5ldmFsdWF0ZShnZW5vbWUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIGdlbm9tZS5zY29yZSA9IC1yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgZ2Vub21lLnNjb3JlIC09IChnZW5vbWUubm9kZXMubGVuZ3RoIC0gZ2Vub21lLmlucHV0IC0gZ2Vub21lLm91dHB1dCArXHJcbiAgICAgICAgICAgICAgICBnZW5vbWUuY29ubmVjdGlvbnMubGVuZ3RoICsgZ2Vub21lLmdhdGVzLmxlbmd0aCkgKiBncm93dGg7XHJcbiAgICAgICAgICAgICAgZ2Vub21lLnNjb3JlID0gaXNOYU4ocGFyc2VGbG9hdChyZXN1bHQpKSA/IC1JbmZpbml0eSA6IGdlbm9tZS5zY29yZTtcclxuICAgICAgICAgICAgICBzdGFydFdvcmtlcih3b3JrZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3JrZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0V29ya2VyKHdvcmtlcnNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgb3B0aW9ucy5maXRuZXNzUG9wdWxhdGlvbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW50aWFsaXNlIHRoZSBORUFUIGluc3RhbmNlXHJcbiAgICBvcHRpb25zLm5ldHdvcmsgPSB0aGlzO1xyXG4gICAgdmFyIG5lYXQgPSBuZXcgTmVhdCh0aGlzLmlucHV0LCB0aGlzLm91dHB1dCwgZml0bmVzc0Z1bmN0aW9uLCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgZXJyb3IgPSAtSW5maW5pdHk7XHJcbiAgICB2YXIgYmVzdEZpdG5lc3MgPSAtSW5maW5pdHk7XHJcbiAgICB2YXIgYmVzdEdlbm9tZTtcclxuXHJcbiAgICB3aGlsZSAoZXJyb3IgPCAtdGFyZ2V0RXJyb3IgJiYgKG9wdGlvbnMuaXRlcmF0aW9ucyA9PT0gMCB8fCBuZWF0LmdlbmVyYXRpb24gPCBvcHRpb25zLml0ZXJhdGlvbnMpKSB7XHJcbiAgICAgIGxldCBmaXR0ZXN0ID0gYXdhaXQgbmVhdC5ldm9sdmUoKTtcclxuICAgICAgbGV0IGZpdG5lc3MgPSBmaXR0ZXN0LnNjb3JlO1xyXG4gICAgICBlcnJvciA9IGZpdG5lc3MgKyAoZml0dGVzdC5ub2Rlcy5sZW5ndGggLSBmaXR0ZXN0LmlucHV0IC0gZml0dGVzdC5vdXRwdXQgKyBmaXR0ZXN0LmNvbm5lY3Rpb25zLmxlbmd0aCArIGZpdHRlc3QuZ2F0ZXMubGVuZ3RoKSAqIGdyb3d0aDtcclxuXHJcbiAgICAgIGlmIChmaXRuZXNzID4gYmVzdEZpdG5lc3MpIHtcclxuICAgICAgICBiZXN0Rml0bmVzcyA9IGZpdG5lc3M7XHJcbiAgICAgICAgYmVzdEdlbm9tZSA9IGZpdHRlc3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmxvZyAmJiBuZWF0LmdlbmVyYXRpb24gJSBvcHRpb25zLmxvZyA9PT0gMCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdpdGVyYXRpb24nLCBuZWF0LmdlbmVyYXRpb24sICdmaXRuZXNzJywgZml0bmVzcywgJ2Vycm9yJywgLWVycm9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuc2NoZWR1bGUgJiYgbmVhdC5nZW5lcmF0aW9uICUgb3B0aW9ucy5zY2hlZHVsZS5pdGVyYXRpb25zID09PSAwKSB7XHJcbiAgICAgICAgb3B0aW9ucy5zY2hlZHVsZS5mdW5jdGlvbih7IGZpdG5lc3M6IGZpdG5lc3MsIGVycm9yOiAtZXJyb3IsIGl0ZXJhdGlvbjogbmVhdC5nZW5lcmF0aW9uIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRocmVhZHMgPiAxKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29ya2Vycy5sZW5ndGg7IGkrKykgd29ya2Vyc1tpXS50ZXJtaW5hdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGJlc3RHZW5vbWUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMubm9kZXMgPSBiZXN0R2Vub21lLm5vZGVzO1xyXG4gICAgICB0aGlzLmNvbm5lY3Rpb25zID0gYmVzdEdlbm9tZS5jb25uZWN0aW9ucztcclxuICAgICAgdGhpcy5zZWxmY29ubnMgPSBiZXN0R2Vub21lLnNlbGZjb25ucztcclxuICAgICAgdGhpcy5nYXRlcyA9IGJlc3RHZW5vbWUuZ2F0ZXM7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5jbGVhcikgdGhpcy5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVycm9yOiAtZXJyb3IsXHJcbiAgICAgIGl0ZXJhdGlvbnM6IG5lYXQuZ2VuZXJhdGlvbixcclxuICAgICAgdGltZTogRGF0ZS5ub3coKSAtIHN0YXJ0XHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBzdGFuZGFsb25lIGZ1bmN0aW9uIG9mIHRoZSBuZXR3b3JrIHdoaWNoIGNhbiBiZSBydW4gd2l0aG91dCB0aGVcclxuICAgKiBuZWVkIG9mIGEgbGlicmFyeVxyXG4gICAqL1xyXG4gIHN0YW5kYWxvbmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwcmVzZW50ID0gW107XHJcbiAgICB2YXIgYWN0aXZhdGlvbnMgPSBbXTtcclxuICAgIHZhciBzdGF0ZXMgPSBbXTtcclxuICAgIHZhciBsaW5lcyA9IFtdO1xyXG4gICAgdmFyIGZ1bmN0aW9ucyA9IFtdO1xyXG5cclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuaW5wdXQ7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcbiAgICAgIGFjdGl2YXRpb25zLnB1c2gobm9kZS5hY3RpdmF0aW9uKTtcclxuICAgICAgc3RhdGVzLnB1c2gobm9kZS5zdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGluZXMucHVzaCgnZm9yKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSBBW2ldID0gaW5wdXRbaV07Jyk7XHJcblxyXG4gICAgLy8gU28gd2UgZG9uJ3QgaGF2ZSB0byB1c2UgZXhwZW5zaXZlIC5pbmRleE9mKClcclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMubm9kZXNbaV0uaW5kZXggPSBpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IHRoaXMuaW5wdXQ7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuICAgICAgYWN0aXZhdGlvbnMucHVzaChub2RlLmFjdGl2YXRpb24pO1xyXG4gICAgICBzdGF0ZXMucHVzaChub2RlLnN0YXRlKTtcclxuXHJcbiAgICAgIHZhciBmdW5jdGlvbkluZGV4ID0gcHJlc2VudC5pbmRleE9mKG5vZGUuc3F1YXNoLm5hbWUpO1xyXG5cclxuICAgICAgaWYgKGZ1bmN0aW9uSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgZnVuY3Rpb25JbmRleCA9IHByZXNlbnQubGVuZ3RoO1xyXG4gICAgICAgIHByZXNlbnQucHVzaChub2RlLnNxdWFzaC5uYW1lKTtcclxuICAgICAgICBmdW5jdGlvbnMucHVzaChub2RlLnNxdWFzaC50b1N0cmluZygpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGluY29taW5nID0gW107XHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbm9kZS5jb25uZWN0aW9ucy5pbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHZhciBjb25uID0gbm9kZS5jb25uZWN0aW9ucy5pbltqXTtcclxuICAgICAgICB2YXIgY29tcHV0YXRpb24gPSBgQVske2Nvbm4uZnJvbS5pbmRleH1dICogJHtjb25uLndlaWdodH1gO1xyXG5cclxuICAgICAgICBpZiAoY29ubi5nYXRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgICBjb21wdXRhdGlvbiArPSBgICogQVske2Nvbm4uZ2F0ZXIuaW5kZXh9XWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmNvbWluZy5wdXNoKGNvbXB1dGF0aW9uKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5vZGUuY29ubmVjdGlvbnMuc2VsZi53ZWlnaHQpIHtcclxuICAgICAgICBsZXQgY29ubiA9IG5vZGUuY29ubmVjdGlvbnMuc2VsZjtcclxuICAgICAgICBsZXQgY29tcHV0YXRpb24gPSBgU1ske2l9XSAqICR7Y29ubi53ZWlnaHR9YDtcclxuXHJcbiAgICAgICAgaWYgKGNvbm4uZ2F0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29tcHV0YXRpb24gKz0gYCAqIEFbJHtjb25uLmdhdGVyLmluZGV4fV1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5jb21pbmcucHVzaChjb21wdXRhdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBsaW5lMSA9IGBTWyR7aX1dID0gJHtpbmNvbWluZy5qb2luKCcgKyAnKX0gKyAke25vZGUuYmlhc307YDtcclxuICAgICAgdmFyIGxpbmUyID0gYEFbJHtpfV0gPSBGWyR7ZnVuY3Rpb25JbmRleH1dKFNbJHtpfV0pJHshbm9kZS5tYXNrID8gJyAqICcgKyBub2RlLm1hc2sgOiAnJ307YDtcclxuICAgICAgbGluZXMucHVzaChsaW5lMSk7XHJcbiAgICAgIGxpbmVzLnB1c2gobGluZTIpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvdXRwdXQgPSBbXTtcclxuICAgIGZvciAoaSA9IHRoaXMubm9kZXMubGVuZ3RoIC0gdGhpcy5vdXRwdXQ7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG91dHB1dC5wdXNoKGBBWyR7aX1dYCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0ID0gYHJldHVybiBbJHtvdXRwdXQuam9pbignLCcpfV07YDtcclxuICAgIGxpbmVzLnB1c2gob3V0cHV0KTtcclxuXHJcbiAgICB2YXIgdG90YWwgPSAnJztcclxuICAgIHRvdGFsICs9IGB2YXIgRiA9IFske2Z1bmN0aW9ucy50b1N0cmluZygpfV07XFxyXFxuYDtcclxuICAgIHRvdGFsICs9IGB2YXIgQSA9IFske2FjdGl2YXRpb25zLnRvU3RyaW5nKCl9XTtcXHJcXG5gO1xyXG4gICAgdG90YWwgKz0gYHZhciBTID0gWyR7c3RhdGVzLnRvU3RyaW5nKCl9XTtcXHJcXG5gO1xyXG4gICAgdG90YWwgKz0gYGZ1bmN0aW9uIGFjdGl2YXRlKGlucHV0KXtcXHJcXG4ke2xpbmVzLmpvaW4oJ1xcclxcbicpfVxcclxcbn1gO1xyXG5cclxuICAgIHJldHVybiB0b3RhbDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTZXJpYWxpemUgdG8gc2VuZCB0byB3b3JrZXJzIGVmZmljaWVudGx5XHJcbiAgICovXHJcbiAgc2VyaWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYWN0aXZhdGlvbnMgPSBbXTtcclxuICAgIHZhciBzdGF0ZXMgPSBbXTtcclxuICAgIHZhciBjb25ucyA9IFtdO1xyXG4gICAgdmFyIHNxdWFzaGVzID0gW1xyXG4gICAgICAnTE9HSVNUSUMnLCAnVEFOSCcsICdJREVOVElUWScsICdTVEVQJywgJ1JFTFUnLCAnU09GVFNJR04nLCAnU0lOVVNPSUQnLFxyXG4gICAgICAnR0FVU1NJQU4nLCAnQkVOVF9JREVOVElUWScsICdCSVBPTEFSJywgJ0JJUE9MQVJfU0lHTU9JRCcsICdIQVJEX1RBTkgnLFxyXG4gICAgICAnQUJTT0xVVEUnLCAnSU5WRVJTRScsICdTRUxVJ1xyXG4gICAgXTtcclxuXHJcbiAgICBjb25ucy5wdXNoKHRoaXMuaW5wdXQpO1xyXG4gICAgY29ubnMucHVzaCh0aGlzLm91dHB1dCk7XHJcblxyXG4gICAgdmFyIGk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZXNbaV07XHJcbiAgICAgIG5vZGUuaW5kZXggPSBpO1xyXG4gICAgICBhY3RpdmF0aW9ucy5wdXNoKG5vZGUuYWN0aXZhdGlvbik7XHJcbiAgICAgIHN0YXRlcy5wdXNoKG5vZGUuc3RhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IHRoaXMuaW5wdXQ7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBub2RlID0gdGhpcy5ub2Rlc1tpXTtcclxuICAgICAgY29ubnMucHVzaChub2RlLmluZGV4KTtcclxuICAgICAgY29ubnMucHVzaChub2RlLmJpYXMpO1xyXG4gICAgICBjb25ucy5wdXNoKHNxdWFzaGVzLmluZGV4T2Yobm9kZS5zcXVhc2gubmFtZSkpO1xyXG5cclxuICAgICAgY29ubnMucHVzaChub2RlLmNvbm5lY3Rpb25zLnNlbGYud2VpZ2h0KTtcclxuICAgICAgY29ubnMucHVzaChub2RlLmNvbm5lY3Rpb25zLnNlbGYuZ2F0ZXIgPT0gbnVsbCA/IC0xIDogbm9kZS5jb25uZWN0aW9ucy5zZWxmLmdhdGVyLmluZGV4KTtcclxuXHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbm9kZS5jb25uZWN0aW9ucy5pbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBjb25uID0gbm9kZS5jb25uZWN0aW9ucy5pbltqXTtcclxuXHJcbiAgICAgICAgY29ubnMucHVzaChjb25uLmZyb20uaW5kZXgpO1xyXG4gICAgICAgIGNvbm5zLnB1c2goY29ubi53ZWlnaHQpO1xyXG4gICAgICAgIGNvbm5zLnB1c2goY29ubi5nYXRlciA9PSBudWxsID8gLTEgOiBjb25uLmdhdGVyLmluZGV4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29ubnMucHVzaCgtMik7IC8vIHN0b3AgdG9rZW4gLT4gbmV4dCBub2RlXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFthY3RpdmF0aW9ucywgc3RhdGVzLCBjb25uc107XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBqc29uIG9iamVjdCB0byBhIG5ldHdvcmtcclxuICovXHJcbk5ldHdvcmsuZnJvbUpTT04gPSBmdW5jdGlvbiAoanNvbikge1xyXG4gIHZhciBuZXR3b3JrID0gbmV3IE5ldHdvcmsoanNvbi5pbnB1dCwganNvbi5vdXRwdXQpO1xyXG4gIG5ldHdvcmsuZHJvcG91dCA9IGpzb24uZHJvcG91dDtcclxuICBuZXR3b3JrLm5vZGVzID0gW107XHJcbiAgbmV0d29yay5jb25uZWN0aW9ucyA9IFtdO1xyXG5cclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwganNvbi5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgbmV0d29yay5ub2Rlcy5wdXNoKE5vZGUuZnJvbUpTT04oanNvbi5ub2Rlc1tpXSkpO1xyXG4gIH1cclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGpzb24uY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBjb25uID0ganNvbi5jb25uZWN0aW9uc1tpXTtcclxuXHJcbiAgICB2YXIgY29ubmVjdGlvbiA9IG5ldHdvcmsuY29ubmVjdChuZXR3b3JrLm5vZGVzW2Nvbm4uZnJvbV0sIG5ldHdvcmsubm9kZXNbY29ubi50b10pWzBdO1xyXG4gICAgY29ubmVjdGlvbi53ZWlnaHQgPSBjb25uLndlaWdodDtcclxuXHJcbiAgICBpZiAoY29ubi5nYXRlciAhPSBudWxsKSB7XHJcbiAgICAgIG5ldHdvcmsuZ2F0ZShuZXR3b3JrLm5vZGVzW2Nvbm4uZ2F0ZXJdLCBjb25uZWN0aW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBuZXR3b3JrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1lcmdlIHR3byBuZXR3b3JrcyBpbnRvIG9uZVxyXG4gKi9cclxuTmV0d29yay5tZXJnZSA9IGZ1bmN0aW9uIChuZXR3b3JrMSwgbmV0d29yazIpIHtcclxuICAvLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBuZXR3b3Jrc1xyXG4gIG5ldHdvcmsxID0gTmV0d29yay5mcm9tSlNPTihuZXR3b3JrMS50b0pTT04oKSk7XHJcbiAgbmV0d29yazIgPSBOZXR3b3JrLmZyb21KU09OKG5ldHdvcmsyLnRvSlNPTigpKTtcclxuXHJcbiAgLy8gQ2hlY2sgaWYgb3V0cHV0IGFuZCBpbnB1dCBzaXplIGFyZSB0aGUgc2FtZVxyXG4gIGlmIChuZXR3b3JrMS5vdXRwdXQgIT09IG5ldHdvcmsyLmlucHV0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ091dHB1dCBzaXplIG9mIG5ldHdvcmsxIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgaW5wdXQgc2l6ZSBvZiBuZXR3b3JrMiEnKTtcclxuICB9XHJcblxyXG4gIC8vIFJlZGlyZWN0IGFsbCBjb25uZWN0aW9ucyBmcm9tIG5ldHdvcmsyIGlucHV0IGZyb20gbmV0d29yazEgb3V0cHV0XHJcbiAgdmFyIGk7XHJcbiAgZm9yIChpID0gMDsgaSA8IG5ldHdvcmsyLmNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgY29ubiA9IG5ldHdvcmsyLmNvbm5lY3Rpb25zW2ldO1xyXG4gICAgaWYgKGNvbm4uZnJvbS50eXBlID09PSAnaW5wdXQnKSB7XHJcbiAgICAgIGxldCBpbmRleCA9IG5ldHdvcmsyLm5vZGVzLmluZGV4T2YoY29ubi5mcm9tKTtcclxuXHJcbiAgICAgIC8vIHJlZGlyZWN0XHJcbiAgICAgIGNvbm4uZnJvbSA9IG5ldHdvcmsxLm5vZGVzW25ldHdvcmsxLm5vZGVzLmxlbmd0aCAtIDEgLSBpbmRleF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgaW5wdXQgbm9kZXMgb2YgbmV0d29yazJcclxuICBmb3IgKGkgPSBuZXR3b3JrMi5pbnB1dCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICBuZXR3b3JrMi5ub2Rlcy5zcGxpY2UoaSwgMSk7XHJcbiAgfVxyXG5cclxuICAvLyBDaGFuZ2UgdGhlIG5vZGUgdHlwZSBvZiBuZXR3b3JrMSdzIG91dHB1dCBub2RlcyAobm93IGhpZGRlbilcclxuICBmb3IgKGkgPSBuZXR3b3JrMS5ub2Rlcy5sZW5ndGggLSBuZXR3b3JrMS5vdXRwdXQ7IGkgPCBuZXR3b3JrMS5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgbmV0d29yazEubm9kZXNbaV0udHlwZSA9ICdoaWRkZW4nO1xyXG4gIH1cclxuXHJcbiAgLy8gQ3JlYXRlIG9uZSBuZXR3b3JrIGZyb20gYm90aCBuZXR3b3Jrc1xyXG4gIG5ldHdvcmsxLmNvbm5lY3Rpb25zID0gbmV0d29yazEuY29ubmVjdGlvbnMuY29uY2F0KG5ldHdvcmsyLmNvbm5lY3Rpb25zKTtcclxuICBuZXR3b3JrMS5ub2RlcyA9IG5ldHdvcmsxLm5vZGVzLmNvbmNhdChuZXR3b3JrMi5ub2Rlcyk7XHJcblxyXG4gIHJldHVybiBuZXR3b3JrMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYW4gb2Zmc3ByaW5nIGZyb20gdHdvIHBhcmVudCBuZXR3b3Jrc1xyXG4gKi9cclxuTmV0d29yay5jcm9zc092ZXIgPSBmdW5jdGlvbiAobmV0d29yazEsIG5ldHdvcmsyLCBlcXVhbCkge1xyXG4gIGlmIChuZXR3b3JrMS5pbnB1dCAhPT0gbmV0d29yazIuaW5wdXQgfHwgbmV0d29yazEub3V0cHV0ICE9PSBuZXR3b3JrMi5vdXRwdXQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk5ldHdvcmtzIGRvbid0IGhhdmUgdGhlIHNhbWUgaW5wdXQvb3V0cHV0IHNpemUhXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbGlzZSBvZmZzcHJpbmdcclxuICB2YXIgb2Zmc3ByaW5nID0gbmV3IE5ldHdvcmsobmV0d29yazEuaW5wdXQsIG5ldHdvcmsxLm91dHB1dCk7XHJcbiAgb2Zmc3ByaW5nLmNvbm5lY3Rpb25zID0gW107XHJcbiAgb2Zmc3ByaW5nLm5vZGVzID0gW107XHJcblxyXG4gIC8vIFNhdmUgc2NvcmVzIGFuZCBjcmVhdGUgYSBjb3B5XHJcbiAgdmFyIHNjb3JlMSA9IG5ldHdvcmsxLnNjb3JlIHx8IDA7XHJcbiAgdmFyIHNjb3JlMiA9IG5ldHdvcmsyLnNjb3JlIHx8IDA7XHJcblxyXG4gIC8vIERldGVybWluZSBvZmZzcHJpbmcgbm9kZSBzaXplXHJcbiAgdmFyIHNpemU7XHJcbiAgaWYgKGVxdWFsIHx8IHNjb3JlMSA9PT0gc2NvcmUyKSB7XHJcbiAgICBsZXQgbWF4ID0gTWF0aC5tYXgobmV0d29yazEubm9kZXMubGVuZ3RoLCBuZXR3b3JrMi5ub2Rlcy5sZW5ndGgpO1xyXG4gICAgbGV0IG1pbiA9IE1hdGgubWluKG5ldHdvcmsxLm5vZGVzLmxlbmd0aCwgbmV0d29yazIubm9kZXMubGVuZ3RoKTtcclxuICAgIHNpemUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xyXG4gIH0gZWxzZSBpZiAoc2NvcmUxID4gc2NvcmUyKSB7XHJcbiAgICBzaXplID0gbmV0d29yazEubm9kZXMubGVuZ3RoO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzaXplID0gbmV0d29yazIubm9kZXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVuYW1lIHNvbWUgdmFyaWFibGVzIGZvciBlYXNpZXIgcmVhZGluZ1xyXG4gIHZhciBvdXRwdXRTaXplID0gbmV0d29yazEub3V0cHV0O1xyXG5cclxuICAvLyBTZXQgaW5kZXhlcyBzbyB3ZSBkb24ndCBuZWVkIGluZGV4T2ZcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgbmV0d29yazEubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIG5ldHdvcmsxLm5vZGVzW2ldLmluZGV4ID0gaTtcclxuICB9XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBuZXR3b3JrMi5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgbmV0d29yazIubm9kZXNbaV0uaW5kZXggPSBpO1xyXG4gIH1cclxuXHJcbiAgLy8gQXNzaWduIG5vZGVzIGZyb20gcGFyZW50cyB0byBvZmZzcHJpbmdcclxuICBmb3IgKGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcbiAgICAvLyBEZXRlcm1pbmUgaWYgYW4gb3V0cHV0IG5vZGUgaXMgbmVlZGVkXHJcbiAgICB2YXIgbm9kZTtcclxuICAgIGlmIChpIDwgc2l6ZSAtIG91dHB1dFNpemUpIHtcclxuICAgICAgbGV0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgIG5vZGUgPSByYW5kb20gPj0gMC41ID8gbmV0d29yazEubm9kZXNbaV0gOiBuZXR3b3JrMi5ub2Rlc1tpXTtcclxuICAgICAgbGV0IG90aGVyID0gcmFuZG9tIDwgMC41ID8gbmV0d29yazEubm9kZXNbaV0gOiBuZXR3b3JrMi5ub2Rlc1tpXTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbm9kZS50eXBlID09PSAnb3V0cHV0Jykge1xyXG4gICAgICAgIG5vZGUgPSBvdGhlcjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPj0gMC41KSB7XHJcbiAgICAgICAgbm9kZSA9IG5ldHdvcmsxLm5vZGVzW25ldHdvcmsxLm5vZGVzLmxlbmd0aCArIGkgLSBzaXplXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBub2RlID0gbmV0d29yazIubm9kZXNbbmV0d29yazIubm9kZXMubGVuZ3RoICsgaSAtIHNpemVdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5ld05vZGUgPSBuZXcgTm9kZSgpO1xyXG4gICAgbmV3Tm9kZS5iaWFzID0gbm9kZS5iaWFzO1xyXG4gICAgbmV3Tm9kZS5zcXVhc2ggPSBub2RlLnNxdWFzaDtcclxuICAgIG5ld05vZGUudHlwZSA9IG5vZGUudHlwZTtcclxuXHJcbiAgICBvZmZzcHJpbmcubm9kZXMucHVzaChuZXdOb2RlKTtcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZSBhcnJheXMgb2YgY29ubmVjdGlvbiBnZW5lc1xyXG4gIHZhciBuMWNvbm5zID0ge307XHJcbiAgdmFyIG4yY29ubnMgPSB7fTtcclxuXHJcbiAgLy8gTm9ybWFsIGNvbm5lY3Rpb25zXHJcbiAgZm9yIChpID0gMDsgaSA8IG5ldHdvcmsxLmNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgY29ubiA9IG5ldHdvcmsxLmNvbm5lY3Rpb25zW2ldO1xyXG4gICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgIHdlaWdodDogY29ubi53ZWlnaHQsXHJcbiAgICAgIGZyb206IGNvbm4uZnJvbS5pbmRleCxcclxuICAgICAgdG86IGNvbm4udG8uaW5kZXgsXHJcbiAgICAgIGdhdGVyOiBjb25uLmdhdGVyICE9IG51bGwgPyBjb25uLmdhdGVyLmluZGV4IDogLTFcclxuICAgIH07XHJcbiAgICBuMWNvbm5zW0Nvbm5lY3Rpb24uaW5ub3ZhdGlvbklEKGRhdGEuZnJvbSwgZGF0YS50byldID0gZGF0YTtcclxuICB9XHJcblxyXG4gIC8vIFNlbGZjb25uZWN0aW9uc1xyXG4gIGZvciAoaSA9IDA7IGkgPCBuZXR3b3JrMS5zZWxmY29ubnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBjb25uID0gbmV0d29yazEuc2VsZmNvbm5zW2ldO1xyXG4gICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgIHdlaWdodDogY29ubi53ZWlnaHQsXHJcbiAgICAgIGZyb206IGNvbm4uZnJvbS5pbmRleCxcclxuICAgICAgdG86IGNvbm4udG8uaW5kZXgsXHJcbiAgICAgIGdhdGVyOiBjb25uLmdhdGVyICE9IG51bGwgPyBjb25uLmdhdGVyLmluZGV4IDogLTFcclxuICAgIH07XHJcbiAgICBuMWNvbm5zW0Nvbm5lY3Rpb24uaW5ub3ZhdGlvbklEKGRhdGEuZnJvbSwgZGF0YS50byldID0gZGF0YTtcclxuICB9XHJcblxyXG4gIC8vIE5vcm1hbCBjb25uZWN0aW9uc1xyXG4gIGZvciAoaSA9IDA7IGkgPCBuZXR3b3JrMi5jb25uZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGNvbm4gPSBuZXR3b3JrMi5jb25uZWN0aW9uc1tpXTtcclxuICAgIGxldCBkYXRhID0ge1xyXG4gICAgICB3ZWlnaHQ6IGNvbm4ud2VpZ2h0LFxyXG4gICAgICBmcm9tOiBjb25uLmZyb20uaW5kZXgsXHJcbiAgICAgIHRvOiBjb25uLnRvLmluZGV4LFxyXG4gICAgICBnYXRlcjogY29ubi5nYXRlciAhPSBudWxsID8gY29ubi5nYXRlci5pbmRleCA6IC0xXHJcbiAgICB9O1xyXG4gICAgbjJjb25uc1tDb25uZWN0aW9uLmlubm92YXRpb25JRChkYXRhLmZyb20sIGRhdGEudG8pXSA9IGRhdGE7XHJcbiAgfVxyXG5cclxuICAvLyBTZWxmY29ubmVjdGlvbnNcclxuICBmb3IgKGkgPSAwOyBpIDwgbmV0d29yazIuc2VsZmNvbm5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgY29ubiA9IG5ldHdvcmsyLnNlbGZjb25uc1tpXTtcclxuICAgIGxldCBkYXRhID0ge1xyXG4gICAgICB3ZWlnaHQ6IGNvbm4ud2VpZ2h0LFxyXG4gICAgICBmcm9tOiBjb25uLmZyb20uaW5kZXgsXHJcbiAgICAgIHRvOiBjb25uLnRvLmluZGV4LFxyXG4gICAgICBnYXRlcjogY29ubi5nYXRlciAhPSBudWxsID8gY29ubi5nYXRlci5pbmRleCA6IC0xXHJcbiAgICB9O1xyXG4gICAgbjJjb25uc1tDb25uZWN0aW9uLmlubm92YXRpb25JRChkYXRhLmZyb20sIGRhdGEudG8pXSA9IGRhdGE7XHJcbiAgfVxyXG5cclxuICAvLyBTcGxpdCBjb21tb24gY29ubiBnZW5lcyBmcm9tIGRpc2pvaW50IG9yIGV4Y2VzcyBjb25uIGdlbmVzXHJcbiAgdmFyIGNvbm5lY3Rpb25zID0gW107XHJcbiAgdmFyIGtleXMxID0gT2JqZWN0LmtleXMobjFjb25ucyk7XHJcbiAgdmFyIGtleXMyID0gT2JqZWN0LmtleXMobjJjb25ucyk7XHJcbiAgZm9yIChpID0ga2V5czEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgIC8vIENvbW1vbiBnZW5lXHJcbiAgICBpZiAodHlwZW9mIG4yY29ubnNba2V5czFbaV1dICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBsZXQgY29ubiA9IE1hdGgucmFuZG9tKCkgPj0gMC41ID8gbjFjb25uc1trZXlzMVtpXV0gOiBuMmNvbm5zW2tleXMxW2ldXTtcclxuICAgICAgY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuXHJcbiAgICAgIC8vIEJlY2F1c2UgZGVsZXRpbmcgaXMgZXhwZW5zaXZlLCBqdXN0IHNldCBpdCB0byBzb21lIHZhbHVlXHJcbiAgICAgIG4yY29ubnNba2V5czFbaV1dID0gdW5kZWZpbmVkO1xyXG4gICAgfSBlbHNlIGlmIChzY29yZTEgPj0gc2NvcmUyIHx8IGVxdWFsKSB7XHJcbiAgICAgIGNvbm5lY3Rpb25zLnB1c2gobjFjb25uc1trZXlzMVtpXV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRXhjZXNzL2Rpc2pvaW50IGdlbmVcclxuICBpZiAoc2NvcmUyID49IHNjb3JlMSB8fCBlcXVhbCkge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgbjJjb25uc1trZXlzMltpXV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgY29ubmVjdGlvbnMucHVzaChuMmNvbm5zW2tleXMyW2ldXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBjb21tb24gY29ubiBnZW5lcyB1bmlmb3JtbHlcclxuICBmb3IgKGkgPSAwOyBpIDwgY29ubmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBjb25uRGF0YSA9IGNvbm5lY3Rpb25zW2ldO1xyXG4gICAgaWYgKGNvbm5EYXRhLnRvIDwgc2l6ZSAmJiBjb25uRGF0YS5mcm9tIDwgc2l6ZSkge1xyXG4gICAgICBsZXQgZnJvbSA9IG9mZnNwcmluZy5ub2Rlc1tjb25uRGF0YS5mcm9tXTtcclxuICAgICAgbGV0IHRvID0gb2Zmc3ByaW5nLm5vZGVzW2Nvbm5EYXRhLnRvXTtcclxuICAgICAgbGV0IGNvbm4gPSBvZmZzcHJpbmcuY29ubmVjdChmcm9tLCB0bylbMF07XHJcblxyXG4gICAgICBjb25uLndlaWdodCA9IGNvbm5EYXRhLndlaWdodDtcclxuXHJcbiAgICAgIGlmIChjb25uRGF0YS5nYXRlciAhPT0gLTEgJiYgY29ubkRhdGEuZ2F0ZXIgPCBzaXplKSB7XHJcbiAgICAgICAgb2Zmc3ByaW5nLmdhdGUob2Zmc3ByaW5nLm5vZGVzW2Nvbm5EYXRhLmdhdGVyXSwgY29ubik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBvZmZzcHJpbmc7XHJcbn07XHJcbiIsIi8qIEV4cG9ydCAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGU7XHJcblxyXG4vKiBJbXBvcnQgKi9cclxudmFyIG1ldGhvZHMgPSByZXF1aXJlKCcuLi9tZXRob2RzL21ldGhvZHMnKTtcclxudmFyIENvbm5lY3Rpb24gPSByZXF1aXJlKCcuL2Nvbm5lY3Rpb24nKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOT0RFXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5mdW5jdGlvbiBOb2RlICh0eXBlKSB7XHJcbiAgdGhpcy5iaWFzID0gKHR5cGUgPT09ICdpbnB1dCcpID8gMCA6IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjE7XHJcbiAgdGhpcy5zcXVhc2ggPSBtZXRob2RzLmFjdGl2YXRpb24uTE9HSVNUSUM7XHJcbiAgdGhpcy50eXBlID0gdHlwZSB8fCAnaGlkZGVuJztcclxuXHJcbiAgdGhpcy5hY3RpdmF0aW9uID0gMDtcclxuICB0aGlzLnN0YXRlID0gMDtcclxuICB0aGlzLm9sZCA9IDA7XHJcblxyXG4gIC8vIEZvciBkcm9wb3V0XHJcbiAgdGhpcy5tYXNrID0gMTtcclxuXHJcbiAgLy8gRm9yIHRyYWNraW5nIG1vbWVudHVtXHJcbiAgdGhpcy5wcmV2aW91c0RlbHRhQmlhcyA9IDA7XHJcblxyXG4gIC8vIEJhdGNoIHRyYWluaW5nXHJcbiAgdGhpcy50b3RhbERlbHRhQmlhcyA9IDA7XHJcblxyXG4gIHRoaXMuY29ubmVjdGlvbnMgPSB7XHJcbiAgICBpbjogW10sXHJcbiAgICBvdXQ6IFtdLFxyXG4gICAgZ2F0ZWQ6IFtdLFxyXG4gICAgc2VsZjogbmV3IENvbm5lY3Rpb24odGhpcywgdGhpcywgMClcclxuICB9O1xyXG5cclxuICAvLyBEYXRhIGZvciBiYWNrcHJvcGFnYXRpb25cclxuICB0aGlzLmVycm9yID0ge1xyXG4gICAgcmVzcG9uc2liaWxpdHk6IDAsXHJcbiAgICBwcm9qZWN0ZWQ6IDAsXHJcbiAgICBnYXRlZDogMFxyXG4gIH07XHJcbn1cclxuXHJcbk5vZGUucHJvdG90eXBlID0ge1xyXG4gIC8qKlxyXG4gICAqIEFjdGl2YXRlcyB0aGUgbm9kZVxyXG4gICAqL1xyXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgIC8vIENoZWNrIGlmIGFuIGlucHV0IGlzIGdpdmVuXHJcbiAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzLmFjdGl2YXRpb24gPSBpbnB1dDtcclxuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9sZCA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgLy8gQWxsIGFjdGl2YXRpb24gc291cmNlcyBjb21pbmcgZnJvbSB0aGUgbm9kZSBpdHNlbGZcclxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmNvbm5lY3Rpb25zLnNlbGYuZ2FpbiAqIHRoaXMuY29ubmVjdGlvbnMuc2VsZi53ZWlnaHQgKiB0aGlzLnN0YXRlICsgdGhpcy5iaWFzO1xyXG5cclxuICAgIC8vIEFjdGl2YXRpb24gc291cmNlcyBjb21pbmcgZnJvbSBjb25uZWN0aW9uc1xyXG4gICAgdmFyIGk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jb25uZWN0aW9ucy5pbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdGlvbnMuaW5baV07XHJcbiAgICAgIHRoaXMuc3RhdGUgKz0gY29ubmVjdGlvbi5mcm9tLmFjdGl2YXRpb24gKiBjb25uZWN0aW9uLndlaWdodCAqIGNvbm5lY3Rpb24uZ2FpbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTcXVhc2ggdGhlIHZhbHVlcyByZWNlaXZlZFxyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gdGhpcy5zcXVhc2godGhpcy5zdGF0ZSkgKiB0aGlzLm1hc2s7XHJcbiAgICB0aGlzLmRlcml2YXRpdmUgPSB0aGlzLnNxdWFzaCh0aGlzLnN0YXRlLCB0cnVlKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdHJhY2VzXHJcbiAgICB2YXIgbm9kZXMgPSBbXTtcclxuICAgIHZhciBpbmZsdWVuY2VzID0gW107XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY29ubmVjdGlvbnMuZ2F0ZWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IGNvbm4gPSB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkW2ldO1xyXG4gICAgICBsZXQgbm9kZSA9IGNvbm4udG87XHJcblxyXG4gICAgICBsZXQgaW5kZXggPSBub2Rlcy5pbmRleE9mKG5vZGUpO1xyXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgIGluZmx1ZW5jZXNbaW5kZXhdICs9IGNvbm4ud2VpZ2h0ICogY29ubi5mcm9tLmFjdGl2YXRpb247XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICBpbmZsdWVuY2VzLnB1c2goY29ubi53ZWlnaHQgKiBjb25uLmZyb20uYWN0aXZhdGlvbiArXHJcbiAgICAgICAgICAobm9kZS5jb25uZWN0aW9ucy5zZWxmLmdhdGVyID09PSB0aGlzID8gbm9kZS5vbGQgOiAwKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkanVzdCB0aGUgZ2FpbiB0byB0aGlzIG5vZGVzJyBhY3RpdmF0aW9uXHJcbiAgICAgIGNvbm4uZ2FpbiA9IHRoaXMuYWN0aXZhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jb25uZWN0aW9ucy5pbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdGlvbnMuaW5baV07XHJcblxyXG4gICAgICAvLyBFbGVnaWJpbGl0eSB0cmFjZVxyXG4gICAgICBjb25uZWN0aW9uLmVsZWdpYmlsaXR5ID0gdGhpcy5jb25uZWN0aW9ucy5zZWxmLmdhaW4gKiB0aGlzLmNvbm5lY3Rpb25zLnNlbGYud2VpZ2h0ICpcclxuICAgICAgICBjb25uZWN0aW9uLmVsZWdpYmlsaXR5ICsgY29ubmVjdGlvbi5mcm9tLmFjdGl2YXRpb24gKiBjb25uZWN0aW9uLmdhaW47XHJcblxyXG4gICAgICAvLyBFeHRlbmRlZCB0cmFjZVxyXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5vZGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSBub2Rlc1tqXTtcclxuICAgICAgICBsZXQgaW5mbHVlbmNlID0gaW5mbHVlbmNlc1tqXTtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gY29ubmVjdGlvbi54dHJhY2Uubm9kZXMuaW5kZXhPZihub2RlKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgIGNvbm5lY3Rpb24ueHRyYWNlLnZhbHVlc1tpbmRleF0gPSBub2RlLmNvbm5lY3Rpb25zLnNlbGYuZ2FpbiAqIG5vZGUuY29ubmVjdGlvbnMuc2VsZi53ZWlnaHQgKlxyXG4gICAgICAgICAgICBjb25uZWN0aW9uLnh0cmFjZS52YWx1ZXNbaW5kZXhdICsgdGhpcy5kZXJpdmF0aXZlICogY29ubmVjdGlvbi5lbGVnaWJpbGl0eSAqIGluZmx1ZW5jZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gRG9lcyBub3QgZXhpc3QgdGhlcmUgeWV0LCBtaWdodCBiZSB0aHJvdWdoIG11dGF0aW9uXHJcbiAgICAgICAgICBjb25uZWN0aW9uLnh0cmFjZS5ub2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgY29ubmVjdGlvbi54dHJhY2UudmFsdWVzLnB1c2godGhpcy5kZXJpdmF0aXZlICogY29ubmVjdGlvbi5lbGVnaWJpbGl0eSAqIGluZmx1ZW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGlvbjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBY3RpdmF0ZXMgdGhlIG5vZGUgd2l0aG91dCBjYWxjdWxhdGluZyBlbGVnaWJpbGl0eSB0cmFjZXMgYW5kIHN1Y2hcclxuICAgKi9cclxuICBub1RyYWNlQWN0aXZhdGU6IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgYW4gaW5wdXQgaXMgZ2l2ZW5cclxuICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZhdGlvbiA9IGlucHV0O1xyXG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFsbCBhY3RpdmF0aW9uIHNvdXJjZXMgY29taW5nIGZyb20gdGhlIG5vZGUgaXRzZWxmXHJcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5jb25uZWN0aW9ucy5zZWxmLmdhaW4gKiB0aGlzLmNvbm5lY3Rpb25zLnNlbGYud2VpZ2h0ICogdGhpcy5zdGF0ZSArIHRoaXMuYmlhcztcclxuXHJcbiAgICAvLyBBY3RpdmF0aW9uIHNvdXJjZXMgY29taW5nIGZyb20gY29ubmVjdGlvbnNcclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY29ubmVjdGlvbnMuaW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3Rpb25zLmluW2ldO1xyXG4gICAgICB0aGlzLnN0YXRlICs9IGNvbm5lY3Rpb24uZnJvbS5hY3RpdmF0aW9uICogY29ubmVjdGlvbi53ZWlnaHQgKiBjb25uZWN0aW9uLmdhaW47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3F1YXNoIHRoZSB2YWx1ZXMgcmVjZWl2ZWRcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IHRoaXMuc3F1YXNoKHRoaXMuc3RhdGUpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuZ2F0ZWRbaV0uZ2FpbiA9IHRoaXMuYWN0aXZhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmF0aW9uO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEJhY2stcHJvcGFnYXRlIHRoZSBlcnJvciwgYWthIGxlYXJuXHJcbiAgICovXHJcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbiAocmF0ZSwgbW9tZW50dW0sIHVwZGF0ZSwgdGFyZ2V0KSB7XHJcbiAgICBtb21lbnR1bSA9IG1vbWVudHVtIHx8IDA7XHJcbiAgICByYXRlID0gcmF0ZSB8fCAwLjM7XHJcblxyXG4gICAgLy8gRXJyb3IgYWNjdW11bGF0b3JcclxuICAgIHZhciBlcnJvciA9IDA7XHJcblxyXG4gICAgLy8gT3V0cHV0IG5vZGVzIGdldCB0aGVpciBlcnJvciBmcm9tIHRoZSBlbnZpcm9tZW50XHJcbiAgICBpZiAodGhpcy50eXBlID09PSAnb3V0cHV0Jykge1xyXG4gICAgICB0aGlzLmVycm9yLnJlc3BvbnNpYmlsaXR5ID0gdGhpcy5lcnJvci5wcm9qZWN0ZWQgPSB0YXJnZXQgLSB0aGlzLmFjdGl2YXRpb247XHJcbiAgICB9IGVsc2UgeyAvLyB0aGUgcmVzdCBvZiB0aGUgbm9kZXMgY29tcHV0ZSB0aGVpciBlcnJvciByZXNwb25zaWJpbGl0aWVzIGJ5IGJhY2twcm9wYWdhdGlvblxyXG4gICAgICAvLyBlcnJvciByZXNwb25zaWJpbGl0aWVzIGZyb20gYWxsIHRoZSBjb25uZWN0aW9ucyBwcm9qZWN0ZWQgZnJvbSB0aGlzIG5vZGVcclxuICAgICAgdmFyIGk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLm91dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjb25uZWN0aW9uID0gdGhpcy5jb25uZWN0aW9ucy5vdXRbaV07XHJcbiAgICAgICAgbGV0IG5vZGUgPSBjb25uZWN0aW9uLnRvO1xyXG4gICAgICAgIC8vIEVxLiAyMVxyXG4gICAgICAgIGVycm9yICs9IG5vZGUuZXJyb3IucmVzcG9uc2liaWxpdHkgKiBjb25uZWN0aW9uLndlaWdodCAqIGNvbm5lY3Rpb24uZ2FpbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJvamVjdGVkIGVycm9yIHJlc3BvbnNpYmlsaXR5XHJcbiAgICAgIHRoaXMuZXJyb3IucHJvamVjdGVkID0gdGhpcy5kZXJpdmF0aXZlICogZXJyb3I7XHJcblxyXG4gICAgICAvLyBFcnJvciByZXNwb25zaWJpbGl0aWVzIGZyb20gYWxsIGNvbm5lY3Rpb25zIGdhdGVkIGJ5IHRoaXMgbmV1cm9uXHJcbiAgICAgIGVycm9yID0gMDtcclxuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNvbm4gPSB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkW2ldO1xyXG4gICAgICAgIGxldCBub2RlID0gY29ubi50bztcclxuICAgICAgICBsZXQgaW5mbHVlbmNlID0gbm9kZS5jb25uZWN0aW9ucy5zZWxmLmdhdGVyID09PSB0aGlzID8gbm9kZS5vbGQgOiAwO1xyXG5cclxuICAgICAgICBpbmZsdWVuY2UgKz0gY29ubi53ZWlnaHQgKiBjb25uLmZyb20uYWN0aXZhdGlvbjtcclxuICAgICAgICBlcnJvciArPSBub2RlLmVycm9yLnJlc3BvbnNpYmlsaXR5ICogaW5mbHVlbmNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBHYXRlZCBlcnJvciByZXNwb25zaWJpbGl0eVxyXG4gICAgICB0aGlzLmVycm9yLmdhdGVkID0gdGhpcy5kZXJpdmF0aXZlICogZXJyb3I7XHJcblxyXG4gICAgICAvLyBFcnJvciByZXNwb25zaWJpbGl0eVxyXG4gICAgICB0aGlzLmVycm9yLnJlc3BvbnNpYmlsaXR5ID0gdGhpcy5lcnJvci5wcm9qZWN0ZWQgKyB0aGlzLmVycm9yLmdhdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdjb25zdGFudCcpIHJldHVybjtcclxuXHJcbiAgICAvLyBBZGp1c3QgYWxsIHRoZSBub2RlJ3MgaW5jb21pbmcgY29ubmVjdGlvbnNcclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmluLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjb25uZWN0aW9uID0gdGhpcy5jb25uZWN0aW9ucy5pbltpXTtcclxuXHJcbiAgICAgIGxldCBncmFkaWVudCA9IHRoaXMuZXJyb3IucHJvamVjdGVkICogY29ubmVjdGlvbi5lbGVnaWJpbGl0eTtcclxuXHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29ubmVjdGlvbi54dHJhY2Uubm9kZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBsZXQgbm9kZSA9IGNvbm5lY3Rpb24ueHRyYWNlLm5vZGVzW2pdO1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGNvbm5lY3Rpb24ueHRyYWNlLnZhbHVlc1tqXTtcclxuICAgICAgICBncmFkaWVudCArPSBub2RlLmVycm9yLnJlc3BvbnNpYmlsaXR5ICogdmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkanVzdCB3ZWlnaHRcclxuICAgICAgbGV0IGRlbHRhV2VpZ2h0ID0gcmF0ZSAqIGdyYWRpZW50ICogdGhpcy5tYXNrO1xyXG4gICAgICBjb25uZWN0aW9uLnRvdGFsRGVsdGFXZWlnaHQgKz0gZGVsdGFXZWlnaHQ7XHJcbiAgICAgIGlmICh1cGRhdGUpIHtcclxuICAgICAgICBjb25uZWN0aW9uLnRvdGFsRGVsdGFXZWlnaHQgKz0gbW9tZW50dW0gKiBjb25uZWN0aW9uLnByZXZpb3VzRGVsdGFXZWlnaHQ7XHJcbiAgICAgICAgY29ubmVjdGlvbi53ZWlnaHQgKz0gY29ubmVjdGlvbi50b3RhbERlbHRhV2VpZ2h0O1xyXG4gICAgICAgIGNvbm5lY3Rpb24ucHJldmlvdXNEZWx0YVdlaWdodCA9IGNvbm5lY3Rpb24udG90YWxEZWx0YVdlaWdodDtcclxuICAgICAgICBjb25uZWN0aW9uLnRvdGFsRGVsdGFXZWlnaHQgPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRqdXN0IGJpYXNcclxuICAgIHZhciBkZWx0YUJpYXMgPSByYXRlICogdGhpcy5lcnJvci5yZXNwb25zaWJpbGl0eTtcclxuICAgIHRoaXMudG90YWxEZWx0YUJpYXMgKz0gZGVsdGFCaWFzO1xyXG4gICAgaWYgKHVwZGF0ZSkge1xyXG4gICAgICB0aGlzLnRvdGFsRGVsdGFCaWFzICs9IG1vbWVudHVtICogdGhpcy5wcmV2aW91c0RlbHRhQmlhcztcclxuICAgICAgdGhpcy5iaWFzICs9IHRoaXMudG90YWxEZWx0YUJpYXM7XHJcbiAgICAgIHRoaXMucHJldmlvdXNEZWx0YUJpYXMgPSB0aGlzLnRvdGFsRGVsdGFCaWFzO1xyXG4gICAgICB0aGlzLnRvdGFsRGVsdGFCaWFzID0gMDtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgY29ubmVjdGlvbiBmcm9tIHRoaXMgbm9kZSB0byB0aGUgZ2l2ZW4gbm9kZVxyXG4gICAqL1xyXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uICh0YXJnZXQsIHdlaWdodCkge1xyXG4gICAgdmFyIGNvbm5lY3Rpb25zID0gW107XHJcbiAgICBpZiAodHlwZW9mIHRhcmdldC5iaWFzICE9PSAndW5kZWZpbmVkJykgeyAvLyBtdXN0IGJlIGEgbm9kZSFcclxuICAgICAgaWYgKHRhcmdldCA9PT0gdGhpcykge1xyXG4gICAgICAgIC8vIFR1cm4gb24gdGhlIHNlbGYgY29ubmVjdGlvbiBieSBzZXR0aW5nIHRoZSB3ZWlnaHRcclxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9ucy5zZWxmLndlaWdodCAhPT0gMCkge1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy53YXJuaW5ncykgY29uc29sZS53YXJuKCdUaGlzIGNvbm5lY3Rpb24gYWxyZWFkeSBleGlzdHMhJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMuc2VsZi53ZWlnaHQgPSB3ZWlnaHQgfHwgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29ubmVjdGlvbnMucHVzaCh0aGlzLmNvbm5lY3Rpb25zLnNlbGYpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNQcm9qZWN0aW5nVG8odGFyZ2V0KSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQWxyZWFkeSBwcm9qZWN0aW5nIGEgY29ubmVjdGlvbiB0byB0aGlzIG5vZGUhJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbih0aGlzLCB0YXJnZXQsIHdlaWdodCk7XHJcbiAgICAgICAgdGFyZ2V0LmNvbm5lY3Rpb25zLmluLnB1c2goY29ubmVjdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5vdXQucHVzaChjb25uZWN0aW9uKTtcclxuXHJcbiAgICAgICAgY29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gc2hvdWxkIGJlIGEgZ3JvdXBcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKHRoaXMsIHRhcmdldC5ub2Rlc1tpXSwgd2VpZ2h0KTtcclxuICAgICAgICB0YXJnZXQubm9kZXNbaV0uY29ubmVjdGlvbnMuaW4ucHVzaChjb25uZWN0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLm91dC5wdXNoKGNvbm5lY3Rpb24pO1xyXG4gICAgICAgIHRhcmdldC5jb25uZWN0aW9ucy5pbi5wdXNoKGNvbm5lY3Rpb24pO1xyXG5cclxuICAgICAgICBjb25uZWN0aW9ucy5wdXNoKGNvbm5lY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29ubmVjdGlvbnM7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRGlzY29ubmVjdHMgdGhpcyBub2RlIGZyb20gdGhlIG90aGVyIG5vZGVcclxuICAgKi9cclxuICBkaXNjb25uZWN0OiBmdW5jdGlvbiAobm9kZSwgdHdvc2lkZWQpIHtcclxuICAgIGlmICh0aGlzID09PSBub2RlKSB7XHJcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuc2VsZi53ZWlnaHQgPSAwO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLm91dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY29ubiA9IHRoaXMuY29ubmVjdGlvbnMub3V0W2ldO1xyXG4gICAgICBpZiAoY29ubi50byA9PT0gbm9kZSkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMub3V0LnNwbGljZShpLCAxKTtcclxuICAgICAgICBsZXQgaiA9IGNvbm4udG8uY29ubmVjdGlvbnMuaW4uaW5kZXhPZihjb25uKTtcclxuICAgICAgICBjb25uLnRvLmNvbm5lY3Rpb25zLmluLnNwbGljZShqLCAxKTtcclxuICAgICAgICBpZiAoY29ubi5nYXRlciAhPT0gbnVsbCkgY29ubi5nYXRlci51bmdhdGUoY29ubik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHdvc2lkZWQpIHtcclxuICAgICAgbm9kZS5kaXNjb25uZWN0KHRoaXMpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgdGhpcyBub2RlIGdhdGUgYSBjb25uZWN0aW9uXHJcbiAgICovXHJcbiAgZ2F0ZTogZnVuY3Rpb24gKGNvbm5lY3Rpb25zKSB7XHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29ubmVjdGlvbnMpKSB7XHJcbiAgICAgIGNvbm5lY3Rpb25zID0gW2Nvbm5lY3Rpb25zXTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb25uZWN0aW9uID0gY29ubmVjdGlvbnNbaV07XHJcblxyXG4gICAgICB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkLnB1c2goY29ubmVjdGlvbik7XHJcbiAgICAgIGNvbm5lY3Rpb24uZ2F0ZXIgPSB0aGlzO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGhlIGdhdGVzIGZyb20gdGhpcyBub2RlIGZyb20gdGhlIGdpdmVuIGNvbm5lY3Rpb24ocylcclxuICAgKi9cclxuICB1bmdhdGU6IGZ1bmN0aW9uIChjb25uZWN0aW9ucykge1xyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbm5lY3Rpb25zKSkge1xyXG4gICAgICBjb25uZWN0aW9ucyA9IFtjb25uZWN0aW9uc107XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGNvbm5lY3Rpb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIHZhciBjb25uZWN0aW9uID0gY29ubmVjdGlvbnNbaV07XHJcblxyXG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkLmluZGV4T2YoY29ubmVjdGlvbik7XHJcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuZ2F0ZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgY29ubmVjdGlvbi5nYXRlciA9IG51bGw7XHJcbiAgICAgIGNvbm5lY3Rpb24uZ2FpbiA9IDE7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgdGhlIGNvbnRleHQgb2YgdGhlIG5vZGVcclxuICAgKi9cclxuICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmluLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb25uZWN0aW9uID0gdGhpcy5jb25uZWN0aW9ucy5pbltpXTtcclxuXHJcbiAgICAgIGNvbm5lY3Rpb24uZWxlZ2liaWxpdHkgPSAwO1xyXG4gICAgICBjb25uZWN0aW9uLnh0cmFjZSA9IHtcclxuICAgICAgICBub2RlczogW10sXHJcbiAgICAgICAgdmFsdWVzOiBbXVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmdhdGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjb25uID0gdGhpcy5jb25uZWN0aW9ucy5nYXRlZFtpXTtcclxuICAgICAgY29ubi5nYWluID0gMDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVycm9yLnJlc3BvbnNpYmlsaXR5ID0gdGhpcy5lcnJvci5wcm9qZWN0ZWQgPSB0aGlzLmVycm9yLmdhdGVkID0gMDtcclxuICAgIHRoaXMub2xkID0gdGhpcy5zdGF0ZSA9IHRoaXMuYWN0aXZhdGlvbiA9IDA7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTXV0YXRlcyB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBtZXRob2RcclxuICAgKi9cclxuICBtdXRhdGU6IGZ1bmN0aW9uIChtZXRob2QpIHtcclxuICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG11dGF0ZSBtZXRob2QgZ2l2ZW4hJyk7XHJcbiAgICB9IGVsc2UgaWYgKCEobWV0aG9kLm5hbWUgaW4gbWV0aG9kcy5tdXRhdGlvbikpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBkb2VzIG5vdCBleGlzdCEnKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xyXG4gICAgICBjYXNlIG1ldGhvZHMubXV0YXRpb24uTU9EX0FDVElWQVRJT046XHJcbiAgICAgICAgLy8gQ2FuJ3QgYmUgdGhlIHNhbWUgc3F1YXNoXHJcbiAgICAgICAgdmFyIHNxdWFzaCA9IG1ldGhvZC5hbGxvd2VkWyhtZXRob2QuYWxsb3dlZC5pbmRleE9mKHRoaXMuc3F1YXNoKSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtZXRob2QuYWxsb3dlZC5sZW5ndGggLSAxKSkgKyAxKSAlIG1ldGhvZC5hbGxvd2VkLmxlbmd0aF07XHJcbiAgICAgICAgdGhpcy5zcXVhc2ggPSBzcXVhc2g7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgbWV0aG9kcy5tdXRhdGlvbi5NT0RfQklBUzpcclxuICAgICAgICB2YXIgbW9kaWZpY2F0aW9uID0gTWF0aC5yYW5kb20oKSAqIChtZXRob2QubWF4IC0gbWV0aG9kLm1pbikgKyBtZXRob2QubWluO1xyXG4gICAgICAgIHRoaXMuYmlhcyArPSBtb2RpZmljYXRpb247XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIGlmIHRoaXMgbm9kZSBpcyBwcm9qZWN0aW5nIHRvIHRoZSBnaXZlbiBub2RlXHJcbiAgICovXHJcbiAgaXNQcm9qZWN0aW5nVG86IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICBpZiAobm9kZSA9PT0gdGhpcyAmJiB0aGlzLmNvbm5lY3Rpb25zLnNlbGYud2VpZ2h0ICE9PSAwKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29ubmVjdGlvbnMub3V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb25uID0gdGhpcy5jb25uZWN0aW9ucy5vdXRbaV07XHJcbiAgICAgIGlmIChjb25uLnRvID09PSBub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgcHJvamVjdGluZyB0byB0aGlzIG5vZGVcclxuICAgKi9cclxuICBpc1Byb2plY3RlZEJ5OiBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKG5vZGUgPT09IHRoaXMgJiYgdGhpcy5jb25uZWN0aW9ucy5zZWxmLndlaWdodCAhPT0gMCkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbm5lY3Rpb25zLmluLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb25uID0gdGhpcy5jb25uZWN0aW9ucy5pbltpXTtcclxuICAgICAgaWYgKGNvbm4uZnJvbSA9PT0gbm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnRzIHRoZSBub2RlIHRvIGEganNvbiBvYmplY3RcclxuICAgKi9cclxuICB0b0pTT046IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBqc29uID0ge1xyXG4gICAgICBiaWFzOiB0aGlzLmJpYXMsXHJcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgc3F1YXNoOiB0aGlzLnNxdWFzaC5uYW1lLFxyXG4gICAgICBtYXNrOiB0aGlzLm1hc2tcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGpzb247XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBqc29uIG9iamVjdCB0byBhIG5vZGVcclxuICovXHJcbk5vZGUuZnJvbUpTT04gPSBmdW5jdGlvbiAoanNvbikge1xyXG4gIHZhciBub2RlID0gbmV3IE5vZGUoKTtcclxuICBub2RlLmJpYXMgPSBqc29uLmJpYXM7XHJcbiAgbm9kZS50eXBlID0ganNvbi50eXBlO1xyXG4gIG5vZGUubWFzayA9IGpzb24ubWFzaztcclxuICBub2RlLnNxdWFzaCA9IG1ldGhvZHMuYWN0aXZhdGlvbltqc29uLnNxdWFzaF07XHJcblxyXG4gIHJldHVybiBub2RlO1xyXG59O1xyXG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENPTkZJR1xyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLy8gQ29uZmlnXHJcbnZhciBjb25maWcgPSB7XHJcbiAgd2FybmluZ3M6IGZhbHNlXHJcbn07XHJcblxyXG4vKiBFeHBvcnQgKi9cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBQ1RJVkFUSU9OIEZVTkNUSU9OU1xyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQWN0aXZhdGlvbl9mdW5jdGlvblxyXG4vLyBodHRwczovL3N0YXRzLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy8xMTUyNTgvY29tcHJlaGVuc2l2ZS1saXN0LW9mLWFjdGl2YXRpb24tZnVuY3Rpb25zLWluLW5ldXJhbC1uZXR3b3Jrcy13aXRoLXByb3MtY29uc1xyXG52YXIgYWN0aXZhdGlvbiA9IHtcclxuICBMT0dJU1RJQzogZnVuY3Rpb24gKHgsIGRlcml2YXRlKSB7XHJcbiAgICB2YXIgZnggPSAxIC8gKDEgKyBNYXRoLmV4cCgteCkpO1xyXG4gICAgaWYgKCFkZXJpdmF0ZSkgcmV0dXJuIGZ4O1xyXG4gICAgcmV0dXJuIGZ4ICogKDEgLSBmeCk7XHJcbiAgfSxcclxuICBUQU5IOiBmdW5jdGlvbiAoeCwgZGVyaXZhdGUpIHtcclxuICAgIGlmIChkZXJpdmF0ZSkgcmV0dXJuIDEgLSBNYXRoLnBvdyhNYXRoLnRhbmgoeCksIDIpO1xyXG4gICAgcmV0dXJuIE1hdGgudGFuaCh4KTtcclxuICB9LFxyXG4gIElERU5USVRZOiBmdW5jdGlvbiAoeCwgZGVyaXZhdGUpIHtcclxuICAgIHJldHVybiBkZXJpdmF0ZSA/IDEgOiB4O1xyXG4gIH0sXHJcbiAgU1RFUDogZnVuY3Rpb24gKHgsIGRlcml2YXRlKSB7XHJcbiAgICByZXR1cm4gZGVyaXZhdGUgPyAwIDogeCA+IDAgPyAxIDogMDtcclxuICB9LFxyXG4gIFJFTFU6IGZ1bmN0aW9uICh4LCBkZXJpdmF0ZSkge1xyXG4gICAgaWYgKGRlcml2YXRlKSByZXR1cm4geCA+IDAgPyAxIDogMDtcclxuICAgIHJldHVybiB4ID4gMCA/IHggOiAwO1xyXG4gIH0sXHJcbiAgU09GVFNJR046IGZ1bmN0aW9uICh4LCBkZXJpdmF0ZSkge1xyXG4gICAgdmFyIGQgPSAxICsgTWF0aC5hYnMoeCk7XHJcbiAgICBpZiAoZGVyaXZhdGUpIHJldHVybiB4IC8gTWF0aC5wb3coZCwgMik7XHJcbiAgICByZXR1cm4geCAvIGQ7XHJcbiAgfSxcclxuICBTSU5VU09JRDogZnVuY3Rpb24gKHgsIGRlcml2YXRlKSB7XHJcbiAgICBpZiAoZGVyaXZhdGUpIHJldHVybiBNYXRoLmNvcyh4KTtcclxuICAgIHJldHVybiBNYXRoLnNpbih4KTtcclxuICB9LFxyXG4gIEdBVVNTSUFOOiBmdW5jdGlvbiAoeCwgZGVyaXZhdGUpIHtcclxuICAgIHZhciBkID0gTWF0aC5leHAoLU1hdGgucG93KHgsIDIpKTtcclxuICAgIGlmIChkZXJpdmF0ZSkgcmV0dXJuIC0yICogeCAqIGQ7XHJcbiAgICByZXR1cm4gZDtcclxuICB9LFxyXG4gIEJFTlRfSURFTlRJVFk6IGZ1bmN0aW9uICh4LCBkZXJpdmF0ZSkge1xyXG4gICAgdmFyIGQgPSBNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyAxKTtcclxuICAgIGlmIChkZXJpdmF0ZSkgcmV0dXJuIHggLyAoMiAqIGQpICsgMTtcclxuICAgIHJldHVybiAoZCAtIDEpIC8gMiArIHg7XHJcbiAgfSxcclxuICBCSVBPTEFSOiBmdW5jdGlvbiAoeCwgZGVyaXZhdGUpIHtcclxuICAgIHJldHVybiBkZXJpdmF0ZSA/IDAgOiB4ID4gMCA/IDEgOiAtMTtcclxuICB9LFxyXG4gIEJJUE9MQVJfU0lHTU9JRDogZnVuY3Rpb24gKHgsIGRlcml2YXRlKSB7XHJcbiAgICB2YXIgZCA9IDIgLyAoMSArIE1hdGguZXhwKC14KSkgLSAxO1xyXG4gICAgaWYgKGRlcml2YXRlKSByZXR1cm4gMSAvIDIgKiAoMSArIGQpICogKDEgLSBkKTtcclxuICAgIHJldHVybiBkO1xyXG4gIH0sXHJcbiAgSEFSRF9UQU5IOiBmdW5jdGlvbiAoeCwgZGVyaXZhdGUpIHtcclxuICAgIGlmIChkZXJpdmF0ZSkgcmV0dXJuIHggPiAtMSAmJiB4IDwgMSA/IDEgOiAwO1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCB4KSk7XHJcbiAgfSxcclxuICBBQlNPTFVURTogZnVuY3Rpb24gKHgsIGRlcml2YXRlKSB7XHJcbiAgICBpZiAoZGVyaXZhdGUpIHJldHVybiB4IDwgMCA/IC0xIDogMTtcclxuICAgIHJldHVybiBNYXRoLmFicyh4KTtcclxuICB9LFxyXG4gIElOVkVSU0U6IGZ1bmN0aW9uICh4LCBkZXJpdmF0ZSkge1xyXG4gICAgaWYgKGRlcml2YXRlKSByZXR1cm4gLTE7XHJcbiAgICByZXR1cm4gMSAtIHg7XHJcbiAgfSxcclxuICAvLyBodHRwczovL2FyeGl2Lm9yZy9wZGYvMTcwNi4wMjUxNS5wZGZcclxuICBTRUxVOiBmdW5jdGlvbiAoeCwgZGVyaXZhdGUpIHtcclxuICAgIHZhciBhbHBoYSA9IDEuNjczMjYzMjQyMzU0Mzc3Mjg0ODE3MDQyOTkxNjcxNztcclxuICAgIHZhciBzY2FsZSA9IDEuMDUwNzAwOTg3MzU1NDgwNDkzNDE5MzM0OTg1Mjk0NjtcclxuICAgIHZhciBmeCA9IHggPiAwID8geCA6IGFscGhhICogTWF0aC5leHAoeCkgLSBhbHBoYTtcclxuICAgIGlmIChkZXJpdmF0ZSkgeyByZXR1cm4geCA+IDAgPyBzY2FsZSA6IChmeCArIGFscGhhKSAqIHNjYWxlOyB9XHJcbiAgICByZXR1cm4gZnggKiBzY2FsZTtcclxuICB9XHJcbn07XHJcblxyXG4vKiBFeHBvcnQgKi9cclxubW9kdWxlLmV4cG9ydHMgPSBhY3RpdmF0aW9uO1xyXG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDT05ORUNUSU9OXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4vLyBTcGVjaWZpZXMgaW4gd2hhdCBtYW5uZXIgdHdvIGdyb3VwcyBhcmUgY29ubmVjdGVkXHJcbnZhciBjb25uZWN0aW9uID0ge1xyXG4gIEFMTF9UT19BTEw6IHtcclxuICAgIG5hbWU6ICdPVVRQVVQnXHJcbiAgfSxcclxuICBBTExfVE9fRUxTRToge1xyXG4gICAgbmFtZTogJ0lOUFVUJ1xyXG4gIH0sXHJcbiAgT05FX1RPX09ORToge1xyXG4gICAgbmFtZTogJ1NFTEYnXHJcbiAgfVxyXG59O1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gY29ubmVjdGlvbjtcclxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ09TVCBGVU5DVElPTlNcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xvc3NfZnVuY3Rpb25cclxudmFyIGNvc3QgPSB7XHJcbiAgLy8gQ3Jvc3MgZW50cm9weSBlcnJvclxyXG4gIENST1NTX0VOVFJPUFk6IGZ1bmN0aW9uICh0YXJnZXQsIG91dHB1dCkge1xyXG4gICAgdmFyIGVycm9yID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vIEF2b2lkIG5lZ2F0aXZlIGFuZCB6ZXJvIG51bWJlcnMsIHVzZSAxZS0xNSBodHRwOi8vYml0Lmx5LzJwNVcyOUFcclxuICAgICAgZXJyb3IgLT0gdGFyZ2V0W2ldICogTWF0aC5sb2coTWF0aC5tYXgob3V0cHV0W2ldLCAxZS0xNSkpICsgKDEgLSB0YXJnZXRbaV0pICogTWF0aC5sb2coMSAtIE1hdGgubWF4KG91dHB1dFtpXSwgMWUtMTUpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBlcnJvciAvIG91dHB1dC5sZW5ndGg7XHJcbiAgfSxcclxuICAvLyBNZWFuIFNxdWFyZWQgRXJyb3JcclxuICBNU0U6IGZ1bmN0aW9uICh0YXJnZXQsIG91dHB1dCkge1xyXG4gICAgdmFyIGVycm9yID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGVycm9yICs9IE1hdGgucG93KHRhcmdldFtpXSAtIG91dHB1dFtpXSwgMik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVycm9yIC8gb3V0cHV0Lmxlbmd0aDtcclxuICB9LFxyXG4gIC8vIEJpbmFyeSBlcnJvclxyXG4gIEJJTkFSWTogZnVuY3Rpb24gKHRhcmdldCwgb3V0cHV0KSB7XHJcbiAgICB2YXIgbWlzc2VzID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1pc3NlcyArPSBNYXRoLnJvdW5kKHRhcmdldFtpXSAqIDIpICE9PSBNYXRoLnJvdW5kKG91dHB1dFtpXSAqIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtaXNzZXM7XHJcbiAgfSxcclxuICAvLyBNZWFuIEFic29sdXRlIEVycm9yXHJcbiAgTUFFOiBmdW5jdGlvbiAodGFyZ2V0LCBvdXRwdXQpIHtcclxuICAgIHZhciBlcnJvciA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlcnJvciArPSBNYXRoLmFicyh0YXJnZXRbaV0gLSBvdXRwdXRbaV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlcnJvciAvIG91dHB1dC5sZW5ndGg7XHJcbiAgfSxcclxuICAvLyBNZWFuIEFic29sdXRlIFBlcmNlbnRhZ2UgRXJyb3JcclxuICBNQVBFOiBmdW5jdGlvbiAodGFyZ2V0LCBvdXRwdXQpIHtcclxuICAgIHZhciBlcnJvciA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlcnJvciArPSBNYXRoLmFicygob3V0cHV0W2ldIC0gdGFyZ2V0W2ldKSAvIE1hdGgubWF4KHRhcmdldFtpXSwgMWUtMTUpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXJyb3IgLyBvdXRwdXQubGVuZ3RoO1xyXG4gIH0sXHJcbiAgLy8gTWVhbiBTcXVhcmVkIExvZ2FyaXRobWljIEVycm9yXHJcbiAgTVNMRTogZnVuY3Rpb24gKHRhcmdldCwgb3V0cHV0KSB7XHJcbiAgICB2YXIgZXJyb3IgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvdXRwdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZXJyb3IgKz0gTWF0aC5sb2coTWF0aC5tYXgodGFyZ2V0W2ldLCAxZS0xNSkpIC0gTWF0aC5sb2coTWF0aC5tYXgob3V0cHV0W2ldLCAxZS0xNSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlcnJvcjtcclxuICB9LFxyXG4gIC8vIEhpbmdlIGxvc3MsIGZvciBjbGFzc2lmaWVyc1xyXG4gIEhJTkdFOiBmdW5jdGlvbiAodGFyZ2V0LCBvdXRwdXQpIHtcclxuICAgIHZhciBlcnJvciA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlcnJvciArPSBNYXRoLm1heCgwLCAxIC0gdGFyZ2V0W2ldICogb3V0cHV0W2ldKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXJyb3I7XHJcbiAgfVxyXG59O1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gY29zdDtcclxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDUk9TU09WRVJcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Nyb3Nzb3Zlcl8oZ2VuZXRpY19hbGdvcml0aG0pXHJcbnZhciBjcm9zc292ZXIgPSB7XHJcbiAgU0lOR0xFX1BPSU5UOiB7XHJcbiAgICBuYW1lOiAnU0lOR0xFX1BPSU5UJyxcclxuICAgIGNvbmZpZzogWzAuNF1cclxuICB9LFxyXG4gIFRXT19QT0lOVDoge1xyXG4gICAgbmFtZTogJ1RXT19QT0lOVCcsXHJcbiAgICBjb25maWc6IFswLjQsIDAuOV1cclxuICB9LFxyXG4gIFVOSUZPUk06IHtcclxuICAgIG5hbWU6ICdVTklGT1JNJ1xyXG4gIH0sXHJcbiAgQVZFUkFHRToge1xyXG4gICAgbmFtZTogJ0FWRVJBR0UnXHJcbiAgfVxyXG59O1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gY3Jvc3NvdmVyO1xyXG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHQVRJTkdcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbi8vIFNwZWNpZmllcyBob3cgdG8gZ2F0ZSBhIGNvbm5lY3Rpb24gYmV0d2VlbiB0d28gZ3JvdXBzIG9mIG11bHRpcGxlIG5ldXJvbnNcclxudmFyIGdhdGluZyA9IHtcclxuICBPVVRQVVQ6IHtcclxuICAgIG5hbWU6ICdPVVRQVVQnXHJcbiAgfSxcclxuICBJTlBVVDoge1xyXG4gICAgbmFtZTogJ0lOUFVUJ1xyXG4gIH0sXHJcbiAgU0VMRjoge1xyXG4gICAgbmFtZTogJ1NFTEYnXHJcbiAgfVxyXG59O1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gZ2F0aW5nO1xyXG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUVUSE9EU1xyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxudmFyIG1ldGhvZHMgPSB7XHJcbiAgYWN0aXZhdGlvbjogcmVxdWlyZSgnLi9hY3RpdmF0aW9uJyksXHJcbiAgbXV0YXRpb246IHJlcXVpcmUoJy4vbXV0YXRpb24nKSxcclxuICBzZWxlY3Rpb246IHJlcXVpcmUoJy4vc2VsZWN0aW9uJyksXHJcbiAgY3Jvc3NvdmVyOiByZXF1aXJlKCcuL2Nyb3Nzb3ZlcicpLFxyXG4gIGNvc3Q6IHJlcXVpcmUoJy4vY29zdCcpLFxyXG4gIGdhdGluZzogcmVxdWlyZSgnLi9nYXRpbmcnKSxcclxuICBjb25uZWN0aW9uOiByZXF1aXJlKCcuL2Nvbm5lY3Rpb24nKSxcclxuICByYXRlOiByZXF1aXJlKCcuL3JhdGUnKVxyXG59O1xyXG5cclxuLyoqIEV4cG9ydCAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IG1ldGhvZHM7XHJcbiIsIi8qIEltcG9ydCAqL1xyXG52YXIgYWN0aXZhdGlvbiA9IHJlcXVpcmUoJy4vYWN0aXZhdGlvbicpO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNVVRBVElPTlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvbXV0YXRpb25fKGdlbmV0aWNfYWxnb3JpdGhtKVxyXG52YXIgbXV0YXRpb24gPSB7XHJcbiAgQUREX05PREU6IHtcclxuICAgIG5hbWU6ICdBRERfTk9ERSdcclxuICB9LFxyXG4gIFNVQl9OT0RFOiB7XHJcbiAgICBuYW1lOiAnU1VCX05PREUnLFxyXG4gICAga2VlcF9nYXRlczogdHJ1ZVxyXG4gIH0sXHJcbiAgQUREX0NPTk46IHtcclxuICAgIG5hbWU6ICdBRERfQ09OTidcclxuICB9LFxyXG4gIFNVQl9DT05OOiB7XHJcbiAgICBuYW1lOiAnUkVNT1ZFX0NPTk4nXHJcbiAgfSxcclxuICBNT0RfV0VJR0hUOiB7XHJcbiAgICBuYW1lOiAnTU9EX1dFSUdIVCcsXHJcbiAgICBtaW46IC0xLFxyXG4gICAgbWF4OiAxXHJcbiAgfSxcclxuICBNT0RfQklBUzoge1xyXG4gICAgbmFtZTogJ01PRF9CSUFTJyxcclxuICAgIG1pbjogLTEsXHJcbiAgICBtYXg6IDFcclxuICB9LFxyXG4gIE1PRF9BQ1RJVkFUSU9OOiB7XHJcbiAgICBuYW1lOiAnTU9EX0FDVElWQVRJT04nLFxyXG4gICAgbXV0YXRlT3V0cHV0OiB0cnVlLFxyXG4gICAgYWxsb3dlZDogW1xyXG4gICAgICBhY3RpdmF0aW9uLkxPR0lTVElDLFxyXG4gICAgICBhY3RpdmF0aW9uLlRBTkgsXHJcbiAgICAgIGFjdGl2YXRpb24uUkVMVSxcclxuICAgICAgYWN0aXZhdGlvbi5JREVOVElUWSxcclxuICAgICAgYWN0aXZhdGlvbi5TVEVQLFxyXG4gICAgICBhY3RpdmF0aW9uLlNPRlRTSUdOLFxyXG4gICAgICBhY3RpdmF0aW9uLlNJTlVTT0lELFxyXG4gICAgICBhY3RpdmF0aW9uLkdBVVNTSUFOLFxyXG4gICAgICBhY3RpdmF0aW9uLkJFTlRfSURFTlRJVFksXHJcbiAgICAgIGFjdGl2YXRpb24uQklQT0xBUixcclxuICAgICAgYWN0aXZhdGlvbi5CSVBPTEFSX1NJR01PSUQsXHJcbiAgICAgIGFjdGl2YXRpb24uSEFSRF9UQU5ILFxyXG4gICAgICBhY3RpdmF0aW9uLkFCU09MVVRFLFxyXG4gICAgICBhY3RpdmF0aW9uLklOVkVSU0UsXHJcbiAgICAgIGFjdGl2YXRpb24uU0VMVVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgQUREX1NFTEZfQ09OTjoge1xyXG4gICAgbmFtZTogJ0FERF9TRUxGX0NPTk4nXHJcbiAgfSxcclxuICBTVUJfU0VMRl9DT05OOiB7XHJcbiAgICBuYW1lOiAnU1VCX1NFTEZfQ09OTidcclxuICB9LFxyXG4gIEFERF9HQVRFOiB7XHJcbiAgICBuYW1lOiAnQUREX0dBVEUnXHJcbiAgfSxcclxuICBTVUJfR0FURToge1xyXG4gICAgbmFtZTogJ1NVQl9HQVRFJ1xyXG4gIH0sXHJcbiAgQUREX0JBQ0tfQ09OTjoge1xyXG4gICAgbmFtZTogJ0FERF9CQUNLX0NPTk4nXHJcbiAgfSxcclxuICBTVUJfQkFDS19DT05OOiB7XHJcbiAgICBuYW1lOiAnU1VCX0JBQ0tfQ09OTidcclxuICB9LFxyXG4gIFNXQVBfTk9ERVM6IHtcclxuICAgIG5hbWU6ICdTV0FQX05PREVTJyxcclxuICAgIG11dGF0ZU91dHB1dDogdHJ1ZVxyXG4gIH1cclxufTtcclxuXHJcbm11dGF0aW9uLkFMTCA9IFtcclxuICBtdXRhdGlvbi5BRERfTk9ERSxcclxuICBtdXRhdGlvbi5TVUJfTk9ERSxcclxuICBtdXRhdGlvbi5BRERfQ09OTixcclxuICBtdXRhdGlvbi5TVUJfQ09OTixcclxuICBtdXRhdGlvbi5NT0RfV0VJR0hULFxyXG4gIG11dGF0aW9uLk1PRF9CSUFTLFxyXG4gIG11dGF0aW9uLk1PRF9BQ1RJVkFUSU9OLFxyXG4gIG11dGF0aW9uLkFERF9HQVRFLFxyXG4gIG11dGF0aW9uLlNVQl9HQVRFLFxyXG4gIG11dGF0aW9uLkFERF9TRUxGX0NPTk4sXHJcbiAgbXV0YXRpb24uU1VCX1NFTEZfQ09OTixcclxuICBtdXRhdGlvbi5BRERfQkFDS19DT05OLFxyXG4gIG11dGF0aW9uLlNVQl9CQUNLX0NPTk4sXHJcbiAgbXV0YXRpb24uU1dBUF9OT0RFU1xyXG5dO1xyXG5cclxubXV0YXRpb24uRkZXID0gW1xyXG4gIG11dGF0aW9uLkFERF9OT0RFLFxyXG4gIG11dGF0aW9uLlNVQl9OT0RFLFxyXG4gIG11dGF0aW9uLkFERF9DT05OLFxyXG4gIG11dGF0aW9uLlNVQl9DT05OLFxyXG4gIG11dGF0aW9uLk1PRF9XRUlHSFQsXHJcbiAgbXV0YXRpb24uTU9EX0JJQVMsXHJcbiAgbXV0YXRpb24uTU9EX0FDVElWQVRJT04sXHJcbiAgbXV0YXRpb24uU1dBUF9OT0RFU1xyXG5dO1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gbXV0YXRpb247XHJcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUkFURVxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzAwMzMwOTYvd2hhdC1pcy1sci1wb2xpY3ktaW4tY2FmZmUvMzAwNDUyNDRcclxudmFyIHJhdGUgPSB7XHJcbiAgRklYRUQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmdW5jID0gZnVuY3Rpb24gKGJhc2VSYXRlLCBpdGVyYXRpb24pIHsgcmV0dXJuIGJhc2VSYXRlOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmM7XHJcbiAgfSxcclxuICBTVEVQOiBmdW5jdGlvbiAoZ2FtbWEsIHN0ZXBTaXplKSB7XHJcbiAgICBnYW1tYSA9IGdhbW1hIHx8IDAuOTtcclxuICAgIHN0ZXBTaXplID0gc3RlcFNpemUgfHwgMTAwO1xyXG5cclxuICAgIHZhciBmdW5jID0gZnVuY3Rpb24gKGJhc2VSYXRlLCBpdGVyYXRpb24pIHtcclxuICAgICAgcmV0dXJuIGJhc2VSYXRlICogTWF0aC5wb3coZ2FtbWEsIE1hdGguZmxvb3IoaXRlcmF0aW9uIC8gc3RlcFNpemUpKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZ1bmM7XHJcbiAgfSxcclxuICBFWFA6IGZ1bmN0aW9uIChnYW1tYSkge1xyXG4gICAgZ2FtbWEgPSBnYW1tYSB8fCAwLjk5OTtcclxuXHJcbiAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uIChiYXNlUmF0ZSwgaXRlcmF0aW9uKSB7XHJcbiAgICAgIHJldHVybiBiYXNlUmF0ZSAqIE1hdGgucG93KGdhbW1hLCBpdGVyYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZnVuYztcclxuICB9LFxyXG4gIElOVjogZnVuY3Rpb24gKGdhbW1hLCBwb3dlcikge1xyXG4gICAgZ2FtbWEgPSBnYW1tYSB8fCAwLjAwMTtcclxuICAgIHBvd2VyID0gcG93ZXIgfHwgMjtcclxuXHJcbiAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uIChiYXNlUmF0ZSwgaXRlcmF0aW9uKSB7XHJcbiAgICAgIHJldHVybiBiYXNlUmF0ZSAqIE1hdGgucG93KDEgKyBnYW1tYSAqIGl0ZXJhdGlvbiwgLXBvd2VyKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZ1bmM7XHJcbiAgfVxyXG59O1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gcmF0ZTtcclxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTRUxFQ1RJT05cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NlbGVjdGlvbl8oZ2VuZXRpY19hbGdvcml0aG0pXHJcblxyXG52YXIgc2VsZWN0aW9uID0ge1xyXG4gIEZJVE5FU1NfUFJPUE9SVElPTkFURToge1xyXG4gICAgbmFtZTogJ0ZJVE5FU1NfUFJPUE9SVElPTkFURSdcclxuICB9LFxyXG4gIFBPV0VSOiB7XHJcbiAgICBuYW1lOiAnUE9XRVInLFxyXG4gICAgcG93ZXI6IDRcclxuICB9LFxyXG4gIFRPVVJOQU1FTlQ6IHtcclxuICAgIG5hbWU6ICdUT1VSTkFNRU5UJyxcclxuICAgIHNpemU6IDUsXHJcbiAgICBwcm9iYWJpbGl0eTogMC41XHJcbiAgfVxyXG59O1xyXG5cclxuLyogRXhwb3J0ICovXHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZWN0aW9uO1xyXG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1VTFRJVEhSRUFESU5HXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG52YXIgbXVsdGkgPSB7XHJcbiAgLyoqIFdvcmtlcnMgKi9cclxuICB3b3JrZXJzOiByZXF1aXJlKCcuL3dvcmtlcnMvd29ya2VycycpLFxyXG5cclxuICAvKiogU2VyaWFsaXplcyBhIGRhdGFzZXQgKi9cclxuICBzZXJpYWxpemVEYXRhU2V0OiBmdW5jdGlvbiAoZGF0YVNldCkge1xyXG4gICAgdmFyIHNlcmlhbGl6ZWQgPSBbZGF0YVNldFswXS5pbnB1dC5sZW5ndGgsIGRhdGFTZXRbMF0ub3V0cHV0Lmxlbmd0aF07XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhU2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBqO1xyXG4gICAgICBmb3IgKGogPSAwOyBqIDwgc2VyaWFsaXplZFswXTsgaisrKSB7XHJcbiAgICAgICAgc2VyaWFsaXplZC5wdXNoKGRhdGFTZXRbaV0uaW5wdXRbal0pO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoaiA9IDA7IGogPCBzZXJpYWxpemVkWzFdOyBqKyspIHtcclxuICAgICAgICBzZXJpYWxpemVkLnB1c2goZGF0YVNldFtpXS5vdXRwdXRbal0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XHJcbiAgfSxcclxuXHJcbiAgLyoqIEFjdGl2YXRlIGEgc2VyaWFsaXplZCBuZXR3b3JrICovXHJcbiAgYWN0aXZhdGVTZXJpYWxpemVkTmV0d29yazogZnVuY3Rpb24gKGlucHV0LCBBLCBTLCBkYXRhLCBGKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFbMF07IGkrKykgQVtpXSA9IGlucHV0W2ldO1xyXG4gICAgZm9yIChpID0gMjsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IGluZGV4ID0gZGF0YVtpKytdO1xyXG4gICAgICBsZXQgYmlhcyA9IGRhdGFbaSsrXTtcclxuICAgICAgbGV0IHNxdWFzaCA9IGRhdGFbaSsrXTtcclxuICAgICAgbGV0IHNlbGZ3ZWlnaHQgPSBkYXRhW2krK107XHJcbiAgICAgIGxldCBzZWxmZ2F0ZXIgPSBkYXRhW2krK107XHJcblxyXG4gICAgICBTW2luZGV4XSA9IChzZWxmZ2F0ZXIgPT09IC0xID8gMSA6IEFbc2VsZmdhdGVyXSkgKiBzZWxmd2VpZ2h0ICogU1tpbmRleF0gKyBiaWFzO1xyXG5cclxuICAgICAgd2hpbGUgKGRhdGFbaV0gIT09IC0yKSB7XHJcbiAgICAgICAgU1tpbmRleF0gKz0gQVtkYXRhW2krK11dICogZGF0YVtpKytdICogKGRhdGFbaSsrXSA9PT0gLTEgPyAxIDogQVtkYXRhW2kgLSAxXV0pO1xyXG4gICAgICB9XHJcbiAgICAgIEFbaW5kZXhdID0gRltzcXVhc2hdKFNbaW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICBmb3IgKGkgPSBBLmxlbmd0aCAtIGRhdGFbMV07IGkgPCBBLmxlbmd0aDsgaSsrKSBvdXRwdXQucHVzaChBW2ldKTtcclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfSxcclxuXHJcbiAgLyoqIERlc2VyaWFsaXplcyBhIGRhdGFzZXQgdG8gYW4gYXJyYXkgb2YgYXJyYXlzICovXHJcbiAgZGVzZXJpYWxpemVEYXRhU2V0OiBmdW5jdGlvbiAoc2VyaWFsaXplZFNldCkge1xyXG4gICAgdmFyIHNldCA9IFtdO1xyXG5cclxuICAgIHZhciBzYW1wbGVTaXplID0gc2VyaWFsaXplZFNldFswXSArIHNlcmlhbGl6ZWRTZXRbMV07XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IChzZXJpYWxpemVkU2V0Lmxlbmd0aCAtIDIpIC8gc2FtcGxlU2l6ZTsgaSsrKSB7XHJcbiAgICAgIGxldCBpbnB1dCA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBqID0gMiArIGkgKiBzYW1wbGVTaXplOyBqIDwgMiArIGkgKiBzYW1wbGVTaXplICsgc2VyaWFsaXplZFNldFswXTsgaisrKSB7XHJcbiAgICAgICAgaW5wdXQucHVzaChzZXJpYWxpemVkU2V0W2pdKTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgb3V0cHV0ID0gW107XHJcbiAgICAgIGZvciAoaiA9IDIgKyBpICogc2FtcGxlU2l6ZSArIHNlcmlhbGl6ZWRTZXRbMF07IGogPCAyICsgaSAqIHNhbXBsZVNpemUgKyBzYW1wbGVTaXplOyBqKyspIHtcclxuICAgICAgICBvdXRwdXQucHVzaChzZXJpYWxpemVkU2V0W2pdKTtcclxuICAgICAgfVxyXG4gICAgICBzZXQucHVzaChpbnB1dCk7XHJcbiAgICAgIHNldC5wdXNoKG91dHB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNldDtcclxuICB9LFxyXG5cclxuICAvKiogQSBsaXN0IG9mIGNvbXBpbGVkIGFjdGl2YXRpb24gZnVuY3Rpb25zIGluIGEgY2VydGFpbiBvcmRlciAqL1xyXG4gIGFjdGl2YXRpb25zOiBbXHJcbiAgICBmdW5jdGlvbiAoeCkgeyByZXR1cm4gMSAvICgxICsgTWF0aC5leHAoLXgpKTsgfSxcclxuICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiBNYXRoLnRhbmgoeCk7IH0sXHJcbiAgICBmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfSxcclxuICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ID4gMCA/IDEgOiAwOyB9LFxyXG4gICAgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggPiAwID8geCA6IDA7IH0sXHJcbiAgICBmdW5jdGlvbiAoeCkgeyByZXR1cm4geCAvICgxICsgTWF0aC5hYnMoeCkpOyB9LFxyXG4gICAgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIE1hdGguc2luKHgpOyB9LFxyXG4gICAgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIE1hdGguZXhwKC1NYXRoLnBvdyh4LCAyKSk7IH0sXHJcbiAgICBmdW5jdGlvbiAoeCkgeyByZXR1cm4gKE1hdGguc3FydChNYXRoLnBvdyh4LCAyKSArIDEpIC0gMSkgLyAyICsgeDsgfSxcclxuICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ID4gMCA/IDEgOiAtMTsgfSxcclxuICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiAyIC8gKDEgKyBNYXRoLmV4cCgteCkpIC0gMTsgfSxcclxuICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgeCkpOyB9LFxyXG4gICAgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIE1hdGguYWJzKHgpOyB9LFxyXG4gICAgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIDEgLSB4OyB9LFxyXG4gICAgZnVuY3Rpb24gKHgpIHtcclxuICAgICAgdmFyIGEgPSAxLjY3MzI2MzI0MjM1NDM3NzI4NDgxNzA0Mjk5MTY3MTc7XHJcbiAgICAgIHJldHVybiAoeCA+IDAgPyB4IDogYSAqIE1hdGguZXhwKHgpIC0gYSkgKiAxLjA1MDcwMDk4NzM1NTQ4MDQ5MzQxOTMzNDk4NTI5NDY7XHJcbiAgICB9XHJcbiAgXVxyXG59O1xyXG5cclxubXVsdGkudGVzdFNlcmlhbGl6ZWRTZXQgPSBmdW5jdGlvbiAoc2V0LCBjb3N0LCBBLCBTLCBkYXRhLCBGKSB7XHJcbiAgLy8gQ2FsY3VsYXRlIGhvdyBtdWNoIHNhbXBsZXMgYXJlIGluIHRoZSBzZXRcclxuICB2YXIgZXJyb3IgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSArPSAyKSB7XHJcbiAgICBsZXQgb3V0cHV0ID0gbXVsdGkuYWN0aXZhdGVTZXJpYWxpemVkTmV0d29yayhzZXRbaV0sIEEsIFMsIGRhdGEsIEYpO1xyXG4gICAgZXJyb3IgKz0gY29zdChzZXRbaSArIDFdLCBvdXRwdXQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVycm9yIC8gKHNldC5sZW5ndGggLyAyKTtcclxufTtcclxuXHJcbi8qIEV4cG9ydCAqL1xyXG5mb3IgKHZhciBpIGluIG11bHRpKSB7XHJcbiAgbW9kdWxlLmV4cG9ydHNbaV0gPSBtdWx0aVtpXTtcclxufVxyXG4iLCIvKiBFeHBvcnQgKi9cclxubW9kdWxlLmV4cG9ydHMgPSBUZXN0V29ya2VyO1xyXG5cclxuLyogSW1wb3J0ICovXHJcbnZhciBtdWx0aSA9IHJlcXVpcmUoJy4uLy4uL211bHRpJyk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdFQldPUktFUlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gVGVzdFdvcmtlciAoZGF0YVNldCwgY29zdCkge1xyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoW3RoaXMuX2NyZWF0ZUJsb2JTdHJpbmcoY29zdCldKTtcclxuICB0aGlzLnVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih0aGlzLnVybCk7XHJcblxyXG4gIHZhciBkYXRhID0geyBzZXQ6IG5ldyBGbG9hdDY0QXJyYXkoZGF0YVNldCkuYnVmZmVyIH07XHJcbiAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoZGF0YSwgW2RhdGEuc2V0XSk7XHJcbn1cclxuXHJcblRlc3RXb3JrZXIucHJvdG90eXBlID0ge1xyXG4gIGV2YWx1YXRlOiBmdW5jdGlvbiAobmV0d29yaykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdmFyIHNlcmlhbGl6ZWQgPSBuZXR3b3JrLnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgYWN0aXZhdGlvbnM6IG5ldyBGbG9hdDY0QXJyYXkoc2VyaWFsaXplZFswXSkuYnVmZmVyLFxyXG4gICAgICAgIHN0YXRlczogbmV3IEZsb2F0NjRBcnJheShzZXJpYWxpemVkWzFdKS5idWZmZXIsXHJcbiAgICAgICAgY29ubnM6IG5ldyBGbG9hdDY0QXJyYXkoc2VyaWFsaXplZFsyXSkuYnVmZmVyXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBGbG9hdDY0QXJyYXkoZS5kYXRhLmJ1ZmZlcilbMF07XHJcbiAgICAgICAgcmVzb2x2ZShlcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZShkYXRhLCBbZGF0YS5hY3RpdmF0aW9ucywgZGF0YS5zdGF0ZXMsIGRhdGEuY29ubnNdKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIHRlcm1pbmF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy53b3JrZXIudGVybWluYXRlKCk7XHJcbiAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh0aGlzLnVybCk7XHJcbiAgfSxcclxuXHJcbiAgX2NyZWF0ZUJsb2JTdHJpbmc6IGZ1bmN0aW9uIChjb3N0KSB7XHJcbiAgICB2YXIgc291cmNlID0gYFxyXG4gICAgICB2YXIgRiA9IFske211bHRpLmFjdGl2YXRpb25zLnRvU3RyaW5nKCl9XTtcclxuICAgICAgdmFyIGNvc3QgPSAke2Nvc3QudG9TdHJpbmcoKX07XHJcbiAgICAgIHZhciBtdWx0aSA9IHtcclxuICAgICAgICBkZXNlcmlhbGl6ZURhdGFTZXQ6ICR7bXVsdGkuZGVzZXJpYWxpemVEYXRhU2V0LnRvU3RyaW5nKCl9LFxyXG4gICAgICAgIHRlc3RTZXJpYWxpemVkU2V0OiAke211bHRpLnRlc3RTZXJpYWxpemVkU2V0LnRvU3RyaW5nKCl9LFxyXG4gICAgICAgIGFjdGl2YXRlU2VyaWFsaXplZE5ldHdvcms6ICR7bXVsdGkuYWN0aXZhdGVTZXJpYWxpemVkTmV0d29yay50b1N0cmluZygpfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmKHR5cGVvZiBlLmRhdGEuc2V0ID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICB2YXIgQSA9IG5ldyBGbG9hdDY0QXJyYXkoZS5kYXRhLmFjdGl2YXRpb25zKTtcclxuICAgICAgICAgIHZhciBTID0gbmV3IEZsb2F0NjRBcnJheShlLmRhdGEuc3RhdGVzKTtcclxuICAgICAgICAgIHZhciBkYXRhID0gbmV3IEZsb2F0NjRBcnJheShlLmRhdGEuY29ubnMpO1xyXG5cclxuICAgICAgICAgIHZhciBlcnJvciA9IG11bHRpLnRlc3RTZXJpYWxpemVkU2V0KHNldCwgY29zdCwgQSwgUywgZGF0YSwgRik7XHJcblxyXG4gICAgICAgICAgdmFyIGFuc3dlciA9IHsgYnVmZmVyOiBuZXcgRmxvYXQ2NEFycmF5KFtlcnJvciBdKS5idWZmZXIgfTtcclxuICAgICAgICAgIHBvc3RNZXNzYWdlKGFuc3dlciwgW2Fuc3dlci5idWZmZXJdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2V0ID0gbXVsdGkuZGVzZXJpYWxpemVEYXRhU2V0KG5ldyBGbG9hdDY0QXJyYXkoZS5kYXRhLnNldCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtgO1xyXG5cclxuICAgIHJldHVybiBzb3VyY2U7XHJcbiAgfVxyXG59O1xyXG4iLCIvKiBFeHBvcnQgKi9cclxubW9kdWxlLmV4cG9ydHMgPSBUZXN0V29ya2VyO1xyXG5cclxuLyogSW1wb3J0ICovXHJcbnZhciBjcCA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcclxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdFQldPUktFUlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gVGVzdFdvcmtlciAoZGF0YVNldCwgY29zdCkge1xyXG4gIHRoaXMud29ya2VyID0gY3AuZm9yayhwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3dvcmtlcicpKTtcclxuXHJcbiAgdGhpcy53b3JrZXIuc2VuZCh7IHNldDogZGF0YVNldCwgY29zdDogY29zdC5uYW1lIH0pO1xyXG59XHJcblxyXG5UZXN0V29ya2VyLnByb3RvdHlwZSA9IHtcclxuICBldmFsdWF0ZTogZnVuY3Rpb24gKG5ldHdvcmspIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHZhciBzZXJpYWxpemVkID0gbmV0d29yay5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIGFjdGl2YXRpb25zOiBzZXJpYWxpemVkWzBdLFxyXG4gICAgICAgIHN0YXRlczogc2VyaWFsaXplZFsxXSxcclxuICAgICAgICBjb25uczogc2VyaWFsaXplZFsyXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIF90aGF0ID0gdGhpcy53b3JrZXI7XHJcbiAgICAgIHRoaXMud29ya2VyLm9uKCdtZXNzYWdlJywgZnVuY3Rpb24gY2FsbGJhY2sgKGUpIHtcclxuICAgICAgICBfdGhhdC5yZW1vdmVMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrKTtcclxuICAgICAgICByZXNvbHZlKGUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMud29ya2VyLnNlbmQoZGF0YSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICB0ZXJtaW5hdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMud29ya2VyLmtpbGwoKTtcclxuICB9XHJcbn07XHJcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXT1JLRVJTXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG52YXIgd29ya2VycyA9IHtcclxuICBub2RlOiB7XHJcbiAgICBUZXN0V29ya2VyOiByZXF1aXJlKCcuL25vZGUvdGVzdHdvcmtlcicpXHJcbiAgfSxcclxuICBicm93c2VyOiB7XHJcbiAgICBUZXN0V29ya2VyOiByZXF1aXJlKCcuL2Jyb3dzZXIvdGVzdHdvcmtlcicpXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqIEV4cG9ydCAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHdvcmtlcnM7XHJcbiIsIi8qIEV4cG9ydCAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE5lYXQ7XHJcblxyXG4vKiBJbXBvcnQgKi9cclxudmFyIE5ldHdvcmsgPSByZXF1aXJlKCcuL2FyY2hpdGVjdHVyZS9uZXR3b3JrJyk7XHJcbnZhciBtZXRob2RzID0gcmVxdWlyZSgnLi9tZXRob2RzL21ldGhvZHMnKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XHJcblxyXG4vKiBFYXNpZXIgdmFyaWFibGUgbmFtaW5nICovXHJcbnZhciBzZWxlY3Rpb24gPSBtZXRob2RzLnNlbGVjdGlvbjtcclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTkVBVFxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gTmVhdCAoaW5wdXQsIG91dHB1dCwgZml0bmVzcywgb3B0aW9ucykge1xyXG4gIHRoaXMuaW5wdXQgPSBpbnB1dDsgLy8gVGhlIGlucHV0IHNpemUgb2YgdGhlIG5ldHdvcmtzXHJcbiAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7IC8vIFRoZSBvdXRwdXQgc2l6ZSBvZiB0aGUgbmV0d29ya3NcclxuICB0aGlzLmZpdG5lc3MgPSBmaXRuZXNzOyAvLyBUaGUgZml0bmVzcyBmdW5jdGlvbiB0byBldmFsdWF0ZSB0aGUgbmV0d29ya3NcclxuXHJcbiAgLy8gQ29uZmlndXJlIG9wdGlvbnNcclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICB0aGlzLmVxdWFsID0gb3B0aW9ucy5lcXVhbCB8fCBmYWxzZTtcclxuICB0aGlzLmNsZWFyID0gb3B0aW9ucy5jbGVhciB8fCBmYWxzZTtcclxuICB0aGlzLnBvcHNpemUgPSBvcHRpb25zLnBvcHNpemUgfHwgNTA7XHJcbiAgdGhpcy5lbGl0aXNtID0gb3B0aW9ucy5lbGl0aXNtIHx8IDA7XHJcbiAgdGhpcy5wcm92ZW5hbmNlID0gb3B0aW9ucy5wcm92ZW5hbmNlIHx8IDA7XHJcbiAgdGhpcy5tdXRhdGlvblJhdGUgPSBvcHRpb25zLm11dGF0aW9uUmF0ZSB8fCAwLjM7XHJcbiAgdGhpcy5tdXRhdGlvbkFtb3VudCA9IG9wdGlvbnMubXV0YXRpb25BbW91bnQgfHwgMTtcclxuXHJcbiAgdGhpcy5maXRuZXNzUG9wdWxhdGlvbiA9IG9wdGlvbnMuZml0bmVzc1BvcHVsYXRpb24gfHwgZmFsc2U7XHJcblxyXG4gIHRoaXMuc2VsZWN0aW9uID0gb3B0aW9ucy5zZWxlY3Rpb24gfHwgbWV0aG9kcy5zZWxlY3Rpb24uUE9XRVI7XHJcbiAgdGhpcy5jcm9zc292ZXIgPSBvcHRpb25zLmNyb3Nzb3ZlciB8fCBbXHJcbiAgICBtZXRob2RzLmNyb3Nzb3Zlci5TSU5HTEVfUE9JTlQsXHJcbiAgICBtZXRob2RzLmNyb3Nzb3Zlci5UV09fUE9JTlQsXHJcbiAgICBtZXRob2RzLmNyb3Nzb3Zlci5VTklGT1JNLFxyXG4gICAgbWV0aG9kcy5jcm9zc292ZXIuQVZFUkFHRVxyXG4gIF07XHJcbiAgdGhpcy5tdXRhdGlvbiA9IG9wdGlvbnMubXV0YXRpb24gfHwgbWV0aG9kcy5tdXRhdGlvbi5GRlc7XHJcblxyXG4gIHRoaXMudGVtcGxhdGUgPSBvcHRpb25zLm5ldHdvcmsgfHwgZmFsc2U7XHJcblxyXG4gIHRoaXMubWF4Tm9kZXMgPSBvcHRpb25zLm1heE5vZGVzIHx8IEluZmluaXR5O1xyXG4gIHRoaXMubWF4Q29ubnMgPSBvcHRpb25zLm1heENvbm5zIHx8IEluZmluaXR5O1xyXG4gIHRoaXMubWF4R2F0ZXMgPSBvcHRpb25zLm1heEdhdGVzIHx8IEluZmluaXR5O1xyXG5cclxuICAvLyBDdXN0b20gbXV0YXRpb24gc2VsZWN0aW9uIGZ1bmN0aW9uIGlmIGdpdmVuXHJcbiAgdGhpcy5zZWxlY3RNdXRhdGlvbk1ldGhvZCA9IHR5cGVvZiBvcHRpb25zLm11dGF0aW9uU2VsZWN0aW9uID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5tdXRhdGlvblNlbGVjdGlvbi5iaW5kKHRoaXMpIDogdGhpcy5zZWxlY3RNdXRhdGlvbk1ldGhvZDtcclxuXHJcbiAgLy8gR2VuZXJhdGlvbiBjb3VudGVyXHJcbiAgdGhpcy5nZW5lcmF0aW9uID0gMDtcclxuXHJcbiAgLy8gSW5pdGlhbGlzZSB0aGUgZ2Vub21lc1xyXG4gIHRoaXMuY3JlYXRlUG9vbCh0aGlzLnRlbXBsYXRlKTtcclxufVxyXG5cclxuTmVhdC5wcm90b3R5cGUgPSB7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIHRoZSBpbml0aWFsIHBvb2wgb2YgZ2Vub21lc1xyXG4gICAqL1xyXG4gIGNyZWF0ZVBvb2w6IGZ1bmN0aW9uIChuZXR3b3JrKSB7XHJcbiAgICB0aGlzLnBvcHVsYXRpb24gPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9wc2l6ZTsgaSsrKSB7XHJcbiAgICAgIHZhciBjb3B5O1xyXG4gICAgICBpZiAodGhpcy50ZW1wbGF0ZSkge1xyXG4gICAgICAgIGNvcHkgPSBOZXR3b3JrLmZyb21KU09OKG5ldHdvcmsudG9KU09OKCkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvcHkgPSBuZXcgTmV0d29yayh0aGlzLmlucHV0LCB0aGlzLm91dHB1dCk7XHJcbiAgICAgIH1cclxuICAgICAgY29weS5zY29yZSA9IHVuZGVmaW5lZDtcclxuICAgICAgdGhpcy5wb3B1bGF0aW9uLnB1c2goY29weSk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRXZhbHVhdGVzLCBzZWxlY3RzLCBicmVlZHMgYW5kIG11dGF0ZXMgcG9wdWxhdGlvblxyXG4gICAqL1xyXG4gIGV2b2x2ZTogYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgZXZhbHVhdGVkLCBzb3J0IHRoZSBwb3B1bGF0aW9uXHJcbiAgICBpZiAodHlwZW9mIHRoaXMucG9wdWxhdGlvblt0aGlzLnBvcHVsYXRpb24ubGVuZ3RoIC0gMV0uc2NvcmUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuZXZhbHVhdGUoKTtcclxuICAgIH1cclxuICAgIHRoaXMuc29ydCgpO1xyXG5cclxuICAgIHZhciBmaXR0ZXN0ID0gTmV0d29yay5mcm9tSlNPTih0aGlzLnBvcHVsYXRpb25bMF0udG9KU09OKCkpO1xyXG4gICAgZml0dGVzdC5zY29yZSA9IHRoaXMucG9wdWxhdGlvblswXS5zY29yZTtcclxuXHJcbiAgICB2YXIgbmV3UG9wdWxhdGlvbiA9IFtdO1xyXG5cclxuICAgIC8vIEVsaXRpc21cclxuICAgIHZhciBlbGl0aXN0cyA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsaXRpc207IGkrKykge1xyXG4gICAgICBlbGl0aXN0cy5wdXNoKHRoaXMucG9wdWxhdGlvbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJvdmVuYW5jZVxyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMucHJvdmVuYW5jZTsgaSsrKSB7XHJcbiAgICAgIG5ld1BvcHVsYXRpb24ucHVzaChOZXR3b3JrLmZyb21KU09OKHRoaXMudGVtcGxhdGUudG9KU09OKCkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBCcmVlZCB0aGUgbmV4dCBpbmRpdmlkdWFsc1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMucG9wc2l6ZSAtIHRoaXMuZWxpdGlzbSAtIHRoaXMucHJvdmVuYW5jZTsgaSsrKSB7XHJcbiAgICAgIG5ld1BvcHVsYXRpb24ucHVzaCh0aGlzLmdldE9mZnNwcmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXBsYWNlIHRoZSBvbGQgcG9wdWxhdGlvbiB3aXRoIHRoZSBuZXcgcG9wdWxhdGlvblxyXG4gICAgdGhpcy5wb3B1bGF0aW9uID0gbmV3UG9wdWxhdGlvbjtcclxuICAgIHRoaXMubXV0YXRlKCk7XHJcblxyXG4gICAgdGhpcy5wb3B1bGF0aW9uLnB1c2goLi4uZWxpdGlzdHMpO1xyXG5cclxuICAgIC8vIFJlc2V0IHRoZSBzY29yZXNcclxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnBvcHVsYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5wb3B1bGF0aW9uW2ldLnNjb3JlID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2VuZXJhdGlvbisrO1xyXG5cclxuICAgIHJldHVybiBmaXR0ZXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEJyZWVkcyB0d28gcGFyZW50cyBpbnRvIGFuIG9mZnNwcmluZywgcG9wdWxhdGlvbiBNVVNUIGJlIHN1cnRlZFxyXG4gICAqL1xyXG4gIGdldE9mZnNwcmluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHBhcmVudDEgPSB0aGlzLmdldFBhcmVudCgpO1xyXG4gICAgdmFyIHBhcmVudDIgPSB0aGlzLmdldFBhcmVudCgpO1xyXG5cclxuICAgIHJldHVybiBOZXR3b3JrLmNyb3NzT3ZlcihwYXJlbnQxLCBwYXJlbnQyLCB0aGlzLmVxdWFsKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTZWxlY3RzIGEgcmFuZG9tIG11dGF0aW9uIG1ldGhvZCBmb3IgYSBnZW5vbWUgYWNjb3JkaW5nIHRvIHRoZSBwYXJhbWV0ZXJzXHJcbiAgICovXHJcbiAgc2VsZWN0TXV0YXRpb25NZXRob2Q6IGZ1bmN0aW9uIChnZW5vbWUpIHtcclxuICAgIHZhciBtdXRhdGlvbk1ldGhvZCA9IHRoaXMubXV0YXRpb25bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5tdXRhdGlvbi5sZW5ndGgpXTtcclxuXHJcbiAgICBpZiAobXV0YXRpb25NZXRob2QgPT09IG1ldGhvZHMubXV0YXRpb24uQUREX05PREUgJiYgZ2Vub21lLm5vZGVzLmxlbmd0aCA+PSB0aGlzLm1heE5vZGVzKSB7XHJcbiAgICAgIGlmIChjb25maWcud2FybmluZ3MpIGNvbnNvbGUud2FybignbWF4Tm9kZXMgZXhjZWVkZWQhJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobXV0YXRpb25NZXRob2QgPT09IG1ldGhvZHMubXV0YXRpb24uQUREX0NPTk4gJiYgZ2Vub21lLmNvbm5lY3Rpb25zLmxlbmd0aCA+PSB0aGlzLm1heENvbm5zKSB7XHJcbiAgICAgIGlmIChjb25maWcud2FybmluZ3MpIGNvbnNvbGUud2FybignbWF4Q29ubnMgZXhjZWVkZWQhJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobXV0YXRpb25NZXRob2QgPT09IG1ldGhvZHMubXV0YXRpb24uQUREX0dBVEUgJiYgZ2Vub21lLmdhdGVzLmxlbmd0aCA+PSB0aGlzLm1heEdhdGVzKSB7XHJcbiAgICAgIGlmIChjb25maWcud2FybmluZ3MpIGNvbnNvbGUud2FybignbWF4R2F0ZXMgZXhjZWVkZWQhJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbXV0YXRpb25NZXRob2Q7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTXV0YXRlcyB0aGUgZ2l2ZW4gKG9yIGN1cnJlbnQpIHBvcHVsYXRpb25cclxuICAgKi9cclxuICBtdXRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIEVsaXRpc3QgZ2Vub21lcyBzaG91bGQgbm90IGJlIGluY2x1ZGVkXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA8PSB0aGlzLm11dGF0aW9uUmF0ZSkge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5tdXRhdGlvbkFtb3VudDsgaisrKSB7XHJcbiAgICAgICAgICB2YXIgbXV0YXRpb25NZXRob2QgPSB0aGlzLnNlbGVjdE11dGF0aW9uTWV0aG9kKHRoaXMucG9wdWxhdGlvbltpXSk7XHJcbiAgICAgICAgICB0aGlzLnBvcHVsYXRpb25baV0ubXV0YXRlKG11dGF0aW9uTWV0aG9kKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBFdmFsdWF0ZXMgdGhlIGN1cnJlbnQgcG9wdWxhdGlvblxyXG4gICAqL1xyXG4gIGV2YWx1YXRlOiBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIGlmICh0aGlzLmZpdG5lc3NQb3B1bGF0aW9uKSB7XHJcbiAgICAgIGlmICh0aGlzLmNsZWFyKSB7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdGhpcy5wb3B1bGF0aW9uW2ldLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGF3YWl0IHRoaXMuZml0bmVzcyh0aGlzLnBvcHVsYXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBnZW5vbWUgPSB0aGlzLnBvcHVsYXRpb25baV07XHJcbiAgICAgICAgaWYgKHRoaXMuY2xlYXIpIGdlbm9tZS5jbGVhcigpO1xyXG4gICAgICAgIGdlbm9tZS5zY29yZSA9IGF3YWl0IHRoaXMuZml0bmVzcyhnZW5vbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogU29ydHMgdGhlIHBvcHVsYXRpb24gYnkgc2NvcmVcclxuICAgKi9cclxuICBzb3J0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnBvcHVsYXRpb24uc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBmaXR0ZXN0IGdlbm9tZSBvZiB0aGUgY3VycmVudCBwb3B1bGF0aW9uXHJcbiAgICovXHJcbiAgZ2V0Rml0dGVzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgZXZhbHVhdGVkXHJcbiAgICBpZiAodHlwZW9mIHRoaXMucG9wdWxhdGlvblt0aGlzLnBvcHVsYXRpb24ubGVuZ3RoIC0gMV0uc2NvcmUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMuZXZhbHVhdGUoKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnBvcHVsYXRpb25bMF0uc2NvcmUgPCB0aGlzLnBvcHVsYXRpb25bMV0uc2NvcmUpIHtcclxuICAgICAgdGhpcy5zb3J0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvblswXTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhdmVyYWdlIGZpdG5lc3Mgb2YgdGhlIGN1cnJlbnQgcG9wdWxhdGlvblxyXG4gICAqL1xyXG4gIGdldEF2ZXJhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5wb3B1bGF0aW9uW3RoaXMucG9wdWxhdGlvbi5sZW5ndGggLSAxXS5zY29yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpcy5ldmFsdWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzY29yZSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBzY29yZSArPSB0aGlzLnBvcHVsYXRpb25baV0uc2NvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNjb3JlIC8gdGhpcy5wb3B1bGF0aW9uLmxlbmd0aDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgZ2Vub21lIGJhc2VkIG9uIHRoZSBzZWxlY3Rpb24gZnVuY3Rpb25cclxuICAgKiBAcmV0dXJuIHtOZXR3b3JrfSBnZW5vbWVcclxuICAgKi9cclxuICBnZXRQYXJlbnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpO1xyXG4gICAgc3dpdGNoICh0aGlzLnNlbGVjdGlvbikge1xyXG4gICAgICBjYXNlIHNlbGVjdGlvbi5QT1dFUjpcclxuICAgICAgICBpZiAodGhpcy5wb3B1bGF0aW9uWzBdLnNjb3JlIDwgdGhpcy5wb3B1bGF0aW9uWzFdLnNjb3JlKSB0aGlzLnNvcnQoKTtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnBvdyhNYXRoLnJhbmRvbSgpLCB0aGlzLnNlbGVjdGlvbi5wb3dlcikgKiB0aGlzLnBvcHVsYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3B1bGF0aW9uW2luZGV4XTtcclxuICAgICAgY2FzZSBzZWxlY3Rpb24uRklUTkVTU19QUk9QT1JUSU9OQVRFOlxyXG4gICAgICAgIC8vIEFzIG5lZ2F0aXZlIGZpdG5lc3NlcyBhcmUgcG9zc2libGVcclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNjE4NjY4Ni9nZW5ldGljLWFsZ29yaXRobS1oYW5kbGluZy1uZWdhdGl2ZS1maXRuZXNzLXZhbHVlc1xyXG4gICAgICAgIC8vIHRoaXMgaXMgdW5uZWNlc3NhcmlseSBydW4gZm9yIGV2ZXJ5IGluZGl2aWR1YWwsIHNob3VsZCBiZSBjaGFuZ2VkXHJcblxyXG4gICAgICAgIHZhciB0b3RhbEZpdG5lc3MgPSAwO1xyXG4gICAgICAgIHZhciBtaW5pbWFsRml0bmVzcyA9IDA7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIHNjb3JlID0gdGhpcy5wb3B1bGF0aW9uW2ldLnNjb3JlO1xyXG4gICAgICAgICAgbWluaW1hbEZpdG5lc3MgPSBzY29yZSA8IG1pbmltYWxGaXRuZXNzID8gc2NvcmUgOiBtaW5pbWFsRml0bmVzcztcclxuICAgICAgICAgIHRvdGFsRml0bmVzcyArPSBzY29yZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1pbmltYWxGaXRuZXNzID0gTWF0aC5hYnMobWluaW1hbEZpdG5lc3MpO1xyXG4gICAgICAgIHRvdGFsRml0bmVzcyArPSBtaW5pbWFsRml0bmVzcyAqIHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogdG90YWxGaXRuZXNzO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnBvcHVsYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBnZW5vbWUgPSB0aGlzLnBvcHVsYXRpb25baV07XHJcbiAgICAgICAgICB2YWx1ZSArPSBnZW5vbWUuc2NvcmUgKyBtaW5pbWFsRml0bmVzcztcclxuICAgICAgICAgIGlmIChyYW5kb20gPCB2YWx1ZSkgcmV0dXJuIGdlbm9tZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGFsbCBzY29yZXMgZXF1YWwsIHJldHVybiByYW5kb20gZ2Vub21lXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnBvcHVsYXRpb24ubGVuZ3RoKV07XHJcbiAgICAgIGNhc2Ugc2VsZWN0aW9uLlRPVVJOQU1FTlQ6XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNpemUgPiB0aGlzLnBvcHNpemUpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciB0b3VybmFtZW50IHNpemUgc2hvdWxkIGJlIGxvd2VyIHRoYW4gdGhlIHBvcHVsYXRpb24gc2l6ZSwgcGxlYXNlIGNoYW5nZSBtZXRob2RzLnNlbGVjdGlvbi5UT1VSTkFNRU5ULnNpemUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHRvdXJuYW1lbnRcclxuICAgICAgICB2YXIgaW5kaXZpZHVhbHMgPSBbXTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zZWxlY3Rpb24uc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgcmFuZG9tID0gdGhpcy5wb3B1bGF0aW9uW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucG9wdWxhdGlvbi5sZW5ndGgpXTtcclxuICAgICAgICAgIGluZGl2aWR1YWxzLnB1c2gocmFuZG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNvcnQgdGhlIHRvdXJuYW1lbnQgaW5kaXZpZHVhbHMgYnkgc2NvcmVcclxuICAgICAgICBpbmRpdmlkdWFscy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNlbGVjdCBhbiBpbmRpdmlkdWFsXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuc2VsZWN0aW9uLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCB0aGlzLnNlbGVjdGlvbi5wcm9iYWJpbGl0eSB8fCBpID09PSB0aGlzLnNlbGVjdGlvbi5zaXplIC0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kaXZpZHVhbHNbaV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydCB0aGUgY3VycmVudCBwb3B1bGF0aW9uIHRvIGEganNvbiBvYmplY3RcclxuICAgKi9cclxuICBleHBvcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBqc29uID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZ2Vub21lID0gdGhpcy5wb3B1bGF0aW9uW2ldO1xyXG4gICAgICBqc29uLnB1c2goZ2Vub21lLnRvSlNPTigpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ganNvbjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBJbXBvcnQgcG9wdWxhdGlvbiBmcm9tIGEganNvbiBvYmplY3RcclxuICAgKi9cclxuICBpbXBvcnQ6IGZ1bmN0aW9uIChqc29uKSB7XHJcbiAgICB2YXIgcG9wdWxhdGlvbiA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBnZW5vbWUgPSBqc29uW2ldO1xyXG4gICAgICBwb3B1bGF0aW9uLnB1c2goTmV0d29yay5mcm9tSlNPTihnZW5vbWUpKTtcclxuICAgIH1cclxuICAgIHRoaXMucG9wdWxhdGlvbiA9IHBvcHVsYXRpb247XHJcbiAgICB0aGlzLnBvcHNpemUgPSBwb3B1bGF0aW9uLmxlbmd0aDtcclxuICB9XHJcbn07XHJcbiIsInZhciBOZWF0YXB0aWMgPSB7XHJcbiAgbWV0aG9kczogcmVxdWlyZSgnLi9tZXRob2RzL21ldGhvZHMnKSxcclxuICBDb25uZWN0aW9uOiByZXF1aXJlKCcuL2FyY2hpdGVjdHVyZS9jb25uZWN0aW9uJyksXHJcbiAgYXJjaGl0ZWN0OiByZXF1aXJlKCcuL2FyY2hpdGVjdHVyZS9hcmNoaXRlY3QnKSxcclxuICBOZXR3b3JrOiByZXF1aXJlKCcuL2FyY2hpdGVjdHVyZS9uZXR3b3JrJyksXHJcbiAgY29uZmlnOiByZXF1aXJlKCcuL2NvbmZpZycpLFxyXG4gIEdyb3VwOiByZXF1aXJlKCcuL2FyY2hpdGVjdHVyZS9ncm91cCcpLFxyXG4gIExheWVyOiByZXF1aXJlKCcuL2FyY2hpdGVjdHVyZS9sYXllcicpLFxyXG4gIE5vZGU6IHJlcXVpcmUoJy4vYXJjaGl0ZWN0dXJlL25vZGUnKSxcclxuICBOZWF0OiByZXF1aXJlKCcuL25lYXQnKSxcclxuICBtdWx0aTogcmVxdWlyZSgnLi9tdWx0aXRocmVhZGluZy9tdWx0aScpXHJcbn07XHJcblxyXG4vLyBDb21tb25KUyAmIEFNRFxyXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkge1xyXG4gIGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gTmVhdGFwdGljOyB9KTtcclxufVxyXG5cclxuLy8gTm9kZS5qc1xyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IE5lYXRhcHRpYztcclxufVxyXG5cclxuLy8gQnJvd3NlclxyXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG9sZCA9IHdpbmRvd1snbmVhdGFwdGljJ107XHJcbiAgICBOZWF0YXB0aWMubmluamEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvd1snbmVhdGFwdGljJ10gPSBvbGQ7XHJcbiAgICAgIHJldHVybiBOZWF0YXB0aWM7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG4gIHdpbmRvd1snbmVhdGFwdGljJ10gPSBOZWF0YXB0aWM7XHJcbn1cclxuIiwiZXhwb3J0cy5lbmRpYW5uZXNzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0xFJyB9O1xuXG5leHBvcnRzLmhvc3RuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgbG9jYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5ob3N0bmFtZVxuICAgIH1cbiAgICBlbHNlIHJldHVybiAnJztcbn07XG5cbmV4cG9ydHMubG9hZGF2ZyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdIH07XG5cbmV4cG9ydHMudXB0aW1lID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMCB9O1xuXG5leHBvcnRzLmZyZWVtZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE51bWJlci5NQVhfVkFMVUU7XG59O1xuXG5leHBvcnRzLnRvdGFsbWVtID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBOdW1iZXIuTUFYX1ZBTFVFO1xufTtcblxuZXhwb3J0cy5jcHVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW10gfTtcblxuZXhwb3J0cy50eXBlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0Jyb3dzZXInIH07XG5cbmV4cG9ydHMucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5hcHBWZXJzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59O1xuXG5leHBvcnRzLm5ldHdvcmtJbnRlcmZhY2VzXG49IGV4cG9ydHMuZ2V0TmV0d29ya0ludGVyZmFjZXNcbj0gZnVuY3Rpb24gKCkgeyByZXR1cm4ge30gfTtcblxuZXhwb3J0cy5hcmNoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2phdmFzY3JpcHQnIH07XG5cbmV4cG9ydHMucGxhdGZvcm0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnYnJvd3NlcicgfTtcblxuZXhwb3J0cy50bXBkaXIgPSBleHBvcnRzLnRtcERpciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJy90bXAnO1xufTtcblxuZXhwb3J0cy5FT0wgPSAnXFxuJztcblxuZXhwb3J0cy5ob21lZGlyID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gJy8nXG59O1xuIiwiLy8gLmRpcm5hbWUsIC5iYXNlbmFtZSwgYW5kIC5leHRuYW1lIG1ldGhvZHMgYXJlIGV4dHJhY3RlZCBmcm9tIE5vZGUuanMgdjguMTEuMSxcbi8vIGJhY2twb3J0ZWQgYW5kIHRyYW5zcGxpdGVkIHdpdGggQmFiZWwsIHdpdGggYmFja3dhcmRzLWNvbXBhdCBmaXhlc1xuXG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xuICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuIGhhc1Jvb3QgPyAnLycgOiAnLic7XG4gIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkge1xuICAgIC8vIHJldHVybiAnLy8nO1xuICAgIC8vIEJhY2t3YXJkcy1jb21wYXQgZml4OlxuICAgIHJldHVybiAnLyc7XG4gIH1cbiAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcblxuICB2YXIgc3RhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICBlbmQgPSBpICsgMTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuICcnO1xuICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbn1cblxuLy8gVXNlcyBhIG1peGVkIGFwcHJvYWNoIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSwgYXMgZXh0IGJlaGF2aW9yIGNoYW5nZWRcbi8vIGluIG5ldyBOb2RlLmpzIHZlcnNpb25zLCBzbyBvbmx5IGJhc2VuYW1lKCkgYWJvdmUgaXMgYmFja3BvcnRlZCBoZXJlXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24gKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IGJhc2VuYW1lKHBhdGgpO1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcbiAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gIHZhciBzdGFydFBhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBleHRlbnNpb25cbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgZW5kID0gaSArIDE7XG4gICAgfVxuICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICBzdGFydERvdCA9IGk7XG4gICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxuICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyBLZXk6ICB7TmFtZSwgeCwgeX1cclxuZXhwb3J0IGNvbnN0IGNvb3JkcyA9IHsgXHJcbiAgICBcIkFcIjoge1wiTmFtZVwiOiBcIkFuamFzIGh1c1wiLCB4OiAgOTAwLCB5OiAgMTUwfSxcclxuICAgIFwiQlwiOiB7XCJOYW1lXCI6IFwiQm9icyBodXNcIiwgeDogMTAwMCwgeTogNDAwfSxcclxuICAgIFwiQ1wiOiB7XCJOYW1lXCI6IFwiQW5qYXMgc29tbWVyaHVzXCIsIHg6IDExMDAsIHk6IDEwMH0sXHJcbiAgICBcIkRcIjoge1wiTmFtZVwiOiBcIkRhbmllbHMgaHVzXCIsIHg6IDQ1MCwgeTogNjAwfSxcclxuICAgIFwiRVwiOiB7XCJOYW1lXCI6IFwiRW1tYXMgaHVzXCIsIHg6IDI1MCwgeTogNTkwfSxcclxuICAgIFwiRlwiOiB7XCJOYW1lXCI6IFwiR3JldGVzIGfDpXJkXCIsIHg6IDEyMCwgeTogMTYwfSxcclxuICAgIFwiR1wiOiB7XCJOYW1lXCI6IFwiR3JldGVzIGh1c1wiLCB4OiAxMjAsIHk6IDM2MH0sXHJcbiAgICBcIkhcIjoge1wiTmFtZVwiOiBcIkdyZXRlcyBidXRpa1wiLCB4OiAzNTAsIHk6IDQwMH0sXHJcbiAgICBcIlBcIjoge1wiTmFtZVwiOiBcIlBvc3RjZW50ZXJcIiwgeDogNjAwLCB5OiAxMDB9LFxyXG4gICAgXCJTXCI6IHtcIk5hbWVcIjogXCJTaG9wcGluZ2NlbnRlclwiLCB4OiA1MDAsIHk6IDE1MH0sXHJcbiAgICBcIlpcIjoge1wiTmFtZVwiOiBcIlpCQyBIVFhcIiwgeDogNjAwLCB5OiAzNTB9XHJcbn1cclxuXHJcbi8vIEVhY2ggZWxlbWVudCBpcyBhbiBhcnJheSBvZiBsZW5ndGggMiB0aGF0IGRlZmluZXMgc3RhcnRpbmcgcG9pbnQgYW5kIGVuZGluZyBwb2ludCBvZiBhIHJvYWRcclxuZXhwb3J0IGNvbnN0IHJvYWRzID0gW1xyXG4gICAgW1wiQVwiLFwiQlwiXSxcclxuICAgIFtcIkFcIixcIkNcIl0sXHJcbiAgICBbXCJBXCIsXCJQXCJdLFxyXG4gICAgW1wiQlwiLFwiWlwiXSxcclxuICAgIFtcIkRcIixcIkVcIl0sXHJcbiAgICBbXCJEXCIsXCJaXCJdLFxyXG4gICAgW1wiRVwiLFwiR1wiXSxcclxuICAgIFtcIkdcIixcIkZcIl0sXHJcbiAgICBbXCJHXCIsXCJIXCJdLFxyXG4gICAgW1wiR1wiLFwiU1wiXSxcclxuICAgIFtcIlNcIixcIlBcIl0sXHJcbiAgICBbXCJTXCIsXCJIXCJdLFxyXG4gICAgW1wiU1wiLFwiWlwiXSxcclxuICAgIFtcIkhcIixcIlpcIl0sXHJcbiAgICBbXCJGXCIsXCJTXCJdXHJcbiAgXTtcclxuIiwiaW1wb3J0IHtyZWRyYXd9IGZyb20gXCIuL3Zpc3VhbFwiXHJcbmltcG9ydCB7Um9ib3QsIHJhbmRvbVJvYm90fSBmcm9tIFwiLi9yb2JvdFwiXHJcbmltcG9ydCB7R2VuZXJhdGVQYWNrYWdlc30gZnJvbSBcIi4vcGFja2FnZXNcIlxyXG5pbXBvcnQge05ldXJvRXZvbHV0aW9ufSBmcm9tIFwiLi9uZWF0XCJcclxuaW1wb3J0IHsgZmluZF9wYXRoIH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xyXG5cclxubGV0IHJvYm90ID0gbmV3IFJvYm90KFwiQVwiLCBHZW5lcmF0ZVBhY2thZ2VzKDUwKSwgdW5kZWZpbmVkKTtcclxucmVkcmF3KHJvYm90KTtcclxuXHJcbmxldCBuZWF0OiBOZXVyb0V2b2x1dGlvbiA9IG5ldyBOZXVyb0V2b2x1dGlvbigpO1xyXG5cclxuY29uc29sZS5sb2coZmluZF9wYXRoKFwiQVwiLCBcIkFcIikpO1xyXG5cclxubmVhdC5zdGFydEV2YWx1YXRpb24oKTtcclxuXHJcbmxldCByb2JvdF9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpPT57XHJcbiAgICBuZWF0LnVwZGF0ZSgpO1xyXG4gICAgcmVkcmF3KG5lYXQucm9ib3RzWzBdKTtcclxufSwgMTApO1xyXG5cclxuXHJcblxyXG5cclxuIiwiLy9AdHMtaWdub3JlXHJcbmltcG9ydCBuZWF0YXB0aWMgZnJvbSBcIm5lYXRhcHRpY1wiXHJcbmltcG9ydCB7IGNvb3JkcyB9IGZyb20gXCIuL2RhdGFcIjtcclxuaW1wb3J0IHsgR2VuZXJhdGVQYWNrYWdlcyB9IGZyb20gXCIuL3BhY2thZ2VzXCI7XHJcblxyXG5pbXBvcnQgeyByYW5kb21Sb2JvdCwgUm9ib3QgfSBmcm9tIFwiLi9yb2JvdFwiXHJcbmltcG9ydCB7IGZpbmRfcGF0aCB9IGZyb20gXCIuL3V0aWxpdHlcIjtcclxuXHJcbnZhciBOZWF0ID0gbmVhdGFwdGljLk5lYXQ7XHJcbnZhciBNZXRob2RzID0gbmVhdGFwdGljLm1ldGhvZHM7XHJcbnZhciBDb25maWcgPSBuZWF0YXB0aWMuQ29uZmlnO1xyXG52YXIgQXJjaGl0ZWN0ID0gbmVhdGFwdGljLmFyY2hpdGVjdDtcclxuXHJcbi8vIE5ldHdvcmsgc2V0dGluZ3NcclxuY29uc3QgSU5QVVRfU0laRSA9IDMzO1xyXG5jb25zdCBTVEFSVF9ISURERU5fU0laRSA9IDUwO1xyXG5jb25zdCBPVVRQVVRfU0laRSA9IDExO1xyXG5cclxuLy8gR0Egc2V0dGluZ3NcclxudmFyIFBBQ0tBR0VTX1BFUl9QTEFZRVIgPSAyO1xyXG52YXIgUExBWUVSX0FNT1VOVCA9IDUwO1xyXG52YXIgSVRFUkFUSU9OUyA9IDI1MDtcclxudmFyIE1VVEFUSU9OX1JBVEUgPSAwLjM7XHJcbnZhciBFTElUSVNNID0gTWF0aC5yb3VuZCgwLjMgKiBQTEFZRVJfQU1PVU5UKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXVyb0V2b2x1dGlvbiB7XHJcbiAgICBoaWdoZXN0U2NvcmUgPSAtMTAwMDAwO1xyXG5cclxuICAgIHJvYm90czogUm9ib3RbXTtcclxuICAgIG5lYXQ6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm5lYXQgPSBuZXcgTmVhdChcclxuICAgICAgICAgICAgSU5QVVRfU0laRSwgT1VUUFVUX1NJWkUsXHJcbiAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG11dGF0aW9uOiBNZXRob2RzLm11dGF0aW9uLkFMTCxcclxuICAgICAgICAgICAgICAgIHBvcHNpemU6IFBMQVlFUl9BTU9VTlQsXHJcbiAgICAgICAgICAgICAgICBtdXRhdGlvblJhdGU6IE1VVEFUSU9OX1JBVEUsXHJcbiAgICAgICAgICAgICAgICBlbGl0aXNtOiBFTElUSVNNLFxyXG4gICAgICAgICAgICAgICAgbmV0d29yazogbmV3IEFyY2hpdGVjdC5SYW5kb20oXHJcbiAgICAgICAgICAgICAgICAgICAgSU5QVVRfU0laRSxcclxuICAgICAgICAgICAgICAgICAgICBTVEFSVF9ISURERU5fU0laRSxcclxuICAgICAgICAgICAgICAgICAgICBPVVRQVVRfU0laRVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgbGV0IGFsbFJvYm90c0ZpbmlzaGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcm9ib3Qgb2YgdGhpcy5yb2JvdHMpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIHJvYm90IGhhcyBkZWxpdmVyZWQgYWxsIG9mIGl0cyBwYWNrYWdlcywgdGhlbiB3ZSBjYW4ganVzdCBtb3ZlIHRvIHRoZSBuZXh0IHJvYm90XHJcbiAgICAgICAgICAgIGlmIChyb2JvdC5wYWNrYWdlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcm9ib3QuYnJhaW4uc2NvcmUgPSAtcm9ib3QudG90YWxNb3ZlcztcclxuICAgICAgICAgICAgICAgIGlmIChyb2JvdC5icmFpbi5zY29yZSA+IHRoaXMuaGlnaGVzdFNjb3JlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVzdFNjb3JlID0gcm9ib3QuYnJhaW4uc2NvcmU7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIHJvYm90IGhhcyBtYWRlIHRvbyBtYW55IG1vdmVzLCB0aGVuIHdlIGNhbiBqdXN0IGRlY2xhcmUgaXQgZmluaXNoZWQgYW5kIGdpdmUgaXQgYSBiYWQgc2NvcmVcclxuICAgICAgICAgICAgaWYgKHJvYm90LnRvdGFsTW92ZXMgPiA1MDApIHtcclxuICAgICAgICAgICAgICAgIHJvYm90LmJyYWluLnNjb3JlID0gLTEwMDAgLSByb2JvdC5wYWNrYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9ib3QuYnJhaW4uc2NvcmUgPiB0aGlzLmhpZ2hlc3RTY29yZSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlc3RTY29yZSA9IHJvYm90LmJyYWluLnNjb3JlO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFsbFJvYm90c0ZpbmlzaGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBMZXQgdGhpcyBiZSB0aGUgaW5wdXQgZm9yIHRoZSBuZXVyYWwgbmV0d29ya1xyXG4gICAgICAgICAgICBsZXQgaW5wdXQ6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgZmlyc3QgMTEgZWxlbWVudHMgc2hhbGwgZGVzY3JpcGUgdGhlIHJvYm90bG9jYXRpb24sIFxyXG4gICAgICAgICAgICAvLyB3aGVyZSB0aGUgcm9ib3Rsb2NhdGlvbiBpcyBkZXNpZ25hdGVkIHdpdGggYSAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IGxvYyBpbiBjb29yZHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2MgPT09IHJvYm90LnJvYm90TG9jYXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICBpbnB1dC5wdXNoKDEpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQucHVzaCgwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVGhlIG5leHQgMTEgZWxlbWVudHMgc2hhbGwgZGVzY3JpYmUgdGhlIGRpc3RyaWJ1dGlvbiBvZiBwYWNrYWdlIGxvY2F0aW9uIGFuZCBkZXN0aW5hdGlvbiBhbW9uZyB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgIC8vIGVhY2ggbG9jYXRpb24gaGFzIGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLCBkZXNjcmlwaW5nIHRoZSBwZXJjYW50YWdlIG9mIHRoZSB0b3RhbCBwYWNrYWdlcyBvbiB0aGF0IHBvaW50XHJcbiAgICAgICAgICAgIGxldCBwYWNrYWdlTG9jYXRpb25BbW91bnQ6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgICAgIGxldCBwYWNrYWdlRGVzdGluYXRpb25BbW91bnQ6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgICAgICAgICAvLyBGaWxsIGFycmF5c1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDExOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHBhY2thZ2VMb2NhdGlvbkFtb3VudC5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgcGFja2FnZURlc3RpbmF0aW9uQW1vdW50LnB1c2goMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB0b3RhbCBwYWNrYWdlc1xyXG4gICAgICAgICAgICBmb3IgKGxldCB0aGlzUGFja2FnZSBvZiByb2JvdC5wYWNrYWdlcykge1xyXG4gICAgICAgICAgICAgICAgcGFja2FnZUxvY2F0aW9uQW1vdW50W09iamVjdC5rZXlzKGNvb3JkcykuaW5kZXhPZih0aGlzUGFja2FnZS5jdXJyZW50KV0rKztcclxuICAgICAgICAgICAgICAgIHBhY2thZ2VEZXN0aW5hdGlvbkFtb3VudFtPYmplY3Qua2V5cyhjb29yZHMpLmluZGV4T2YodGhpc1BhY2thZ2UuZGVzdGluYXRpb24pXSsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBOb3JtYWxpemVcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwYWNrYWdlTG9jYXRpb25BbW91bnQpIHtcclxuICAgICAgICAgICAgICAgIHBhY2thZ2VMb2NhdGlvbkFtb3VudFtpXSA9IHBhY2thZ2VMb2NhdGlvbkFtb3VudFtpXSAvIHJvYm90LnBhY2thZ2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHBhY2thZ2VEZXN0aW5hdGlvbkFtb3VudFtpXSA9IHBhY2thZ2VEZXN0aW5hdGlvbkFtb3VudFtpXSAvIHJvYm90LnBhY2thZ2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ29uY2F0IHRvIGlucHV0XHJcbiAgICAgICAgICAgIGlucHV0LnB1c2goLi4ucGFja2FnZUxvY2F0aW9uQW1vdW50KTtcclxuICAgICAgICAgICAgaW5wdXQucHVzaCguLi5wYWNrYWdlRGVzdGluYXRpb25BbW91bnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgb3V0cHV0c1xyXG4gICAgICAgICAgICBsZXQgb3V0cHV0OiBudW1iZXJbXSA9IHJvYm90LmJyYWluLmFjdGl2YXRlKGlucHV0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgdGhlIGxvY2F0aW9uIHdpdGggdGhlIGhpZ2hlc3QgcHJvYmFiaWxpdHk6XHJcbiAgICAgICAgICAgIGxldCBoaWdoZXN0UHJvYiA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIG91dHB1dCk7XHJcblxyXG4gICAgICAgICAgICAvLyBGaW5kIGl0IHRoZSBpbmRleCBpbiB0aGUgb3V0cHV0LCBhbmQgY29udmVydCBpdCB0byBhIGxldHRlclxyXG4gICAgICAgICAgICBsZXQgY2hvc2VuTG9jYXRpb24gPSBPYmplY3Qua2V5cyhjb29yZHMpW291dHB1dC5pbmRleE9mKGhpZ2hlc3RQcm9iKV07XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB3ZSBjaG9zZSB0byBtb3ZlIHRvIHRoZSBjdXJyZW50IHBvc2l0aW9uLCB3ZSBzaG91bGQganVzdCBpbmNyZW1lbnQgbW92ZSBjb3VudGVyXHJcbiAgICAgICAgICAgIGlmIChjaG9zZW5Mb2NhdGlvbiA9PSByb2JvdC5yb2JvdExvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByb2JvdC50b3RhbE1vdmVzKys7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2luY2UgdGhlIGNob3NlbiBpcyBub3QgbmVjZXNhcmlseSBvbmUgb2YgdGhlIG5laWdib3Vycywgd2UgdXNlIHBhdGhmaW5kaW5nIHRvIGdlbmVyYXRlIHRoZSBuZXh0IG1vdmVcclxuICAgICAgICAgICAgbGV0IGJlc3RfcGF0aCA9IGZpbmRfcGF0aChyb2JvdC5yb2JvdExvY2F0aW9uLCBjaG9zZW5Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgIGxldCBuZXh0TW92ZSA9IGJlc3RfcGF0aC5yZXZlcnNlKClbMV07XHJcbiAgICAgICAgICAgIHJvYm90Lm1vdmUobmV4dE1vdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFsbFJvYm90c0ZpbmlzaGVkKVxyXG4gICAgICAgICAgICB0aGlzLmVuZEV2YWx1YXRpb24oKTtcclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogU3RhcnQgdGhlIGV2YWx1YXRpb24gb2YgdGhlIGN1cnJlbnQgZ2VuZXJhdGlvbiAqL1xyXG4gICAgc3RhcnRFdmFsdWF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucm9ib3RzID0gW107XHJcbiAgICAgICAgdGhpcy5oaWdoZXN0U2NvcmUgPSAtMTAwMDAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnZW5vbWUgaW4gdGhpcy5uZWF0LnBvcHVsYXRpb24pIHtcclxuICAgICAgICAgICAgZ2Vub21lID0gdGhpcy5uZWF0LnBvcHVsYXRpb25bZ2Vub21lXTtcclxuICAgICAgICAgICAgdGhpcy5yb2JvdHMucHVzaChuZXcgUm9ib3QoXCJBXCIsIEdlbmVyYXRlUGFja2FnZXMoUEFDS0FHRVNfUEVSX1BMQVlFUiksIGdlbm9tZSkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBFbmQgdGhlIGV2YWx1YXRpb24gb2YgdGhlIGN1cnJlbnQgZ2VuZXJhdGlvbiAqL1xyXG4gICAgZW5kRXZhbHVhdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnR2VuZXJhdGlvbjonLCB0aGlzLm5lYXQuZ2VuZXJhdGlvbiwgJy0gYXZlcmFnZSBzY29yZTonLCB0aGlzLm5lYXQuZ2V0QXZlcmFnZSgpLCAnIGhpZ2hlc3Qgc2NvcmU6JywgdGhpcy5oaWdoZXN0U2NvcmUpO1xyXG4gICAgICAgIHRoaXMubmVhdC5zb3J0KCk7XHJcbiAgICAgICAgdmFyIG5ld1BvcHVsYXRpb24gPSBbXTtcclxuICAgICAgICAvLyBFbGl0aXNtXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5lYXQuZWxpdGlzbTsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcHVsYXRpb24ucHVzaCh0aGlzLm5lYXQucG9wdWxhdGlvbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEJyZWVkIHRoZSBuZXh0IGluZGl2aWR1YWxzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5lYXQucG9wc2l6ZSAtIHRoaXMubmVhdC5lbGl0aXNtOyBpKyspIHtcclxuICAgICAgICAgICAgbmV3UG9wdWxhdGlvbi5wdXNoKHRoaXMubmVhdC5nZXRPZmZzcHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIG9sZCBwb3B1bGF0aW9uIHdpdGggdGhlIG5ldyBwb3B1bGF0aW9uXHJcbiAgICAgICAgdGhpcy5uZWF0LnBvcHVsYXRpb24gPSBuZXdQb3B1bGF0aW9uO1xyXG4gICAgICAgIHRoaXMubmVhdC5tdXRhdGUoKTtcclxuICAgICAgICB0aGlzLm5lYXQuZ2VuZXJhdGlvbisrO1xyXG4gICAgICAgIHRoaXMuc3RhcnRFdmFsdWF0aW9uKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge2Nvb3Jkc30gZnJvbSBcIi4vZGF0YVwiXHJcbmltcG9ydCB7cmFuZG9tSW50RnJvbUludGVydmFsfSBmcm9tIFwiLi91dGlsaXR5XCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2thZ2Uge1xyXG4gICAgY3VycmVudDogc3RyaW5nO1xyXG4gICAgZGVzdGluYXRpb246IHN0cmluZztcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR2VuZXJhdGVQYWNrYWdlcyhuOiBudW1iZXIpIDogSVBhY2thZ2VbXSB7XHJcbiAgICBsZXQgcmFuZG9tX3BhY2thZ2VzIDogSVBhY2thZ2VbXSA9IFtdO1xyXG5cclxuICAgIGxldCBsb2NhdGlvbnMgPSBPYmplY3Qua2V5cyhjb29yZHMpO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBsZXQgc29tZV9wYWNrYWdlOiBJUGFja2FnZSA9IHtjdXJyZW50OiBcIlwiLCBkZXN0aW5hdGlvbjogXCJcIn07XHJcblxyXG4gICAgICAgIHNvbWVfcGFja2FnZS5jdXJyZW50ID0gbG9jYXRpb25zW3JhbmRvbUludEZyb21JbnRlcnZhbCgwLCBsb2NhdGlvbnMubGVuZ3RoLTEpXVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkZXN0aW5hdGlvbiA9IHNvbWVfcGFja2FnZS5jdXJyZW50O1xyXG5cclxuICAgICAgICB3aGlsZShkZXN0aW5hdGlvbiA9PSBzb21lX3BhY2thZ2UuY3VycmVudClcclxuICAgICAgICAgICAgZGVzdGluYXRpb24gPSBsb2NhdGlvbnNbcmFuZG9tSW50RnJvbUludGVydmFsKDAsIGxvY2F0aW9ucy5sZW5ndGgtMSldO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNvbWVfcGFja2FnZS5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xyXG5cclxuICAgICAgICByYW5kb21fcGFja2FnZXMucHVzaChzb21lX3BhY2thZ2UpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhbmRvbV9wYWNrYWdlcztcclxufVxyXG4iLCJpbXBvcnQge0lQYWNrYWdlfSBmcm9tIFwiLi9wYWNrYWdlc1wiXHJcbmltcG9ydCB7YnVpbGRfY29ubmVjdGlvbnMsIHJhbmRvbUludEZyb21JbnRlcnZhbH0gZnJvbSBcIi4vdXRpbGl0eVwiXHJcblxyXG5leHBvcnQgY2xhc3MgUm9ib3Qge1xyXG4gICAgcm9ib3RMb2NhdGlvbjogc3RyaW5nO1xyXG4gICAgdG90YWxNb3ZlcyA6IG51bWJlciA9IDA7XHJcbiAgICBwYWNrYWdlczogSVBhY2thZ2VbXTtcclxuICAgIGJyYWluOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RhcnRMb2NhdGlvbjogc3RyaW5nLCBzdGFydFBhY2thZ2VzOiBJUGFja2FnZVtdLCBnZW5vbWU6IGFueSApIHtcclxuICAgICAgICB0aGlzLnJvYm90TG9jYXRpb24gPSBzdGFydExvY2F0aW9uO1xyXG4gICAgICAgIHRoaXMucGFja2FnZXMgPSBzdGFydFBhY2thZ2VzO1xyXG4gICAgICAgIHRoaXMuYnJhaW4gPSBnZW5vbWU7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZSh0bzogc3RyaW5nKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgcm9ib3QgbG9jIGlzIGNvbm5lY3RlZCB0byB0b1xyXG4gICAgICAgIGxldCBjb25uZWN0aW9ucyA9IGJ1aWxkX2Nvbm5lY3Rpb25zKCk7XHJcbiAgICAgICAgaWYoIWNvbm5lY3Rpb25zW3RoaXMucm9ib3RMb2NhdGlvbl0uaW5jbHVkZXModG8pKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogdHJpZWQgdG8gbW92ZSByb2JvdCB0byBub24gbmVpZ2hib3VyaW5nIGxvY2F0aW9uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFja2FnZXMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpPT57XHJcbiAgICAgICAgICAgIC8vIEFueSBwYWNrYWdlcyBvbiB0aGUgdGhpcyBsb2NhdGlvbiB3aWxsIGJlIG1vdmVkIHRvIHRoZSBuZXh0IGxvY1xyXG4gICAgICAgICAgICBpZihlbGVtZW50LmN1cnJlbnQgPT0gdGhpcy5yb2JvdExvY2F0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmN1cnJlbnQgPSB0bztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhY2thZ2VzID0gdGhpcy5wYWNrYWdlcy5maWx0ZXIoKGVsZW1lbnQpPT57XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmN1cnJlbnQgIT0gZWxlbWVudC5kZXN0aW5hdGlvbjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5yb2JvdExvY2F0aW9uID0gdG87XHJcbiAgICAgICAgdGhpcy50b3RhbE1vdmVzKys7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVJvYm90KHNvbWVfcm9ib3QgOiBSb2JvdCkgOiBzdHJpbmcge1xyXG4gICAgbGV0IG5leHRfbW92ZSA9IFwiXCI7XHJcblxyXG4gICAgLy8gR2V0IG5laWdoYm91cnNcclxuICAgIGxldCBjb25uZWN0aW9ucyA9IGJ1aWxkX2Nvbm5lY3Rpb25zKCk7XHJcbiAgICBsZXQgbmVpZ2hib3VycyA9IGNvbm5lY3Rpb25zW3NvbWVfcm9ib3Qucm9ib3RMb2NhdGlvbl07XHJcblxyXG4gICAgLy8gUGljayBtb3ZlXHJcbiAgICBuZXh0X21vdmUgPSBuZWlnaGJvdXJzW3JhbmRvbUludEZyb21JbnRlcnZhbCgwLCBuZWlnaGJvdXJzLmxlbmd0aC0xKV07XHJcblxyXG4gICAgcmV0dXJuIG5leHRfbW92ZTtcclxufSIsImltcG9ydCB7IGNvb3Jkcywgcm9hZHMgfSBmcm9tIFwiLi9kYXRhXCJcclxuXHJcbi8vIEJ1aWxkIGNvbm5lY3Rpb24gb2JqZWN0LCBlYWNoIGtleSAobG9jYXRpb24pIHNob3VsZCBjb250YWluIGFuIGFycmF5IG9mIGFsbCBjb25uZWN0ZWQgbG9jYXRpb25zXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZF9jb25uZWN0aW9ucygpIHtcclxuICAgIHZhciBjb25uZWN0aW9uczogeyBbaWQ6IHN0cmluZ106IHN0cmluZ1tdIH0gPSB7fTtcclxuICAgIGZvciAobGV0IGsgaW4gY29vcmRzKSB7XHJcbiAgICAgICAgY29ubmVjdGlvbnNba10gPSBbXSBhcyBzdHJpbmdbXTtcclxuICAgICAgICBmb3IgKGxldCByIGluIHJvYWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChyb2Fkc1tyXVswXSA9PSBrKVxyXG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbnNba10ucHVzaChyb2Fkc1tyXVsxXSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJvYWRzW3JdWzFdID09IGspXHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uc1trXS5wdXNoKHJvYWRzW3JdWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbm5lY3Rpb25zO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tSW50RnJvbUludGVydmFsKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7IC8vIG1pbiBhbmQgbWF4IGluY2x1ZGVkIFxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vZGVUb0luZGV4KG5vZGU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoY29vcmRzKS5pbmRleE9mKG5vZGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmRleFRvTm9kZShpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhjb29yZHMpW2luZGV4XTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRfcGF0aChmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICBsZXQgc3JjOiBudW1iZXIgPSBPYmplY3Qua2V5cyhjb29yZHMpLmluZGV4T2YoZnJvbSk7XHJcbiAgICBsZXQgZGVzdDogbnVtYmVyID0gT2JqZWN0LmtleXMoY29vcmRzKS5pbmRleE9mKHRvKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJTUkM6IFwiICsgZnJvbSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiREVTVDogXCIgKyB0byk7XHJcblxyXG5cclxuICAgIGxldCBudW1Ob2RlcyA9IDExO1xyXG4gICAgbGV0IGdyYXBoID0ge307XHJcblxyXG4gICAgZm9yIChsZXQgayBpbiBjb29yZHMpIHtcclxuICAgICAgICBncmFwaFtub2RlVG9JbmRleChrKV0gPSBbXSBhcyBzdHJpbmdbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgciBpbiByb2Fkcykge1xyXG4gICAgICAgICAgICBpZiAocm9hZHNbcl1bMF0gPT0gaylcclxuICAgICAgICAgICAgICAgIGdyYXBoW25vZGVUb0luZGV4KGspXS5wdXNoKG5vZGVUb0luZGV4KHJvYWRzW3JdWzFdKSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJvYWRzW3JdWzFdID09IGspXHJcbiAgICAgICAgICAgICAgICBncmFwaFtub2RlVG9JbmRleChrKV0ucHVzaChub2RlVG9JbmRleChyb2Fkc1tyXVswXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcHJlZDogbnVtYmVyW10gPSBbXTtcclxuICAgIGxldCBkaXN0OiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIGlmIChCRlMoZ3JhcGgsIG51bU5vZGVzLCBzcmMsIGRlc3QsIHByZWQsIGRpc3QpID09IGZhbHNlKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIk5vIGF2YWlsYWJsZSBwYXRoXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2ZWN0b3IgcGF0aCBzdG9yZXMgdGhlIHNob3J0ZXN0IHBhdGhcclxuICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgbGV0IGNyYXdsID0gZGVzdDtcclxuICAgIHBhdGgucHVzaChpbmRleFRvTm9kZShjcmF3bCkpO1xyXG4gICAgd2hpbGUgKHByZWRbY3Jhd2xdICE9IC0xKSB7XHJcbiAgICAgICAgcGF0aC5wdXNoKGluZGV4VG9Ob2RlKHByZWRbY3Jhd2xdKSk7XHJcbiAgICAgICAgY3Jhd2wgPSBwcmVkW2NyYXdsXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkaXN0YW5jZSBmcm9tIHNvdXJjZSBpcyBpbiBkaXN0YW5jZSBhcnJheVxyXG4gICAgLy9jb25zb2xlLmxvZyhcIlNob3J0ZXN0IHBhdGggbGVuZ3RoIGlzIDogXCIgKyBkaXN0W2Rlc3RdKVxyXG5cclxuICAgIC8vIHByaW50aW5nIHBhdGggZnJvbSBzb3VyY2UgdG8gZGVzdGluYXRpb25cclxuICAgIC8vY29uc29sZS5sb2coXCJQYXRoIGlzOiBcIiArIHBhdGgpO1xyXG5cclxuICAgIHJldHVybiBwYXRoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBCRlMoZ3JhcGg6IGFueSwgbnVtTm9kZXM6IG51bWJlciwgc3JjOiBudW1iZXIsIGRlc3Q6IG51bWJlciwgcHJlZDogbnVtYmVyW10sIGRpc3Q6IG51bWJlcltdKTogYm9vbGVhbiB7XHJcbiAgICB2YXIgcXVldWU6IG51bWJlcltdID0gW107XHJcbiAgICB2YXIgdmlzaXRlZDogYm9vbGVhbltdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XHJcbiAgICAgICAgdmlzaXRlZC5wdXNoKGZhbHNlKTtcclxuICAgICAgICBkaXN0LnB1c2goTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpO1xyXG4gICAgICAgIHByZWQucHVzaCgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmlzaXRlZFtzcmNdID0gdHJ1ZTtcclxuICAgIGRpc3Rbc3JjXSA9IDA7XHJcbiAgICBxdWV1ZS5wdXNoKHNyYyk7XHJcblxyXG5cclxuICAgIC8vIHN0YW5kYXJkIEJGUyBhbGdvcml0aG1cclxuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIGxldCB1ID0gcXVldWVbMF07XHJcbiAgICAgICAgcXVldWUuc2hpZnQoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyYXBoW3VdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh2aXNpdGVkW2dyYXBoW3VdW2ldXSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdmlzaXRlZFtncmFwaFt1XVtpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZGlzdFtncmFwaFt1XVtpXV0gPSBkaXN0W3VdICsgMTtcclxuICAgICAgICAgICAgICAgIHByZWRbZ3JhcGhbdV1baV1dID0gdTtcclxuICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goZ3JhcGhbdV1baV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdlIHN0b3AgQkZTIHdoZW4gd2UgZmluZFxyXG4gICAgICAgICAgICAgICAgLy8gZGVzdGluYXRpb24uXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKE9iamVjdC5rZXlzKGNvb3JkcylbZ3JhcGhbdV1baV1dKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhncmFwaFt1XVtpXSAtIGRlc3QpIDwgMC4wMSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSIsImltcG9ydCB7Y29vcmRzLCByb2Fkc30gZnJvbSBcIi4vZGF0YVwiXHJcbmltcG9ydCB7IElQYWNrYWdlIH0gZnJvbSBcIi4vcGFja2FnZXNcIjtcclxuaW1wb3J0IHtSb2JvdH0gZnJvbSBcIi4vcm9ib3RcIlxyXG5cclxuLy8gVE9ETzogU2hvdWxkIHRoaXMgYmUgbW92ZWQgdG8gYW4gZXh0ZXJuYWwgY29uZmlndXJhdGlvbiBmaWxlP1xyXG5jb25zdCBMT0NBVElPTl9TSVpFID0gMjA7XHJcbmNvbnN0IExPQ0FUSU9OX1RFWFRfU0laRSA9IFwiMjVweFwiO1xyXG5jb25zdCBST0FEX1dJRFRIID0gNTtcclxuXHJcbmNvbnN0IExPQ0FUSU9OX0NPTE9SOiBzdHJpbmcgPSBcImJsYWNrXCI7XHJcbmNvbnN0IExPQ0FUSU9OX1RFWFRfQ09MT1I6IHN0cmluZyA9IFwid2hpdGVcIjtcclxuY29uc3QgUk9BRF9DT0xPUjogc3RyaW5nID0gXCJibGFja1wiO1xyXG5jb25zdCBST0JPVF9DT0xPUjogc3RyaW5nID0gXCJibHVlXCI7XHJcblxyXG4vLyBHZXQgY2FudmFzIGZyb20gaHRtbFxyXG5jb25zdCBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudCAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rvd25cIilcclxuY29uc3QgY3R4IDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuY3R4LnNjYWxlKDIsMik7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkcmF3KHJvYm90OiBSb2JvdCkge1xyXG4gICAgLy8gU3RvcmUgdGhlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIC8vIFVzZSB0aGUgaWRlbnRpdHkgbWF0cml4IHdoaWxlIGNsZWFyaW5nIHRoZSBjYW52YXNcclxuICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgLy8gUmVzdG9yZSB0aGUgdHJhbnNmb3JtXHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGRyYXdSb2FkcygpO1xyXG4gICAgZHJhd0xvY2F0aW9ucyhyb2JvdC5yb2JvdExvY2F0aW9uKTtcclxuICAgIGRyYXdBbGxQYWNrYWdlcyhyb2JvdC5wYWNrYWdlcyk7XHJcbn1cclxuXHJcbi8vIFBhaW50IGEgc21hbGwgZmlsbGVkIGNpcmNsZSBvbiB0aGUgY2FudmFzIGZvciBlYWNoIGtleSAobG9jYXRpb24pIGluIGNvb3JkcyAocmFuZG9tbHkgcGxhY2VkKVxyXG5mdW5jdGlvbiBkcmF3TG9jYXRpb25zKHJvYm90X2xvY2F0aW9uOiBzdHJpbmcpIHtcclxuICAgIGZvciAobGV0IGsgaW4gY29vcmRzKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmMoY29vcmRzW2tdLngsIGNvb3Jkc1trXS55LCBMT0NBVElPTl9TSVpFLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgaWYoayA9PSByb2JvdF9sb2NhdGlvbilcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFJPQk9UX0NPTE9SO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IExPQ0FUSU9OX0NPTE9SO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBMT0NBVElPTl9URVhUX1NJWkUgKyBcIiBDb21pYyBTYW5zIE1TXCI7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IExPQ0FUSU9OX1RFWFRfQ09MT1I7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGssIGNvb3Jkc1trXS54LCBjb29yZHNba10ueSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdSb2FkcygpIHtcclxuICAgIGZvciAobGV0IGsgaW4gcm9hZHMpIHtcclxuICAgICAgICBkcmF3Um9hZChyb2Fkc1trXVswXSwgcm9hZHNba11bMV0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3Um9hZChmcm9tLCB0bykge1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4Lm1vdmVUbyhjb29yZHNbZnJvbV0ueCwgY29vcmRzW2Zyb21dLnkpO1xyXG4gICAgY3R4LmxpbmVUbyhjb29yZHNbdG9dLngsIGNvb3Jkc1t0b10ueSk7XHJcbiAgICBjdHgubGluZVdpZHRoID0gUk9BRF9XSURUSDtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFJPQURfQ09MT1I7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbn1cclxuXHJcbi8vIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzkwMTE3MFxyXG5mdW5jdGlvbiBkcmF3UGFja2FnZXMoY2VudGVyWDogbnVtYmVyLCBjZW50ZXJZOiBudW1iZXIsIHBhY2tzOiBzdHJpbmdbXSkge1xyXG4gICAgLy8gdmFsdWUgb2YgdGhldGEgY29ycmVzcG9uZGluZyB0byBlbmQgb2YgbGFzdCBjb2lsXHJcbiAgICBjb25zdCBjb2lscyA9IDY7XHJcbiAgICBjb25zdCByYWRpdXMgPSAxNTA7XHJcbiAgICBjb25zdCByb3RhdGlvbiA9IE1hdGguUEkgKiAxLjU7XHJcblxyXG4gICAgY29uc3QgdGhldGFNYXggPSBjb2lscyAqIDIgKiBNYXRoLlBJO1xyXG5cclxuICAgIC8vIEhvdyBmYXIgdG8gc3RlcCBhd2F5IGZyb20gY2VudGVyIGZvciBlYWNoIHNpZGUuXHJcbiAgICBjb25zdCBhd2F5U3RlcCA9IHJhZGl1cyAvIHRoZXRhTWF4O1xyXG5cclxuICAgIC8vIGRpc3RhbmNlIGJldHdlZW4gcG9pbnRzIHRvIHBsb3RcclxuICAgIGNvbnN0IGNob3JkID0gMzA7XHJcblxyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgZm9yIChsZXQgdGhldGEgPSBjaG9yZCAvIGF3YXlTdGVwOyB0aGV0YSA8PSB0aGV0YU1heDspIHtcclxuICAgICAgICAvLyBIb3cgZmFyIGF3YXkgZnJvbSBjZW50ZXJcclxuICAgICAgICBjb25zdCBhd2F5ID0gYXdheVN0ZXAgKiB0aGV0YTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIEhvdyBmYXIgYXJvdW5kIHRoZSBjZW50ZXIuXHJcbiAgICAgICAgY29uc3QgYXJvdW5kID0gdGhldGEgKyByb3RhdGlvbjtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIENvbnZlcnQgJ2Fyb3VuZCcgYW5kICdhd2F5JyB0byBYIGFuZCBZLlxyXG4gICAgICAgIGNvbnN0IHggPSBjZW50ZXJYICsgTWF0aC5jb3MoYXJvdW5kKSAqIGF3YXk7XHJcbiAgICAgICAgY29uc3QgeSA9IGNlbnRlclkgKyBNYXRoLnNpbihhcm91bmQpICogYXdheTtcclxuXHJcbiAgICAgICAgLy8gTm93IHRoYXQgeW91IGtub3cgaXQsIGRvIGl0LlxyXG4gICAgICAgIGlmIChpIDwgcGFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyh4LCB5LCA4LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gXCIxM3B4IEFyaWFsXCI7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHBhY2tzW2ldLCB4LCB5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRvIGEgZmlyc3QgYXBwcm94aW1hdGlvbiwgdGhlIHBvaW50cyBhcmUgb24gYSBjaXJjbGVcclxuICAgICAgICAvLyBzbyB0aGUgYW5nbGUgYmV0d2VlbiB0aGVtIGlzIGNob3JkL3JhZGl1c1xyXG4gICAgICAgIHRoZXRhICs9IGNob3JkIC8gYXdheTtcclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdBbGxQYWNrYWdlcyhwYWNrYWdlczogSVBhY2thZ2VbXSkge1xyXG4gICAgZm9yIChsZXQgayBpbiBjb29yZHMpIHtcclxuICAgICAgICB2YXIgcGFja3M6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGFja2FnZXMpIHtcclxuICAgICAgICAgICAgaWYgKGsgPT0gcC5jdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgcGFja3MucHVzaChwLmRlc3RpbmF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYXdQYWNrYWdlcyhjb29yZHNba10ueCwgY29vcmRzW2tdLnksIHBhY2tzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9