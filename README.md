# LiveChat

Currently hosted [here](https://react-live-chat.herokuapp.com/) via [Heroku](https://www.heroku.com/) 

(https://react-live-chat.herokuapp.com)

## Description

Using React, NodeJS + Express, this application facilitates live messing between users. 

## Installation

In root directory:
```
npm install
npm run server
```

In ```Client/``` directory:
```
npm install
npm start
```

Finally, to run locally, in the main directory:
```
npm run dev
```

## Database Functionality
I recently introduced SQL database functionality to this program, which is optional. It will automatically activate if a proper ```.env``` file exists in this format:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=username
DB_PASS=password
DB_DATABASE=chat
```

The above configuration functions well with my local [Docker](https://www.docker.com/) setup.
