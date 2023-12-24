onmessage = (e) => {
  console.log("Message received from main script");
  let buffer = e.data.buffer
  let summaryLength = 2048;
  let summary = Array(summaryLength);
  for (let x = 0; x < summaryLength; x++) {
    summary[x] = {"high" : -1, "low" : 1}
  }
  let framesPerSummary = buffer.length / summaryLength;
  for (let x = 0; x < buffer.length; x++) {
    let summaryFrame = Math.floor(x / framesPerSummary);
    let frame = buffer[x]
    if (frame < summary[summaryFrame]["low"]) {
      summary[summaryFrame]["low"] = frame;
    }
    if (frame > summary[summaryFrame]["high"]) {
      summary[summaryFrame]["high"] = frame;
    }
  }
  console.log("Posting message back to main script");
  postMessage({"channel" : e.data.channel, "summary" : summary});
};
