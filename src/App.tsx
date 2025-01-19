import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Star, Trophy, RotateCcw, Timer } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  fact: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Who is known as the 'Father of the Nation' in India?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Sardar Patel"],
    correct: 0,
    fact: "Mahatma Gandhi led India's non-violent independence movement and inspired civil rights movements worldwide."
  },
  {
    id: 2,
    question: "Which freedom fighter was known as 'Netaji'?",
    options: ["Bhagat Singh", "Subhas Chandra Bose", "Jethalal Champaklal Gada","Chandrashekhar Azad"],
    correct: 1,
    fact: "Subhas Chandra Bose formed the Indian National Army (INA) to fight for India's independence."
  },
  {
    id: 3,
    question: "What is the ancient language of India?",
    options: ["Hindi", "Sanskrit", "Telugu", "Tamil"],
    correct: 1,
    fact: "Sanskrit is considered the ancient language of India. It is one of the oldest languages in the world and is still used for religious and scholarly purposes."
  },
  {
    id: 4,
    question: "What is the national animal of India?",
    options: ["Lion", "Tiger", "Jethalal Champaklal Gada", "Bear"],
    correct: 1,
    fact: "The tiger is a symbol of strength, power, grace, and agility and it is national animal of india."
  },
  {
    id: 5,
    question: "What is the national river of India?",
    options: ["Godavari River", "Krishna River", "Indus River", "Ganga River"],
    correct: 3,
    fact: "The Ganga (Ganges) is the national river of India, considered sacred and vital to the country's culture and heritage."
  }
];

const QUESTION_TIMER = 20; // seconds per question

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFact, setShowFact] = useState(false);
  const [stars, setStars] = useState<{ x: number; y: number; size: number }[]>([]);
  const [rockets, setRockets] = useState<{ x: number; y: number; size: number; rotation: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);

    const newRockets = Array.from({ length: 6 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 20,
      rotation: Math.random() * 360,
    }));
    setRockets(newRockets);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !showFact && !showScore) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, showFact, showScore]);

  const handleTimeout = useCallback(() => {
    if (!selectedAnswer && !showFact) {
      setSelectedAnswer(-1);
      setShowFact(true);
      setTimerActive(false);
    }
  }, [selectedAnswer, showFact]);

  const handleAnswerClick = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(optionIndex);
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowFact(true);
    setTimerActive(false);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFact(false);
    setTimeLeft(QUESTION_TIMER);
    setTimerActive(true);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setShowFact(false);
    setTimeLeft(QUESTION_TIMER);
    setTimerActive(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white relative overflow-hidden">
      {/* Stars background */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}

      {/* 3D Rockets */}
      {rockets.map((rocket, index) => (
        <div
          key={`rocket-${index}`}
          className="rocket"
          style={{
            left: `${rocket.x}%`,
            top: `${rocket.y}%`,
            transform: `rotate(${rocket.rotation}deg)`,
          }}
        >
          <Rocket
            size={rocket.size}
            className="text-white"
            style={{ transform: 'rotate(-45deg)' }}
          />
        </div>
      ))}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {!showScore ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Rocket className="text-blue-400" />
                <span className="text-xl font-bold">Space Quest: Freedom Fighters</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" />
                <span>Score: {score}/{questions.length}</span>
              </div>
            </div>

            <div className="bg-indigo-800/50 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-indigo-600">
              {/* Timer */}
              <div className="mb-4 relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(timeLeft / QUESTION_TIMER) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Question {currentQuestion + 1} of {questions.length}</h2>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{timeLeft}s</span>
                </div>
              </div>
              <p className="text-lg mb-6">{questions[currentQuestion].question}</p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-lg transition-all ${
                      selectedAnswer === null
                        ? 'bg-indigo-700 hover:bg-indigo-600'
                        : selectedAnswer === index
                        ? index === questions[currentQuestion].correct
                          ? 'bg-green-600'
                          : 'bg-red-600'
                        : index === questions[currentQuestion].correct
                        ? 'bg-green-600'
                        : 'bg-indigo-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showFact && (
                <div className="mt-6 p-4 bg-indigo-900/50 rounded-lg">
                  <p className="text-sm italic">{questions[currentQuestion].fact}</p>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
                  >
                    {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-indigo-800/50 backdrop-blur-lg rounded-lg p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-6">Your score: {score} out of {questions.length}</p>
            <p className="mb-6">
              {score === questions.length
                ? 'Perfect score! You\'re a freedom fighter expert! 🎉'
                : score >= questions.length / 2
                ? 'Well done! Keep learning about our freedom fighters! 🌟'
                : 'Keep studying our rich history! Try again! 📚'}
            </p>
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;