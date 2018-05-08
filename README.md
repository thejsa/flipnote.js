# flipnote.js

[Flipnote Studio](http://flipnotestudio.nintendo.com/) is an application for the Nintendo DSi console, originally released in 2008. Users can create simple flipbook-style animations ("Flipnotes") with the console's touchscreen or camera, and add sounds or music with the microphone. Until 2013, Flipnote creations could also be shared with others on and online service called [Flipnote Hatena](flipnote.hatena.com).

This project's goal is to allow for entirely browser-based parsing and playback of Flipnote Studio's animation format, `.ppm`. It started mostly as a way to challenge myself to learn [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), with no real purpose in mind other than making something of a tribute to an app that I spent a *lot* of my early teens playing with. 

I hope that maybe in the long term it will serve some use in archiving Flipnote animations, epecially given that now there's no legitimate way to get Flipnote Studio unless you manage to find a DSi with it already installed.

### Features

* Full browser-based Flipnote (PPM) playback, with perfect accuracy for both frames and audio
* Metadata parsing
* Player API based on the HTML5 Video and Audio APIs
* ~6KB minified + gzipped

### Demo

Check out [Flipnote Player](https://github.com/jaames/flipnote-player) for a live demo. :)

### Documentation

* [Getting Started](https://github.com/jaames/flipnote.js/blob/master/docs/getStarted.md)
* [Player API](https://github.com/jaames/flipnote.js/blob/master/docs/playerAPI.md)

### How does it work?

#### The Flipnote format (`.ppm`)

The PPM format was custom-made by Nintendo for use within Flipnote Studio. The file extension comes from the Japanese "パラパラマンガ" ("Para Para Manga"), which roughly translates to "flip comic". Its purpose is to store Flipnotes created within the app, which comprise of animation frames, audio, and metadata (author name, timestamp, etc).

PPM animations have 2 layers per frame, each layer is a monochrome bitmap image where each pixel is represented in data by a single bit. Layers can use one of three colors; red, blue, or black/white, the latter being the inverse of the background color. As such, there is a maximum of 3 colors per frame.  

To save space (the Nintendo DSi doesn't have much internal memory) layers are compressed in a variety of different ways. The [PPM Format Docs](https://github.com/pbsds/hatena-server/wiki/PPM-format) cover frame compression in more detail, but the general idea was to avoid storing data for chunks of pixels that have the same value.  

PPMs can also have up to four audio tracks; a one minute long background track and 3 short "sound effects" that can be assigned to any frame. Nintendo went with [ADCPM](https://en.wikipedia.org/wiki/Adaptive_differential_pulse-code_modulation) for storing audio data because, again, they wanted to use as little space as possible.

#### The decoder

Frame decoding ([source](https://github.com/jaames/flipnote.js/blob/master/src/decoder/index.js#L296)) is easy enough to implement so long as you follow the docs. I wanted to avoid was pre-decoding frames though, as it could cause JavaScript execution to lock up for a while and memory usage wouldn't be too great. 

The general process looks like this:
 
* Decompress both layers into arrays, where each array item = one pixel of the layer
* If necessary, merge with the previous frame by XORing the current layers with the ones from the previous frame
* Merge layers together and feed the result into a [HTML canvas element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) to produce the final image

Flipnote Studio has 8 playback speed presets, the fastest being 30 frames per second. Hitting that benchmark is necessary for providing accurate real-time playback so it was important to avoid peformance bottlenecks wherever possible. As such, the frame decoder employs a couple of tricks:

* Each layer is decompressed into an [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) buffer, these provide numerous benefits besides just generally being more memory-efficient for this purpose than standard arrays.
* Rather than creating new layer buffers every time a frame is decoded, 4 layer buffers (2 for current frame layers, 2 for previous frame layers) are reused. 
* Since we're using Uint8Array buffers, the [`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) method can be used to copy one buffer to another, and the [`fill`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill) method can be used to quickly clear a buffer or set groups of pixels to the same value.
* Layers have to be merged by looping through each pixel and XORing against it the previous layer. It's slightly more efficient to loop through both layers' pixels in one go.
* Merging the layers together and pushing the result to a canvas with [`putImageData`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData) was proving to be a major bottleneck, so I ended up trying [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) instead. Layers are already Uint8Arrays so we can bind them to WebGL texture buffers easily, and for our drawing surface we use a quad that fills the whole canvas. Then a [fragment shader](https://github.com/jaames/flipnote.js/blob/master/src/webgl/fragmentShader.glsl.js) takes both layer textures and combines them on the GPU.

Audio was a little tricky. In my Python PPM decoder I was just able to rely on the [audioop module](https://docs.python.org/3.6/library/audioop.html#audioop.adpcm2lin) to decode it, but JavaScript doesn't have any out-of-the-box way to process ADPCM like that. The [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) API does support PCM audio, however it's a rather young and finicky API where implementations still differ quite a bit. That's no biggie though, the HTML5 [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) element also supports PCM via the [WAV](https://en.wikipedia.org/wiki/WAV) format! In the end the audio decoding and playing process looks like this:

* Convert 4-bit ADPCM samples to 16-bit PCM samples. For this I [semi-ported an ACPCM to PCM converter from C to JavaScript](https://github.com/jaames/flipnote.js/blob/master/src/decoder/adpcm.js).
* Prepend the raw PCM data with a [WAV header](https://github.com/jaames/flipnote.js/blob/master/src/player/audio.js#L21) to produce a valid .wav audio file. 
* Create an `<audio>` element using the .wav file [blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) as its source. 

### Authors

* **[James Daniel](https://github.com/jaames)**

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.

### Acknowledgments

* PPM format reverse-engineering & documentaion: [bricklife](http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313), [mirai-iro](http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm), [harimau_tigris](http://ugomemo.g.hatena.ne.jp/harimau_tigris), [steven](http://www.dsibrew.org/wiki/User:Steven), [yellows8](http://www.dsibrew.org/wiki/User:Yellows8) and [PBSDS](https://github.com/pbsds).
* Identifying the PPM sound codec: Midmad from Hatena Haiku (no longer active) and WDLMaster from the [HCS forum](https://hcs64.com/mboard/forum.php).
* [PBSDS](https://github.com/pbsds) for creating [Hatena Tools](https://github.com/pbsds/Hatenatools), and for giving me some notes regarding areas where the documentation fell short. 
* Stichting Mathematisch Centrum for writing this [ADPCM to PCM converter in C](http://www.cs.columbia.edu/~gskc/Code/AdvancedInternetServices/SoundNoiseRatio/dvi_adpcm.c) which I semi-ported to JS to handle audio.
* [Austin Burk](https://sudomemo.net) and [JoshuaDoes](https://github.com/joshuadoes) for helping to debug my Python3 PPM parser (which I used as a reference for the JS decoder).
* [JSA](https://github.com/thejsa) for performing packet captures of [Flipnote Hatena](http://flipnote.hatena.com/thankyou) before it shut down, without them reverse-engineering the app in general would have been a *huge* pain.
* [Nintendo](https://www.nintendo.com/) for creating the Flipnote Studio application.
* [Hatena](http://www.hatena.ne.jp/) for creating Flipnote Hatena, the now-defunct online service for sharing Flipnote Studio creations.
