'use client';
import Bet from "./bet";
import { useState } from "react";

function Gambling() {
    const [bet, setBet] = useState(0);
    const clickBet = bet + 100;
    const handleClickBet = () => {
        setBet(prevBet => prevBet + 100);
    }
    return (
        <div className="flex justify-center items-center border-gold-inner-black w-114 h-24 gap-5">
            {/* BET決定buttonのコンポーネントを作成後に追加 */}
            <button>
                <p className="border-gold-inner-black w-48 h-16 text-gold size-27-SC">
                    <span className="size-27-SC gold flex justify-center items-center h-14">
                        {clickBet}
                    </span>
                </p>
            </button>
            <Bet onClick={handleClickBet}/>
        </div>
    )
}

export default Gambling;
