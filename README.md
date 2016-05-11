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

The application utilizez the [dotenv](https://www.npmjs.com/package/dotenv) NPM package which requires you to have a `.env` file at the root of the project.  You will need to at a _mininum_ set the **SESSION_SECRET** environment variable to be used by the express-session module.  



## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
