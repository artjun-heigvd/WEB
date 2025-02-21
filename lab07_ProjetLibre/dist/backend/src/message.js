export var MessageModule;
(function (MessageModule) {
    class Message {
        constructor(data) {
            Object.defineProperty(this, "data", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.data = data;
        }
    }
    MessageModule.Message = Message;
    class ClickMessage extends Message {
        constructor(data) {
            super(data);
        }
        execute(user) {
            user.nbClicks += this.data;
            // Envoyer un UpdateClickMessage à tous les clients connectés
            //broadcastMessage(new UpdateClickMessage(user.nbClicks));
        }
    }
    MessageModule.ClickMessage = ClickMessage;
    class UpdateClickMessage extends Message {
        constructor(data) {
            super(data);
        }
    }
    MessageModule.UpdateClickMessage = UpdateClickMessage;
    class ChangePetMessage extends Message {
        constructor(petName) {
            super(petName);
        }
    }
    MessageModule.ChangePetMessage = ChangePetMessage;
    class JoinMessage extends Message {
        constructor(playerId) {
            super(playerId);
        }
    }
    MessageModule.JoinMessage = JoinMessage;
    class RemovePlayerMessage extends Message {
        constructor(playerId) {
            super(playerId);
        }
    }
    MessageModule.RemovePlayerMessage = RemovePlayerMessage;
    class MessageCodec {
        static encode(message) {
            return JSON.stringify({ type: message.constructor.name, message: message });
        }
        static decode(data) {
            const decoded = JSON.parse(data);
            const MessageClass = this.types[decoded];
            return Object.assign(MessageClass, decoded.message);
        }
    }
    Object.defineProperty(MessageCodec, "types", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {
            ClickMessage,
            UpdateClickMessage,
            ChangePetMessage,
            JoinMessage,
            RemovePlayerMessage
        }
    });
    MessageModule.MessageCodec = MessageCodec;
})(MessageModule || (MessageModule = {}));
export default MessageModule;
