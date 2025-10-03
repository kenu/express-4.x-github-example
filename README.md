This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users using GitHub. Use
this example as a starting point for your own web applications.
This project is forked and modified from
[Facebook example](https://github.com/passport/express-4.x-facebook-example).

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
git clone https://github.com/kenu/express-4.x-github-example
cd express-4.x-github-example
npm i
```

The example uses environment variables to configure the consumer key and
consumer secret needed to access [GitHub's OAuth API](https://github.com/settings/developers). Start the server with those
variables set to the appropriate credentials.
- callback URL
  - http://localhost:3000/login/github/return

```bash
GITHUB_CLIENT_ID=Ov23liphnuyS9EToOtNG GITHUB_CLIENT_SECRET=7b96ef5eac8f607cc9ed7c41cc7f76b01bef50d8 node server.js
```

Open a web browser and navigate to [http://localhost:3000/](http://localhost:3000/)
to see the example in action.
