import {RecordBuffer} from "./recordBuff.js";
import {RecordingWorklet} from "./recordingWorklet.js";
if (typeof registerProcessor === `function`) {
  registerProcessor(`recording-worklet`, RecordingWorklet);
} else {
  let encoder;
  const bufferHandler = {
    onRecorded: (data) => {
      postMessage({message: `ready`}, [data]);
    }
  };
  onmessage = ({data}) => {
    if (encoder) {
      switch (data.command) {
        case `start`:
          encoder.record();
          break;
        case `chunk`:
          encoder.onChunk(data.buffer);
          break;
        case `stop`:
          encoder.stopRecord();
          break;
        default:
          break;
      }
    }
    switch (data.command) {
      case `close`:
        close();
        break;
      case `init`:
        encoder = new RecordBuffer(data.data.sampleRate, data.data.maxLength, data.data.chunkSize, bufferHandler);
        postMessage({message: `ready`});
        break;
      default:
        break;
    }
  };
}
