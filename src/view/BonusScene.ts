import Phaser, { Scene } from "phaser";
import { Globals, ResultData } from "../scripts/Globals";
import SoundManager from "../scripts/SoundManager";

export default class BonusScene extends Scene {
    public bonusContainer!: Phaser.GameObjects.Container;
    SoundManager!: SoundManager; 
    SceneBg!: Phaser.GameObjects.Sprite;
    winBg!: Phaser.GameObjects.Sprite;
    private spriteObjects: Phaser.GameObjects.Sprite[] = [];
    private spriteNames: string[][] = []; 
    private clickAnimations: string[][] = []; // Array for click animations
    private gemObjects: Phaser.GameObjects.Sprite[] = [];
    private bonusResults: string[] = ['20', '40', '30', '50', '0', "10"]; 
    private totalWinAmount: number = 0;
    private winamountText!: Phaser.GameObjects.Text;
    panelBg!: Phaser.GameObjects.Sprite
    private isSpriteClicked: boolean = false;
    private suitcasePositions: { x: number, y: number }[] = [];

    constructor() {
        super({ key: 'BonusScene' });
        this.SoundManager = new SoundManager(this); 
    }

    create() {
        const { width, height } = this.cameras.main;
        this.bonusContainer = this.add.container();
        // this.SoundManager.playSound("bonusBg");

        this.SceneBg = new Phaser.GameObjects.Sprite(this, width / 2, height / 2, 'BonusBgImage')
            .setDisplaySize(width, height)
            .setDepth(11)
            .setInteractive();
        this.SceneBg.on('pointerdown', (pointer:Phaser.Input.Pointer)=>{
            pointer.event.stopPropagation();
        })
        this.winBg = new Phaser.GameObjects.Sprite(this, width * 0.5, height * 0.1, "bonusLogo").setScale(0.8);
        const gunLeft = new Phaser.GameObjects.Sprite(this, width/7, height/2, "gunLeft");
        const gunRight = new Phaser.GameObjects.Sprite(this, width/1.1, height/2, "gunRight");

        this.bonusContainer.add([this.SceneBg, this.winBg, gunLeft, gunRight]);

        this.suitcasePositions = [
            { x: 600, y: 550 },
            { x: 1000, y: 550 },
            { x: 1380, y: 550 },
            { x: 600, y: 875 },
            { x: 1000, y: 875 },
            { x: 1380, y: 875 }
        ];

        // Define animation frames 
        this.spriteNames = [
            ['closedSuitCase'], 
            ['closedSuitCase'],
            ['closedSuitCase'],
            ['closedSuitCase'],
            ['closedSuitCase'],
            ['closedSuitCase']
        ];

        this.suitcasePositions.forEach((position, index) => {
            const symbolIndex = index % this.spriteNames.length; 
            const sprite = this.add.sprite(position.x, position.y, this.spriteNames[symbolIndex][0]) 
                .setInteractive()
                .setScale(0.8)
                .setDepth(11);

            sprite.setData('value', ResultData.gameData.BonusResult[index]);
            // sprite.setData('value', this.bonusResults[index]);
            sprite.setData('symbolIndex', symbolIndex); 
            sprite.on('pointerdown', () => this.handleGemClick(sprite, position.x, position.y)); 
            this.gemObjects.push(sprite);
            this.spriteObjects.push(sprite);
        });

        // this.createTweenAnimations(); 

        // // Define click animation frames
        this.clickAnimations = [
            ['openSuitCase0', 'openSuitCase1', 'openSuitCase2', 'openSuitCase3', 'openSuitCase4', 'openSuitCase5', 'openSuitCase6', 'openSuitCase7', 'openSuitCase8', 'openSuitCase9', 'openSuitCase10'],
            ['openSuitCase0', 'openSuitCase1', 'openSuitCase2', 'openSuitCase3', 'openSuitCase4', 'openSuitCase5', 'openSuitCase6', 'openSuitCase7', 'openSuitCase8', 'openSuitCase9', 'openSuitCase10'],
            ['openSuitCase0', 'openSuitCase1', 'openSuitCase2', 'openSuitCase3', 'openSuitCase4', 'openSuitCase5', 'openSuitCase6', 'openSuitCase7', 'openSuitCase8', 'openSuitCase9', 'openSuitCase10'],
            ['openSuitCase0', 'openSuitCase1', 'openSuitCase2', 'openSuitCase3', 'openSuitCase4', 'openSuitCase5', 'openSuitCase6', 'openSuitCase7', 'openSuitCase8', 'openSuitCase9', 'openSuitCase10'],
            ['openSuitCase0', 'openSuitCase1', 'openSuitCase2', 'openSuitCase3', 'openSuitCase4', 'openSuitCase5', 'openSuitCase6', 'openSuitCase7', 'openSuitCase8', 'openSuitCase9', 'openSuitCase10'],
            ['openSuitCase0', 'openSuitCase1', 'openSuitCase2', 'openSuitCase3', 'openSuitCase4', 'openSuitCase5', 'openSuitCase6', 'openSuitCase7', 'openSuitCase8', 'openSuitCase9', 'openSuitCase10'],
        ];
        this.createTweenAnimations(); 
    }

    private handleGemClick(sprite: Phaser.GameObjects.Sprite, x: number, y: number): void {

        
        const valueText = sprite.getData('value');
        const value = parseInt(valueText);
        console.log(value, valueText, "fvdfrfrtyhrt");
        this.totalWinAmount += value;
        // this.winamountText.setText(this.totalWinAmount.toString());

        this.tweens.getTweensOf(sprite).forEach(tween => tween.stop()); 
        const symbolIndex = sprite.getData('symbolIndex');
        const clickAnimationFrames = this.clickAnimations[symbolIndex]; 

        this.isSpriteClicked = true;

        sprite.setVisible(false);  

        const animSprite = this.add.sprite(x, y-20, clickAnimationFrames[0]).setDepth(12); 
        let finalFramePosition = { x, y };

        const centerSprite = this.add.sprite(x, y-20, value === 0 ? 'centerEmpty' : 'centerMoney')
        .setDepth(11)
        .setAlpha(1);  // Start with alpha 0 to fade it in later

    
        this.tweens.addCounter({
            from: 0,
            to: clickAnimationFrames.length - 1,
            duration: 1000, 
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const frameIndex = Math.floor(tween.getValue());
                animSprite.setTexture(clickAnimationFrames[frameIndex]);
                finalFramePosition = { x: animSprite.x, y: animSprite.y - 80 };
            },
            onComplete: () => {
                let text = this.add.text(finalFramePosition.x, finalFramePosition.y + 100, `+${valueText}`, { font: "80px", color: "#fff", fontFamily:"CarterOne"}).setOrigin(0.5).setDepth(16);
                if (value === 0) {
                    text.destroy();
                    text = this.add.text(finalFramePosition.x, finalFramePosition.y + 100, "GameOver", { font: "60px", color: "#fff", fontFamily:"CarterOne"}).setOrigin(0.5).setDepth(16);
                    setTimeout(() => {
                        this.SoundManager.pauseSound("bonusBg");
                        Globals.SceneHandler?.removeScene("BonusScene"); 
                    }, 1000);
                } else {
                    this.SoundManager.playSound("bonusWin");
                }

                this.tweens.add({
                    targets: text,
                    alpha: 0, 
                    duration: 900,
                    delay: 900, 
                    onComplete: () => {
                        text.destroy(); 
                    }
                });
                sprite.destroy();
                // animSprite.destroy();
            }
        });
    }

    private createTweenAnimations(): void {
        this.spriteObjects.forEach((sprite, index) => {
            const symbolFrames = this.spriteNames[sprite.getData('symbolIndex')];
            this.tweens.addCounter({
                from: 0,
                to: symbolFrames.length - 1,
                duration: 1000, 
                repeat: -1, 
                onUpdate: (tween: Phaser.Tweens.Tween) => {
                    if (!this.isSpriteClicked) { // Only update if not clicked
                        const frameIndex = Math.floor(tween.getValue());
                        sprite.setTexture(symbolFrames[frameIndex]);
                    }
                }
            });
        });
    }
}