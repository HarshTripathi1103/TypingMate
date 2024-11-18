import React,{useState,useEffect} from "react";

const App : React.FC= () => {
    const [input,setInput] = useState("");
    const [target,setTarget] = useState("This is a typing test.");
    const [time,setTime] = useState<number | null>(null);
    const [complete,setComplete] = useState(false);


    useEffect(() => {
        if (input === target){
            setComplete(true)
        }
    }, [input]);

    const reloadButtton = () => {
        setComplete(false);
    }

   const changeTarget = () => {
      setTarget("This is a new Target")
   }
    const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (!time) setTime(Date.now());
        setInput(e.target.value);
    }

    return(
        <div>
            <div>{target}</div>
            <input
              type="text"
              value={input}
              onChange={handleInput}
              disabled={complete}
            />

           <button
            value="changeTarget"
            onClick={changeTarget}
           >
               Change Target
           </button>

            <button
               value="reloadbutton"
               onClick={reloadButtton}
            >
                Reload Button
            </button>

            {complete && <p>Completed!</p>}
        </div>
    )


}

export default App;