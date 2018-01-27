/*!
 * ugomemo.js v1.0.0
 * Real-time, browser-based playback of Flipnote Studio's .ppm animation format
 * 2018 James Daniel
 * github.com/jaames/ugomemo.js
 * Flipnote Studio is (c) Nintendo Co., Ltd.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ugomemo"] = factory();
	else
		root["ugomemo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _player = __webpack_require__(1);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import decoder from "./decoder";

module.exports = {
  version: "1.0.0",
  player: _player2.default
  // decoder: decoder,
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webglCanvas = __webpack_require__(2);

var _webglCanvas2 = _interopRequireDefault(_webglCanvas);

var _decoder = __webpack_require__(5);

var _decoder2 = _interopRequireDefault(_decoder);

var _audio = __webpack_require__(8);

var _audio2 = _interopRequireDefault(_audio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// internal framerate value -> FPS table
var FRAMERATES = {
  1: 0.5,
  2: 1,
  3: 2,
  4: 4,
  5: 6,
  6: 12,
  7: 20,
  8: 30
};

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */

var ppmPlayer = function () {
  /**
  * Create new flipnote player
  * @param {string | HTMLCanvasElement} el - HTML Canvas Element to use, or CSS selector for one
  * @param {number} width - canvas width in pixels
  * @param {number} height - canvas height in pixels
  */
  function ppmPlayer(el, width, height) {
    _classCallCheck(this, ppmPlayer);

    // if `el` is a string, use it to select an Element, else assume it's an element
    el = "string" == typeof el ? document.querySelector(el) : el;
    this.canvas = new _webglCanvas2.default(el, width, height);
    this._isOpen = false;
    this.loop = false;
    this.currentFrame = 0;
    this.paused = true;
  }

  /**
  * Get the index of the current frame 
  */


  _createClass(ppmPlayer, [{
    key: "open",


    /**
    * Load a Flipnote into the player
    * @param {ArrayBuffer} source - ppm data
    */
    value: function open(source) {
      if (this._isOpen) this.close();
      var buffer = source;
      var ppm = new _decoder2.default(buffer);
      var meta = ppm.meta;
      this.ppm = ppm;
      this.meta = meta;
      this.frameCount = ppm.frameCount;
      this.frameSpeed = ppm.frameSpeed;
      this.loop = meta.loop == 1;
      this._bgmAudio = ppm.soundMeta.bgm.length > 0 ? new _audio2.default(this.ppm.decodeAudio("bgm")) : null;
      if (this._bgmAudio) this._bgmAudio.playbackRate = this._audiorate;
      this._seAudio = [ppm.soundMeta.se1.length > 0 ? new _audio2.default(this.ppm.decodeAudio("se1")) : null, ppm.soundMeta.se2.length > 0 ? new _audio2.default(this.ppm.decodeAudio("se2")) : null, ppm.soundMeta.se3.length > 0 ? new _audio2.default(this.ppm.decodeAudio("se3")) : null];
      this._seFlags = this.ppm.decodeSoundFlags();
      this._isOpen = true;
      this.paused = true;
      this._playbackFrameTime = 0;
      this._lastFrameTime = 0;
      this._events = {};
      this._hasPlaybackStarted = false;
      this.setFrame(this.ppm.thumbFrameIndex);
      this.emit("load");
    }

    /**
    * Close the currently loaded Flipnote and clear the player canvas
    */

  }, {
    key: "close",
    value: function close() {
      this.ppm = null;
      this._isOpen = false;
      this.paused = true;
      this.loop = null;
      this.meta = null;
      this.frameCount = null;
      this.frameSpeed = null;
      this._frame = 0;
      this._bgmAudio = null;
      this._seAudio = new Array(3);
      this._seFlags = null;
      this._hasPlaybackStarted = null;
      this.canvas.clear();
    }

    /**
    * Play the sound effects for a given frame
    * @param {number} index - zero-based frame index
    * @access protected
    */

  }, {
    key: "_playFrameSe",
    value: function _playFrameSe(index) {
      var flags = this._seFlags[index];
      for (var i = 0; i < flags.length; i++) {
        if (flags[i] && this._seAudio[i]) this._seAudio[i].start();
      }
    }

    /**
    * Play the Flipnote BGM
    * @access protected
    */

  }, {
    key: "_playBgm",
    value: function _playBgm() {
      if (this._bgmAudio) this._bgmAudio.start(this.currentTime);
    }

    /**
    * Internal requestAnimationFrame handler
    * @param {number} now - current time
    * @access protected
    */

  }, {
    key: "_playbackLoop",
    value: function _playbackLoop(now) {
      var dt = (now - this._lastFrameTime) / (1000 / 60);
      var frame = this.currentFrame;
      if (this._playbackFrameTime >= 60 / this.framerate) {
        this._playFrameSe(frame);
        this.nextFrame();
        this._playbackFrameTime = 0;
      }
      if (frame == this.frameCount - 1) {
        if (this.loop) {
          this.firstFrame();
          this._playBgm();
          this.emit("playback:loop");
        } else {
          this.pause();
          this.emit("playback:end");
        }
      }
      this._playbackFrameTime += dt;
      this._lastFrameTime = now;
      if (!this.paused) requestAnimationFrame(this._playbackLoop.bind(this));
    }

    /**
    * Begin Flipnote playback
    */

  }, {
    key: "play",
    value: function play() {
      if (!this._isOpen) return null;
      this.paused = false;
      if (!this._hasPlaybackStarted || !this.loop && this.currentFrame == this.frameCount - 1) this._frame = 0;
      this._lastFrameTime = performance.now();
      this._playBgm();
      this._playbackLoop(this._lastFrameTime);
      this._hasPlaybackStarted = true;
      this.emit("playback:start");
    }

    /**
    * Pause Flipnote playback
    */

  }, {
    key: "pause",
    value: function pause() {
      if (!this._isOpen) return null;
      // break the playback loop
      this.paused = true;
      if (this._bgmAudio) this._bgmAudio.stop();
      this.emit("playback:stop");
    }

    /**
    * Jump to a specific frame
    * @param {number} index - zero-based frame index
    */

  }, {
    key: "setFrame",
    value: function setFrame(index) {
      if (!this._isOpen) return null;
      // clamp frame index
      index = Math.max(0, Math.min(index, this.frameCount - 1));
      this._frame = index;
      this._playbackFrameTime = 0;
      this.canvas.setPalette(this.ppm.getFramePalette(index));
      this.canvas.setBitmaps(this.ppm.decodeFrame(index));
      this.canvas.refresh();
    }

    /**
    * Jump to the next frame in the animation
    */

  }, {
    key: "nextFrame",
    value: function nextFrame() {
      if (this.loop && this.currentFrame >= this.frameCount - 1) {
        this.currentFrame = 0;
      } else {
        this.currentFrame += 1;
      }
    }

    /**
    * Jump to the previous frame in the animation
    */

  }, {
    key: "prevFrame",
    value: function prevFrame() {
      if (this.loop && this.currentFrame <= 0) {
        this.currentFrame = this.frameCount - 1;
      } else {
        this.currentFrame -= 1;
      }
    }

    /**
    * Jump to the last frame in the animation
    */

  }, {
    key: "lastFrame",
    value: function lastFrame() {
      this.currentFrame = this.frameCount - 1;
    }

    /**
    * Jump to the first frame in the animation
    */

  }, {
    key: "firstFrame",
    value: function firstFrame() {
      this.currentFrame = 0;
    }

    /**
    * Jump to the thumbnail frame
    */

  }, {
    key: "thumbnailFrame",
    value: function thumbnailFrame() {
      this.currentFrame = this.ppm.thumbFrameIndex;
    }

    /**
    * Resize player canvas
    * @param {number} width - canvas width in pixels
    * @param {number} height - canvas height in pixels
    */

  }, {
    key: "resize",
    value: function resize(width, height) {
      this.canvas.resize(width, height);
    }

    /**
    * Register an event callback
    * @param {string} eventType - event type
    * @param {function} callback - event callback function
    */

  }, {
    key: "on",
    value: function on(eventType, callback) {
      var events = this._events;
      (events[eventType] || (events[eventType] = [])).push(callback);
    }

    /**
    * Remove an event callback
    * @param {string} eventType - event type
    * @param {function} callback - event callback function
    */

  }, {
    key: "off",
    value: function off(eventType, callback) {
      var callbackList = this._events[eventType];
      if (callbackList) callbackList.splice(callbackList.indexOf(callback), 1);
    }

    /**
    * Emit an event (used internally)
    * @param {string} eventType - event type
    * @param {...} args - arguments to be passed to event callback
    */

  }, {
    key: "emit",
    value: function emit(eventType) {
      var callbackList = this._events[eventType] || [];

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < callbackList.length; i++) {
        callbackList[i].apply(null, args);
      }
    }
  }, {
    key: "currentFrame",
    get: function get() {
      return this._frame;
    }

    /**
    * Set the current frame
    */
    ,
    set: function set(index) {
      this.setFrame(index);
    }

    /**
    * Get current playback time in seconds
    */

  }, {
    key: "currentTime",
    get: function get() {
      return this._isOpen ? this.currentFrame * (1 / this.framerate) : null;
    }

    /**
    * Set current playback time in seconds
    */
    ,
    set: function set(value) {
      if (this._isOpen && value < this.duration && value > 0) {
        this.setFrame(Math.round(value / (1 / this.framerate)));
        this._playbackFrameTime = 0;
      }
    }

    /**
    * Get the duration of the Flipnote in seconds
    */

  }, {
    key: "duration",
    get: function get() {
      return this._isOpen ? this.frameCount * (1 / this.framerate) : null;
    }

    /**
    * Get the Flipnote framerate in frames-per-second
    */

  }, {
    key: "framerate",
    get: function get() {
      return FRAMERATES[this.frameSpeed];
    }

    /**
    * Get the audio playback rate by comparing audio and frame speeds
    * @access protected
    */

  }, {
    key: "_audiorate",
    get: function get() {
      return 1 / FRAMERATES[this.ppm.bgmSpeed] / (1 / FRAMERATES[this.frameSpeed]);
    }
  }]);

  return ppmPlayer;
}();

exports.default = ppmPlayer;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vertexShaderGlsl = __webpack_require__(3);

var _vertexShaderGlsl2 = _interopRequireDefault(_vertexShaderGlsl);

var _fragmentShaderGlsl = __webpack_require__(4);

var _fragmentShaderGlsl2 = _interopRequireDefault(_fragmentShaderGlsl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** webgl canvas wrapper class */
var webglCanvas = function () {
  /**
  * Create a rendering canvas
  * @param {HTMLCanvasElement} el - The HTML canvas element
  * @param {number} width - width of the canvas in pixels
  * @param {number} height - height of the canvas in pixels
  */
  function webglCanvas(el, width, height) {
    _classCallCheck(this, webglCanvas);

    el.width = width || 256;
    el.height = height || 192;
    var gl = el.getContext("webgl", { antialias: false });
    var program = gl.createProgram();
    this.program = program;
    this.el = el;
    this.gl = gl;
    this._createShader(gl.VERTEX_SHADER, _vertexShaderGlsl2.default);
    this._createShader(gl.FRAGMENT_SHADER, _fragmentShaderGlsl2.default);
    gl.linkProgram(program);
    gl.useProgram(program);
    // create quad that fills the screen, this will be our drawing surface
    var vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // create textures for each layer
    this._createTexture("u_layer1Bitmap", 0, gl.TEXTURE0);
    this._createTexture("u_layer2Bitmap", 1, gl.TEXTURE1);
  }

  /**
  * Util to compile and attach a new shader
  * @param {shader type} type - gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
  * @param {string} source - GLSL code for the shader
  * @access protected 
  */


  _createClass(webglCanvas, [{
    key: "_createShader",
    value: function _createShader(type, source) {
      var gl = this.gl;
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(this.program, shader);
    }

    /**
    * Util to set up a texture
    * @param {string} name - name of the texture's uniform variable
    * @param {number} index - texture index
    * @param {texture} texture - webgl texture unit, gl.TEXTURE0, gl.TEXTURE1, etc
    * @access protected 
    */

  }, {
    key: "_createTexture",
    value: function _createTexture(name, index, texture) {
      var gl = this.gl;
      gl.uniform1i(gl.getUniformLocation(this.program, name), index);
      gl.activeTexture(texture);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    /**
    * Set an palette individual color
    * @param {string} color - name of the color's uniform variable
    * @param {array} value - r,g,b,a color, each channel's value should be between 0.0 and 1.0
    */

  }, {
    key: "setColor",
    value: function setColor(color, value) {
      this.gl.uniform4f(this.gl.getUniformLocation(this.program, color), value[0] / 255, value[1] / 255, value[2] / 255, value[3] / 255);
    }

    /**
    * Set the palette
    * @param {array} colors - array of r,g,b,a colors with channel values from 0.0 to 1.0, in order of paper, layer1, layer2
    */

  }, {
    key: "setPalette",
    value: function setPalette(colors) {
      this.setColor("u_paperColor", colors[0]);
      this.setColor("u_layer1Color", colors[1]);
      this.setColor("u_layer2Color", colors[2]);
    }

    /**
    * Set layer bitmaps
    * @param {array} buffers - array of two uint8 buffers, one for each layer
    */

  }, {
    key: "setBitmaps",
    value: function setBitmaps(buffers) {
      var gl = this.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, buffers[0]);
      gl.activeTexture(gl.TEXTURE1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 256, 192, 0, gl.ALPHA, gl.UNSIGNED_BYTE, buffers[1]);
    }

    /**
    * Resize canvas
    * @param {number} width - width of the canvas in pixels
    * @param {number} height - height of the canvas in pixels
    */

  }, {
    key: "resize",
    value: function resize() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 192;

      this.el.width = width;
      this.el.height = height;
      this.gl.viewport(0, 0, width, height);
    }

    /**
    * Redraw canvas
    */

  }, {
    key: "refresh",
    value: function refresh() {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    /**
    * Clear canvas
    */

  }, {
    key: "clear",
    value: function clear() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
  }]);

  return webglCanvas;
}();

exports.default = webglCanvas;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ["attribute vec4 a_position;", "varying vec2 v_texcoord;", "void main() {", "gl_Position = a_position;", "v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;", "}"].join("\n");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ["precision lowp float;", "varying vec2 v_texcoord;", "uniform vec4 u_paperColor;", "uniform vec4 u_layer1Color;", "uniform vec4 u_layer2Color;", "uniform sampler2D u_layer1Bitmap;", "uniform sampler2D u_layer2Bitmap;", "void main() {", "float layer1 = texture2D(u_layer1Bitmap, v_texcoord).a;", "float layer2 = texture2D(u_layer2Bitmap, v_texcoord).a;",
// combine the two layer bitmaps together
// each pixel will either be 0.0 if it is "transparent", or (1/255) if it is used
// layer 1 is on top of layer 2, anything else should be paper color
"gl_FragColor = (layer1 == 0.0) ? (layer2 == 0.0) ? u_paperColor : u_layer2Color : u_layer1Color;", "}"].join("\n");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fileReader2 = __webpack_require__(6);

var _fileReader3 = _interopRequireDefault(_fileReader2);

var _adpcm = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * PPM decoder
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Reads frames, audio, and metadata from Flipnote Studio PPM files 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Based on my Python PPM decoder implementation (https://github.com/jaames/flipnote-tools)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Credits:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  PPM format reverse-engineering and documentation:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - bricklife (http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - mirai-iro (http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - harimau_tigris (http://ugomemo.g.hatena.ne.jp/harimau_tigris)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - steven (http://www.dsibrew.org/wiki/User:Steven)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - yellows8 (http://www.dsibrew.org/wiki/User:Yellows8)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - PBSDS (https://github.com/pbsds)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - jaames (https://github.com/jaames)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Identifying the PPM sound codec:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - Midmad from Hatena Haiku
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - WDLMaster from hcs64.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Helping me to identify issues with the Python decoder that this is based on:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - Austin Burk (https://sudomemo.net)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Lastly, a huge thanks goes to Nintendo for creating Flipnote Studio, 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  and to Hatena for providing the Flipnote Hatena online service, both of which inspired so many c:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var WIDTH = 256;
var HEIGHT = 192;
var BLACK = [14, 14, 14, 255];
var WHITE = [255, 255, 255, 255];
var BLUE = [10, 57, 255, 255];
var RED = [255, 42, 42, 255];

var ppmDecoder = function (_fileReader) {
  _inherits(ppmDecoder, _fileReader);

  /**
  * Create a ppmDecoder instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  function ppmDecoder(arrayBuffer) {
    _classCallCheck(this, ppmDecoder);

    var _this = _possibleConstructorReturn(this, (ppmDecoder.__proto__ || Object.getPrototypeOf(ppmDecoder)).call(this, arrayBuffer));

    _this.seek(4);
    // decode header
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
    _this._frameDataLength = _this.readUint32();
    _this._soundDataLength = _this.readUint32();
    _this.frameCount = Math.min(_this.readUint16() + 1, 999);
    _this.seek(18);
    _this.thumbFrameIndex = _this.readUint16();
    // jump to the start of the animation data section
    // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-data-section
    _this.seek(0x06A0);
    var offsetTableLength = _this.readUint16();
    // skip padding + flags
    _this.seek(0x06A8);
    // read frame offsets and build them into a table
    _this._frameOffsets = new Uint32Array(offsetTableLength / 4).map(function (value) {
      return 0x06A8 + offsetTableLength + _this.readUint32();
    });
    _this.meta = _this._decodeMeta();
    _this._decodeSoundHeader();
    // create image buffers
    _this._layers = [new Uint8Array(WIDTH * HEIGHT), new Uint8Array(WIDTH * HEIGHT)];
    _this._prevLayers = [new Uint8Array(WIDTH * HEIGHT), new Uint8Array(WIDTH * HEIGHT)];
    _this._prevFrameIndex = 0;
    return _this;
  }

  /**
  * Seek the buffer position to the start of a given frame
  * @param {number} index - zero-based frame index to jump to
  * @access protected
  */


  _createClass(ppmDecoder, [{
    key: "_seekToFrame",
    value: function _seekToFrame(index) {
      this.seek(this._frameOffsets[index]);
    }

    /**
    * Seek the buffer position to the start of a given audio track
    * @param {string} track - track name, "bgm" | "se1" | "se2" | "se3"
    * @access protected
    */

  }, {
    key: "_seekToAudio",
    value: function _seekToAudio(track) {
      this.seek(this.soundMeta[track].offset);
    }

    /**
    * Read an UTF-16 little-endian string (for usernames)
    * @param {number} length - max length of the string in bytes (including padding)
    * @returns {string}
    * @access protected
    */

  }, {
    key: "_readUtf16",
    value: function _readUtf16(length) {
      var str = "";
      var terminated = false;
      for (var i = 0; i < length / 2; i++) {
        var char = this.readUint16();
        // utf16 stings in flipnotes are terminated with null bytes (0x00) 
        if (terminated || char == 0) {
          terminated = true;
          continue;
        }
        str += String.fromCharCode(char);
      }
      return str;
    }

    /**
    * Read a hex string (for FSIDs and filenames)
    * @param {number} length - max length of the string in bytes
    * @param {boolean} reverse - defaults to false, if true, the string will be read in reverse byte order
    * @returns {string}
    * @access protected
    */

  }, {
    key: "_readHex",
    value: function _readHex(length) {
      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var ret = [];
      for (var i = 0; i < length; i++) {
        ret.push(this.readUint8().toString(16).padStart(2, "0"));
      }
      if (reverse) ret.reverse();
      return ret.join("").toUpperCase();
    }

    /**
    * Read a HEX string 
    * @returns {string}
    * @access protected
    */

  }, {
    key: "_readFilename",
    value: function _readFilename() {
      var str = "";
      // filename starts with 3 hex bytes
      str += this._readHex(3) + "_";
      // then 13 byte utf8 string
      for (var i = 0; i < 13; i++) {
        str += String.fromCharCode(this.readUint8());
      }
      str += "_";
      // then 2-byte edit count padded to 3 chars
      str += this.readUint16().toString().padStart(3, "0");
      return str;
    }

    /**
    * Unpack the line encoding flags for all 192 lines in a layer
    * @returns {array}
    * @access protected
    */

  }, {
    key: "_readLineEncoding",
    value: function _readLineEncoding() {
      var unpacked = new Uint8Array(HEIGHT);
      for (var byteOffset = 0; byteOffset < 48; byteOffset++) {
        var byte = this.readUint8();
        // each line's encoding type is stored as a 2-bit value
        for (var bitOffset = 0; bitOffset < 8; bitOffset += 2) {
          unpacked[byteOffset * 4 + bitOffset / 2] = byte >> bitOffset & 0x03;
        }
      }
      return unpacked;
    }

    /**
    * Decode the main PPM metadata, like username, timestamp, etc
    * @returns {object}
    * @access protected
    */

  }, {
    key: "_decodeMeta",
    value: function _decodeMeta() {
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#file-header
      this.seek(0x10);
      var lock = this.readUint16(),
          thumbIndex = this.readInt16(),
          rootAuthorName = this._readUtf16(22),
          parentAuthorName = this._readUtf16(22),
          currentAuthorName = this._readUtf16(22),
          parentAuthorId = this._readHex(8, true),
          currentAuthorId = this._readHex(8, true),
          parentFilename = this._readFilename(),
          currentFilename = this._readFilename(),
          rootAuthorId = this._readHex(8, true);
      this.seek(0x9A);
      var timestamp = new Date((this.readUint32() + 946684800) * 1000);
      this.seek(0x6A60);
      var flags = this.readUint16();
      return {
        lock: lock,
        loop: flags >> 1 & 0x01,
        frame_count: this.frameCount,
        thumb_index: thumbIndex,
        timestamp: timestamp,
        spinoff: currentAuthorId !== parentAuthorId,
        root: {
          username: rootAuthorName,
          fsid: rootAuthorId
        },
        parent: {
          username: parentAuthorName,
          fsid: parentAuthorId,
          filename: parentFilename
        },
        current: {
          username: currentAuthorName,
          fsid: currentAuthorId,
          filename: currentFilename
        }
      };
    }

    /**
    * Decode the sound header to get audio track lengths and frame/bgm sppeds
    * @access protected
    */

  }, {
    key: "_decodeSoundHeader",
    value: function _decodeSoundHeader() {
      // https://github.com/pbsds/hatena-server/wiki/PPM-format#sound-data-section
      // offset = frame data offset + frame data length + sound effect flags
      var offset = 0x06A0 + this._frameDataLength + this.frameCount;
      // account for multiple-of-4 padding
      if (offset % 4 != 0) offset += 4 - offset % 4;
      this.seek(offset);
      var bgmLen = this.readUint32();
      var se1Len = this.readUint32();
      var se2Len = this.readUint32();
      var se3Len = this.readUint32();
      this.frameSpeed = 8 - this.readUint8();
      this.bgmSpeed = 8 - this.readUint8();
      offset += 32;
      this.soundMeta = {
        "bgm": { offset: offset, length: bgmLen },
        "se1": { offset: offset += bgmLen, length: se1Len },
        "se2": { offset: offset += se1Len, length: se2Len },
        "se3": { offset: offset += se2Len, length: se3Len }
      };
    }

    /**
    * Check whether or not a given frame is based on the previous one
    * @param {number} index - zero-based frame index 
    * @returns {boolean}
    */

  }, {
    key: "_isFrameNew",
    value: function _isFrameNew(index) {
      this._seekToFrame(index);
      var header = this.readUint8();
      return header >> 7 & 0x1;
    }

    /**
    * Helper to decode necessary previous frames if the current frame is difference-based
    * @param {number} index - zero-based frame index 
    */

  }, {
    key: "_decodePrevFrames",
    value: function _decodePrevFrames(index) {
      var backTrack = 0;
      var isNew = 0;
      while (!isNew) {
        backTrack += 1;
        isNew = this._isFrameNew(index - backTrack);
      }
      backTrack = index - backTrack;
      while (backTrack < index) {
        this.decodeFrame(backTrack, false);
        backTrack += 1;
      }
      // jump back to where we were and skip flag byte
      this._seekToFrame(index);
      this.seek(1, 1);
    }

    /**
    * Get the color palette for a given frame
    * @param {number} index - zero-based frame index 
    * @returns {array} rgba palette in order of paper, layer1, layer2
    */

  }, {
    key: "getFramePalette",
    value: function getFramePalette(index) {
      this._seekToFrame(index);
      var header = this.readUint8();
      var paperColor = header & 0x1;
      var pen = [null, paperColor == 1 ? BLACK : WHITE, RED, BLUE];
      return [paperColor == 1 ? WHITE : BLACK, pen[header >> 1 & 0x3], // layer 1 color
      pen[header >> 3 & 0x3]];
    }

    /**
    * Decode a frame
    * @param {number} index - zero-based frame index 
    * @param {boolean} decodePrev - defaults to true, set to false to not bother decoding previous frames
    */

  }, {
    key: "decodeFrame",
    value: function decodeFrame(index) {
      var decodePrev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // https://github.com/pbsds/hatena-server/wiki/PPM-format#animation-frame
      this._seekToFrame(index);
      var header = this.readUint8();
      var isNewFrame = header >> 7 & 0x1;
      var isTranslated = header >> 5 & 0x3;
      var translateX = 0;
      var translateY = 0;

      if (decodePrev && !isNewFrame && index !== this._prevFrameIndex + 1) {
        this._decodePrevFrames(index);
      }
      // copy the current layer buffers to the previous ones
      this._prevLayers[0].set(this._layers[0]);
      this._prevLayers[1].set(this._layers[1]);
      this._prevFrameIndex = index;
      // reset current layer buffers
      this._layers[0].fill(0);
      this._layers[1].fill(0);

      if (isTranslated) {
        translateX = this.readInt8();
        translateY = this.readInt8();
      }

      var layerEncoding = [this._readLineEncoding(), this._readLineEncoding()];
      // start decoding layer bitmaps
      for (var layer = 0; layer < 2; layer++) {
        var layerBitmap = this._layers[layer];
        for (var line = 0; line < HEIGHT; line++) {
          var chunkOffset = line * WIDTH;
          var lineType = layerEncoding[layer][line];
          switch (lineType) {
            // line type 0 = blank line, decode nothing
            case 0:
              break;
            // line types 1 + 2 = compressed bitmap line
            case 1:
            case 2:
              var lineHeader = this.readUint32(false);
              // line type 2 starts as an inverted line
              if (lineType == 2) layerBitmap.fill(1, chunkOffset, chunkOffset + WIDTH);
              // loop through each bit in the line header
              while (lineHeader & 0xFFFFFFFF) {
                // if the bit is set, this 8-pix wide chunk is stored
                // else we can just leave it blank and move on to the next chunk
                if (lineHeader & 0x80000000) {
                  var chunk = this.readUint8();
                  // unpack chunk bits
                  for (var pixel = 0; pixel < 8; pixel++) {
                    layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1;
                  }
                }
                chunkOffset += 8;
                // shift lineheader to the left by 1 bit, now on the next loop cycle the next bit will be checked
                lineHeader <<= 1;
              }
              break;
            // line type 3 = raw bitmap line
            case 3:
              while (chunkOffset < (line + 1) * WIDTH) {
                var chunk = this.readUint8();
                for (var pixel = 0; pixel < 8; pixel++) {
                  layerBitmap[chunkOffset + pixel] = chunk >> pixel & 0x1;
                }
                chunkOffset += 8;
              }
              break;
          }
        }
      }
      // Merge this frame with the previous frame if needed
      if (!isNewFrame) {
        var dest, src, srcOutOfBounds;
        for (var y = 0; y < HEIGHT; y++) {
          for (var x = 0; x < WIDTH; x++) {
            dest = x + y * WIDTH;
            src = dest - (translateX + translateY * WIDTH);
            srcOutOfBounds = x - translateX > WIDTH || x - translateX < 0;
            // if the current frame is based on changes from the preivous one, merge them by XORing their values
            this._layers[0][dest] = srcOutOfBounds ? this._layers[0][dest] : this._layers[0][dest] ^ this._prevLayers[0][src];
            this._layers[1][dest] = srcOutOfBounds ? this._layers[1][dest] : this._layers[1][dest] ^ this._prevLayers[1][src];
          }
        }
      }
      return this._layers;
    }

    /**
    * Decode an audio track to 32-bit adpcm
    * @param {string} track - track name, "bgm" | "se1" | "se2" | "se3"
    * @returns {Float32Array}
    */

  }, {
    key: "decodeAudio",
    value: function decodeAudio(track) {
      var _this2 = this;

      this._seekToAudio(track);
      var buffer = new Uint8Array(this.soundMeta[track].length).map(function (value) {
        return _this2.readUint8();
      });
      return (0, _adpcm.decodeAdpcm)(buffer);
    }

    /**
    * Decode the sound effect usage for each frame
    * @returns {array}
    */

  }, {
    key: "decodeSoundFlags",
    value: function decodeSoundFlags() {
      var _this3 = this;

      this.seek(0x06A0 + this._frameDataLength);
      // per msdn docs - the array map callback is only invoked for array indicies that have assigned values
      // so when we create an array, we need to fill it with something before we can map over it
      var arr = new Array(this.frameCount).fill([]);
      return arr.map(function (value) {
        var byte = _this3.readUint8();
        return [byte & 0x1, byte >> 1 & 0x1, byte >> 2 & 0x1];
      });
    }
  }]);

  return ppmDecoder;
}(_fileReader3.default);

exports.default = ppmDecoder;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** file reader serves as a wrapper around the DataView API to help keep track of the offset into the file */
var fileReader = function () {
  /**
  * Create a fileReader instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  function fileReader(arrayBuffer) {
    _classCallCheck(this, fileReader);

    this._data = new DataView(arrayBuffer);
    this._offset = 0;
  }

  /**
  * Get the length of the file
  * @returns {number}
  */


  _createClass(fileReader, [{
    key: "seek",


    /**
    * based on the seek method from Python's file objects - https://www.tutorialspoint.com/python/file_seek.htm
    * @param {number} offset - position of the read pointer within the file
    * @param {number} whence - (optional) defaults to absolute file positioning,
    *                          1 = offset is relative to the current position
    *                          2 = offset is relative to the file's end
    */
    value: function seek(offset, whence) {
      switch (whence) {
        case 2:
          this._offset = this._data.byteLength + offset;
          break;
        case 1:
          this._offset += offset;
          break;
        case 0:
        default:
          this._offset = offset;
          break;
      }
    }

    /**
    * Read an unsigned 8-bit integer from the file, and automatically increment the offset
    * @returns {number}
    */

  }, {
    key: "readUint8",
    value: function readUint8() {
      var val = this._data.getUint8(this._offset);
      this._offset += 1;
      return val;
    }

    /**
    * Read a signed 8-bit integer from the file, and automatically increment the offset
    * @returns {number}
    */

  }, {
    key: "readInt8",
    value: function readInt8() {
      var val = this._data.getInt8(this._offset);
      this._offset += 1;
      return val;
    }

    /**
    * Read an unsigned 16-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readUint16",
    value: function readUint16() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getUint16(this._offset, littleEndian);
      this._offset += 2;
      return val;
    }

    /**
    * Read a signed 16-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readInt16",
    value: function readInt16() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getInt16(this._offset, littleEndian);
      this._offset += 2;
      return val;
    }

    /**
    * Read an unsigned 32-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readUint32",
    value: function readUint32() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getUint32(this._offset, littleEndian);
      this._offset += 4;
      return val;
    }

    /**
    * Read a signed 32-bit integer from the file, and automatically increment the offset
    * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
    * @returns {number}
    */

  }, {
    key: "readInt32",
    value: function readInt32() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var val = this._data.getInt32(this._offset, littleEndian);
      this._offset += 4;
      return val;
    }
  }, {
    key: "fileLength",
    get: function get() {
      return this._data.byteLength;
    }
  }]);

  return fileReader;
}();

exports.default = fileReader;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeAdpcm = decodeAdpcm;
/** convert 4-bit adpcm to float32 pcm (as supported by the AudioBuffer API) 
 *  implementation based on https://github.com/jwzhangjie/Adpcm_Pcm/blob/master/adpcm.c
*/

var indexTable = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];

var stepSizeTable = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];

var statePrevSample = 0,
    statePrevIndex = 0;

/**
* Convert 4-bit adpcm to 32-bit pcm
* @param {Uint8Array} inputBuffer - adpcm buffer
* @returns {Float32Array}
*/
function decodeAdpcm(inputBuffer) {
  statePrevSample = 0;
  statePrevIndex = 0;
  var outputBuffer = new Float32Array(inputBuffer.length * 2);
  var outputOffset = 0;
  for (var inputOffset = 0; inputOffset < inputBuffer.length; inputOffset++) {
    var byte = inputBuffer[inputOffset];
    // note - Flipnote Studio's adpcm data uses reverse nibble order
    outputBuffer[outputOffset] = decodeSample(byte & 0xF);
    outputBuffer[outputOffset + 1] = decodeSample(byte >> 4 & 0xF);
    outputOffset += 2;
  }
  return outputBuffer;
};

/**
* Unpack a single adpcm 4-bit sample
* @param {number} sample - sample value
* @returns {number}
* @access protected
*/
function decodeSample(sample) {
  var predSample = statePrevSample;
  var index = statePrevIndex;
  var step = stepSizeTable[index];
  var difference = step >> 3;

  // compute difference and new predicted value
  if (sample & 0x4) difference += step;
  if (sample & 0x2) difference += step >> 1;
  if (sample & 0x1) difference += step >> 2;
  // handle sign bit
  predSample += sample & 0x8 ? -difference : difference;

  // find new index value
  index += indexTable[sample];
  index = clamp(index, 0, 88);

  // clamp output value
  predSample = clamp(predSample, -32767, 32767);
  statePrevSample = predSample;
  statePrevIndex = index;
  // return a value between -1.0 and 1.0, since that's what's used by JavaScript's AudioBuffer API
  return predSample / 32768;
};

/**
* Util to clamp a number within a given range
* @param {number} num - input value
* @param {number} min - minimun value
* @param {number} max - maximum value
* @returns {number}
* @access protected
*/
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Wrapper around JavaScript's audio API since it's a bit of a pain to deal with
var audioTrack = function () {
  /**
  * Create a new audio player
  * @param {Float32Array} audioData - mono-channel floating 32-bit PCM audio
  */
  function audioTrack(audioData) {
    _classCallCheck(this, audioTrack);

    var ctx = new AudioContext();
    var audioBuffer = ctx.createBuffer(1, audioData.length, 8192);
    var channel = audioBuffer.copyToChannel(audioData, 0);
    this.audioBuffer = audioBuffer;
    this.source = null;
    this.paused = true;
    this.ctx = ctx;
    this.playbackRate = 1;
  }

  /**
  * Start audio playback
  * @param {number} offset - offset to begin playback at
  */


  _createClass(audioTrack, [{
    key: "start",
    value: function start(offset) {
      var _this = this;

      this.source = this.ctx.createBufferSource();
      this.source.buffer = this.audioBuffer;
      this.source.connect(this.ctx.destination);
      this.source.onended = function (e) {
        _this.paused = true;
      };
      this.source.playbackRate.value = this.playbackRate;
      this.source.start(0, offset);
      this.paused = false;
    }

    /**
    * Stop audio playback
    */

  }, {
    key: "stop",
    value: function stop() {
      if (this.source) this.source.stop();
      this.source = null;
      this.paused = true;
    }
  }]);

  return audioTrack;
}();

exports.default = audioTrack;

/***/ })
/******/ ]);
});
//# sourceMappingURL=ugomemo.js.map