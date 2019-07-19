import * as utils from './utils';
import { parseSource, KwzParser, PpmParser } from './parsers'; 
import { Player } from './player';
import { GifEncoder, WavEncoder } from './encoders';
// bitmap encoder is deprecated in favor of gif
// import { BitmapEncoder } from './encoders';

export default {
  version: VERSION,
  player: Player,
  parseSource,
  kwzParser: KwzParser,
  ppmParser: PpmParser,
  // bitmapEncoder: BitmapEncoder,
  gifEncoder: GifEncoder,
  wavEncoder: WavEncoder,
  utils,
}