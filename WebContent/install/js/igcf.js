/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
*/
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var Base = C_lib.Base = (function () {
        function F() {}

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // IE won't copy toString using the loop above
                // Other non-enumerable properties are:
                //   hasOwnProperty, isPrototypeOf, propertyIsEnumerable,
                //   toLocaleString, valueOf
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.$super.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push((Math.random() * 0x100000000) | 0);
            }

            return WordArray.create(words, nBytes);
        }
    });

    /**
     * Encoder namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return WordArray.create(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return WordArray.create(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = WordArray.create();
            this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         * This method invokes _doProcessBlock(dataWords, offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} flush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (flush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (flush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return WordArray.create(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
        },

        _minBufferSize: 0
    });

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        // cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            // this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            this._doFinalize();

            return this._hash;
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = hasher.clone();
         */
        clone: function () {
            var clone = BufferedBlockAlgorithm.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        },

        blockSize: 512/32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return hasher.create(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return C_algo.HMAC.create(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}(Math));

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Reusable object
    var W = [];

    /**
     * SHA-1 hash algorithm.
     */
    var SHA1 = C_algo.SHA1 = Hasher.extend({
        _doReset: function () {
            this._hash = WordArray.create([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            // Computation
            for (var i = 0; i < 80; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                    W[i] = (n << 1) | (n >>> 31);
                }

                var t = ((a << 5) | (a >>> 27)) + e + W[i];
                if (i < 20) {
                    t += ((b & c) | (~b & d)) + 0x5a827999;
                } else if (i < 40) {
                    t += (b ^ c ^ d) + 0x6ed9eba1;
                } else if (i < 60) {
                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                } else /* if (i < 80) */ {
                    t += (b ^ c ^ d) - 0x359d3e2a;
                }

                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = t;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA1('message');
     *     var hash = CryptoJS.SHA1(wordArray);
     */
    C.SHA1 = Hasher._createHelper(SHA1);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA1(message, key);
     */
    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
}());

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Ignore whitespaces
            base64Str = base64Str.replace(/\s/g, '');

            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bitsHigh = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                    var bitsLow  = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bitsHigh | bitsLow) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else
    alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for(t = 0; t < z.length; ++t)
      rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }  
  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  //rng_seed_int(window.screenX);
  //rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if(rng_state == null) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		if (!input)
			return "";
			
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 	},
 	
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}
var gsequence = 0;

if (!window.IG$/*mainapp*/)
{
	window.IG$/*mainapp*/ = {};
}

IG$/*mainapp*/.__c_/*chartoption*/ = IG$/*mainapp*/.__c_/*chartoption*/ || {};
IG$/*mainapp*/.__c_/*chartoption*/.chartext = IG$/*mainapp*/.__c_/*chartoption*/.chartext || {};

var extjsphone = window.Ext && Ext.versions && Ext.versions.touch;

//if (typeof(Ext) != "undefined" && !extjsphone)
//{
//	Ext.ns = Ext["ns"];
//	Ext.util.Observable.on = Ext.util.Observable["on"];
//	Ext.Ajax.on = Ext.Ajax["on"];
//}

IG$/*mainapp*/._I03/*isCanvasSupported*/ = function() {
	var elem = document.createElement("canvas");
	return !!(elem.getContext && elem.getContext("2d"));	
}


IG$/*mainapp*/.UNDEFINED;
IG$/*mainapp*/.L_SPPL = null;
IG$/*mainapp*/.msgint = -1;
IG$/*mainapp*/.mX/*markInvalid*/ = "Field necessary";
IG$/*mainapp*/.level = 0;
IG$/*mainapp*/.cb/*clipboard*/ = null;
IG$/*mainapp*/.sX/*seperator*/ = "|";
IG$/*mainapp*/.i$0 = "initComponent";
IG$/*mainapp*/.msvg = window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
IG$/*mainapp*/.mcanvas = !IG$/*mainapp*/.msvg;

if (IG$/*mainapp*/.mcanvas && !IG$/*mainapp*/._I03/*isCanvasSupported*/())
{
	IG$/*mainapp*/.mcanvas = false;
}
IG$/*mainapp*/.dbp = {};
IG$/*mainapp*/.ps = {};
IG$/*mainapp*/.lE/*loadExtend*/ = {
	rcsloaded: false,
	items: []
};

IG$/*mainapp*/.extend = function(objname, base, option) {
	if (IG$/*mainapp*/.lE/*loadExtend*/.rcsloaded)
	{
		objname = IG$/*mainapp*/.x_c/*extend*/(base, option);
	}
	else
	{
		IG$/*mainapp*/.lE/*loadExtend*/.items.push({
			name: objname,
			base: base,
			option: option
		});
	}
};

IG$/*mainapp*/._rrcsv = function(t) {
	if (t && t.length > 1 && t.charAt(0) == "@")
	{
		t = IRm$/*resources*/.r1(t);
	}
	return t;
}

IG$/*mainapp*/._rrcs = function(dobj, t, span, istext) {
	if (t && t.length > 1 && t.charAt(0) == "@")
	{
		dobj._rcs = dobj._rcs || [];
		
		dobj._rcs.push({
			t: t,
			h: span,
			dobj: dobj,
			t: istext
		});
		
		t = IRm$/*resources*/.r1(t);
	}
	
	return t;
};

IG$/*mainapp*/.$lbg = function(msg, init) {
	if (init || !IG$/*mainapp*/.___mtimer)
	{
		IG$/*mainapp*/.___mtimer = new Date().getTime();
	}
	
	var ctime = new Date().getTime();
	
	console.log((ctime - IG$/*mainapp*/.___mtimer), msg);
}

IG$/*mainapp*/.override = function (target, overrides) {
    if (target.$isClass) {
        target.override(overrides);
    } else if (typeof target == "function") {
        IG$/*mainapp*/.apply(target.prototype, overrides);
    } else {
        var owner = target.self,
            name, value;

        if (owner && owner.$isClass) { // if (instance of Ext.defined class)
            for (name in overrides) {
                if (overrides.hasOwnProperty(name)) {
                    value = overrides[name];

                    if (typeof value == "function") {
                        //<debug>
                        if (owner.$className) {
                            value.displayName = owner.$className + "#" + name;
                        }
                        //</debug>

                        value.$name = name;
                        value.$owner = owner;
                        value.$previous = target.hasOwnProperty(name)
                            ? target[name] // already hooked, so call previous hook
                            : callOverrideParent; // calls by name on prototype
                    }

                    target[name] = value;
                }
            }
        } else {
            IG$/*mainapp*/.apply(target, overrides);
        }
    }

    return target;
}

IG$/*mainapp*/.x_c/*extend*/ = (function() {
    // inline overrides
    var objectConstructor = Object.prototype.constructor,
        inlineOverrides = function(o) {
        for (var m in o) {
            if (!o.hasOwnProperty(m)) {
                continue;
            }
            this[m] = o[m];
        }
    };

    return function(subclass, superclass, overrides) {
        // First we check if the user passed in just the superClass with overrides
        if (IG$/*mainapp*/.isObject(superclass)) {
            overrides = superclass;
            superclass = subclass;
            subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                return superclass.apply(this, arguments);
            };
        }

        // We create a new temporary class
        var F = function() {},
            subclassProto, superclassProto = superclass.prototype;
        F.prototype = superclassProto;
        subclassProto = subclass.prototype = new F();
        subclassProto.constructor = subclass;
        subclass.superclass = superclassProto;

        if (superclassProto.constructor === objectConstructor) {
            superclassProto.constructor = superclass;
        }

        subclass.override = function(overrides) {
            IG$/*mainapp*/.override(subclass, overrides);
        };

        subclassProto.override = inlineOverrides;
        subclassProto.proto = subclassProto;

        subclass.override(overrides);
        subclass.extend = function(o) {
            return IG$/*mainapp*/.extend(subclass, o);
        };

        return subclass;
    };
}());

IG$/*mainapp*/.D_1/*microcharttype*/ = function(chartdata, opt) {
	var mctype = chartdata.mctype,
		c1 = chartdata.linecolor ? IG$/*mainapp*/.$gv/*getColorValue*/(chartdata.linecolor) : null,
		c2 = chartdata.fillcolor ? IG$/*mainapp*/.$gv/*getColorValue*/(chartdata.fillcolor) : null;
	
	switch(mctype)
	{
	case 0:
		opt.type = "bullet";
		break;
	case 2:  // area
		opt.type = "line";
		if (c1)
		{
			opt.lineColor = c1;
		}
		if (c2)
		{
			opt.fillColor = c2;
		}
		break;
	case 4:
		opt.type = "bar";
		if (c1)
		{
			opt.barColor = c1;
		}
		if (c2)
		{
			opt.negBarColor = c2;
		}
		break;
	case 6:
		opt.type = "box";
		break;
	case 7:
		opt.type = "tristate";
		if (c1)
		{
			opt.posBarColor = c1;
		}
		if (c2)
		{
			opt.negBarColor = c2;
		}
		break;
	case 8:
		opt.type = "pie";
		break;
	case 9:
		opt.type = "box";
		if (c1)
		{
			opt.boxFillColor = c1;
		}
		if (c2)
		{
			opt.medianColor = c2;
		}
		break;
	default: 
		opt.type = "line";
		if (c1)
		{
			opt.lineColor = c1;
		}
		opt.fillColor = "#fff";
		break;
	}
}

IG$/*mainapp*/.apply = function(object, config, defaults) {
    if (object && config && typeof config === "object") {
        var i, j, k;

        for (i in config) {
            object[i] = config[i];
        }
        
        var enumerables;

        if (enumerables) {
            for (j = enumerables.length; j--;) {
                k = enumerables[j];
                if (config.hasOwnProperty(k)) {
                    object[k] = config[k];
                }
            }
        }
    }

    return object;
};

IG$/*mainapp*/.copyObject = function(src) {
	var r = {}, k;
	
	for (k in src)
	{
		r[k] = src[k];
	}
	
	return r;
}

IG$/*mainapp*/.isObject = function(val) {
	if (val === null) { return false;}
	return typeof val === "object";
}

IG$/*mainapp*/.isString = function(val) {
	return typeof val === "string";
}

IG$/*mainapp*/._I04/*getMetaItemCache*/ = {
	itemicon: {},
	foldertype: {}
};

IG$/*mainapp*/._I05/*getLicenseTag*/ = function() {
	var r,
		m;
	
	if (IG$/*mainapp*/._I83/*dlgLogin*/ && IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/)
	{
		m = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l3.substring(1);
	}
	
	if (m == "1")
	{
		r = ["COMMUNITY EDITION", "http://www.ingecep.com"];
	}
	
	// r = ["COMMUNITY EDITION", "http://www.ingecep.com"];
	
	return r;
}

IG$/*mainapp*/._I06/*formatUID*/ = function(uid) {
	if (uid && uid.indexOf("-") > -1)
	{
		var uid1 = uid.substring(0, uid.indexOf("-")),
			uid2 = uid.substring(uid.indexOf("-") + 1),
			i;
		
		if (uid1.length < 8)
		{
			for (i=uid1.length; i<8; i++)
			{
				uid1 = "0" + uid1;
			}
		}
		
		if (uid2.length < 8)
		{
			for (i=uid2.length; i<8; i++)
			{
				uid2 = "0" + uid2;
			}
		}
		
		return uid1 + "-" + uid2;
	}
	
	return uid;
}

IG$/*mainapp*/._I07/*checkUID*/ = function(uid) {
	var r = false;
	
	if (uid && uid.length == 17 && uid.charAt(8) == "-")
	{
		r = true;
	}
	
	return r;
}

IG$/*mainapp*/._I08/*formatName*/ = function(tname) {
	if (tname.length > 17 && tname.charAt(17) == "_")
	{
		tname = tname.substring(18);
	}
	else if (tname.length > 15 && tname.charAt(15) == "_")
	{
		tname = tname.substring(16);
	}
	
	return tname;
}

IG$/*mainapp*/.trim12 = function(str) {
	if (!str)
		return str;
	
	var	str = str.replace(/^\s\s*/, ""),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

IG$/*mainapp*/._I0a/*drawLicenseTag*/ = function(unode) {
	var i,
		ltag = IG$/*mainapp*/._I05/*getLicenseTag*/(),
		PjU/*watermark*/,
		mvar;
	
	if (ltag)
	{
		PjU/*watermark*/ = $("<div></div>")
			.css({
				position: "absolute", 
				bottom: 10, left: 10, 
				backgroundImage: "url(./images/75p_white.png)",
				backgroundRepeat: "repeat",
				padding: 5
			})
			.appendTo(unode);
		for (i=0; i < ltag.length; i++)
		{
			mvar = (i>0 ? "<br>" : "");
			if (ltag[i].substring(0, 4) == "http")
			{
				mvar += "<a href='" + ltag[i] + "' target='_new'>" + ltag[i] + "</a>";
			}
			else
			{
				mvar += "<span>" + ltag[i] + "</span>";
			}
			PjU/*watermark*/.append(mvar);
		}
	}
}

IG$/*mainapp*/._I0b/*tooltip*/ = function(ui, content) {
	var t = IG$/*mainapp*/.Ti/*tooltipInstance*/;
	if (!t)
	{
		t = IG$/*mainapp*/.Ti/*tooltipInstance*/ = $("<div class='mto'></div>").css({position: "absolute", zIndex: 999}).hide();
		t.appendTo($(body));
	}
	
	t.text(text);
	t.show();
}

IG$/*mainapp*/._I0c/*typeOfValue*/ = function(value) {
    var s = typeof value;
    if (s === "object") {
        if (value) {
            if (value instanceof Array) {
                s = "array";
            }
        } else {
            s = "null";
        }
    }
    return s;
}

IG$/*mainapp*/._I0d/*findSubDivClass*/ = function(unode, cname) {
	var cdiv = null;
	if (unode.childNodes != null && unode.childNodes.length > 0)
	{
		var i;
		for (i=0; i < unode.childNodes.length; i++)
		{
			var classname = unode.childNodes[i].className;
			var cid = unode.childNodes[i].id;
			
			if ((classname && typeof(classname) == "string" && classname.indexOf(cname) > -1) || cid == cname)
			{
				return unode.childNodes[i];
			}
			
			var nodename = (unode.childNodes[i].nodeName) ? unode.childNodes[i].nodeName : unode.childNodes[i].localName;
			
			if (nodename.toLowerCase() == "div" || nodename.toLowerCase() == "span")
			{
				cdiv = IG$/*mainapp*/._I0d/*findSubDivClass*/(unode.childNodes[i], cname);
				
				if (cdiv != null)
					return cdiv;
			}
		}
	}
	
	return cdiv;
}

IG$/*mainapp*/._I0e/*isFolder*/ = function(typename) {
	var r = 5,
		cache = IG$/*mainapp*/._I04/*getMetaItemCache*/.foldertype;
		
	if (cache[typename])
	{
		r = cache[typename];
	}
	else
	{
		if (/(workspace|folder|rfolder|javapackage)/.test(typename) == true)
		{
			r = 1;
		}
		else if (/(cube|mcube|metrics|datacube|nosql|mdbcube|sqlcube)/.test(typename) == true && typename != "cubemodel")
		{
			r = 2;
		}
		else if (typename == "datemetric")
		{
			r = 3;
		}
		
		cache[typename] = r;
	}
	return r;
}

IG$/*mainapp*/._I0f/*sortTypeOrder*/ = {"workspace": 0, "folder": 1, "cube": 2, "cubemodel": 3, "javapackage": 4, "mcube": 5, "mdbcube": 6};

IG$/*mainapp*/._I10/*sortMeta*/ = function(items) {
	var torder = IG$/*mainapp*/._I0f/*sortTypeOrder*/,
		i;
	
	for (i=0; i < items.length; i++)
	{
		items[i].ltype = items[i].type.toLowerCase();
		items[i].lfd = IG$/*mainapp*/._I0e/*isFolder*/(items[i].ltype);
	}
	
	items.sort(function(a, b) {
		var c = 0,
			sa, sb,
			na = -1, nb = -1,
			al = a.lfd,
			bl = b.lfd,
			at = a.ltype,
			bt = b.ltype,
			an = a.nodepath || "",
			bn = b.nodepath || "",
			at1 = torder[at] || 99,
			bt1 = torder[bt] || 99,
			i, n, L;
			
		an = an.substring(0, an.lastIndexOf("/"));
		bn = bn.substring(0, bn.lastIndexOf("/"));
		
		if (at1 != bt1)
		{
			c = at1 - bt1;
		}
		else if (an != bn)
		{
			sa = an;
			sb = bn;
			
			if (sa.charAt(0) >= "0" && sa.charAt(0) <= "9")
			{
				na = parseInt(sa);
			}
			if (sb.charAt(0) >= "0" && sb.charAt(0) <= "9")
			{
				nb = parseInt(sb);
			}
			
			if (na > -1 && nb > -1)
			{
				c = (na - nb);
			}
			else if (na > -1)
			{
				c = 1;
			}
			else if (nb > -1)
			{
				c = -1;
			}
			else 
			{
				c = (sa > sb) ? 1 : -1;
			}
		}
		else if (al == bl && at1 == bt1)
		{
			sa = a.lname || a.name;
			sb = b.lname || b.name;
			
			rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
			
			if(sa == sb)
			{
				c = 0;
			}
			else
			{
			    a= sa.match(rx); // sa.toLowerCase().match(rx);
			    b= sb.match(rx); // sb.toLowerCase().match(rx);
			    
			    L= a.length;
			    i= 0;
			    
			    while(i<L)
			    {
			        if(!b[i])
			        {
			        	c = 1;
			        	break;
			        }
			        
			        a1= a[i],
			        b1= b[i++];
			        if(a1!== b1)
			        {
			            n= a1-b1;
			            if(!isNaN(n)) 
			            {
			            	c = n;
			            	break;
			            }
			            
			            c = a1>b1? 1:-1;
			            break;
			        }
			    }
			    
			    if (c == 0)
			    	c = b[i]? -1:0;
			}
			
//			if (sa.charAt(0) >= "0" && sa.charAt(0) <= "9")
//			{
//				na = parseInt(sa);
//			}
//			if (sb.charAt(0) >= "0" && sb.charAt(0) <= "9")
//			{
//				nb = parseInt(sb);
//			}
//			
//			if (na > -1 && nb > -1)
//			{
//				c = (na - nb);
//			}
//			else if (na > -1)
//			{
//				c = 1;
//			}
//			else if (nb > -1)
//			{
//				c = -1;
//			}
//			else 
//			{
//				c = (sa > sb) ? 1 : -1;
//			}
		}
		else if (al == bl)
		{
			c = at1 > bt1 ? -1 : 1;
		}
		else 
		{
			c = (al > bl) ? -1 : 1;
		}
		
		return c;
	});
}

IG$/*mainapp*/._I11/*getMetaItemClass*/ = function(typename, memo) {
	var r = "",
		cache = IG$/*mainapp*/._I04/*getMetaItemCache*/.itemicon;
		
	memo = memo || "";
		
	if (cache[typename + "_" + memo])
	{
		r = cache[typename + "_" + memo];
	}
	else
	{
		switch (typename)
		{
		case "workspace":
			r = "icon-global";
			switch (memo.toLowerCase())
			{
			case "private":
				r = "icon-private";
				break;
			case "group":
				r = "icon-group";
				break;
			}
			break;
		case "metrics":
			r = "icon-folder";
			break;
		case "datacube":
			r = "icon-excel";
			break;
		default:
			r = "icon-" + typename;
			break;
		}
		
		cache[typename + "_" + memo] = r;
	}
	
	return r;
}

IG$/*mainapp*/._I12/*findSubNode*/ = function(unode, nodename, nodevalue) {
	var cdiv = null;
	if (unode.childNodes != null && unode.childNodes.length > 0)
	{
		var i;
		for (i=0; i < unode.childNodes.length; i++)
		{
			var cvalue = (unode.childNodes[i].getAttribute) ? unode.childNodes[i].getAttribute(nodename) : null;
			
			if (cvalue && cvalue == nodevalue)
			{
				return unode.childNodes[i];
			}
			
			if (unode.childNodes[i].childNodes && unode.childNodes[i].childNodes.length > 0)
			{
				cdiv = IG$/*mainapp*/._I12/*findSubNode*/(unode.childNodes[i], nodename, nodevalue);
				
				if (cdiv != null)
					return cdiv;
			}
		}
	}
	
	return cdiv;
}

/**
 * xml related
 */
IG$/*mainapp*/._I13/*loadXML*/ = function(doc) {
	/* var dindex = doc.indexOf("|");
	   var msgid = doc.substring(0, dindex);
	   doc = doc.substring(dindex+1); */
    var xdoc,
		parser;
	
    if (doc.charAt(0).charCodeAt(0) == 10)
    {
	    doc = doc.substring(1);
    }
   
	if (doc.charAt(0) != "<")
	{
		doc = Base64.decode(doc);
	}
		
	if (window.DOMParser)
	{
		parser = new DOMParser();
		xdoc = parser.parseFromString(doc, "application/xml");
	}
	else
	{
		xdoc = new ActiveXObject("Microsoft.XMLDOM");
		xdoc.async = false;
		xdoc.loadXML(doc);
	}
	
	return xdoc;
}

IG$/*mainapp*/._I14/*loadMapData*/ = function(callback) {
	$.ajax({
		type: "GET",
		url: (window.mapurl || "./data/map.json") + "?uniquekey=" + IG$/*mainapp*/._I4a/*getUniqueKey*/(), 
		dataType: "json",
		timeout: 10000,
		success: function(data) {
			IG$/*mainapp*/.mLU = data;
		},
		error: function(e, status, thrown) {
		}
	});
}

IG$/*mainapp*/._I15/*interpolateColor*/ = function(minColor,maxColor,maxDepth,depth){
	
    function d2h(d) {return d.toString(16);}
    function h2d(h) {return parseInt(h,16);}
   
    if(depth == 0){
        return minColor;
    }
    if(depth == maxDepth){
        return maxColor;
    }
   
    var color = "#",
    	minVal,
    	maxVal,
    	nVal,
    	val,
    	i;
    for(i=1; i <= 6; i+=2){
        minVal = Number(h2d(minColor.substr(i,2)));
        maxVal = Number(h2d(maxColor.substr(i,2)));
        nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
        val = d2h(Math.floor(nVal));
        while(val.length < 2){
            val = "0"+val;
        }
        color += val;
    }
    return color;
};

IG$/*mainapp*/._I16/*stripXMLContent*/ = function(doc)
{
	/*
	var dindex = doc.indexOf("|");
	var msgid = doc.substring(0, dindex);
	doc = doc.substring(dindex+1);
	*/
	
	return doc;
}

IG$/*mainapp*/._I17/*getFirstChild*/ = function(node) {
	var children = IG$/*mainapp*/._I26/*getChildNodes*/(node);
	
	if (children != null && children.length > 0)
	{
		return children[0];
	}
	
	return null;
}

IG$/*mainapp*/._I18/*XGetNode*/ = function(doc, path) {
	var root = null;
	
	var plist = path.split("/");
	var n = 0;
	
	var unode = doc;
	
	if (plist[0] == "")
	{
		unode = doc.getElementsByTagName(plist[1])[0];
		n = 2;
	}
	
	var nd = null;
	
	for (i=n; i < plist.length; i++)
	{
		unode = IG$/*mainapp*/._I19/*getSubNode*/(unode, plist[i]);
		if (unode == null || unode == undefined)
			break;
	}
	
	nd = unode;
	
	return nd;
}

IG$/*mainapp*/._I19/*getSubNode*/ = function(unode, pname) {
	var nd = null,
		snode = null,
		i;
	
	if (unode != null && unode.hasChildNodes() == true)
	{
		snode = IG$/*mainapp*/._I26/*getChildNodes*/(unode);
		
		for (i=0; i < snode.length; i++)
		{
			if (snode[i].nodeName == pname)
			{
				nd = snode[i];
				break;
			}
		}
	}
	
	return nd;
}

IG$/*mainapp*/._I1a/*getSubNodeText*/ = function(unode, pname) {
	var m = IG$/*mainapp*/._I19/*getSubNode*/(unode, pname);
	
	if (m)
	{
		return IG$/*mainapp*/._I24/*getTextContent*/(m);
	}
	
	return null;
}

IG$/*mainapp*/._I1b/*XGetAttr*/ = function(node, name) {
	var value = "";
	
	value = node.getAttribute(name);
	
	return value;
}

IG$/*mainapp*/._I1c/*XGetAttrProp*/ = function(node) {
	var obj = {},
		browser = window.bowser;
		
	for (var i=0; i < node.attributes.length; i++)
	{
		obj[(browser.msie ? node.attributes[i].nodeName : node.attributes[i].localName)] = node.attributes[i].value;
	}
	
	return obj;
}

IG$/*mainapp*/._$A/*placeholder*/ = function(ctrl) {
	var browser = window.bowser,
		placeholder = ctrl.attr("placeholder");
	
	if (browser.msie && placeholder)
	{
		ctrl.bind({
			"focus": function(e) {
				var input = $(this);
				if (input.val() == input.attr("placeholder")) {
					input.val("");
					input.removeClass("placeholder");
				}
			},
			"blur": function(e) {
				var input = $(this);
				if (input.val() == "" || input.val() == input.attr("placeholder")) {
					input.addClass("placeholder");
					input.val(input.attr("placeholder"));
				}
				else
				{
					input.removeClass("placeholder");
				}
			},
			"keyup": function(e) {
				var input = $(this);
				if (input.val() == "") {
					input.blur();
				}
			}
		}).blur();
	}
}

IG$/*mainapp*/._I1d/*CopyObject*/ = function(src, tgt, attr) {
	var i,key;
	
	attr = (attr) ? ";" + attr + ";" : attr;
	
	tgt = (!tgt) ? {} : tgt;
	
	for (key in src)
	{
		if (attr && attr.indexOf(";" + key+";") > -1)
		{
			tgt[key] = src[key];
		}
		else if (!attr)
		{
			tgt[key] = src[key];
		}
	}
	return tgt;
}

IG$/*mainapp*/._I1e/*CloneObject*/ = function(src) {
	var i,key;
	var tgt = {};
	for (key in src)
	{
		tgt[key] = src[key];
	}
	return tgt;
}

IG$/*mainapp*/._I1f/*XGetInfo*/ = function(obj, node, attr, vtype, ismixed) {
	var i,
		r,
		v,
		attrs = attr.split(";"),
		prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node),
		aname;
		
	for (i=0; i < attrs.length; i++)
	{
		aname = attrs[i];
		if (aname)
		{
			switch (vtype)
			{
			case "i":
				v = (prop[aname] != null && typeof prop[aname] != "undefined") ? Number(prop[aname]) : null;
				break;
			case "b":
				if (prop[aname] == "T")
					v = true;
				else if (prop[aname] == "F")
					v = false;
				else
					v = null;
				break;
			default:
				v = (prop[aname] != null && typeof prop[aname] != "undefined") ? prop[aname] : null;
				break;
			}
			
			if (ismixed && aname.substring(0, "cdata_".length) == "cdata_")
			{
				v = IG$/*mainapp*/._I1a/*getSubNodeText*/(node, aname);
			}
			
			if (v != null)
			{
				obj[aname] = v;
			}
		}
	}
}

IG$/*mainapp*/._I1fx/*XGetInfoX*/ = function(obj, node, attr) {
	var i,
		attrs = attr.split(";"),
		v, tnode, t;
	for (i=0; i < attrs.length; i++)
	{
		v = attrs[i];
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, v);
		if (tnode)
		{
			t = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
		}
		else
		{
			t = IG$/*mainapp*/._I1b/*XGetAttr*/(node, v);
		}
		
		if (t)
		{
			obj[v] = t;
		}
	}
};

IG$/*mainapp*/._I20/*XUpdateInfo*/ = function(obj, attr, vtype, ismixed) {
	var i,
		r,
		v,
		attrs = attr.split(";"),
		aname,
		mvtype;
	r = "";
	
	for (i=0; i < attrs.length; i++)
	{
		aname = attrs[i];
		if (aname && typeof obj[aname] != "undefined" && obj[aname] != null)
		{
			if (aname.substring(0, "cdata_".length) == "cdata_")
			{
				continue;
			}
			
			mvtype = vtype;
			v = obj[aname];
			r += " " + aname + "='";
			if (typeof(v) == "boolean")
			{
				mvtype = "b";
			}
			switch (mvtype)
			{
			case "b":
				r += (v == true) ? "T" : "F";
				break;
			default:
				r += IG$/*mainapp*/._I48/*escapeXMLString*/(v);
				break;
			}
			r += "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I21/*XUpdateInfo*/ = function(obj) {
	var i,
		r = "",
		k;
	
	for (k in obj)
	{
		v = obj[k];
		if (v != null && typeof(v) == "string")
		{
			r += " " + k + "='";
			r += IG$/*mainapp*/._I48/*escapeXMLString*/(v);
			r += "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I22/*NodeUpdateInfo*/ = function(node, name) {
	var r = ""
		anames = name.split(";"),
		i;
	
	for (i=0; i < anames.length; i++)
	{
		if (anames[i] != "")
		{
			r += " " + anames[i] + "='" + (IG$/*mainapp*/._I48/*escapeXMLString*/(node.get(anames[i])) || "") + "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I23/*XSetAttr*/ = function(node, name, value) {
	node.setAttribute(name, value);
}

IG$/*mainapp*/._I24/*getTextContent*/ = function(node) {
	var r = "",
		cnodes,
		cdata,
		i,
		browser = window.bowser;
		
	if (node)
	{
		if (node.hasChildNodes())
		{
			cnodes = node.childNodes;
			for (i=0; i < cnodes.length; i++)
			{
				if (cnodes[i].nodeType == "4")
				{
					cdata = cnodes[i];
					break;
				}
			}
			
			if (cdata)
			{
				r = cdata.nodeValue || cdata.textContent;
				return r;
			}
		}
		
		if (browser.msie)
		{
			r = node.text || node.textContent || "";
		}
		else if (node != null && typeof node.textContent != "undefined")
		{
			return node.textContent;
		}
	}
	
	return r;
}

IG$/*mainapp*/._I25/*toXMLString*/ = function(xdoc) {
	var value = "";
	
	// if ($.browser.msie == true)
	if (!window.XMLSerializer)
	{
		value = xdoc.documentElement ? xdoc.documentElement.xml : xdoc.xml;
	}
	else
	{
		value = (new XMLSerializer()).serializeToString(xdoc);
	}
	return value;
}

IG$/*mainapp*/._I26/*getChildNodes*/ = function(node, nodename) {
	var nodes = [];
	
	if (node != null && node.hasChildNodes() == true)
	{
		for (var i=0; i < node.childNodes.length; i++)
		{
			if (node.childNodes[i].nodeType == "1" && node.childNodes[i].nodeName != "parseerror") {
				if (!(nodename && nodename != IG$/*mainapp*/._I29/*XGetNodeName*/(node.childNodes[i])))
				{
					nodes.push(node.childNodes[i]);
				}
			}
		}
	}
	
	return nodes;
}

IG$/*mainapp*/._I27/*getErrorCode*/ = function(doc) {
	var root = IG$/*mainapp*/._I18/*XGetNode*/(doc, "/smsg");
	var errcode = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode");
	
	return errcode;
}

IG$/*mainapp*/._I28/*getTabTitle*/ = function(text) {
	var ntitle = text,
		nlength = 16;
	
	if (ntitle.length > nlength)
	{
		ntitle = ntitle.substring(0, nlength - 2) + "..";
	}
	
	return ntitle;
}

IG$/*mainapp*/._I29/*XGetNodeName*/ = function(node) {
	return node.nodeName;
}

IG$/*mainapp*/._I2a/*parseValueList*/ = function(xdoc) {
	var i, j, clen, cfield, m, sfield,
		item,
		obj, dnode, dnodes, uid, vnode, delimiter, d,
		mnode =  IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
		mchild = (mnode ? IG$/*mainapp*/._I26/*getChildNodes*/(mnode) : null),
		snode,
		hnode,
		hnodes,
		dnode,
		tpnode, tpnodes,
		vnode,
		cols, cols_m1,
		mval, dt, vt,
		results = [];
	
	if (mchild)
	{
		for (m=0; m < mchild.length; m++)
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result");
			hnode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result/Header");
			hnodes = (hnode ? IG$/*mainapp*/._I26/*getChildNodes*/(hnode) : null);
			dnode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result/Data");
			tpnode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result/TupleData");
			tpnodes = (tpnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tpnode) : null);
			
			obj = null;
			
			if (snode && hnode && hnodes && dnode)
			{
				delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "delimiter");
				cfield = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "codefield");
				sfield = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "sortfield");
				cols = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "cols");
				cols = parseInt(cols);
				cols_m1 = cols-1;
				dnode = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
				dnode = dnode ? dnode.split(delimiter) : [];
				if (dnode.length > 0 && dnode[dnode.length - 1] == "")
				{
					dnode.splice(dnode.length-1, 1);
				}
				clen = hnodes.length;
				
				for (i=0; i < hnodes.length; i++)
				{
					uid = IG$/*mainapp*/._I1b/*XGetAttr*/(hnodes[i], "uid");
					if (i == 0)
					{
						obj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(hnodes[i]);
						obj.data = [];
					}
				}
				
				if (clen == 1)
				{
					for (i=0; i < dnode.length; i++)
					{
						obj.data.push({
							code: dnode[i],
							disp: null,
							sdisp: null
						});
					}
				}
				else
				{
					for (i=0; i < dnode.length; i++)
					{
						if (cols_m1 == 0)
						{
							mval = {
								code: dnode[i],
								disp: null,
								sdisp: null
							};
							obj.data.push(mval);
						}
						else
						{
							if (i % cols == 0)
							{
								mval = {
									code: dnode[i],
									disp: null,
									sdisp: null
								}
								obj.data.push(mval);
							}
							else if (i % cols == 1)
							{
								mval.disp = dnode[i];
							}
							else if (i % cols == 2)
							{
								mval.sdisp = dnode[i];
							}
						}
					}
				}
				
				/*
				obj.data.sort(function(a, b) {
					var m1 = a.sdisp || a.code,
						m2 = b.sdisp || b.code;
						
					return (m1 - m2);
				});
				*/
			}
			else if (tpnode)
			{
				obj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(mchild[m]);
				
				delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "delimiter");
				
				for (i=0; i < tpnodes.length; i++)
				{
					uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tpnodes[i], "uid");
					if (uid == obj.uid)
					{
						vnode = IG$/*mainapp*/._I18/*XGetNode*/(tpnodes[i], "DataList");
						dnode = IG$/*mainapp*/._I18/*XGetNode*/(tpnodes[i], "ValueList");
						dt = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
						dt = dt.split(delimiter);
						
						if (dnode)
						{
							vt = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
							if (vt)
							{
								vt = vt.split(delimiter);
							}
							else
							{
								vt = null;
							}
						}
						
						obj.data = [];
						if (dt.length > 0)
						{
							for (i=0; i < dt.length - 1; i++)
							{
								obj.data.push({
									code: dt[i],
									disp: vt && vt.length > i ? vt[i] : null,
									sdisp: null
								});
							}
						}
						break;
					}
				}
			}
			
			if (obj)
			{
				results.push(obj);
			}
		}
	}
	
	return results;
}





IG$/*mainapp*/._I2b/*getFieldValue*/ = function(owner, cname, ctype) {
	var ctrl = owner.down.call(owner, "[name=" + cname + "]"),
		r = null;
	
	if (ctrl)
	{
		switch (ctype)
		{
		case "s":
			r = ctrl.getValue();
			break;
		case "dg":
			
			break;
		}
	}
	
	return r;
}

IG$/*mainapp*/._I2c/*setFieldValue*/ = function(owner, cname, ctype, value) {
	var ctrl = owner.down.call(owner, "[name=" + cname + "]");

	if (ctrl)
	{
		switch (ctype)
		{
		case "s":
			ctrl.setValue(value);
			break;
		case "dg":
			ctrl.store.loadData(value);
			break;
		}
	}
}

IG$/*mainapp*/._I2d/*getItemAddress*/ = function(item, field) {
	item.type = item.type || item.itemtype;
	var r = "<smsg><item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(item, field || "uid;nodepath;name;pid;address;description;type;revision", "s") + "/></smsg>";
	return r;
}

IG$/*mainapp*/._I2e/*getItemOption*/ = function(item, p1, datavalue) {
	var r = "<smsg>",
		k;
	if (item)
	{
		r += "<info ";
		r += IG$/*mainapp*/._I30/*getXMLAttr*/(item);
		
		if (datavalue)
		{
			if (datavalue.length)
			{
				r += ">";
				for (k=0; k < datavalue.length; k++)
				{
					r += "<" + datavalue[k].name + "><![CDATA[" + datavalue[k].value + "]]></" + datavalue[k].name + ">";
				}
				r += "</info>";
			}
			else
			{
				r += "><" + datavalue.name + "><![CDATA[" + datavalue.value + "]]></" + datavalue.name + "></info>";
			}
		}
		else
		{
			r += "/>";	
		}
	}
	r += "</smsg>";
	return r;
}

IG$/*mainapp*/.aa/*applyOptions*/ = function(panel, opt, names, isupdate) {
	$.each(names, function(k, nm) {
		var p = panel.down("[name=" + nm + "]");
		
		if (p)
		{
			if (isupdate)
			{
				if (p.xtype == "checkbox")
				{
					opt[nm] = p.getValue() ? "T" : "F";
				}
				else
				{
					opt[nm] = p.getValue();
				}
			}
			else
			{
				if (p.xtype == "checkbox")
				{
					p.setValue(opt[nm] == "T");
				}
				else
				{
					p.setValue(opt[nm]);
				}
			}
		}
	});
};

IG$/*mainapp*/._I2f/*getObjAddress*/ = function(item) {
	var r = "<smsg><item ",
		k;
	
	for (k in item)
	{
		r += " " + k + "='" + IG$/*mainapp*/._I48/*escapeXMLString*/(item[k]) + "'";
	}	
	
	r += "/></smsg>";
	return r;
}

IG$/*mainapp*/._I30/*getXMLAttr*/ = function(item) {
	var k, r = "";
	for (k in item)
	{
		if (typeof(item[k]) == "string" || typeof(item[k]) == "number")
		{
			r += " " + k + "='" + IG$/*mainapp*/._I48/*escapeXMLString*/(item[k]) + "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I31/*hasElement*/ = function(node, element) {
	var i, havone = false;
	if (node && node.children)
	{
		for (i=0; i < node.children.length; i++)
		{
			if (node.children[i] == element)
			{
				return true;
			}
			else if (node.children[i].children && node.children[i].children.length > 0)
			{
				havone = IG$/*mainapp*/._I31/*hasElement*/(node.children[i], element);
				if (havone == true)
					return true;
			}
		}
	}
	
	return havone;
}

IG$/*mainapp*/._I32/*charttypemenu*/ = [
	{label:"Column", charttype:"cartesian", subtype:"column", img: "column"},
	{label:"Line", charttype:"cartesian", subtype:"line", img: "line"},
	{label:"Area", charttype:"cartesian", subtype:"area", img: "area"},
	{label:"Bar", charttype:"cartesian", subtype:"bar", img: "bar"},
	{label:"Pie", charttype:"pie", subtype:"pie", img: "pie"},
	{label:"Doughnut", charttype:"pie", subtype:"doughnut", img: "pie"},
	{label:"Bubble", charttype:"bubble", subtype:"bubble", img: "bubble"},
	{label:"Scatter", charttype:"scatter", subtype:"scatter", img: "bubble"},
	//{label:"Radar", charttype:"radar", subtype:"radar", img: "radar"},
	//{label:"Candlestick", charttype:"candlestick", subtype:"candlestick", img: "candlestick"},
	//{label:"OHLC", charttype:"candlestick", subtype:"ohlc", img: "hloc"},
	//{label:"World Map", charttype:"map", subtype:"worldmap"},
	//{label:"US Map", charttype:"map", subtype:"usmap"},
	//{label:"Seoul Map", charttype:"map", subtype:"seoulmap"},
	{label:"DataGrid", charttype:"datagrid", subtype:"datagrid"}
];

IG$/*mainapp*/._I33/*getPrintXML*/ = function(node) {
	var doc,
		browser = window.bowser;
		
	if (browser.msie)
	{
		doc = node.outerHTML;
	}
	else
	{
		doc = (new XMLSerializer()).serializeToString(node);
	}
	
	return doc;
}

IG$/*mainapp*/._I34/*isNumericType*/ = function(type) {
	var r = false;
	type = (type) ? type.toLowerCase() : "";
	switch (type)
	{
	case "numeric":
	case "number":
	case "int":
	case "bigint":
	case "decimal":
		r = true;
		break;
	}
	
	return r;
}

IG$/*mainapp*/._I35/*FormatNumber*/ = function(value)
{
	value += "";
	x = value.split(".");
	x1 = x[0];
	x2 = x.length > 1 ? "." + x[1] : "";
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1" + "," + "$2");
	}
	return x1 + x2;
}

IG$/*mainapp*/._I36/*getSeriesType*/ = function(subtype) {
	var stype = "column";
	
	switch (subtype)
	{
	case "column":
		stype = "column";
		break;
	case "line":
		stype = "line";
		break;
	case "spline":
		stype = "spline";
		break;
	case "area":
		stype = "area";
		break;
	case "bar":
		stype = "bar";
		break;
	case "pie":
		stype = "pie";
		break;
	case "doughnut":
		stype = "pie";
		break;
	case "bubble":
		stype = "bubble";
		break;
	case "scatter":
		stype = "scatter";
		break;
	case "parallel":
		stype = "parallel";
		break;
	case "waterfall":
		stype = "waterfall";
		break;
	case "areaspline":
		stype = "areaspline";
		break;
	}
	
	return stype;
};

IG$/*mainapp*/._I37/*isNumber*/ = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


/**
 * Other utility
 */

//This function removes non-numeric characters
IG$/*mainapp*/._I38/*stripNonNumeric*/ = function(str) {
  str += "";
  var rgx = /^\d|\.|-$/;
  var out = "";
  for( var i = 0; i < str.length; i++ )
  {
    if( rgx.test( str.charAt(i) ) ){
      if( !( ( str.charAt(i) == "." && out.indexOf( "." ) != -1 ) ||
             ( str.charAt(i) == "-" && out.length != 0 ) ) ){
        out += str.charAt(i);
      }
    }
  }
  return out;
};

IG$/*mainapp*/._I39/*validateEmail*/ = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = null;
IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = null;

IG$/*mainapp*/._I3c/*encryptkey*/ = function(str) {
	var i;
	
	if (IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/) 
	{
		var rsa = new RSAKey();
		rsa.setPublic(IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/, IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/);
		
		for (i=0; i < str.length; i++)
		{
			str[i] = rsa.encrypt(str[i]);
		}
	}
	
	return str;
}

Number.prototype.format = function(format) {
	var that = this,
		cf;
		
	if (typeof(format) != "string") 
		return ""; // sanity check
		
	if (format.indexOf(";") > -1) // supplementary
	{
		cf = format.split(";");
		
		if (cf.length == 2 && cf[1])
		{
			if (that < 0)
			{
				format = cf[1];
				 if (format.length > 2 && format.charAt(0) == "(" && format.charAt(format.length - 1) == ")")
				 {
					that = Math.abs(that);
				 }
			}
			else
			{
				format = cf[0];
			}
		}
	}

	var hasComma = -1 < format.indexOf(","),
		psplit = IG$/*mainapp*/._I38/*stripNonNumeric*/(format).split(".");

	// compute precision
	if (1 < psplit.length) {
		// fix number precision
		that = that.toFixed(psplit[1].length);
	}
	// error: too many periods
	else if (2 < psplit.length) {
		throw("NumberFormatException: invalid format, formats should have no more than 1 period: " + format);
	}
	// remove precision
	else {
		that = that.toFixed(0);
	}
	
	if (format.substring(format.length - 1) == "%")
	{
		that = Number(that) * 100;
	}
	else if (format.substring(format.length - 3) == "'%'")
	{
		format = format.substring(0, format.length - 3) + "%";
	}

	// get the string now that precision is correct
	var fnum = that.toString();

	// format has comma, then compute commas
	if (hasComma) {
		// remove precision for computation
		psplit = fnum.split(".");
		
		var cnum = psplit[0],
			parr = [],
			j = cnum.length,
			m = Math.floor(j / 3),
			n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop

		// break the number into chunks of 3 digits; first chunk may be less than 3
		for (var i = 0; i < j; i += n) {
			if (i != 0) {n = 3;}
			parr[parr.length] = cnum.substr(i, n);
			m -= 1;
		}

		// put chunks back together, separated by comma
		fnum = parr.join(",");

		// add the precision back in
		if (psplit[1]) {fnum += "." + psplit[1];}
	}

	// replace the number portion of the format with fnum
	return format.replace(/[\d,?,#\.?,#]+/, fnum);
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.deleteRow = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


IG$/*mainapp*/._I3d/*callBackObj*/ = function(callerptr, callexec, callparam) {
	this.p1/*callerptr*/ = callerptr;
	this.p2/*callexec*/ = callexec;
	this.p3/*callparam*/ = callparam;
}

IG$/*mainapp*/._I3d/*callBackObj*/.prototype = {
	execute: function(extra) {
		var ret;
		if (this.p2/*callexec*/)
		{
			if (this.p1/*callerptr*/)
			{
				ret = this.p2/*callexec*/.call(this.p1/*callerptr*/, (extra ? extra : this.p3/*callparam*/), this.p3/*callparam*/);
			}
			else
			{
				ret = this.p2/*callexec*/((extra ? extra : this.p3/*callparam*/));
			}
		}
		
		return ret;
	}
};

IG$/*mainapp*/._I3e/*requestServer*/ = function() {
	this.atld/*stoploading*/ = true;
}

IG$/*mainapp*/._I3e/*requestServer*/.prototype = {
	init: function(panel, params, caller, rsSuccess, rsFail, rsParams) {
		this.panel = panel;
		if (ig$/*appoption*/.isdev != true)
		{
			this.params = {
				data: Base64.encode(params.cmd) + "|" + Base64.encode(params.obj),
				content: Base64.encode(params.cnt)
			};
		}
		else
		{
			this.params = params;
		}
	
		this.caller = caller;
		this.rsSuccess = rsSuccess;
		this.rsFail = rsFail;
		this.rsParams = rsParams;
		this.showerror = true;
		this.atld/*stoploading*/ = true;
		
		if (!rsFail && typeof(Ext) != "undefined" && extjsphone)
		{
			this.rsFail = null;
		}
		
		this.sccall = new IG$/*mainapp*/._I3d/*callBackObj*/(this.caller, this.rsSuccess, this.rsParams);
		this.scfail = new IG$/*mainapp*/._I3d/*callBackObj*/(this.caller, this.rsFail, this.rsParams);
	},

	_l/*request*/: function() {
		var req = this,
			ret,
			xparam = IG$/*mainapp*/._I13/*loadXML*/(req.params.payload),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xparam, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			p, k, pnames;
		
		if (tnodes.length == 1 && !tnodes[0].hasChildNodes())
		{
			pnames = [];
			delete req.params.payload;
			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[0]);
			for (k in p)
			{
				req.params[k] = p[k];
				pnames.push(k);
			}
			req.params.__i = pnames.join(";");
		}
		
		req.params._mts_ = IG$/*mainapp*/._g$a/*global_mts*/ || "";
		
		if (req.params.mbody && req.params.mbody.substring(0, "<smsg><info ".length) == "<smsg><info ")
		{
			xparam = IG$/*mainapp*/._I13/*loadXML*/(req.params.mbody);
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xparam, "/smsg");
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			if (tnodes.length == 1 && !tnodes[0].hasChildNodes())
			{
				pnames = [];
				delete req.params.mbody;
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[0]);
				for (k in p)
				{
					req.params[k] = p[k];
					pnames.push(k);
				}
				req.params.__g = pnames.join(";");
			}
		}
		
		req.params.uniquekey = IG$/*mainapp*/._I4a/*getUniqueKey*/();
		
		window.Pace && window.Pace.start();
		
		$.ajax({
			url: ig$/*appoption*/.servlet,
			data: req.params,
			dataType: "text",
			type: "POST",
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			timeout: 600000,
			beforeSend: function(xhr, settings) {
			},
			cache: false,
			crossDomain: false,
			processData: true,
			success: function(response, status, xhr) {
				window.Pace && window.Pace.stop();
				
				var doc = response || "<smsg errorcode='0xffff' errormsg='Server incorrect responding'/>",
					xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc),
					stopprog = false;
				
				if (req.panel && req.panel.setLoading)
				{
					if (req.atld/*stoploading*/ != false)
					{
						req.panel.setLoading(false);
					}
					else
					{
						stopprog = true;
					}
				}
				if (errcode == "0x1300")
				{
					if (stopprog == true)
					{
						req.panel.setLoading(false);
					}
					ret = req.scfail.execute(errcode);
						
					if (ret == true || req.showerror == false)
						return;
	
					IG$/*mainapp*/._I89/*showLogin*/((req.panel ? new IG$/*mainapp*/._I3d/*callBackObj*/(req.panel, req.panel.entryLogin) : null), 2);
				}
				else if (errcode != null && errcode.length > 0)
				{
					if (stopprog == true)
					{
						req.panel.setLoading(false);
					}
					
					var rerr = req.scfail.execute(xdoc);
					
					if (req.showerror !== false && rerr != false)
					{
						IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, req.panel, req.params);
					}
				}
				else
				{
                    // IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, req.panel, req.params);
					req.sccall.execute(xdoc);
	            }
			},
			error: function(xhr, status, err) {
				window.Pace && window.Pace.stop();
				
				if (req.panel)
	        	{
	        		req.panel.setLoading(false);
	        	}
				
				if (req.showerror !== false)
				{
	        		IG$/*mainapp*/._I53/*ShowConnectionError*/(req.panel);
	        	}
	        	var doc = "<smsg errorcode='0x9999' errormsg='Server URL Connection Failed'/>",
	        		xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc);
	        	req.scfail.execute(xdoc);
			}
		});
	}
};

$.download = function(url, datas, method){
	//url and data options required
	if( url && datas ){ 
		//data can be string of parameters or array/object
		//datas = typeof datas == "string" ? datas : jQuery.param(datas);
		//split params into form inputs
		var inputs = "",
			i;
		for (i=0; i < datas.length; i++)
		{
			inputs+="<input type='hidden' name='"+ datas[i].name +"' value='"+ datas[i].value +"' />"; 
		}
		//send request
		$("<form action='"+ url + "' method='"+ (method||"post") + "'>" + inputs + "</form>")
		.appendTo("body").submit().remove();
	};
};

IG$/*mainapp*/.measureText = function(fs, text) {
	var sensor = this.sensorDiv;
	
	if (!sensor)
	{
		sensor = $("<div style='margin:0px;padding:0px;display:inline-block;top:-100px'></div>");
		$("body").append(sensor);
		this.sensorDiv = sensor;
	}
	
	sensor.css({fontSize: fs});
	sensor.text(text);
	
	var width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(sensor),
		height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(sensor);
	
	// sensor.remove();
	return {width: width || 0, height: height || 0};
};

IG$/*mainapp*/._I0a_/*getDateParse*/ = function(value) {
	var yyyy = value.substr(0, 4),
	MM = value.substr(4, 2),
	dd = value.substr(6, 2),
	hh = value.substr(8, 2),
	mm = value.substr(10, 2);

	var ret = {
		y: yyyy,
		M: MM,
		d: dd,
		h: hh,
		m: mm
	};
	return ret;
}

IG$/*mainapp*/._I40/*formatDate*/ = function(value) {
	var yyyy = value.substr(0, 4),
		MM = value.substr(4, 2),
		dd = value.substr(6, 2),
		hh = value.substr(8, 2),
		mm = value.substr(10, 2);
	
	var ret = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm;
	return ret;
}

IG$/*mainapp*/._I41/*dateFormat*/ = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = IG$/*mainapp*/._I41/*dateFormat*/;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
IG$/*mainapp*/._I41/*dateFormat*/.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
IG$/*mainapp*/._I41/*dateFormat*/.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

IG$/*mainapp*/._I42/*getString*/ = function(fs, start, end) {
	var r = fs.substr(start, end);
	
	if (r.charAt(0) == "0")
	{
		r = r.substr(1);
	}
	
	return parseInt(r);
}

IG$/*mainapp*/._I43/*getFormattedDate*/ = function(fs, isdetail) {
	var r = fs;
	
	if (fs && fs.length > 8)
	{
		var yyyy = IG$/*mainapp*/._I42/*getString*/(fs, 0, 4),
			MM = IG$/*mainapp*/._I42/*getString*/(fs, 4, 2),
			dd = IG$/*mainapp*/._I42/*getString*/(fs, 6, 2),
			hh = 0,
			mm = 0,
			ss = 0,
			d;
		
		if (fs.length > 13)
		{
			hh = IG$/*mainapp*/._I42/*getString*/(fs, 8, 2);
			mm = IG$/*mainapp*/._I42/*getString*/(fs, 10, 2);
			ss = IG$/*mainapp*/._I42/*getString*/(fs, 12, 2);
		}
		
		d = new Date(yyyy, MM, dd, hh, mm, ss);
		r = IG$/*mainapp*/._I41/*dateFormat*/(d, (isdetail == true ? "mmm d yyyy, TThh:MM" : "mmm d yyyy"));
	}
	
	return r;
};


IG$/*mainapp*/._I44/*lineInterpolate*/ = function(p1, p2, steps) {
	var xabs = Math.abs( p1.x - p2.x ),
		yabs = Math.abs( p1.y - p2.y ),
		xdiff = p2.x - p1.x,
		ydiff = p2.y - p1.y,
	 
		length = Math.sqrt((Math.pow(xabs, 2) + Math.pow(yabs, 2))),
		xstep = xdiff / steps,
		ystep = ydiff / steps,
	 
		newx = 0,
		newy = 0,
		result = new Array(),
		s;
	 
	for(s = 0; s < steps; s++)
	{
		newx = p1.x + ( xstep * s );
		newy = p1.y + ( ystep * s );
	 
		result.push( {
			x: newx,
			y: newy
		} );
	}
	 
	return result;
}

IG$/*mainapp*/._I45/*generateUniqueTest*/ = function(len) {
	var r = "",
		i, rnum,
		chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

	for (i=0; i<len; i++) {
		rnum = Math.floor(Math.random() * chars.length);
		r += chars.substring(rnum,rnum+1);
	}
	
	return r;
}

IG$/*mainapp*/._I46/*replaceAll*/ = function(str, s, r) {
	var ret = str;
	
	while (ret.indexOf(s) != -1) {
		ret = ret.replace(s, r);
	}
	
	return ret;
}

IG$/*mainapp*/._I47/*selectAll*/ = function(el) {
	var text = el[0],
		browser = window.bowser;
		
    if (browser.msie) 
    {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } 
    else if (browser.mozilla || browser.opera) 
    {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    } 
    else if (browser.safari) 
    {
        var selection = window.getSelection();
        selection.setBaseAndExtent(text, 0, text, 1);
    }
};

IG$/*mainapp*/._I48/*escapeXMLString*/ = function(value) {
	var escaped = value,
		findReplace,
		item, i;
	
	if (escaped && typeof(escaped) == "string")
	{
		findReplace = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"]]
		
		for(i=0; i < findReplace.length; i++) 
		{
			item = findReplace[i];
		    escaped = escaped.replace(item[0], item[1]);
		}
	}
	return escaped;
};

IG$/*mainapp*/._I49/*clipboardcopy*/ = function(value) {
	var browser = window.bowser;
	
	if($.zclip)
	{
		$.zclip({
			path:"./images/ZeroClipboard.swf",
			copy: value
		});
	}
	else if(browser.msie)
	{
		window.clipboardData.setData("Text", value);
	}
};

IG$/*mainapp*/._I4a/*getUniqueKey*/ = function() {
	var dt = new Date();
	var dateStr = "" + dt.getFullYear() + 
				  (1+dt.getMonth()) +
				  dt.getDate() +
				  dt.getHours() + 
				  dt.getMinutes() +
				  dt.getSeconds();
	
	return dateStr;
};

IG$/*mainapp*/._I4b/*checkEmail*/ = function(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
};

IG$/*mainapp*/._I4c/*majordateformat*/ = 
	[{name: "YYYY", rname: "YEAR"}, {name: "QUARTER"}, {name: "MM"}, {name: "DD", rname: "DAY"}, {name: "WM", rname: "WEEKMONTH"}, {name: "WEEK"}, {name: "AMPM"}, {name: "HH", rname: "HOUR"}, {name: "MI", rname: "MINUTE"}, {name: "CUSTOM"}];

IG$/*mainapp*/._I4d/*sqldateformat*/ = {
	"auto": {
		"yyyy": "$DATE_YYYY(_date_)$",
		"quarter": "$DATE_QUARTER(_date_)$",
		"mm": "$DATE_MM(_date_)$",
		"dd": "$DATE_DD(_date_)$",
		"wm": "$DATE_WM(_date_)$",
		"week": "$DATE_WEEK(_date_)$",
		"ampm": "$DATE_AMPM(_date_)$",
		"hh": "$DATE_HH(_date_)$",
		"mi": "$DATE_MINUTE(_date_)$",
		"custom": "$DATE_CUSTOM(_date_, _format)$"
	},
	"mysql": {
		"yyyy": "DATE_FORMAT(_date_, '%Y')",
		"quarter": "QUARTER(_date_)",
		"mm": "DATE_FORMAT(_date_, '%c')",
		"dd": "DATE_FORMAT(_date_, '%e')",
		"wm": "WEEK(_date_, 5) - WEEK(DATE_SUB(_date_, INTERVAL DAYOFMONTH(_date_) - 1 DAY), 5) + 1",
		"week": "DATE_FORMAT(_date_, '%W')",
		"ampm": "DATE_FORMAT(_date_, '%p')",
		"hh": "DATE_FORMAT(_date_, '%k')",
		"mi": "DATE_FORMAT(_date_, '%i')",
		"custom": "DATE_FORMAT(_date_, '%b %e, %Y %k-%i')"
	},
	"oracle": {
		"yyyy": "to_char(_date_, 'yyyy')",
		"quarter": "to_char(_date_, 'Q')",
		"mm": "to_char(_date_, 'mm')",
		"dd": "to_char(_date_, 'dd')",
		"wm": "to_char(_date_, 'W')",
		"week": "to_char(_date_, 'DY')",
		"ampm": "to_char(_date_, 'AM')",
		"hh": "to_char(_date_, 'HH')",
		"mi": "to_char(_date_, 'MI')",
		"custom": "to_char(_date_, '_format')"
	}
};

Date.prototype.format = function(format) {
    var returnStr = "";
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};

Date.replaceChars = {
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    longMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    longDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    // Day
    d: function() { return (this.getDate() < 10 ? "0" : "") + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? "st" : (this.getDate() % 10 == 2 && this.getDate() != 12 ? "nd" : (this.getDate() % 10 == 3 && this.getDate() != 13 ? "rd" : "th"))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? "0" : "") + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ("" + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? "am" : "pm"; },
    A: function() { return this.getHours() < 12 ? "AM" : "PM"; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? "0" : "") + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? "0" : "") + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? "0" : "") + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? "0" : "") + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? "00" : (m < 100 ?
"0" : "")) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() { return "Not Yet Supported"; },
    O: function() { return (-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + (Math.abs(this.getTimezoneOffset() / 60)) + "00"; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + (Math.abs(this.getTimezoneOffset() / 60)) + ":00"; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, "$1"); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};

IG$/*mainapp*/._I4e/*ColumnsToString*/ = function(columns, cname) {
	var i,
		r = "";
	for (i=0; i < columns.length; i++)
	{
		columns[i].type = columns[i].type || columns[i].itemtype;
		r += "<" + cname + " " + IG$/*mainapp*/._I20/*XUpdateInfo*/(columns[i], "uid;fieldname;name;type;datatype;size;tablename;alias", "s") + ">";
		if (columns[i].dataoption && columns[i].dataoption.valuetype)
		{
			r += "<dataoption " + IG$/*mainapp*/._I20/*XUpdateInfo*/(columns[i].dataoption, "datadelimiter;coldelimiter;valuetype") + "><![CDATA[" + (columns[i].dataoption.data || "") + "]]></dataoption>";
		}
		r += "</" + cname + ">";
	}
	
	return r;
}

IG$/*mainapp*/._I4f/*parseColumn*/ = function(node) {
	var column = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node);
	var dopt = IG$/*mainapp*/._I19/*getSubNode*/(node, "dataoption");
	if (dopt)
	{
		column.dataoption = IG$/*mainapp*/._I1c/*XGetAttrProp*/(dopt);
		column.dataoption.data = IG$/*mainapp*/._I24/*getTextContent*/(dopt);
	}
	
	return column;
}

IG$/*mainapp*/._I50/*showScheduler*/ = function(runner, uid, itemtype, req, rop) {
	var dlg = new IG$/*mainapp*/.s$ml/*schedule_list*/({
		runner: runner,
		uid: uid,
		itemtype: itemtype,
		req: req,
		_ILa/*reportoption*/: rop
	});
	dlg.show();
}

IG$/*mainapp*/._1/*applyFormOptions*/ = function(opt, map, setval) {
	var me = this,
		i,
		c,
		ot;
		
	for (i=0; i < map.length; i++)
	{
		c = me.down("[name=" + (map[i].c || map[i].n) + "]");
		
		if (setval)
		{
			ot = opt[map[i].n];
			ot = (ot == IG$/*mainapp*/.UNDEFINED || ot == null) ? ot || map[i].s : ot;
			c.setValue(ot);
		}
		else
		{
			if (map[i].d)
			{
				opt[map[i].n] = c.getValue() || map[i].d;
			}
			else
			{
				opt[map[i].n] = c.getValue();
			}
		}
	}
}

IG$/*mainapp*/._l51/*readSysConfig*/ = function(callback) {
	var req,
		uid = "/SYS_Config/systemconfig";
	
	req = new IG$/*mainapp*/._I3e/*requestServer*/();
	req.showerror = false;
	req.init(null, 
		{
            ack: "5",
            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
        }, null, function(xdoc) {
        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
        		tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
        		i, p;
        		
        	if (tnodes)
        	{
        		IG$/*mainapp*/._L51/*sysconfig*/ = {};
        		
        		for (i=0; i < tnodes.length; i++)
        		{
        			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
        			p.value = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
        			IG$/*mainapp*/._L51/*sysconfig*/[p.name] = p;
        		}
        	}
        	
        	callback && callback.execute();
        }, function() {
        	callback && callback.execute();
			return false;
        });
	req._l/*request*/();
}

IG$/*mainapp*/.x01/*checkValues*/ = function(form, fieldnames) {
	var r = {
			b: true,
			v: {}
		},
		i,
		ctrl,
		val;
		
	for (i=0; i < fieldnames.length; i++)
	{
		ctrl = form.down("[name=" + fieldnames[i] + "]");
		if (ctrl)
		{
			ctrl.clearInvalid();
			val = ctrl.getValue();
			
			if (!val)
			{
				ctrl.markInvalid(IRm$/*resources*/.r1("B_REQ"));
				r.b = false;
			}
			else 
			{
				r.v[fieldnames[i]] = val;
			}
		}
	}
	
	return r;
};

IG$/*mainapp*/.x02/*fillFormValues*/ = function(form, fitem, fieldnames) {
	var i,
		ctrl,
		val;
		
	for (i=0; i < fieldnames.length; i++)
	{
		ctrl = form.down("[name=" + fieldnames[i] + "]");
		if (ctrl)
		{
			val = fitem[fieldnames[i]];
			ctrl.setValue(val);
		}
	}
}

IG$/*mainapp*/.x03/*getScriptCache*/ = function(scripts, callback) {
	var loaded = [],
		loadScript = function(scs) {
			var sc = scs[0],
				head= document.getElementsByTagName("head")[0],
				script= document.createElement("script");
			
			if (!sc)
			{
				callback && callback.execute();
				return;
			}
			
			scs.splice(0, 1);
			
			script.type= "text/javascript";
			
			if (script.readyState)
			{ 
				// IE
				script.onreadystatechange= function () {
					if (this.readyState == "loaded" || this.readyState == "complete")
					{
						loaded.push(sc);
						loadScript(scs);
						// loaded.length == scripts.length && callback && callback.execute();
					}
				};
			}
			else
			{
				script.onload = function() {
					loaded.push(sc);
					loadScript(scs);
					// loaded.length == scripts.length && callback && callback.execute();
				};
			}
			
			script.src= sc;
	      	head.appendChild(script);
		};
	
	loadScript(scripts);
	
	$.each(scripts, function(i, sc) {
//		$.ajax({
//			type: "get",
//			url: sc + "?_d=" + (window.m$_d || IG$/*mainapp*/._I4a/*getUniqueKey*/()),
//			dataType: "script",
//			cache: true,
//			success: function() {
//				loaded.push(sc);
//				loaded.length == scripts.length && callback && callback.execute();
//			},
//			error: function(e, status, thrown) {
//				IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_SCR"));
//			}
//		});

		
	});
};

IG$/*mainapp*/.x_10/*jqueryExtension*/ = {
	_w: function(jdom, value) {
		var dom = jdom && jdom.length ? jdom[0] : null,
			r = 0;
		
		if (dom)
		{
			if (typeof(value) == "undefined")
			{
				r = dom.offsetWidth || dom.innerWidth || dom.clientWidth;
				r = isNaN(r) ? 0 : r;
			}
			else
			{
				jdom.width(value);
			}
		}
		
		return r;
	},
	_h: function(jdom, value) {
		var dom = jdom && jdom.length ? jdom[0] : null,
			r = 0;
		
		if (dom)
		{
			if (typeof(value) == "undefined")
			{
				r = dom.offsetHeight || dom.innerHeight || dom.clientHeight;
				r = isNaN(r) ? 0 : r;
			}
			else
			{
				jdom.height(value);
			}
		}
		
		return r;
	}
}

IG$/*mainapp*/.xAM/*getReportType*/ = function(cubetype, reporttype) {
	var r = "rolap";
	
	switch (cubetype.toLowerCase())
	{
	case "mcube":
		r = "molap";
		break;
	case "datacube":
		r = "excel";
		break;
	case "nosql":
		r = "nosql";
		break;
	case "sqlcube":
		r = "sqlcube";
		break;
	case "mdbcube":
		r = "mdbcube";
		break;
	case "cube":
		if (reporttype != "rolap" && reporttype != "sql")
		{
			r = "rolap";
		}
		break;
	default:
		r = cubetype.toLowerCase();
		break;
	}
	
	return r;
}
function cDef(xdoc) {
	this.xdoc = xdoc;
	this.d8/*needlogin*/ = true;
	
	this.l13/*parseContent*/();
}

cDef.prototype = {
	l13/*parseContent*/: function() {
		var me = this,
			xdoc = me.xdoc,
			rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/update"),
			tnode, i, dbs, db;
		
		if (rnode)
		{
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, rnode, "version;serverversion", "s");
			IG$/*mainapp*/._I1f/*XGetInfo*/(me, rnode, "dbconnection;needlogin", "b");
			me.d8/*needlogin*/ = me.needlogin;
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "apppath");
			if (tnode)
			{
				me.m5/*apppath*/ = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
			}
			
			me.m3/*dbinfo*/ = [];
			me.mk/*metadbinfo*/ = [];
			me.m4/*dbtype*/ = null;
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "meta_databases");
			
			if (tnode)
			{
				dbs = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < dbs.length; i++)
				{
					db = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(db, dbs[i], "name;databasetype;jdbcdriver;jdbcurl;userid;password;schemaname;userowlimit;validatesql", "s");
					
					var mk = IG$/*mainapp*/._I26/*getChildNodes*/(dbs[i]),
						j;
					
					for (j=0; j < mk.length; j++)
					{
						var nd = IG$/*mainapp*/._I29/*XGetNodeName*/(mk[j]);
						db[nd] = IG$/*mainapp*/._I24/*getTextContent*/(mk[j]);
					}
					
					if (db.name.toLowerCase() == "igcbase")
					{
						me.m4/*dbtype*/ = db.databasetype;
					}
					me.mk/*metadbinfo*/.push(db);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "databases");
			
			if (tnode)
			{
				dbs = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
				for (i=0; i < dbs.length; i++)
				{
					db = {};
					IG$/*mainapp*/._I1f/*XGetInfo*/(db, dbs[i], "name;databasetype;jdbcdriver;jdbcurl;userid;password;schemaname;userowlimit;validatesql", "s");
					
					var mk = IG$/*mainapp*/._I26/*getChildNodes*/(dbs[i]),
						j;
					
					for (j=0; j < mk.length; j++)
					{
						var nd = IG$/*mainapp*/._I29/*XGetNodeName*/(mk[j]);
						db[nd] = IG$/*mainapp*/._I24/*getTextContent*/(mk[j]);
					}
					
					if (db.name.toLowerCase() == "igcbase")
					{
						me.m4/*dbtype*/ = db.databasetype;
					}
					me.m3/*dbinfo*/.push(db);
				}
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "email");
			
			if (tnode)
			{
				me.m2/*emailinfo*/ = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			}
			
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(rnode, "app/sso");
			
			if (tnode)
			{
				me.m6/*sso*/ = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode);
			}
		}
	}
};
var $MI = function(mbase) {
	this.mbase = mbase;
	this.cdef = null;
	
	this.initDBType();
}

$MI.prototype = {
	initDBType: function() {
		var me = this;
		
		me.d1/*dbtypelist*/ = {
				"1": {
					name: "ORACLE_THIN",
					driver: "oracle.jdbc.driver.OracleDriver",
					url: "jdbc:oracle:thin:@{ipaddress}:{port_1521}:{DB_name}"
				},
				"2": {
					name: "ORACLE_8i",
					driver: "oracle.jdbc.driver.OracleDriver",
					url: "jdbc:oracle:oci8:@{DB_name}"
				},
	    		"3": {
					name: "ORACLE_9i",
					driver: "oracle.jdbc.driver.OracleDriver",
					url: "jdbc:oracle:oci:@{DB_name}",
					validateSQL: "SELECT 1 FROM DUAL"
				},
	    		"5": {
					name: "MYSQL_5",
					driver: "org.gjt.mm.mysql.Driver",
					url: "jdbc:mysql://{ipaddress}/{DB_name}",
					validateSQL: "SELECT 1"
				},
	    		"10": {
					name: "MSSQL_2006",
					driver: "com.microsoft.jdbc.sqlserver.SQLServerDriver",
					url: "jdbc:microsoft:sqlserver://{ipaddress}:{port_1433};DatabaseName={DB_name};SelectMethod=cursor;charset=euc-kr",
					validateSQL: "SELECT 1"
				},
	    		"11": {
					name: "MSSQL_JTURBO",
					driver: "com.ashna.JTurbo.Driver.Driver",
					url: "jdbc:JTurbo://{ipaddress}:{port}/{DB_name}",
					validateSQL: ""
				},
	    		"12": {
					name: "MSSQL_SPRINTA",
					driver: "com.inet.Tds.TdsDriver",
					url: "jdbc:inetdae:{ipaddress}:{port}?database={DB_name}"
				},
	    		"21": {
					name: "IBM_DB2",
					driver: "com.IBM.db2.jdbc.app.DB2Driver",
					url: "jdbc:db2://{ipaddress}:{port}/{DB_name}",
					validateSQL: "SELECT 1"
				},
	    		"30": {
					name: "SYBASE_42",
					driver: "com.sybase.jdbc.SybDriver",
					url: "jdbc:sybase:Tds:{ipaddress}:{port}/{DB_name}?CHARSET=eucksc",
					validateSQL: "SELECT 1"
				},
	    		"31": {
					name: "SYBASE_52",
					driver: "com.sybase.jdbc2.jdbc.SybDriver",
					url: "jdbc:sybase:Tds:{ipaddress}:{port}/{DB_name}?CHARSET=eucksc",
					validateSQL: "SELECT 1"
				},
	    		"40": {
					name: "JDBC_ODBC_BRIDGE",
					driver: "jdbc:odbc:{DB_name}",
					url: "sun.jdbc.odbc.JdbcOdbcDriver"
				},
	    		"41": {
					name: "POINTBASE_EMBEDDED",
					driver: "com.pointbase.jdbc.jdbcUniversalDriver",
					url: "jdbc:pointbase://embedded[:{port}]/{DB_name}"
				},
	    		"42": {
					name: "CLOUDESPACE",
					driver: "com.cloudscape.core.jdbcDriver",
					url: "jdbc:cloudscape:{DB_name}"
				},
	    		"43": {
					name: "CLOUDESPACE_RMI",
					driver: "RmiJdbc.RJDriver",
					url: "jdbc:rmi://{ipaddress}:{port}/jdbc:cloudscape:{DB_name}"
				},
	    		"44": {
					name: "FIREBIRD",
					driver: "org.firebirdsql.jdbc.FBDriver",
					url: "jdbc:firebirdsql:[//{ipaddress}[:{port}]/]{DB_name}"
				},
	    		"45": {
					name: "IDS_SERVER",
					driver: "ids.SQL.IDSDriver",
					url: "jdbc:ids://{ipaddress}:{port}/conn?dsn=<ODBC_DSN_NAME>"
				},
	    		"46": {
					name: "INFORMIX",
					driver: "com.informix.jdbc.IfxDriver",
					url: "jdbc:informix-sqli://{ipaddress}:{port}/{DB_name}:INFORMIXSERVER=<SERVER_NAME>"
				},
	    		"47": {
					name: "INSTANT_DB_313",
					driver: "jdbc.idbDriver",
					url: "jdbc:idb:{DB_name}"
				},
	    		"48": {
					name: "INSTANT_DB_314",
					driver: "org.enhydra.InstantDB.jdbc.idbDriver",
					url: "jdbc:idb:{DB_name}"
				},
	    		"49": {
					name: "INTERBASE",
					driver: "interbase.InterClient.Driver",
					url: "jdbc:interbase://{ipaddress}/{DB_name}"
				},
	    		"50": {
					name: "HYPERSONIC_SQL_12",
					driver: "hsql.hDriver",
					url: "jdbc:HypersonicSQL:{DB_name}"
				},
	    		"51": {
					name: "HYPERSONIC_SQL_13",
					driver: "org.hsql.jdbcDriver",
					url: "jdbc:HypersonicSQL:{DB_name}"
				},
	    		"52": {
					name: "POSTGRE_SQL_65",
					driver: "postgresql.Driver",
					url: "jdbc:postgresql://{ipaddress}:{port}/{DB_name}"
				},
				"55": {
					name: "TIBERO",
					driver: "com.tmax.tibero.jdbc.TbDriver",
					url: "jdbc:tibero:thin:@{ipaddress}:{8629}:{DB_name}"
				},
	    		"53": {
					name: "POSTGRE_SQL_70",
					driver: "org.postgresql.Driver",
					url: "jdbc:postgresql://{ipaddress}:{port}/{DB_name}"
				},
	    		"85": {
					name: "DERBY_EMBEDDED",
					driver: "org.apache.derby.jdbc.EmbeddedDriver",
					url: "jdbc:derby:{filename};create=false"
				}
		};
	},
	
	setLoading: function(visible, prog) {
		var mloading = $("#loading"),
			progressbar = $("#progressbar");
			
		if (visible == true)
		{
			progressbar.progressbar({
				value: prog || 100
			});
			mloading.show();
			$("#progresspanel").show();
		}
		else
		{
			progressbar.progressbar({
				value: 100
			});
			setTimeout(function() {
				mloading.fadeOut();
				$("#progresspanel").hide();
			}, 200);
		}
	},
	
	l19a/*doLogin*/: function() {
		var me = this,
			dlg = $("#dialog-login");
		dlg.dialog({
			resizable: false,
			height:160,
			modal: true,
			closable: false,
			buttons: {
				"Login": function() {
					me.rm1$8/*requestLoginKey*/.call(me);
				}
			}
		});
	},
	
	rm1$8/*requestLoginKey*/: function(userid, passwd, bg) {
		var panel = this;
		if (bg)
		{
			bg.show();
		}
		$.ajax({
			url: ig$/*appoption*/.servlet,
			type: 'POST',
			data: {
				ack: "23",
				payload: '<smsg></smsg>',
				mbody: '<smsg></smsg>',
				uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
			},
			dataType: 'text',
			timeout: 300000,
			error: function() {
				alert("Error while connecting server");
			},
			success: function(doc) {
				var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
					item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
					errcode = root ? IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode") : null,
					ltoken;
				
				if (item && item.length > 0)
				{
					p1 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p1");
					p2 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p2");
					
					if (p1 && p2)
					{
						IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = p1;
						IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = p2;
						
						setTimeout(function() {
							panel.l19b/*procLogin*/.call(panel, userid, passwd, bg);
						}, 10);
					}
					else if (bg)
					{
						bg.hide();
						alert("Error while get secure key value. Please try again later!");
					}
				}
				else if (errcode)
				{
					if (bg)
					{
						bg.hide();
					}
					var msg = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg");
						
					alert(msg);
				}
			}
		});
	},
	
	l19b/*procLogin*/: function() {
		var uid = $("#luid").val(),
			pwd = $("#lpwd").val(),
			panel = this, 
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		var encpwd = IG$/*mainapp*/._I3c/*encryptkey*/([uid, pwd]);
		
		panel.setLoading(true);
			
		req.init(panel, 
			{
	            ack: "13",
	            payload: "<smsg><userid><![CDATA[" + encpwd[0] + "]]></userid><passwd><![CDATA[" + encpwd[1] + "]]></passwd></smsg>",
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
	        }, panel, panel.rs_l19b/*procLogin*/, null);
		req._l/*request*/();
	},
	
	rs_l19b/*procLogin*/: function(xdoc) {
		$("#dialog-login").dialog("close");
		this.l1/*getIntallStat*/();
	},
	
// get installation information
	l1/*getIntallStat*/: function() {
		var panel = this, 
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
			
		req.init(panel, 
			{
                ack: "24",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/()
            }, panel, panel.rs_l1/*getIntallStat*/, panel.re_l1/*getIntallStat*/);
		req._l/*request*/();
	},
	
	rs_l1/*getIntallStat*/: function(xdoc) {
		var i,
			clsname = null,
			cdef = new cDef(xdoc),
			proceed = true;
		
		this.cdef = cdef;
		
		var v1 = cdef.version.split("."),
			v2 = cdef.serverversion.split(".");
		
		if (cdef.serverversion && cdef.d8/*needlogin*/ == true)
		{
			this.l19a/*doLogin*/();
			return;
		}
		
		if (v1.length > 0 && v1.length == v2.length)
		{
			for (i=0; i < v1.length; i++)
			{
				if (parseInt(v1[i]) < parseInt(v2[i]))
				{
					proceed = false;
					break;
				}
			}
		}
		else if (cdef.serverversion && cdef.serverversion != "")
		{
			proceed = false;
		}
		
		if (cdef.serverversion == cdef.version)
		{
			proceed = false;
		}
		
		l18/*setResponseText*/("s2path", cdef.m5/*apppath*/ || "Not defined", (cdef.m5/*apppath*/ ? "Yes" : "No"));
		
		l18/*setResponseText*/("s2con", "Success", clsname);
		l18/*setResponseText*/("s2ver", cdef.serverversion || "", clsname);
		l18/*setResponseText*/("s2updver", cdef.version || "", (proceed == true ? clsname : "No"));
		if (cdef.dbconnection == true)
		{
			l18/*setResponseText*/("s2dbcon", "Success", "Yes");
			l18/*setResponseText*/("s2dbtype", cdef.m4/*dbtype*/ || "", clsname);
		}
		else
		{
			l18/*setResponseText*/("s2dbcon", "Fail", "No");
			l18/*setResponseText*/("s2dbtype", "N/A", "No");
		}
		
		if (proceed == true)
		{
			$("#s2btnnext").show();
			if (cdef.serverversion == "")
			{
				$("#s2info").html("First installation on this machine.");
				$("#s2pnladminpwd").html("Admin Password: <input type='password' id='s2adminpwd' class='inputbox'></input>");
			}
			else if (cdef.version != cdef.serverversion)
			{
				$("#s2info").html("Your system already installed with previous version.<br/>Now prepared to update errors with following fix and new features.");
			}
			
			$("#s2desc").html("New version is ready to install. <br><br>Please make sure you backup your database for protecting possible data lose while installation");
		}
		else
		{
			$("#s2btnnext").hide();
			$("#s2info").html("Your system already installed with latest version.<br/>");
			$("#s2desc").html("Remove installation folder <code>IGC_HOME/install</code>. <br><br>Ready to use INGECEP<br/>");
		}
	},
	
	re_l1/*getIntallStat*/: function(xdoc) {
		var errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc),
			clsname = "No";
		
		switch (errcode) {
		case "0x9999": // connection failed
			l18/*setResponseText*/("s2con", "URL Error", clsname);
			break;
		case "0x0003": // MEC_HOME location is not reachable
			IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc);
			l18/*setResponseText*/("s2con", "Exception", clsname);
			break;
		default:
			l18/*setResponseText*/("s2con", "Exception", clsname);
			break;
		}
		
		l18/*setResponseText*/("s2path", "Not defined", "No");
		l18/*setResponseText*/("s2ver", "N/A", clsname);
		l18/*setResponseText*/("s2updver", "N/A", clsname);
		l18/*setResponseText*/("s2dbcon", "N/A", clsname);
		l18/*setResponseText*/("s2dbtype", "N/A", clsname);
		$("#s2btnnext").hide();
	},
	
	
// set datbase parameters
	l2/*setDBConfig*/: function() {
		var me = this,
			dbpanel = $("#dboptions"),
			s4rolapdb = $("#s4rolapdb"),
			cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
			metadbinfo = cdef.mk/*metadbinfo*/,
			db, i;
		
		dbpanel.hide();
		
		s4rolapdb.empty();
		
		for (i=0; i < dbinfo.length; i++)
		{
			if (dbinfo[i].name != "IGCBASE")
			{
				var litem = $("<li></li>").html(dbinfo[i].name).bind("click", function() {
					var lname = $(this).text();
					me.l3/*setDBInfo*/(lname);
				});
				s4rolapdb.append(litem);
			}
		}
	},
	
	l3/*setDBInfo*/: function(dbname) {
		var dbpanel = $("#dboptions"),
			cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
			metadbinfo = cdef.mk/*metadbinfo*/,
			db, i,
			ismetadb = false;
		
		$(document).scrollTop(0);
		
		for (i=0; i < metadbinfo.length; i++)
		{
			if (metadbinfo[i].name == dbname)
			{
				db = metadbinfo[i];
				ismetadb = true;
				break;
			}
		}
		
		if (!db)
		{
			for (i=0; i < dbinfo.length; i++)
			{
				if (dbinfo[i].name == dbname)
				{
					db = dbinfo[i];
					break;
				}
			}
		}
		
		if (ismetadb == true)
		{
			$("#s4dbnameinp").attr('readonly', true);
		}
		else
		{
			$("#s4dbnameinp").attr('readonly', false);
		}
		
		$("#s4dbname").html(db ? db.name : "");
		$("#s4dbtype").val(db ? db.databasetype : "");
		$("#s4dbnameinp").val(db ? db.name : "");
		$("#s4jdbcdrv").val(db ? db.jdbcdriver : "");
		$("#s4jdbcurl").val(db ? db.jdbcurl : "");
		$("#s4dbuser").val(db ? db.userid : "");
		$("#s4dbpwd").val(db ? db.password : "");
		$("#s4schema").val(db ? db.schemaname : "");
		$("#s4vsql").val(db ? db.validatesql : "");
		$("#s4rlimit").val(db ? db.userowlimit : "0");
		
		dbpanel.fadeIn();
	},
	
	l4/*updateDBInfo*/: function() {
		var db = {
			name: $("#s4dbnameinp").val(),
			databasetype: $("#s4dbtype").val(),

			jdbcdriver: $("#s4jdbcdrv").val(),
			jdbcurl: $("#s4jdbcurl").val(),
			userid: $("#s4dbuser").val(),
			password: $("#s4dbpwd").val(),
			schemaname: $("#s4schema").val(),
			validatesql: $("#s4vsql").val(),
			userowlimit: $("#s4rlimit").val()
		};
		
		var b_success = true;
		
		if (db.name == "")
		{
			b_success = false;
		}
		
		if (b_success == true)
		{
			this.l5/*checkDBInfo*/(db);
		}
	},
	
	l5/*checkDBInfo*/: function(db) {
		var cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
		
			panel = this, 
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
			
		req.init(panel, 
			{
	            ack: "4",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: "<smsg><database" + IG$/*mainapp*/._I20/*XUpdateInfo*/(db, "name;databasetype;jdbcdriver;jdbcurl;userid;password;schemaname;validatesql;userowlimit") + "/></smsg>"
	        }, panel, panel.rs_l5/*checkDBInfo*/, panel.re_l5/*checkDBInfo*/, db);
		req._l/*request*/();
	},
	
	rs_l5/*checkDBInfo*/: function(xdoc, db) {
		var cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
			me = this, i, 
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/connection"),
			tinfo = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnode),
			callback;
		
		if (tinfo && tinfo.result == "S")
		{
			me.l6/*contDBInfo*/(db);
		}
		else
		{
			var enode = IG$/*mainapp*/._I18/*XGetNode*/(tnode, "errormessage"),
				errmsg = IG$/*mainapp*/._I24/*getTextContent*/(enode);
			callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.l6/*contDBInfo*/, db);
			l19/*showMessage*/("There's error while loading database information.<br>Click Ok button to set this property.<br><br>" + errmsg, "DB Connection Error", true, callback);
		}
	},
	re_l5/*checkDBInfo*/: function(xdoc) {
		l19/*showMessage*/("There's error while processing request.", "Error!", true);
	},
	
	l6/*contDBInfo*/: function(db) {
		var cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
			me = this, i;
		
		for (i=0; i < dbinfo.length; i++)
		{
			if (dbinfo[i].name == db.name)
			{
				dbinfo.splice(i, 1);
				break;
			}
		}
		
		dbinfo.push(db);
		me.l7/*cancelDBInfo*/();
		me.l2/*setDBConfig*/();
	},
	
	l7/*cancelDBInfo*/: function() {
		var dbpanel = $("#dboptions");
		dbpanel.fadeOut();
	},
	
	l8/*updateContent*/: function() {
		var cdef = this.cdef, 
			ssoinfo = cdef.m6/*sso*/,
			emailinfo = cdef.m2/*emailinfo*/,
			s2adminpwd = $("#s2adminpwd");
		
		cdef.adminpwd = null;
		if (s2adminpwd && s2adminpwd.length > 0)
		{
			cdef.adminpwd = s2adminpwd.val();
		}
		emailinfo.hostname = $("#s5hostname").val();
		emailinfo.port = $("#s5portnumber").val();
		emailinfo.authuser = $("#s5authuser").val();
		emailinfo.password = $("#s5pwd").val();
		
		ssoinfo.enabled = $("#s5sso").is(':checked') == true ? "T" : "F";
		ssoinfo.classname = $("#s5ssoclass").val();
	},
	
	l9/*doUpdate*/: function() {
		var cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
			metadbinfo = cdef.mk/*metadbinfo*/,
			emailinfo = cdef.m2/*emailinfo*/,
			ssoinfo = cdef.m6/*sso*/,
			content = "",
			i,
			panel = this, 
			req = new IG$/*mainapp*/._I3e/*requestServer*/();
		
		panel.setLoading(true);
		
		panel.l8/*updateContent*/();
		
		content = "<smsg>";
		content += "<meta_databases>";
		for (i=0; i < metadbinfo.length; i++)
		{
			content += "<database";
			content += IG$/*mainapp*/._I20/*XUpdateInfo*/(metadbinfo[i], "name;databasetype;jdbcdriver;jdbcurl;userid;password;schemaname;validatesql;userowlimit") + "/>";
		}
		content += "</meta_databases>";
		content += "<databases>";
		for (i=0; i < dbinfo.length; i++)
		{
			content += "<database";
			content += IG$/*mainapp*/._I20/*XUpdateInfo*/(dbinfo[i], "name;databasetype;jdbcdriver;jdbcurl;userid;password;schemaname;validatesql;userowlimit") + "/>";
		}
		content += "</databases>";
		content += "<email";
		content += IG$/*mainapp*/._I20/*XUpdateInfo*/(emailinfo, "authuser;hostname;port;password;useauth;external") + ">";
		content += "</email>";
		content += "<app contextpath='" + ig$/*appoption*/.mainlink + "'>";
		content += "<sso";
		content += IG$/*mainapp*/._I20/*XUpdateInfo*/(ssoinfo, "enabled;classname") + ">";
		content += "</sso>";
		content += "</app>";
		content += "</smsg>";
		
		req.init(panel, 
			{
	            ack: "26",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
	            mbody: content
	        }, panel, panel.rs_l9/*doUpdate*/, panel.re_l9/*doUpdate*/);
		req.atld/*stoploading*/ = false;
		req._l/*request*/();
	},
	
	rs_l9/*doUpdate*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/Update"),
			step = parseInt(IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "steps"));
		
		me.totalsteps = step;
		me.curstep = 0;
		
		me.l10/*processUpdate*/();
	},
	
	re_l9/*doUpdate*/: function(xdoc) {
		this.setLoading(false);
		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc);
	},
	
	l10/*processUpdate*/: function() {
		var cdef = this.cdef, 
			dbinfo = cdef.m3/*dbinfo*/,
			metadbinfo = cdef.mk/*metadbinfo*/,
			emailinfo = cdef.m2/*emailinfo*/,
			ssoinfo = cdef.m6/*sso*/,
			encpwd = CryptoJS.SHA1(cdef.adminpwd),
			passwd = encpwd.toString(CryptoJS.enc.Hex),
			content = "",
			i,
			panel = this, 
			req = new IG$/*mainapp*/._I3e/*requestServer*/(),
			content = (cdef.adminpwd && panel.curstep == panel.totalsteps - 1) ? "<smsg apu='" + passwd + "'></smsg>" : "<smsg></smsg>",
			pcnt = (panel.totalsteps > 0) ? (panel.curstep / panel.totalsteps) * 100 : 0;
		
		panel.setLoading(true, pcnt);
		
		req.init(panel, 
			{
	            ack: "21",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({step: panel.curstep}, "step"),
	            mbody: content
	        }, panel, panel.rs_l10/*processUpdate*/, panel.re_l10/*processUpdate*/);
		req.atld/*stoploading*/ = false;
		req._l/*request*/();
		
		panel.curstep++;
	},
	
	rs_l10/*processUpdate*/: function(xdoc) {
		var panel = this;
		
		if (panel.curstep < panel.totalsteps)
		{
			panel.l10/*processUpdate*/();
		}
		else
		{
			panel.rs_l11/*updateComplete*/();
		}
	},
	
	re_l10/*processUpdate*/: function(xdoc) {
		this.setLoading(false);
		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc);
	},
	
	rs_l11/*updateComplete*/: function(xdoc) {
		this.setLoading(false);
		lm1/*loadStep*/(6);
	},
	
	l12/*updateEmailInfo*/: function() {
		var cdef = this.cdef, 
			emailinfo = cdef.m2/*emailinfo*/,
			ssoinfo = cdef.m6/*sso*/;
		
		if (emailinfo)
		{
			// authuser;hostname;password;port;useauth;external
			// $("#s5email").val(emailinfo.authuser || "");
			$("#s5hostname").val(emailinfo.hostname || "");
			$("#s5portnumber").val(emailinfo.port || "");
			$("#s5authuser").val(emailinfo.authuser || "");
			$("#s5pwd").val(emailinfo.password || "");
		}
		
		if (ssoinfo)
		{
			$("#s5sso").attr({checked: (ssoinfo.enabled == "T" ? true : false)});
			$("#s5ssoclass").val(ssoinfo.classname || "");
		}
	}
}
var m$p = {
	metadb: {}
};

IG$/*mainapp*/._I51/*ShowErrorMessage*/ = function(xdoc, panel) {
	var rnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
		prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(rnode),
		detail = IG$/*mainapp*/._I24/*getTextContent*/(rnode);
	
	l19/*showMessage*/(prop.errormsg + (detail != "" ? "\n" + detail : ""), "Error! [" + prop.errorcode + "]", true, null);
}

IG$/*mainapp*/._I53/*ShowConnectionError*/ = function(panel) {
	l19/*showMessage*/("Error while connecting to server", "Error!", true, null);
}

function callback(thisobj, success, param) {
	this.thisobj = thisobj;
	this.success = success;
	
	this.execute = function(extra) {
		this.success.call(this.thisobj, extra, param);
	};
}

var tabsteps = {};

function l14/*readFile*/(fileurl, rs, step) {
	$.ajax({
		url: fileurl,
		type: 'GET',
		dataType: 'text',
		timeout: 30000,
		error: function() {
			alert("Error while loading file");
		},
		success: function(value) {
			if (value && rs)
			{
				if (step == 1)
				{
					$("#maincontent").empty();
				}
				rs.execute.call(rs, value);
			}
		}
	});
}

function l15/*setStepIndicator*/(index) {
	var i,
		indicator;
	
	for (i=1; i < 10; i++)
	{
		indicator = $("#step_id_" + i); 
		// indicator.removeClass("step-off");
		// indicator.removeClass("step-on");
		
		indicator.removeClass("active");
		
		if (index == i)
		{			
			indicator.addClass("active");
		}
	}
}

function l16/*checkStep*/(step) {
	var mi = ig$/*appoption*/.mi,
		i, dbinfo, db, metadbinfo,
		r = true;
	
	switch (parseInt(step))
	{
	case 3:
		var s2adminpwd = $("#s2adminpwd"),
			pwd;
		if (s2adminpwd && s2adminpwd.length > 0)
		{
			pwd = s2adminpwd.val();
			if (pwd == "")
			{
				l19/*showMessage*/("Admin password is not entered. Please set admin password for secure system install.", "Admin Password", true, null);
				r = false;
			}
		}
		break;
	case 5:
		r = false;
		if (mi && mi.cdef && mi.cdef.mk/*metadbinfo*/)
		{
			dbinfo = mi.cdef.mk/*metadbinfo*/;
			for (i=0; i < dbinfo.length; i++)
			{
				if (dbinfo[i].name == "IGCBASE")
				{
					db = dbinfo[i];
					if (db.jdbcurl && db.jdbcdriver && db.userid && db.databasetype)
					{
						r = true;
					}
					break;
				}
			}
		}
		
		if (r == false)
		{
			l19/*showMessage*/("MetaDB Setting is not completed.<br>Please complete setting and try again.", "DB Setting", true, null);
		}
		break;
	}
	return r;
}

function lm1/*loadStep*/(step) {
	var key,
		cb = new callback(null, l17/*processStep*/, step);
	
	if (l16/*checkStep*/(step) == false)
	{
		return;
	}
	
	for (key in tabsteps)
	{
		if (parseInt(key) == step)
		{
			tabsteps[key].html.show();
		}
		else
		{
			tabsteps[key].html.hide();
		}
	}
	
	if (tabsteps[step])
	{
		l17/*processStep*/(null, step);
	}
	else
	{
		l14/*readFile*/("./html/step" + step + ".html", cb, step);
	}
	l15/*setStepIndicator*/(step);
}

function l17/*processStep*/(value, step) {
	var content, 
		maincontent = $("#maincontent");
	
	if (value)
	{
		tabsteps[step] = {};
		content = $("<div></div>")
			.html(value)
			.appendTo(maincontent);
		
		tabsteps[step].html = content;
	}
	
	switch (step)
	{
	case 2:
		ig$/*appoption*/.mi.l1/*getIntallStat*/();
		break;
	case 4:
		ig$/*appoption*/.mi.l2/*setDBConfig*/();
		if (value)
		{
			$("#s4dbtype").empty();
			$("#s4dbtype").append($("<option value=''>Select type</option>"));
			for (var key in ig$/*appoption*/.mi.d1/*dbtypelist*/)
			{
				var item = ig$/*appoption*/.mi.d1/*dbtypelist*/[key];
				$("#s4dbtype").append($("<option value='" + key + "'>" + item.name + "</option>"));
			}
			
			$("#s4dbtype").bind("change", function(e) {
				var tindex = $(this).val(),
					typelist = ig$/*appoption*/.mi.d1/*dbtypelist*/, tb;
				
				if (typelist[tindex])
				{
					tb = typelist[tindex];
					
					$("#s4jdbcdrv").val(tb.driver || "");
					$("#s4jdbcurl").val(tb.url || "");
					$("#s4vsql").val(tb.validateSQL || "");
				}
			});
			
			$("button").button();
			
			$("#s4dbmeta").bind("click", function() {
				var mi = ig$/*appoption*/.mi;
				mi.l3/*setDBInfo*/.call(mi, "IGCBASE");
				return false;
			});
			$("#s4btnadd").bind("click", function() {
				var mi = ig$/*appoption*/.mi;
				mi.l3/*setDBInfo*/.call(mi, null);
				return false;
			});
			
			$("#s4btnconfirm").bind("click", function() {
				var mi = ig$/*appoption*/.mi;
				mi.l4/*updateDBInfo*/.call(mi, null);
				return false;
			});
			
			$("#s4btncancel").bind("click", function() {
				var mi = ig$/*appoption*/.mi;
				mi.l7/*cancelDBInfo*/.call(mi, null);
				return false;
			});
		}
		break;
	case 5:
		var mi = ig$/*appoption*/.mi;
		mi.l12/*updateEmailInfo*/.call(mi);
		break;
	}
}

function l18/*setResponseText*/(uid, msg, cls) {
	cls = (!cls) ? "Yes" : cls;
	var doc = $("#" + uid);
	doc.html(msg);
	doc.removeClass("No");
	doc.removeClass("Yes");
	doc.addClass(cls);
}

function l19/*showMessage*/(msg, title, modal, rs) {
	var dlg = $("#dialog-confirm"),
		m = $("#dialog-msg"),
		btns = {};
	
	dlg.attr({title: title});
	m.html(msg);
	
	if (rs)
	{
		btns = {
			Ok: function() {
				if (rs)
				{
					rs.execute();
				}
				$(this).dialog("close");
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		};
	}
	else
	{
		btns = {
			Ok: function() {
				$(this).dialog("close");
			}
		}
	}
	
	dlg.dialog({
		resizable: false,
		height:140,
		modal: modal,
		buttons: btns
	});
}

function l20/*gomain*/() {
	var gurl = ig$/*appoption*/.mainlink + "/";
	document.location.href = gurl;
}

function l9/*doUpdate*/() {
	var mi = ig$/*appoption*/.mi,
		callback = new IG$/*mainapp*/._I3d/*callBackObj*/(mi, mi.l9/*doUpdate*/);
	l19/*showMessage*/("Continue to update the server?", "Confirm", true, callback);
}

var ig$/*appoption*/ = {};

$(window).load(function(){
	var mloading = $("#loading"),
		doc = $(document), 
		w = doc.width(),
		h = doc.height(),
		progresspanel = $("#progresspanel"),
		bpath,
		mpath = [],
		i;
		
	mloading.css({position: "absolute", top: 0, left: 0, opacity: 0.5});
	progresspanel.hide();
	$("#dialog-confirm").hide();
	$("#dialog-login").hide();
	$("button").button();
	
	bpath = window.location.pathname.split("/");
	
	for (i=0; i < bpath.length; i++)
	{
		if (bpath[i] == "install")
		{
			break;
		}
		else
		{
			mpath.push(bpath[i]);
		}
	}

	ig$/*appoption*/.mainlink = mpath.join("/");
	ig$/*appoption*/.servlet = ig$/*appoption*/.mainlink + "/servlet/ircp";
	ig$/*appoption*/.isdev = true;
	ig$/*appoption*/.mi = new $MI();
	
	$("#s2btnnext").hide();
	
	$("#progressbar").progressbar({
		value: 0
	});
	
	$(window).bind("resize", function() {
		var w = doc.width(),
			h = doc.height(),
			progresspanel = $("#progresspanel");
		
		mloading.width(w).height(h);
		progresspanel.css({
			left: (w - progresspanel.width()) / 2,
			top: 300 //(h - progresspanel.height()) / 2
		});
	});
	
	mloading.width(w).height(h);
	
	progresspanel.css({
		left: (w - progresspanel.width()) / 2,
		top: 300 // (h - progresspanel.height()) / 2
	});
	
	mloading.fadeOut();
	
	lm1/*loadStep*/(1);
});

