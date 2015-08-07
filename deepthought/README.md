# Deep Thought

Fulfills a promise after 7½ million years.

Requires the following environment variables to be set. During development, put them into .env and run via Foreman, or use `env $(cat .env)`, or whatever other way suites you.

* `WOLFRAM_APPID`: Wolfram Alpha API application identifier


## Running tests

With pre-recorded answers:

    env $(cat .env) mocha

With live server:

    env $(cat .env) NETMODE=live mocha

Recording missing responses into `test/responses/testname.xml`:

    env $(cat .env) NETMODE=record mocha

Re-recording all responses:

    env $(cat .env) NETMODE=rerecord mocha
