import Phaser, { Scene } from "phaser";
import { Globals, initData, ResultData } from "./Globals";
import { gameConfig } from "./appconfig";
import SoundManager from "./SoundManager";

const TextStyle =  {color:"#ffffff", fontSize: "40px", fontFamily: 'CarterOne', align:"center", wordWrap:{ width: 300, useAdvancedWrap: true }}
const smallTextStyle =  {color:"#ffffff", fontSize: "22px", fontFamily: 'CarterOne', align:"center", wordWrap:{ width: 200, useAdvancedWrap: true }}
const bonusTextStyle =  {color:"#ffffff", fontSize: "40px", fontFamily: 'CarterOne', align:"left", wordWrap:{ width: 550, useAdvancedWrap: true }}

export default class InfoScene extends Scene{
    pageviewContainer!: Phaser.GameObjects.Container;
    popupBackground!: Phaser.GameObjects.Sprite
    SceneBg!: Phaser.GameObjects.Sprite
    Symbol1!: Phaser.GameObjects.Sprite
    leftArrow!: Phaser.GameObjects.Sprite
    rightArrow!: Phaser.GameObjects.Sprite
    infoCross!: Phaser.GameObjects.Sprite
    currentPageIndex: number = 0;
    pages: Phaser.GameObjects.Container[] = [];
    soundManager!: SoundManager;
    constructor(){
        super({key: 'InfoScene'})
    }
    create(){
        this.soundManager = new SoundManager(this);
        const {width, height} =  this.cameras.main
        this.SceneBg = new Phaser.GameObjects.Sprite(this, width / 2, height / 2, 'winTableBg')
        .setDisplaySize(width, height)
        .setDepth(11)
        .setInteractive();
        this.SceneBg.on('pointerdown', (pointer:Phaser.Input.Pointer)=>{
            pointer.event.stopPropagation();
        })
        this.pageviewContainer = this.add.container();
        this.popupBackground = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width/2, gameConfig.scale.height/2, "PopupBackground");
        this.pageviewContainer.add(this.popupBackground)
        this.leftArrow = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.12, gameConfig.scale.height/2, "leftArrow").setInteractive();
        this.rightArrow = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.88, gameConfig.scale.height/2, "rightArrow").setInteractive();
        this.infoCross = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.9, gameConfig.scale.height * 0.06, "exitButton").setInteractive()
        const winHeading = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width/2, gameConfig.scale.height * 0.18, "winTableHeading");
        this.infoCross.on('pointerdown', ()=>{
            this.buttonMusic("buttonpressed")
            if(Globals.SceneHandler?.getScene("InfoScene")){
                Globals.SceneHandler.removeScene("InfoScene")
            }
        });
        this.leftArrow.on('pointerdown', ()=>{
            this.buttonMusic("buttonpressed")
            this.goToPreviousPage();
        })
        this.rightArrow.on('pointerdown', ()=>{
            this.buttonMusic("buttonpressed")
            this.goToNextPage()
        })
        this.pageviewContainer.add([this.SceneBg, winHeading, this.leftArrow, this.rightArrow, this.infoCross])
        this.pages = []
        this.createPages()

    }
    createPages() {
        // Create pages and add content
        this.pages[1] = this.add.container(0, 0);
        const symbol1 = this.add.sprite(550, 400, "inofIcon1").setScale(0.75)
        const symbol2 = this.add.sprite(850, 400, "inofIcon2").setScale(0.75)
        const symbol3 = this.add.sprite(1120, 400, "inofIcon3").setScale(0.75)
        const symbol4 = this.add.sprite(1400, 400, "inofIcon4").setScale(0.75)

        const infoIcons = [
            { x: 450, y: 600 }, // Position for infoIcon2
            { x: 750, y: 600 }, // Position for infoIcon3
            { x: 1050, y: 600 }, //
            { x: 1300, y: 600 }, //
        ]

        const prefix1 = this.add.sprite(450, 620, "prefix").setOrigin(0.5)
        const symbols1Text = this.add.text(510, 520, "100 \n 50 \n 20", TextStyle)
        symbols1Text.setLineSpacing(25)
        const prefix2 = this.add.sprite(750, 620, "prefix").setOrigin(0.5)
        const symbols2Text = this.add.text(810, 520, "150 \n 100 \n 40", TextStyle)
        symbols2Text.setLineSpacing(25)
        const prefix3 = this.add.sprite(1050, 620, "prefix").setOrigin(0.5)
        const symbols3Text = this.add.text(1110, 520, "100 \n 50 \n 20", TextStyle)
        symbols3Text.setLineSpacing(25)
        const prefix4 = this.add.sprite(1350, 620, "prefix").setOrigin(0.5)
        const symbols4Text = this.add.text(1410, 520, "100 \n 50 \n 20", TextStyle)
        symbols4Text.setLineSpacing(25)

    
        this.pages[1].add([symbol1, prefix1, symbols1Text, symbol2, prefix2, symbols2Text, symbol3, prefix3, symbols3Text, symbol4, prefix4, symbols4Text]);
        this.pageviewContainer.add(this.pages[1]);

        this.pages[2] = this.add.container(0, 0);  // Position off-screen initially

        const symbol5 = this.add.sprite(500, 400, "inofIcon5").setScale(0.75)
        const prefix5 = this.add.sprite(450, 620, "prefix").setOrigin(0.5)
        const symbols5Text = this.add.text(510, 520, "100 \n 50 \n 20", TextStyle)
        symbols5Text.setLineSpacing(25)
        const symbol6 = this.add.sprite(800, 400, "inofIcon6").setScale(0.75)
        const prefix6 = this.add.sprite(750, 620, "prefix").setOrigin(0.5)
        const symbols6Text = this.add.text(810, 520, "150 \n 100 \n 40", TextStyle)
        symbols6Text.setLineSpacing(25)
        const symbol7 = this.add.sprite(1100, 400, "inofIcon7").setScale(0.75)
        const prefix7 = this.add.sprite(1050, 620, "prefix").setOrigin(0.5)
        const symbols7Text = this.add.text(1110, 520, "150 \n 100 \n 40", TextStyle)
        symbols7Text.setLineSpacing(25)
        const symbol8 = this.add.sprite(1400, 400, "inofIcon8").setScale(0.75)
        const prefix8 = this.add.sprite(1350, 620, "prefix").setOrigin(0.5)
        const symbols8Text = this.add.text(1410, 520, "150 \n 100 \n 40", TextStyle)
        symbols8Text.setLineSpacing(25)
      
        this.pages[2].add([symbol5, prefix5, symbols5Text, symbol6, prefix6, symbols6Text, symbol7, prefix7,  symbols7Text, symbol8, prefix8, symbols8Text])
        this.pageviewContainer.add(this.pages[2]);

        this.pages[3] = this.add.container(0, 0);  // Position off-screen initially

        const symbol9 = this.add.sprite(500, 400, "inofIcon9").setScale(0.75)
       
        const symbols9Text = this.add.text(410, 520, "Triggres bonus game if 4 or 5 symbols appear in anywhere in reel.", smallTextStyle)
        symbols5Text.setLineSpacing(25)
        const symbol10 = this.add.sprite(800, 400, "inofIcon10").setScale(0.75)
       
        const symbols10Text = this.add.text(700, 520, "Substitutes for all symbols except Jackpot, Bonus and Scatter.", smallTextStyle)
        symbols6Text.setLineSpacing(25)
        const symbol11 = this.add.sprite(1100, 400, "inofIcon11").setScale(0.75)
        
        const symbols11Text = this.add.text(1020, 520, "Scatter offers higher payouts when 4 or 5 symbols appear anywhere on the result matrix. Payout 5x - 600, 4x - 400", smallTextStyle)
        symbols7Text.setLineSpacing(25)
        const symbol12 = this.add.sprite(1400, 400, "inofIcon12").setScale(0.75)
        
        const symbols12Text = this.add.text(1300, 520, "Megawin triggered by 5 jackpot symbols anywhere on the result matrix. Payout : 5000X", smallTextStyle)
        symbols8Text.setLineSpacing(25)

        this.pages[3].add([symbol9, symbols9Text, symbol10, symbols10Text, symbol11, symbols11Text, symbol12, symbols12Text])

        this.pageviewContainer.add(this.pages[3]);

        this.pages[4] = this.add.container(0, 0);  // Position off-screen initially

        const riskGameHeading = this.add.text(this.scale.width/2.6, 270, "Bonus Game", {fontFamily:"CarterOne", color: "#ffffff", fontSize: "80px"})

        const riskGameImg = this.add.sprite(this.scale.width/2.9, 550, "bonusSceneInfo").setScale(0.5)

        const riskGameDescription = this.add.text(this.scale.width/2, 400, `In this game , you'll se six similar suitcases. Select them one by one o reveal your prize until game is over.`, bonusTextStyle)
        
        this.pages[4].add([riskGameHeading, riskGameImg, riskGameDescription])

        this.pageviewContainer.add(this.pages[4]);

        this.pages = [this.pages[1], this.pages[2], this.pages[3], this.pages[4]];
        this.currentPageIndex = 0;
        
        // Set initial visibility 
        this.pages.forEach((page, index) => {
            page.setVisible(index === this.currentPageIndex);
        });
    }

    goToNextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.pages[this.currentPageIndex].setVisible(false);
            this.currentPageIndex++;
            this.pages[this.currentPageIndex].setVisible(true);
        }
    }

    goToPreviousPage() {
        if (this.currentPageIndex > 0) {
            this.pages[this.currentPageIndex].setVisible(false);
            this.currentPageIndex--;
            this.pages[this.currentPageIndex].setVisible(true);
        }
    }
    buttonMusic(key: string){
        this.soundManager.playSound(key)
    }
}