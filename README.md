# AnswerBot
An answer for every question (probably)

Answering questions requires the following environment variables to be set. During development, put them into .env and run via Foreman, or use `env $(cat .env) ...`, or `export $(cat .env)`, or whatever.

* `WOLFRAM_APPID`: Wolfram Alpha API application identifier


## Running Deep Thought tests

First:

    cd deepthought
    export $(cat ../.env)

With pre-recorded answers:

    mocha

With live server:

    NETMODE=live mocha

Recording missing responses into `test/responses/testname.xml`:

    NETMODE=record mocha

Re-recording all responses:

    NETMODE=rerecord mocha

To see more output, set `DEBUG`:

    DEBUG='wolfram:*' mocha
