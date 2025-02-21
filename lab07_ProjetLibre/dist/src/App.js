"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var _1216139922123941827lemmling_Cartoon_sheep_svg_med_png_1 = __importDefault(require("./assets/1216139922123941827lemmling_Cartoon_sheep.svg.med.png"));
var _1216139760278927551lemmling_Cartoon_cow_svg_med_png_1 = __importDefault(require("./assets/1216139760278927551lemmling_Cartoon_cow.svg.med.png"));
var _1245696592590661388bloodsong_Pig_RoundCartoon_svg_med_png_1 = __importDefault(require("./assets/1245696592590661388bloodsong_Pig-RoundCartoon.svg.med.png"));
var _12161376021593473697lemmling_Cartoon_goat_svg_med_png_1 = __importDefault(require("./assets/12161376021593473697lemmling_Cartoon_goat.svg.med.png"));
var _12161397191917421375lemmling_Cartoon_cat_svg_med_png_1 = __importDefault(require("./assets/12161397191917421375lemmling_Cartoon_cat.svg.med.png"));
var _1245696568353635238bloodsong_Chicken_RoundCartoon_svg_med_png_1 = __importDefault(require("./assets/1245696568353635238bloodsong_Chicken-RoundCartoon.svg.med.png"));
var heart_shiny_png_1 = __importDefault(require("./assets/heart_shiny.png"));
require("./App.css");
var animals = new Map([
    ['sheep', _1216139922123941827lemmling_Cartoon_sheep_svg_med_png_1.default],
    ['cow', _1216139760278927551lemmling_Cartoon_cow_svg_med_png_1.default],
    ['pig', _1245696592590661388bloodsong_Pig_RoundCartoon_svg_med_png_1.default],
    ['goat', _12161376021593473697lemmling_Cartoon_goat_svg_med_png_1.default],
    ['cat', _12161397191917421375lemmling_Cartoon_cat_svg_med_png_1.default],
    ['chicken', _1245696568353635238bloodsong_Chicken_RoundCartoon_svg_med_png_1.default]
]);
/**
 * Component that represents the main application. It displays a clicker game where the user can click on a pet to pet
 * it. The pet will receive the click and the user will see a heart animation. The user can also type a word that will
 * count as many clicks at once.
 * @constructor App
 */
function App() {
    var _a = (0, react_1.useState)(false), isPulsing = _a[0], setIsPulsing = _a[1];
    var _b = (0, react_1.useState)(false), showHeart = _b[0], setShowHeart = _b[1];
    var _c = (0, react_1.useState)({}), heartStyle = _c[0], setHeartStyle = _c[1];
    var _d = (0, react_1.useState)(null), clientId = _d[0], setClientId = _d[1];
    var _e = (0, react_1.useState)(0), nbGlobalClicksPerPet = _e[0], setNbGlobalClicksPerPet = _e[1];
    var _f = (0, react_1.useState)(0), nbGlobalClicks = _f[0], setNbGlobalClicks = _f[1];
    var _g = (0, react_1.useState)('sheep'), pet = _g[0], setPet = _g[1];
    var _h = (0, react_1.useState)(''), word = _h[0], setWord = _h[1];
    var ws = (0, react_1.useRef)(null);
    var _j = (0, react_1.useState)(true), isLoading = _j[0], setIsLoading = _j[1];
    var _k = (0, react_1.useState)(''), typingWord = _k[0], setTypingWord = _k[1];
    var _l = (0, react_1.useState)(false), ableToType = _l[0], setAbleToType = _l[1];
    (0, react_1.useEffect)(function () {
        document.title = "Farm Clicker";
    }, []);
    (0, react_1.useEffect)(function () {
        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onopen = function () {
            console.log('WebSocket client connection opened');
            setIsLoading(true);
        };
        ws.current.onmessage = function (event) {
            // Handle incoming messages from the server
            try {
                var message = JSON.parse(event.data);
                console.log(message);
                switch (message.type) {
                    case "clientId":
                        setClientId(message.id);
                        break;
                    case "nbGlobalClicks":
                        setNbGlobalClicks(message.global);
                        setNbGlobalClicksPerPet(message.current);
                        break;
                    case "changePet":
                        setPet(message.value);
                        break;
                    case "word":
                        setWord(message.value);
                        setAbleToType(true);
                        break;
                    default:
                        console.log('Received:', event.data);
                }
            }
            catch (error) {
                console.log('Received a non-JSON message:', event.data);
            }
            setIsLoading(false);
        };
        ws.current.onclose = function () {
            console.log('WebSocket client connection closed');
        };
        var wsCurrent = ws.current;
        // Clean up function to close the WebSocket connection when the component unmounts
        return function () {
            wsCurrent.close();
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (event) {
            if (event.key === 'Backspace') {
                setTypingWord(function (prevWord) { return prevWord.slice(0, -1); });
            }
            else if (event.key.match(/^[a-zA-Z]$/)) {
                setTypingWord(function (prevWord) { return prevWord + event.key; });
            }
            else if (event.key === 'Enter') {
                checkWord();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [typingWord, word, ableToType]); // Add typingWord and word as dependencies
    var checkWord = function () {
        if (typingWord === word && ableToType) {
            setAbleToType(false);
            setTypingWord('');
            setWord('');
            if (ws.current) {
                ws.current.send(JSON.stringify({ type: 'click', value: 30 }));
                ws.current.send(JSON.stringify({ type: 'word', value: clientId }));
            }
        }
        else
            setAbleToType(true);
    };
    var handleClick = function () {
        setIsPulsing(true);
        setShowHeart(true);
        setHeartStyle({
            left: "calc(50% + ".concat(Math.random() * 100, "px)"),
            top: "calc(50% + ".concat(Math.random() * 100 - 100, "px)"),
        });
        setTimeout(function () {
            setIsPulsing(false);
            setShowHeart(false);
        }, 500);
        if (ws.current) {
            ws.current.send(JSON.stringify({ type: 'click', value: 1 }));
        }
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isLoading ? ((0, jsx_runtime_1.jsx)(Loading, {})) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ClientInfo, { clientId: clientId, nbGlobalClicks: nbGlobalClicks }), (0, jsx_runtime_1.jsx)("h1", { children: "Click to pet!" }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "card" }, { children: [(0, jsx_runtime_1.jsx)(Pet, { image: pet, onClick: handleClick, isPulsing: isPulsing }), (0, jsx_runtime_1.jsx)(Heart, { showHeart: showHeart, src: heart_shiny_png_1.default, style: heartStyle }), (0, jsx_runtime_1.jsxs)("p", __assign({ className: "font" }, { children: ["I received ", nbGlobalClicksPerPet, " pets"] })), (0, jsx_runtime_1.jsx)(TypingRandomWord, { word: word, typingWord: typingWord })] }))] })) }));
}
/**
 * The loading component
 * @constructor Loading
 */
var Loading = function () { return (0, jsx_runtime_1.jsx)("p", __assign({ className: "loading" }, { children: "Loading..." })); };
/**
 * The pet component
 * @param image The image of the pet
 * @param onClick The function to call when the pet is clicked
 * @param isPulsing Whether the pet should be pulsing
 * @constructor Pet
 */
var Pet = function (_a) {
    var image = _a.image, onClick = _a.onClick, isPulsing = _a.isPulsing;
    return ((0, jsx_runtime_1.jsx)("img", { src: animals.get(image), onClick: onClick, alt: "animal to love", className: "".concat(isPulsing ? 'pulse' : '') }));
};
/**
 * The heart component
 * @param showHeart Whether the heart should be shown
 * @param src The source of the heart image
 * @param style The style of the heart
 * @constructor Heart
 */
var Heart = function (_a) {
    var showHeart = _a.showHeart, src = _a.src, style = _a.style;
    if (!showHeart) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("img", { src: src, className: "heart", alt: "heart", style: style }));
};
/**
 * The client info component
 * @param clientId The client ID
 * @param nbGlobalClicks The number of global clicks
 * @constructor ClientInfo
 */
var ClientInfo = function (_a) {
    var clientId = _a.clientId, nbGlobalClicks = _a.nbGlobalClicks;
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "row" }, { children: [(0, jsx_runtime_1.jsxs)("p", __assign({ className: "font" }, { children: ["Client ID: ", clientId] })), (0, jsx_runtime_1.jsxs)("p", __assign({ className: "font" }, { children: ["Global clicks : ", nbGlobalClicks] }))] })));
};
/**
 * The typing random word component
 * @param word The random word to type
 * @param typingWord The word being typed
 * @constructor TypingRandomWord
 */
var TypingRandomWord = function (_a) {
    var word = _a.word, typingWord = _a.typingWord;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("p", __assign({ className: "font" }, { children: ["Type this word: ", word] })), (0, jsx_runtime_1.jsxs)("p", __assign({ className: "font reduce-margin" }, { children: ["You are typing: ", typingWord] }))] }));
};
exports.default = App;
