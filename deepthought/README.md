# Deep Thought

Fulfills a promise after 7½ million years.

(In reality, it just cheats by asking Wolfram Alpha.)


## Running

Run tests:

    mocha

The tests use saved WA responses from [test/responses/](test/responses/) folder. After adding a test, record new responses by invoking:

    NETMODE=rec mocha

To skip the stored responses and re-query WA, use:

    NETMODE=live mocha

To re-record all responses, do:

    NETMODE=rerec mocha


## Wolfram Alpha pod selection

We pick, in this order:

1. A pod marked as ‘primary’, if there's one.
2. A pod with ID of ‘Result’, if there's one.
3. A pod with any ID which is not ‘Input’.

See [src/wolfram.js](src/wolfram.js).


## Wolfram Alpha post-processing

We do some textual post-processing on whatever plain text WA gives us, mostly focusing on:

1. Replacing stupid pipes (` | `) and newslines with more human-like separators.
2. Reformatting tables (which WA seems to like to produce) into fluent text.
3. Removing extraneous comments.
4. Other minor formatting tweaks.

See [src/wolfram-prettify.js](src/wolfram-prettify.js).
