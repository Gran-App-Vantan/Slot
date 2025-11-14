interface BetProps {
    onClick: () => void;
}

function Bet( { onClick }: BetProps ) {
    return (
        <button className="border-gold-inner-blue w-48 h-16" onClick={onClick}>
            <span className="size-27-SC gold">
                BET
            </span>
        </button>
    )
}

export default Bet;