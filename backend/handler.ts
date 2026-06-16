import { APIGatewayEvent } from "aws-lambda";

export async function main(event: APIGatewayEvent) {
    const body = JSON.parse(event.body || '{}');

    const messages = body.messages || [];

    if (messages.length === 0) {
        return {
            statusCode: 200,
            body: "Pirate Chat Bot API is running!"
        };
    }

    const lastMessage = messages[messages.length - 1];

    return {
        statusCode: 200,
        body: `You said: ${lastMessage.text}`
    };
}