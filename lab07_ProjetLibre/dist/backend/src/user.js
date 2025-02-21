"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * Class representing a user
 */
var User = /** @class */ (function () {
    /**
     * Constructor
     * @param socket the socket of the user
     */
    function User(socket) {
        this.nbClicks = 0;
        this.ws = socket;
    }
    /**
     * Increment the number of clicks by one
     */
    User.prototype.incrementClicks = function () {
        this.nbClicks++;
    };
    return User;
}());
exports.User = User;
exports.default = User;
