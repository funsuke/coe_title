import {
	COEController, Action
} from "@akashic-extension/coe";

/**
 * タイトルシーンでの Action の種別
 */
export enum titleActionType {
	/**
	 * 選手参加
	 */
	entryPlayer = "entry_player",
	/**
	 * 選手不参加
	 */
	erasurePlayer = "erasure_player",
	/**
	 * 舟券購入
	 */
	entryGambler = "entry_gambler",
	/**
	 * 舟券非購入
	 */
	erasureGambler = "erasure_gambler",
}

/**
 * タイトルシーンでの Command の種別
 */
export enum titleCommandType {
	/**
	 * 選手人数の変更
	 */
	changePlayerNum = "change_playerNum",
	/**
	 * 勝負人数の変更
	 */
	changeGamblerNum = "change_gamblerNum"
}

// export type TitleActionData = TitleActionData;

/**
 * タイトルシーンの Action Data
 */
export interface TitleActionData {
	type: titleActionType;
}

export type TitleCommand = ChangePlayerCommand | ChangeGamblerCommand;

/**
 * 選手人数が変化した時の Command
 */
export interface ChangePlayerCommand {
	type: titleCommandType.changePlayerNum;
	num: number;
}

/**
 * 勝負人数が変化した時の Command
 */
export interface ChangeGamblerCommand {
	type: titleCommandType.changeGamblerNum;
	num: number;
}

/**
 * タイトル用 Controller
 */
export class ControllerTitle extends COEController<TitleCommand, TitleActionData> {
	private playerNum: number;
	private gamblerNum: number;
	/**
	 * コンストラクタ
	 */
	constructor() {
		//
		super();
		// プロパティ初期化
		this.playerNum = 0;
		this.gamblerNum = 0;
		// Action の受信トリガの登録
		this.onActionReceive.add(this.onActionReceived, this);
	}

	/**
	 * コントローラ破棄時処理
	 */
	destroy(): void {
		// Action の受信トリガを解除
		this.onActionReceive.remove(this.onActionReceived, this);
		super.destroy();
	}

	/**
	 * Action 受取時の処理
	 *
	 * @param action Action
	 */
	onActionReceived(action: Action<TitleActionData>): void {
		// Action.dataの判定
		const data = action.data;
		if (data == null) return;
		// TitleActionDataのtypeの判定
		let type: titleCommandType = titleCommandType.changePlayerNum;
		let num: number = 0;
		switch (data.type) {
			// Actionが選手参加だった場合
			case titleActionType.entryPlayer:
				type = titleCommandType.changePlayerNum;
				num = ++this.playerNum;
				break;
			// Actionが選手不参加だった場合
			case titleActionType.erasurePlayer:
				type = titleCommandType.changePlayerNum;
				num = --this.playerNum;
				break;
			// Actionが勝負参加だった場合
			case titleActionType.entryGambler:
				type = titleCommandType.changeGamblerNum;
				num = ++this.gamblerNum;
				break;
			// Actionが勝負不参加だった場合
			case titleActionType.erasureGambler:
				type = titleCommandType.changeGamblerNum;
				num = --this.gamblerNum;
				break;
			// その他(データが壊れてる時しか入らないか？)
			default:
				return;
		}
		// numの調整(無いと思うが)
		// パラメータをブロードキャスト
		this.broadcast({
			type: type,
			num: num,
		});
	}
}
