"use strick";

module.exports.hello = async (event) =>{
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Serverless app is deployed, graduate Udacity",
            input: event
        },
        null,
        2
        ),
    };
};