import {
	Scene, SceneParameters, initialize
} from "@akashic-extension/coe";
import {
	TitleActionData, TitleCommand, TitleController, titleActionType, titleCommandType
} from "./coe/TitleController";

export interface TitleSceneParameter extends SceneParameters<TitleCommand, TitleActionData> {
	//
}

const game: g.Game = g.game;

/**
 * タイトルシーン (COE でいう View でもある)
 */
export class SceneTitle extends Scene<TitleCommand, TitleActionData> {
	private font: g.Font;
	private lblPlayerNum: g.Label;
	private lblGamblerNum: g.Label;
	/**
	 * コンストラクタ
	 * @param param ゲームパラメータ
	 */
	constructor(param: g.GameMainParameterObject) {
		// -----------------------------
		// COEフレームワーク
		// -----------------------------
		// 初期化
		initialize({ game, args: param });
		// コントローラ
		const controller = new TitleController();
		// -----------------------------
		// (COE)Scene
		// -----------------------------
		super({
			game,
			controller,
			assetIds: ["title", "button"],
		});
		// -----------------------------
		// プロパティ
		// -----------------------------
		// フォント
		this.font = new g.DynamicFont({
			game: g.game,
			fontFamily: "monospace",
			size: 24,
		});
		// ラベル
		// ※恐らくこの時点でg.SceneがonLoadイベントがfireされてないので、onLoadedでappend等する
		this.lblPlayerNum = new g.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "0人参加",
			x: 200,
			y: 600,
		});
		this.lblGamblerNum = new g.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "0人参加",
			x: 700,
			y: 600,
		});
		// メソッド登録
		this.onLoad.addOnce(this.onLoaded, this);
		this.commandReceived.add(this.onCommandReceived, this);

		/**
		 * シーン読み込み時処理
		 */
		this.onLoad.add(() => {
			// -----------------------------
			// BGM再生
			// -----------------------------
			// const bgm = this.asset.getAudioById("nc298326");
			// this.bgmPlayer = bgm.play();
			// this.bgmPlayer.changeVolume(this.isDebug ? 0.0 : 0.2);
			// -----------------------------
			// 背景
			// -----------------------------
			// new g.FilledRect({
			// 	scene: this,
			// 	width: g.game.width,
			// 	height: g.game.height,
			// 	cssColor: "#600000",
			// 	parent: this,
			// 	opacity: param.isAtsumaru || this.isDebug ? 1.0 : 0.9,
			// });
			// // レイヤー0
			// this.layer0 = new g.E({ scene: this, parent: this, });
			// -----------------------------
			// ビットマップフォント
			// -----------------------------
			// ビットマップフォント(黒)を生成
			// this.font = new g.BitmapFont({
			// 	src: this.asset.getImageById("number"),
			// 	glyphInfo: JSON.parse(this.asset.getTextById("glyph").data),
			// });
			// -----------------------------
			// タイトル
			// -----------------------------
			// const title = new g.Sprite({ scene: this, src: this.asset.getImageById("title") });
			// this.append(title);
			// // タイトルアニメーション
			// this.timeLine
			// 	.create(title)
			// 	.wait(this.isDebug ? 1000 : 3000)
			// 	.moveBy(-1280, 0, 200)
			// 	.call(() => {
			// 		this.sceneMain(param);
			// 	});
			// -----------------------------
			// コンフィグ
			// -----------------------------
			// const config = new Config(this);
			// config.bgmEvent = () => {
			// 	if (!this.isDebug) {
			// 		if (config.frameNumber === 0) {
			// 			this.bgmPlayer.changeVolume(0.2);
			// 		} else {
			// 			this.bgmPlayer.changeVolume(0.0);
			// 		}
			// 	}
			// };
			// -----------------------------
			// セーブデータ表示用ラベル
			// -----------------------------
			// this.saveData = new SaveData(this, 0, g.game.height - 500);
			// title.append(this.saveData);
			// this.saveData.updateSaveData();
		});
	}
	/**
	 * Scene 読み込み時処理
	 */
	private onLoaded(): void {
		const version: string = "ver. 0.01";
		// -----------------------------
		// タイトル
		// -----------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("title"),
			parent: this,
		});
		// -----------------------------
		// バージョン情報
		// -----------------------------
		new g.Label({
			scene: this,
			font: this.font,
			fontSize: 24,
			text: version,
			textColor: "black",
			parent: this,
		});
		// -----------------------------
		// ボタン
		// -----------------------------
		const btnPlayer = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("button"),
			width: 400,
			height: 80,
			x: 200,
			y: 500,
			frames: [4, 5],
			frameNumber: 0,
			touchable: true,
			parent: this,
		});
		btnPlayer.onPointDown.add((ev) => {
			if (btnPlayer.frameNumber === 0) {
				this.send({
					type: titleActionType.entryPlayer,
				});
				btnPlayer.frameNumber = 1;
				btnGambler.touchable = false;
			} else {
				this.send({
					type: titleActionType.erasurePlayer,
				});
				btnPlayer.frameNumber = 0;
				btnGambler.touchable = true;
			}
			btnPlayer.modified();
		});
		const btnGambler = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("button"),
			width: 400,
			height: 80,
			x: 700,
			y: 500,
			frames: [6, 7],
			frameNumber: 0,
			touchable: true,
			parent: this,
		});
		btnGambler.onPointDown.add((ev) => {
			if (btnGambler.frameNumber === 0) {
				this.send({
					type: titleActionType.entryGambler,
				});
				btnGambler.frameNumber = 1;
				btnPlayer.touchable = false;
			} else {
				this.send({
					type: titleActionType.erasureGambler,
				});
				btnGambler.frameNumber = 0;
				btnPlayer.touchable = true;
			}
			btnGambler.modified();
		});
		// -----------------------------
		// ラベル
		// -----------------------------
		this.append(this.lblPlayerNum);
		this.append(this.lblGamblerNum);
	}
	/**
	 * Controller から Command を受信した際の処理
	 * @param command Command
	 */
	private onCommandReceived(command: TitleCommand): void {
		console.log("********TitleScene::onCommandReceived_in");
		console.log("command.type = " + command.type);
		console.log("command.num  = " + command.num);
		// コマンドの種類の判定
		if (command.type === titleCommandType.changePlayerNum) {
			// 選手人数の変更
			if (command.num <= 0) {
				this.lblPlayerNum.text = "0人参加";
			} else {
				this.lblPlayerNum.text = `${command.num}人参加中`;
			}
			this.lblPlayerNum.invalidate();
		} else if (command.type === titleCommandType.changeGamblerNum) {
			// 勝負人数の変更
			if (command.num <= 0) {
				this.lblGamblerNum.text = "0人参加";
			} else {
				this.lblGamblerNum.text = `${command.num}人参加中`;
			}
			this.lblGamblerNum.invalidate();
		}
	}
	/**
	 * 効果音を先生する
	 * @param name 再生するアセットID
	 */
	private playSound(name: string): void {
		(this.asset.getAudioById(name) as g.AudioAsset).play().changeVolume(0.8);
	}
}
