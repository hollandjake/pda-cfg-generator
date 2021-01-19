import CFG from "../cfg/CFG.js";

/* istanbul ignore file*/
export default class PDAConvert {
	/**
	 * @param {PDA} pda
	 * @return {CFG}
	 */
	static toCFG(pda) {
		return CFG.fromString("S->AS");
	}
}