import React, {useEffect, useRef, useState} from 'react'

import sheep from './assets/1216139922123941827lemmling_Cartoon_sheep.svg.med.png'
import cow from './assets/1216139760278927551lemmling_Cartoon_cow.svg.med.png'
import pig from './assets/1245696592590661388bloodsong_Pig-RoundCartoon.svg.med.png'
import goat from './assets/12161376021593473697lemmling_Cartoon_goat.svg.med.png'
import cat from './assets/12161397191917421375lemmling_Cartoon_cat.svg.med.png'
import chicken from './assets/1245696568353635238bloodsong_Chicken-RoundCartoon.svg.med.png'
import heart from './assets/heart_shiny.png'
import './App.css'

const animals = new Map<string, string>([
    ['sheep', sheep],
    ['cow', cow],
    ['pig', pig],
    ['goat', goat],
    ['cat', cat],
    ['chicken', chicken]
]);

/**
 * Component that represents the main application. It displays a clicker game where the user can click on a pet to pet
 * it. The pet will receive the click and the user will see a heart animation. The user can also type a word that will
 * count as many clicks at once.
 * @constructor App
 */
function App() {
    const [isPulsing, setIsPulsing] = useState<boolean>(false);
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const [heartStyle, setHeartStyle] = useState<React.CSSProperties>({});
    const [clientId, setClientId] = useState<string | null>(null);
    const [nbGlobalClicksPerPet, setNbGlobalClicksPerPet] = useState<number>(0);
    const [nbGlobalClicks, setNbGlobalClicks] = useState<number>(0);
    const [pet, setPet] = useState<string>('sheep');
    const [word, setWord] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [typingWord, setTypingWord] = useState<string>('');
    const [ableToType, setAbleToType] = useState<boolean>(false);

    useEffect(():void => {
        document.title = "Farm Clicker";
    }, []);

    useEffect(() => {

        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            console.log('WebSocket client connection opened');
            setIsLoading(true);
        };

        ws.current.onmessage = (event: MessageEvent<any>) => {
            // Handle incoming messages from the server
            try {
                const message = JSON.parse(event.data);
                console.log(message);
                switch (message.type) {
                    case "clientId":
                        setClientId(message.id);
                        break;
                    case "nbGlobalClicks":
                        setNbGlobalClicks(message.global);
                        setNbGlobalClicksPerPet(message.current);
                        break;
                    case "changePet" :
                        setPet(message.value);
                        break;
                    case "word":
                        setWord(message.value);
                        setAbleToType(true);
                        break;
                    default:
                        console.log('Received:', event.data);
                }
            } catch (error) {
                console.log('Received a non-JSON message:', event.data);
            }
            setIsLoading(false);
        };


        ws.current.onclose = () => {
            console.log('WebSocket client connection closed');
        };

        const wsCurrent: WebSocket = ws.current;

        // Clean up function to close the WebSocket connection when the component unmounts
        return (): void => {
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace') {
                setTypingWord(prevWord => prevWord.slice(0, -1));
            } else if (event.key.match(/^[a-zA-Z]$/)) {
                setTypingWord(prevWord => prevWord + event.key);
            } else if (event.key === 'Enter') {
                checkWord();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [typingWord, word, ableToType]); // Add typingWord and word as dependencies


    const checkWord = (): void => {
        if (typingWord === word && ableToType) {
            setAbleToType(false);
            setTypingWord('');
            setWord('');
            if (ws.current) {
                ws.current.send(JSON.stringify({type: 'click', value: 30}));
                ws.current.send(JSON.stringify({type: 'word', value: clientId}));
            }
        } else
            setAbleToType(true);
    }


    const handleClick = (): void => {

        setIsPulsing(true);
        setShowHeart(true);
        setHeartStyle({
            left: `calc(50% + ${Math.random() * 100}px)`,
            top: `calc(50% + ${Math.random() * 100 - 100}px)`,
        });
        setTimeout(() => {
            setIsPulsing(false);
            setShowHeart(false);
        }, 500);

        if (ws.current) {
            ws.current.send(JSON.stringify({type: 'click', value: 1}));
        }

    };

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <ClientInfo clientId={clientId} nbGlobalClicks={nbGlobalClicks} />
                    <h1>Click to pet!</h1>
                    <div className="card">
                        <Pet image={pet} onClick={handleClick} isPulsing={isPulsing}/>
                        <Heart showHeart={showHeart} src={heart} style={heartStyle}/>
                        <p className="font">
                            I received {nbGlobalClicksPerPet} pets
                        </p>
                        <TypingRandomWord word={word} typingWord={typingWord} />
                    </div>

                </>
            )}
        </>
    )
}

/**
 * The props for the pet component
 */
interface PetProps {
    image: string;
    onClick: () => void;
    isPulsing: boolean;
}

/**
 * The props for the heart component
 */
interface HeartProps {
    showHeart: boolean;
    src: string;
    style: React.CSSProperties;
}

/**
 * The props for the client info component
 */
interface ClientInfoProps {
    clientId: string | null;
    nbGlobalClicks: number;
}

/**
 * The props for the typing random word component
 */
interface TypingRandomWordProps {
    word: string;
    typingWord: string;
}

/**
 * The loading component
 * @constructor Loading
 */
const Loading = () => <p className="loading">Loading...</p>;

/**
 * The pet component
 * @param image The image of the pet
 * @param onClick The function to call when the pet is clicked
 * @param isPulsing Whether the pet should be pulsing
 * @constructor Pet
 */
const Pet: React.FC<PetProps> = ({image, onClick, isPulsing}:PetProps) => {
    return (
        <img
            src={animals.get(image)}
            onClick={onClick}
            alt="animal to love"
            className={`${isPulsing ? 'pulse' : ''}`}
        />
    );
}

/**
 * The heart component
 * @param showHeart Whether the heart should be shown
 * @param src The source of the heart image
 * @param style The style of the heart
 * @constructor Heart
 */
const Heart: React.FC<HeartProps> = ({showHeart, src, style}:HeartProps) => {
    if (!showHeart) {
        return null;
    }
    return (
        <img src={src} className="heart" alt="heart" style={style}/>
    );
}

/**
 * The client info component
 * @param clientId The client ID
 * @param nbGlobalClicks The number of global clicks
 * @constructor ClientInfo
 */
const ClientInfo: React.FC<ClientInfoProps> = ({ clientId, nbGlobalClicks }:ClientInfoProps) => (
    <div className="row">
        <p className="font">Client ID: {clientId}</p>
        <p className="font">Global clicks : {nbGlobalClicks}</p>
    </div>
);

/**
 * The typing random word component
 * @param word The random word to type
 * @param typingWord The word being typed
 * @constructor TypingRandomWord
 */
const TypingRandomWord: React.FC<TypingRandomWordProps> = ({ word, typingWord }:TypingRandomWordProps) => (
    <>
        <p className="font">Type this word: {word}</p>
        <p className="font reduce-margin">You are typing: {typingWord}</p>
    </>
);
export default App
