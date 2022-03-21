import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button, DialogTitle } from '@mui/material';
import Card from './Card/Index';
import style from './App.scss';



const uniqueElementsArray = [
  {
    type: "Pikachu",
    image: require(`./images/pikachu.png`)
  },
  {
    type: "ButterFree",
    image: require(`./images/butterfree.png`)
  },
  {
    type: "Charmander",
    image: require(`./images/charmander.png`)
  },
  {
    type: "Squirtle",
    image: require(`./images/squirtle.png`)
  },
  {
    type: "Pidgetto",
    image: require(`./images/pidgeotto.png`)
  },
  {
    type: "Bulbasaur",
    image: require(`./images/bulbasaur.png`)
  }
];

function shuffleCards(array) {
  const length = array.length;

  for (let i = length; i>0; i --) {
    const randomIndex = Math.floor(Math.random() *i );
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}


export default function App() {

  const [cards, setCards] = useState(shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray)));
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [disableAllCards, setDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState (JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY);

  const timeout = useRef(null);

  const disable = () => {
    setDisableAllCards(true);
  };

  const enable = () => {
    setDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray.length) {
      setShowModal(true);

      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
    }
  };

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if( cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({...prev, [cards[first].type] : true}));

      setOpenCards([]);
      return;

    }

      timeout.current = setTimeout(() => {
        setOpenCards([]); 
      }, 500);
    }; 

    const handleCardClick = (index) => {
      if (openCards.length === 1) {
        setOpenCards((prev) => [...prev, index]);
        setMoves((moves) => moves + 1);
        disable();
      } else {
        clearTimeout(timeout.current);
        setOpenCards([index]);
      }
    };

    useEffect(() => {
      let timeout = null;
      if (openCards.length === 2) {
        timeout = setTimeout(evaluate, 300);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, [openCards]);

    useEffect(() => {
      checkCompletion();
    }, [clearedCards]);
    const checkIsFlipped = (index) => {
      return openCards.includes(index);
    };

    const checkIsInactive = (card) => {
      return Boolean(clearedCards[card.type]);
    };

     const handleRestart = () => {
      setClearedCards({});
      setOpenCards([]);
      setShowModal(false);
      setMoves(0);
      setDisableAllCards(false);
    
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
  };


  return (
    <div className={style.App}>
      <header>
        <h3> Play the game! </h3>

      </header>
      <div className={style.container}>
        {cards.map((card, index) => {
          return (
            <Card key={index} card={card} index={index} isDisabled={disableAllCards} isInactive={checkIsInactive(card)} isFlipped={checkIsFlipped(index)} onClick={handleCardClick()} /> 
          );
        })}
      </div>
      <footer>
        <div className={style.score}>
          <div className={style.moves}>
            <span className={style.bold}> Moves:  </span> {moves}
          </div>
        
        {localStorage.getItem("bestScore") && ( 
          <div className={style.highScore}>
            <span className={style.bold}> Best Score:</span> {bestScore}
          </div>
        ) }
        </div>
        <div className={style.restart}>
          <button onClick={handleRestart()} color="primary" variant="contained">
            Restart
          </button>
        </div>
          

      </footer>

      <Dialog open={showModal} disableBackdropClick disableEscapeKeyDown aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>
          Gioco completato!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hai completato il gioco in {moves} mosse. Il tuo punteggio migliore è {""} {bestScore} mosse.
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRestart} color="primary"> Restart</Button>
          </DialogActions>
        
      </Dialog>


    </div> 
    );

  }
