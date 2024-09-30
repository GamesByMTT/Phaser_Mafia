import { Scene } from 'phaser';
import { Slots } from '../scripts/Slots';
import { UiContainer } from '../scripts/UiContainer';
import { LineGenerator } from '../scripts/Lines';
import { UiPopups } from '../scripts/UiPopup';
import LineSymbols from '../scripts/LineSymbols';
import BonusScene from './BonusScene';

import { 
    Globals, 
    ResultData, 
    currentGameData, 
    initData, 
    gambleResult 
} from '../scripts/Globals';
import { gameConfig } from '../scripts/appconfig';
import SoundManager from '../scripts/SoundManager';

export default class MainScene extends Scene {
    // Declare properties without explicit initialization
    gameBg!: Phaser.GameObjects.Sprite;
    slot!: Slots;
    logo!: Phaser.GameObjects.Sprite
    reelBg!: Phaser.GameObjects.Sprite
    lineGenerator!: LineGenerator;
    soundManager!: SoundManager;
    uiContainer!: UiContainer;
    uiPopups!: UiPopups;    
    lineSymbols!: LineSymbols;
    private mainContainer!: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Container for better organization and potential performance
        this.mainContainer = this.add.container();

        this.soundManager = new SoundManager(this);
        console.log("MainScene Loaded on Mafia");

        this.gameBg = this.add.sprite(width / 2, height / 2, 'gameBg')
            .setDepth(0)
        this.reelBg = this.add.sprite(width/2, height/2.2, "reelBg").setScale(0.85);
        const lamp = this.add.sprite(width/2, height/2.2, "lamp").setScale(0.85)
        this.logo = this.add.sprite(width/2, gameConfig.scale.height * 0.09, "mafiaLogo")
        const pumpLeftImage = this.add.sprite(width/4.6, height * 0.85, "pump")
        const pumpRightImage = this.add.sprite(width/1.3, height * 0.85, "pump")
        this.mainContainer.add([this.gameBg, this.reelBg, lamp, this.logo, pumpLeftImage, pumpRightImage]);
        this.soundManager.playSound("backgroundMusic");

        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack(), this.soundManager);
        this.mainContainer.add(this.uiContainer);

        this.slot = new Slots(this, this.uiContainer, () => this.onResultCallBack(), this.soundManager);
        this.lineGenerator = new LineGenerator(this, this.slot.slotSymbols[0][0].symbol.height, this.slot.slotSymbols[0][0].symbol.width );
        this.mainContainer.add([this.lineGenerator,  this.slot]);

        this.uiPopups = new UiPopups(this, this.uiContainer, this.soundManager);
        this.mainContainer.add(this.uiPopups);
        this.lineSymbols = new LineSymbols(this, 10, 12, this.lineGenerator);
        this.mainContainer.add(this.lineSymbols);
     
    }

    update(time: number, delta: number) {
        this.uiContainer.update();
    }

    private onResultCallBack() {
        this.uiContainer.onSpin(false);
        this.soundManager.stopSound("onSpin"); 
        this.lineGenerator.showLines(ResultData.gameData.linesToEmit);
    }

    private onSpinCallBack() {
        this.soundManager.playSound("onSpin");
        this.slot.moveReel();
        this.lineGenerator.hideLines();
    }

    recievedMessage(msgType: string, msgParams: any) {
        if (msgType === 'ResultData') {
            // Use setTimeout for better performance in this case
            setTimeout(() => {
                this.handleResultData();
            }, 3000); 

            // Stop tween after a delay for visual effect
            setTimeout(() => {
                this.slot.stopTween();
            }, 1000);
        } else if (msgType === 'GambleResult') {
            this.uiContainer.currentWiningText.updateLabelText(gambleResult.gamleResultData.currentWining.toString());
        }
    }

    // Handle ResultData logic separately
    private handleResultData() {

        if (ResultData.gameData.isBonus) {
            if (this.uiContainer.isAutoSpinning) {
                this.uiContainer.autoBetBtn.emit('pointerdown');
                this.uiContainer.autoBetBtn.emit('pointerup'); 
            }
            Globals.SceneHandler?.addScene('BonusScene', BonusScene, true);
        }

        this.uiContainer.currentWiningText.updateLabelText(ResultData.playerData.currentWining.toString());
        currentGameData.currentBalance = ResultData.playerData.Balance;
        let betValue = (initData.gameData.Bets[currentGameData.currentBetIndex]) * 20;
        let winAmount = ResultData.gameData.WinAmout;
        let jackpot = ResultData.gameData.jackpot
        this.uiContainer.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
        if (winAmount >= 10 * betValue && winAmount < 15 * betValue) {
            // Big Win Popup
            this.showWinPopup(winAmount, 'bigWinPopup')
           } else if (winAmount >= 15 * betValue && winAmount < 20 * betValue) {
               // HugeWinPopup
               this.showWinPopup(winAmount, 'hugeWinPopup')
           } else if (winAmount >= 20 * betValue && winAmount < 25 * betValue) {
               //MegawinPopup
               this.showWinPopup(winAmount, 'megaWinPopup')
           } else if(jackpot > 0) {
              //jackpot Condition
              this.showWinPopup(winAmount, 'jackpotPopup')
           }
    }

    // Function to show win popup
    private showWinPopup(winAmount: number, spriteKey: string) {
        const inputOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.85)
            .setOrigin(0, 0)
            .setDepth(9)
            .setInteractive();

        inputOverlay.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation(); 
        });
        const winSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 100, spriteKey).setDepth(13);
        const winAmountPanel = this.add.sprite(gameConfig.scale.width/2.05, gameConfig.scale.height/1.15 , "recieveButton").setDepth(11)
            // winAmountPanel.setPosition()
            winAmountPanel.setOrigin(0.5)
    
            // Create the text object to display win amount
            const winText = this.add.text(this.cameras.main.centerX, gameConfig.scale.height/1.4, '0', {
                font: '70px',
                color: '#FFFFFF',
                fontFamily: "CarterOne"
            }).setDepth(11).setOrigin(0.5);
            const winDollar = this.add.text(this.cameras.main.centerX - 95, gameConfig.scale.height/1.4, '$', {
                font: '70px',
                color: '#FFFFFF',
                fontFamily: "CarterOne"
            }).setDepth(11).setOrigin(0.5);

            this.tweens.add({
                targets: winSprite,
                scale: 1.2,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: 200 
            });
    
            // Tween to animate the text increment from 0 to winAmount
            this.tweens.addCounter({
                from: 0,
                to: winAmount,
                duration: 1000, // Duration of the animation in milliseconds
                onUpdate: (tween) => {
                    const value = Math.floor(tween.getValue());
                    winText.setText(value.toString());
                },
                onComplete: () => {
                    // Automatically close the popup after a few seconds
                    this.time.delayedCall(4000, () => {
                        inputOverlay.destroy();
                        winDollar.destroy();
                        winAmountPanel.destroy();
                        winText.destroy();
                        winSprite.destroy();
                    });
                }
            });

    }

}
