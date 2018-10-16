# Development Setup

These installation instructions assume that you already installed the [Homebrew](http://brew.sh/) package manager.

1) Download and install [Node.js](http://nodejs.org).
```sh
brew install nodejs
```

2) Download, install, and start [MongoDB](http://www.mongodb.org/).
```sh
brew install mongodb
```

3) Set up the [MongoDB data directory](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb). The easiest set up is this (you may need `sudo`):

```sh
mkdir -p /data/db
chmod 777 /data/db
```

4) Clone this remote repository to a folder on your computer.
```sh
git clone git@github.com:mkong0216/MangoNotes.git
```

5) Install project dependencies.
```sh
cd MangoNotes
npm install
```

6) Start the web server.
```sh
npm run dev
```

6) Load the application in your web browser by navigating to `http://localhost:3000`
