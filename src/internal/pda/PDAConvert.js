import CFG from "../cfg/CFG.js";

export default class PDAConvert {
	/**
	 * @param {PDA} pda
	 * @return {CFG}
	 */
	static toCFG(pda) {
		/* istanbul ignore next */
		return CFG.fromString("S->AS");
	}
}