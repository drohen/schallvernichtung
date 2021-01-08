import {el} from "../web_modules/redom.js";
var RecordingState;
(function(RecordingState2) {
  RecordingState2[RecordingState2["noDevice"] = 0] = "noDevice";
  RecordingState2[RecordingState2["requestingDevice"] = 1] = "requestingDevice";
  RecordingState2[RecordingState2["idle"] = 2] = "idle";
  RecordingState2[RecordingState2["starting"] = 3] = "starting";
  RecordingState2[RecordingState2["recording"] = 4] = "recording";
  RecordingState2[RecordingState2["closing"] = 5] = "closing";
  RecordingState2[RecordingState2["error"] = 6] = "error";
})(RecordingState || (RecordingState = {}));
export class RecordBtn {
  constructor(handler, recordLength) {
    this.handler = handler;
    this.recordLength = recordLength;
    this.el = el(`button`, `Enable input device`);
    this.recordBtnEvent = this.recordBtnEvent.bind(this);
    this.recordBtnDown = this.recordBtnDown.bind(this);
    this.recordBtnUp = this.recordBtnUp.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.setError = this.setError.bind(this);
    this.setRecordingReady = this.setRecordingReady.bind(this);
    this.el.addEventListener(`click`, this.recordBtnEvent);
    this.state = 0;
    this.mediaTracks = [];
    this.recordingTimeout = 0;
  }
  reset() {
    this.error = void 0;
    this.state = 0;
    this.el.removeEventListener(`mousedown`, this.recordBtnDown);
    this.el.removeEventListener(`touchstart`, this.recordBtnDown);
    this.el.removeEventListener(`mouseup`, this.recordBtnUp);
    this.el.removeEventListener(`mouseleave`, this.recordBtnUp);
    this.el.removeEventListener(`touchend`, this.recordBtnUp);
    this.handler.reloadContext();
  }
  setError(error) {
    this.state = 6;
    this.error = error;
    this.enable(`Reload context`);
    this.mediaTracks.forEach((track) => track.stop());
    this.mediaTracks.length = 0;
    this.handler.onError();
  }
  setRecordingReady() {
    this.state = 2;
    this.enable(`Hold down to record`);
  }
  requestDevice() {
    navigator.mediaDevices.getUserMedia({
      audio: {
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false
      },
      video: false
    }).then((stream) => {
      this.mediaTracks.push(...stream.getAudioTracks());
      return this.handler.handleStream(stream);
    }).then(this.setRecordingReady).catch(this.setError);
  }
  disable(text) {
    this.el.textContent = text;
    this.el.disabled = true;
  }
  enable(text) {
    this.el.textContent = text;
    this.el.disabled = false;
  }
  stopRecording() {
    clearTimeout(this.recordingTimeout);
    if (this.state !== 4)
      return;
    this.state = 5;
    this.disable(`Stopping...`);
    this.handler.stopRecording().then(this.setRecordingReady).catch(this.setError);
  }
  recordBtnDown(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.state === 2) {
      this.state = 3;
      this.disable(`Starting...`);
      this.handler.startRecording().then(() => {
        this.enable(`Release to stop recording`);
        this.state = 4;
        this.recordingTimeout = window.setTimeout(this.stopRecording, this.recordLength * 1e3);
      }).catch(this.setError);
    }
  }
  recordBtnUp(event) {
    event.preventDefault();
    event.stopPropagation();
    this.stopRecording();
  }
  recordBtnEvent() {
    switch (this.state) {
      case 0:
        this.state = 1;
        this.disable(`Loading...`);
        this.requestDevice();
        this.el.addEventListener(`mousedown`, this.recordBtnDown);
        this.el.addEventListener(`touchstart`, this.recordBtnDown);
        this.el.addEventListener(`mouseup`, this.recordBtnUp);
        this.el.addEventListener(`mouseleave`, this.recordBtnUp);
        this.el.addEventListener(`touchend`, this.recordBtnUp);
        break;
      case 6:
        this.reset();
        break;
    }
  }
  getError() {
    return this.error;
  }
}
