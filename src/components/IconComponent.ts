import { LitElement, html, css, customElement, property } from 'lit-element';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';

import IconPlay from './icons/play.svg';
import IconPause from './icons/pause.svg';
import IconLoader from './icons/loader.svg';
import IconVolumeOn from './icons/volumeOn.svg';
import IconVolumeOff from './icons/volumeOff.svg';

/** @internal */
function patchSvg(svgString: string) {
  return svgString.replace(/<svg ([^>]*)>/, (match, svgAttrs) => `<svg ${ svgAttrs } class="Icon" style="fill:currentColor">`);
}

/** @internal */
const iconMap: Record<string, string> = {
  play: patchSvg(IconPlay),
  pause: patchSvg(IconPause),
  loader: patchSvg(IconLoader),
  volumeOn: patchSvg(IconVolumeOn),
  volumeOff: patchSvg(IconVolumeOff),
}

/** 
 * Flipnote player icon component
 * 
 * @category Web Component
 */
@customElement('flipnote-player-icon')
export class IconComponent extends LitElement {

  static get styles() {
    return css`
      .Icon {
        width: 100%;
        height: 100%;
        color: var(--flipnote-player-icon-color, #F36A2D);
      }
    `;
  }

  /**
   * Available icons:
   * - `play`
   * - `pause`
   * - `loader`
   * - `volumeOn`
   * - `volumeOff`
   */
  @property({ type: String })
  icon: string = 'loader';

  /** @internal */
  public render() {
    return html`${ unsafeSVG(iconMap[this.icon]) }`;
  }
}