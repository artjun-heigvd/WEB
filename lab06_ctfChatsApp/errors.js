class ServerError {
    constructor(error, reason, details) {
        this.error = error;
        this.reason = reason;
        this.details = details;
    }
}

//Changed this so it doesn't leak the whole conversation in the error...
export function userNotInConversationError(user) {
    return new ServerError(
        "Operation not permitted",
        "User is not part of the conversation",
        {
            user: {
                username: user.username,
                displayName: user.displayName,
                id: user.id,
                conversationIds: user.conversationIds,
            },
        })
}

export function conversationNotFoundError() {
    return "Conversation not found"
}

//Removed the unnecessary data sent in this error
export function emptyMessageError(user, receiver) {
    let details = {}
    if (user && receiver) {
        details = {
            message: "",
            sender: {
                username: user.username,
                displayName: user.displayName,
                id: user.id,
            },
            receiver: {
                username: receiver.username,
                displayName: receiver.displayName,
                id: receiver.id,
            },
        }
    }
    return new ServerError(
        "Operation not permitted",
        "Message is empty",
        details
    )
}