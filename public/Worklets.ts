registerProcessor(
  "MidSideEncoderWorkletProcessor",
  class extends AudioWorkletProcessor {
    constructor() {
      super();
    }
    process(inputs: any, outputs: any) {
      let output = inputs;
      return true;
    }
  }
);
