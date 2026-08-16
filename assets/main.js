// エントリーポイント。進捗トラッカーの描画ロジックは今後のサイクルで追加していく。
import { recordLastActiveDate } from "./progress-logic.js";

recordLastActiveDate(window.localStorage);
