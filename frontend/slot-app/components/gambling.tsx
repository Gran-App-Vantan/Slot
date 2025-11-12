'use client';
import Bet from "./bet";

interface GamblingProps {
    bet: number;
    onBetChange: () => void;
}

function Gambling({ bet, onBetChange }: GamblingProps) {
    const clickBet = bet + 100;
    return (
        <div className="flex justify-center items-center border-gold-inner-black w-114 h-24 gap-5">
            <button>
                <p className="border-gold-inner-black w-48 h-16 text-gold size-27-SC">
                    <span className="size-27-SC gold flex justify-center items-center h-14">
                        {clickBet}
                    </span>
                </p>
            </button>
            <Bet onClick={onBetChange}/>
        </div>
    )
}

export default Gambling;
