# Help Desk Notification Web App

> Template-driven outage notification web app. Designed to be used by a service desk to send out email notifications via 
> an admin interface. Application is built using the [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) stack.

### Install

```bash
# Clone the repo
git clone https://github.com/sergeant-q/hdnotify2.git

# CD into the project
cd hdnotify2

# Install all required dependencies (including front end via bower)
npm install

# Start the server (defaults to development env)
npm start

# Start server in production mode
NODE_ENV='production' node server.js
```

### Post-Install

The application utilizes the [dotenv](https://www.npmjs.com/package/dotenv) NPM package which requires you to have a `.env` file at the root of the project.  You will need to at a _mininum_ set the **SESSION_SECRET** environment variable to be used by the express-session module.  


