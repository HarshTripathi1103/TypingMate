import { useState, useEffect, useRef } from "react";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";

const App: React.FC = () => {
  const handleTarget = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");
  const [target, setTarget] = useState("This is a typing test.");
  const [time, setTime] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [focusInput, setFocusInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wpm, setWpm] = useState<number | null>(null);
  const [errors, setErrors] = useState<number>(0);
  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const response = await fetch("https://dummyjson.com/quotes/random");
      const data = await response.json();

      const quote = data.quote;
      setTarget(quote);
      setInput("");
      setTime(null);
      setComplete(false);
      setErrors(0);
      setFocusInput(true);
      setLoading(false);

      // return quote;
    } catch (error) {
      console.error("Error generating quote", error);

      return "Failed to generate quote.Try again";
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuotes();
    console.log("generated quote");
  }, []);

  const calculateWpm = (input: string, totalTime: number) => {
    const wordCount = input.trim().split(/\s+/).length;
    const minute = totalTime / 60000;
    return Math.round(wordCount / minute);
  };

  const endTest = () => {
    const incorrectChars = target.split("").reduce((count, char, index) => {
      return input[index] !== char ? count + 1 : count;
    }, 0);

    setErrors(incorrectChars);
    setComplete(true);

    if (time) {
      const elapsedTime = Date.now() - time;
      const calcCompletion = elapsedTime / 1000;
      const calculateWPM = calculateWpm(input, elapsedTime);
      setWpm(calculateWPM);
      setElapsed(calcCompletion);
    }
  };

  useEffect(() => {
    if (focusInput && handleTarget.current) {
      handleTarget.current.focus();
      setFocusInput(false);
    }

    if (handleTarget.current) {
      handleTarget.current.focus();
    }
  }, [focusInput]);

  const reloadButton = () => {
    setComplete(false);
    setInput("");
    setTime(null);
    setErrors(0);
    setFocusInput(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!time) setTime(Date.now());
    const newInput = e.target.value;
    setInput(newInput);

    if (newInput.length === target.length) {
      endTest();
    }
  };

  const renderTarget = () => {
    return target.split("").map((char, index) => {
      const inputChar = input[index];
      const isCorrect = inputChar ? inputChar === char : false;
      const isCurrent = index === input.length - 1;

      return (
        <span
          key={index}
          className={`relative ${
            inputChar === undefined
              ? "text-black"
              : isCorrect
                ? "text-green-500"
                : "text-red-500"
          }`}
        >
          {char}
          {isCurrent && !complete && (
            <span
              className="absolute -right-1 top-0 w-0.5 h-full bg-blue-500 animate-pulse"
              aria-label="Cursor"
            />
          )}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <CardContent
          className="text-center mb-4 text-gray-700 font-semibold select-none"
          aria-label="Typing target"
        >
          {renderTarget()}
        </CardContent>
        <Input
          ref={handleTarget}
          type="text"
          value={input}
          onChange={handleInput}
          disabled={complete}
          aria-label="Type the quote here"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Type here"
        />
        <CardContent className="flex  space-x-4 mb-4">
          <Button onClick={fetchQuotes} disabled={loading} className="flex-1">
            {loading ? "Generating..." : "Generate Quote"}
          </Button>
          <Button onClick={reloadButton} className="flex-1">
            Reload
          </Button>
        </CardContent>
        {complete && (
          <CardFooter
            className="bg-green-100 border border-green-300 rounded-md p-4 text-center
                     flex
                     flex-col
                    "
            aria-label="Test results"
          >
            <p className="text-gray-700">
              Time taken to complete: {elapsed?.toFixed(2)} sec
            </p>
            <p className="text-blue-700">Words Per Minute (WPM): {wpm}</p>
            <p className="text-red-700">Errors: {errors}</p>
            <p className="text-green-700">
              Accuracy: {((1 - errors / target.length) * 100).toFixed(2)}%
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default App;
