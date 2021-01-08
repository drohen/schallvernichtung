import {el} from "../web_modules/redom.js";
var PlayBtnState;
(function(PlayBtnState2) {
  PlayBtnState2[PlayBtnState2["playing"] = 0] = "playing";
  PlayBtnState2[PlayBtnState2["paused"] = 1] = "paused";
})(PlayBtnState || (PlayBtnState = {}));
export class PlayBtn {
  constructor(handler) {
    this.handler = handler;
    this.el = el(`button`, `Play audio`);
    this.state = 1;
    this.playBtnEvent = this.playBtnEvent.bind(this);
    this.el.addEventListener(`click`, this.playBtnEvent);
  }
  playBtnEvent() {
    switch (this.state) {
      case 1:
        this.state = 0;
        this.el.textContent = `Pause audio`;
        this.handler.onPlay();
        break;
      case 0:
        this.pause();
        break;
    }
  }
  pause() {
    if (this.state === 1)
      return;
    this.state = 1;
    this.el.textContent = `Play audio`;
    this.handler.onPause();
  }
}
