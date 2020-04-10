# 303COM Personal Project

> A modern home security system capable of real time threat detection :lock:

## Research Question :thinking:

This project is built to answer the research question: 

> Are Home CCTV Security Systems able to provide useful real-time Threat Alerts by combing Motion Detection and Facial Recognition?

## Download :package:

> Coming soon once a deployment pipeline has been finalized  :clock1:

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

## Documentation :books:

> Coming Soon :clock2:

## Bug Reports and Feature Requests :bug:

Bug reports and feature requests are welcome and should be submitted using the [GitHub Issues Tracker](https://github.coventry.ac.uk/eggintod/303COM/issues/new)

## License

This project is licensed under the [MIT](https://github.coventry.ac.uk/eggintod/303COM/blob/master/LICENSE) license, feel free to do as you wish :smile: 
