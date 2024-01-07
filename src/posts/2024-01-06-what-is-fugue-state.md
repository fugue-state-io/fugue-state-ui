---
title: "What is fugue-state?"
subtitle: "It's a song learning engine"
date: "2024-01-06"
author: Jonathon Zudell
---
fugue-state.io is a digital audio workstation geared towards learning songs. You bring an .mp3 or .mp4 and listen using the playback engine. fugue-state helps you listen faster.

## Features
To assist you in listening fugue-state-io has the following features:

### Looping
The loop feature enables you to select a time segment of a song and repeat it. 
![Example loop Selection](/loop_selection.png)
### Speed Adjustment
The rate at which a song will be played back. This ranges from 0.2x to 2.0x speed.

### Graphic Equalization
The sound output levels can be adjusted using a 9 stage BiquadFilter.

| Lowshelf | Peaking | Peaking | Peaking | Peaking | Peaking | Peaking | Peaking | Highshelf |
| -------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | --------- |
| 100Hz    | 200Hz   | 400Hz   | 800Hz   | 1600Hz  | 3200Hz  | 4800Hz  | 6400Hz  |12800Hz    |

### Fourier Transform output
The output of a fourier transform is drawn for the user
![Example loop Selection](/fourier.png)
