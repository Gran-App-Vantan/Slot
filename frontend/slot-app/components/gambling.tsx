import { RedirectStatusCode } from "next/dist/client/components/redirect-status-code";
import Bet from "./bet";
import TimeLine from "./time-line";

function Gambling() {
    return (
        <div className="flex justify-center items-center border-gold-inner-black w-114 h-24 gap-5">
            {/* BET決定buttonのコンポーネントを作成後に追加 */}
            <Bet />
            <Bet />
            {/* <TimeLine /> */}
        </div>
    )
}

export default Gambling;