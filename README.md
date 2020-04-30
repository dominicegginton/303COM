<div align="center">
	<img width="70" src="https://github.coventry.ac.uk/raw/eggintod/303COM/master/assets/logo.png">
  <h3 align="center">303COM Personal Project</h3>
  <p align="center">:lock: A modern home security system capable of real-time threat detection<p>
  <br>
  <img width="460" align="center" src="https://github.coventry.ac.uk/raw/eggintod/303COM/master/assets/demo.png">
</div>

## Research Question

 Are Home CCTV Security Systems able to provide useful real-time Threat Alerts by combing Motion Detection and Facial Recognition?

## Install

### Prerequisite

To run this project you must have the required prerequisites:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)

### Close Source Code

``` shell
git clone https://github.coventry.ac.uk/eggintod/303COM.git
```

### Install Dependencies

``` shell
npm i
```

Sit back and have a cuppa :coffee: this may take some time, **OpenCV** will take some time to build in your `node_modules` folder.

### Starting the System

``` shell
npm run start
```

The [Docker](https://www.docker.com/) docker demon should be running so **MongoDB** instances can be created.

### Viewing Logs

``` shell
npm run logs:view
```

Logs are written to `/logs/events.log`,

### Clearing Logs

``` shell
npm run logs:clear
```

### Development Environment

This project is released under the [MIT](https://github.coventry.ac.uk/eggintod/303COM/blob/master/LICENSE) license. Feel free to do ask you wish. You may fine some of the following tips useful while hacking around inside this source code:

#### Monitor Source Changes

```shell
npn run start:dev
```

Starts the system using [nodemon](https://github.com/remy/nodemon/), a helping hand that watched for changes to `*.js` files and restarts your node for you.

#### Development Webcam

```shell
npm run start:dev:webcam
```

Attach your bult-in webcam to the system. 
