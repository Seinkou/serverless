"use strict";

module.exports.hello = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "use serverless V3",
                input: event,
            },
            null,
            2
        ),
    };
};