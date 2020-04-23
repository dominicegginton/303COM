# 303COM Personal Project

> :lock: A modern home security system capable of real time threat detection

## Research Question

Are Home CCTV Security Systems able to provide useful real-time Threat Alerts by combing Motion Detection and Facial Recognition?

## Getting Started

To run this project you must have the required prerequisites:

- [docker](https://www.docker.com/)
- [node.js](https://nodejs.org/en/)

### Install Dependencies

This may take some time, it installs [OpenCV](https://opencv.org/) via [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs) and [TensorFlow](https://www.tensorflow.org/), these take a while to download and install.

``` shell
npm i
```

### Managing the Development Environment

To simply start the server in the development environment run the npm script:
``` shell
npm run start:dev
```

Enabling the webcam attached the the development machine is done via the `DEV_WEBCAM=true/false` environment variable, however a easy to use npm script has been created:
``` shell
npm run start:dev:webcam
```
To clean the docker volumes and containers from your machines docker engine use the npm script:
``` shell
npm run clean:dev
```
