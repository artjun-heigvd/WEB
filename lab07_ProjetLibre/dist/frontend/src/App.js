import { useState } from 'react';
import sheep from './assets/1216139922123941827lemmling_Cartoon_sheep.svg.med.png';
import cow from './assets/1216139760278927551lemmling_Cartoon_cow.svg.med.png';
import pig from './assets/1245696592590661388bloodsong_Pig-RoundCartoon.svg.med.png';
import goat from './assets/12161376021593473697lemmling_Cartoon_goat.svg.med.png';
import cat from './assets/12161397191917421375lemmling_Cartoon_cat.svg.med.png';
import chicken from './assets/1245696568353635238bloodsong_Chicken-RoundCartoon.svg.med.png';
import heart from './assets/heart_shiny.png';
import './App.css';
//import {MessageCodec} from "../../backend/src/message.ts";
const animals = [sheep, cow, pig, goat, cat, chicken];
function App() {
    const [count, setCount] = useState(0);
    const [isPulsing, setIsPulsing] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [heartStyle, setHeartStyle] = useState({});
    /*useEffect(() => {
        const port = process.env.PORT || 5173;
        const ws = new WebSocket(`ws://localhost:${port}`); // Remplacez par l'URL de votre serveur WebSocket
  
        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };
  
        ws.onmessage = (event) => {
            const message = MessageCodec.decode(event.data);
            // Traitement du message (par exemple, afficher le nombre de clics)
        };
  
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
  
        return () => {
            ws.close(); // Fermer la connexion WebSocket lorsque le composant est démonté
        };
    }, []);*/
    const handleClick = () => {
        setCount((count) => count + 1);
        setIsPulsing(true);
        setShowHeart(true);
        setHeartStyle({
            left: `calc(50% + ${Math.random() * 100}px)`, // random position between -20px and 20px from the center
            top: `calc(50% + ${Math.random() * 100 - 100}px)`, // random position between -20px and 20px from the center
        });
        setTimeout(() => {
            setIsPulsing(false);
            setShowHeart(false);
        }, 500);
    };
    return (<>
      <h1>Click to pet!</h1>
      <div className="card">
          <img src={sheep} onClick={handleClick} alt={"animal to love"} className={`${isPulsing ? 'pulse' : ''} ${isClicked ? 'sheep-clicked' : ''}`}/>
          {showHeart && <img src={heart} className="heart" alt="heart" style={heartStyle}/>}
        <p className="font">
          I received {count} pets
        </p>
      </div>
    </>);
}
export default App;
