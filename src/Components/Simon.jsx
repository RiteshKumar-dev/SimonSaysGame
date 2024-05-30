import React, { useState, useEffect, useRef } from "react";
import GameBtn from "./GameBtn";
import { toast } from "react-toastify";
import gameOver from "../Sounds/wrong.mp3";
import redSnd from "../Sounds/red.mp3";
import greenSnd from "../Sounds/green.mp3";
import yellowSnd from "../Sounds/yellow.mp3";
import blueSnd from "../Sounds/blue.mp3";
import startSnd from "../Sounds/start.wav";

const colors = ["green", "red", "yellow", "blue"];

const Simon = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highestScore, setHighestScore] = useState(0);

  let score = localStorage.getItem("highScr");
  if (highestScore > score) {
    localStorage.setItem("highScr", highestScore);
  }

  const greenRef = useRef(null);
  const redRef = useRef(null);
  const yellowRef = useRef(null);
  const blueRef = useRef(null);

  const gameStartSound = useRef(new Audio(startSnd));
  const gameOverSound = useRef(new Audio(gameOver));
  const greenSound = useRef(new Audio(greenSnd));
  const redSound = useRef(new Audio(redSnd));
  const yellowSound = useRef(new Audio(yellowSnd));
  const blueSound = useRef(new Audio(blueSnd));

  const addNewColor = () => {
    const color = colors[Math.floor(Math.random() * 4)];
    setSequence((prevSequence) => [...prevSequence, color]);
  };

  const handleNextLevel = () => {
    if (!playing && sequence.length === 0) {
      setGameStarted(true);
      setPlaying(true);
      gameStartSound.current.play();
      toast.success("Game start...");
      addNewColor();
    }
  };

  const showSequence = (idx = 0) => {
    if (idx < sequence.length) {
      let ref = null;

      if (sequence[idx] === "green") ref = greenRef;
      if (sequence[idx] === "red") ref = redRef;
      if (sequence[idx] === "yellow") ref = yellowRef;
      if (sequence[idx] === "blue") ref = blueRef;

      ref.current.classList.add("opacity-50");
      setTimeout(() => {
        ref.current.classList.remove("opacity-50");
        setTimeout(() => showSequence(idx + 1), 500);
      }, 500);
    } else {
      setPlaying(false);
    }
  };

  const handleUserInput = (color) => {
    if (!playing && gameStarted) {
      let ref = null;
      let sound = null;

      if (color === "green") {
        ref = greenRef;
        sound = greenSound;
      }
      if (color === "red") {
        ref = redRef;
        sound = redSound;
      }
      if (color === "yellow") {
        ref = yellowRef;
        sound = yellowSound;
      }
      if (color === "blue") {
        ref = blueRef;
        sound = blueSound;
      }

      ref.current.classList.add("opacity-60");
      sound.current.play();
      setTimeout(() => {
        ref.current.classList.remove("opacity-60");
      }, 500);

      const newUserSequence = [...userSequence, color];
      setUserSequence(newUserSequence);

      const currentIndex = newUserSequence.length - 1;
      if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
        gameOverSound.current.play();
        toast.error("Game Over!");

        // Change the background color to red
        document.body.style.backgroundColor = "red";
        setTimeout(() => {
          document.body.style.backgroundColor = ""; // Revert the background color
        }, 500);
        setHighestScore((prevHighestScore) =>
          Math.max(prevHighestScore, sequence.length)
        );
        setSequence([]);
        setUserSequence([]);
        setPlaying(false);
        setGameStarted(false);
      } else if (newUserSequence.length === sequence.length) {
        setUserSequence([]);
        setPlaying(true);
        setTimeout(() => {
          addNewColor();
        }, 1000);
      }

      // console.log("User Sequence:", newUserSequence);
      // console.log("Sequence:", sequence);
    }
  };

  useEffect(() => {
    if (sequence.length > 0) {
      showSequence();
    }
  }, [sequence]);

  return (
    <div className="flex flex-col justify-center items-center text-white mt-10">
      <h1 className="text-3xl text-neutral-700 font-bold mb-4 mt-4">
        Simon Says Game
      </h1>
      <p className="text-xl text-neutral-600 mb-4">
        How long a sequence can you remember?
      </p>
      <p className="text-xl text-neutral-900 mb-4">Highest Score: {score}</p>
      <div className="relative flex flex-col justify-center items-center mt-10">
        <div>
          <GameBtn
            border="rounded-tl-full"
            bg="bg-green-400"
            ref={greenRef}
            onClick={() => handleUserInput("green")}
            disabled={!gameStarted}
          />
          <GameBtn
            border="rounded-tr-full"
            bg="bg-red-400"
            ref={redRef}
            onClick={() => handleUserInput("red")}
            disabled={!gameStarted}
          />
        </div>
        <div>
          <GameBtn
            border="rounded-bl-full"
            bg="bg-yellow-400"
            ref={yellowRef}
            onClick={() => handleUserInput("yellow")}
            disabled={!gameStarted}
          />
          <GameBtn
            border="rounded-br-full"
            bg="bg-blue-400"
            ref={blueRef}
            onClick={() => handleUserInput("blue")}
            disabled={!gameStarted}
          />
        </div>
        <button
          className="absolute text-white bg-neutral-800 text-xl sm:text-2xl font-bold rounded-full w-[150px] sm:w-[175px] h-[150px] sm:h-[175px] duration-200 hover:scale-105"
          onClick={handleNextLevel}
          disabled={playing}
        >
          {sequence.length === 0 ? "Play" : `Level ${sequence.length}`}
        </button>
      </div>
    </div>
  );
};

export default Simon;
