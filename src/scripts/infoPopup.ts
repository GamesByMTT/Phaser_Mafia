import Phaser, { Scene } from "phaser";
import { Globals, initData, ResultData } from "./Globals";
import { gameConfig } from "./appconfig";

const TextStyle =  {color:"#ffffff", fontSize: "40px", fontFamily: 'CarterOne', align:"center", wordWrap:{ width: 300, useAdvancedWrap: true }}
const smallTextStyle =  {color:"#ffffff", fontSize: "22px", fontFamily: 'CarterOne', align:"center", wordWrap:{ width: 200, useAdvancedWrap: true }}

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
    constructor(){
        super({key: 'InfoScene'})
    }
    create(){
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
            if(Globals.SceneHandler?.getScene("InfoScene")){
                Globals.SceneHandler.removeScene("InfoScene")
            }
        });
        this.leftArrow.on('pointerdown', ()=>{
            this.goToPreviousPage();
        })
        this.rightArrow.on('pointerdown', ()=>{
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

        initData.UIData.symbols.forEach((symbol, symbolIndex) => {
            // Get the corresponding infoIcon position
            const iconPosition = infoIcons[symbolIndex];

            if (!iconPosition) return; // Avoid undefined positions
            
            symbol.multiplier.forEach((multiplierValueArray, multiplierIndex, array) => {
                if (Array.isArray(multiplierValueArray)) {
                    const multiplierValue = multiplierValueArray[0];
                    if (multiplierValue > 0) {  // Skip the loop iteration if multiplierValue is 0
                        // Determine the text (e.g., '5x', '4x', '2x')
                        // const prefix = [5, 4, 3][multiplierIndex]; // Customize this if needed
                        const prefix = (5 - multiplierIndex) + "x"; // No need for an array lookup
                        // console.log(multiplierValue, "multiplierValue");
                        let text = `${prefix} - ${multiplierValue} \n`;            
                        // Create the text object
                        const textObject = this.add.text(
                            iconPosition.x, // X position (you might want to offset this)
                            iconPosition.y + multiplierIndex * 60, // Y position (spacing between lines)
                            text,
                            { fontFamily: "CarterOne", fontSize: '40px', color: '#fff' } // Customize text style
                        );
                        // Optionally adjust the position further based on requirements
                        textObject.setLineSpacing(100)
                        textObject.setOrigin(0, 0.5); // Center the text if needed
                        this.pages[1].add(textObject);
                    }
                }
            });
        });
        this.pages[1].add([symbol1, symbol2, symbol3, symbol4]);
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
        const symbols7Text = this.add.text(1110, 520, "100 \n 50 \n 20", TextStyle)
        symbols7Text.setLineSpacing(25)
        const symbol8 = this.add.sprite(1400, 400, "inofIcon8").setScale(0.75)
        const prefix8 = this.add.sprite(1350, 620, "prefix").setOrigin(0.5)
        const symbols8Text = this.add.text(1410, 520, "100 \n 50 \n 20", TextStyle)
        symbols8Text.setLineSpacing(25)
      
        // const BonusSceneHeading = this.add.text(this.scale.width/2.3, 300, "BONUS GAME", {fontFamily:"crashLandingItalic", color: "#ffffff", fontSize: "80px"})

        // const bonusGameImg = this.add.sprite(this.scale.width/2.9, 550, "BonusScenegame").setScale(0.25)

        // const BonusSceneDescription = this.add.text(this.scale.width/1.95, 430, "Triggers bonus game if 5 icons appear anywhere on the result matrix.", {fontFamily:"crashLandingItalic", align:"center", color: "#ffffff", fontSize: "60px", wordWrap:{ width: 600, useAdvancedWrap: true }})
        
        this.pages[2].add([symbol5, prefix5, symbols5Text, symbol6, prefix6, symbols6Text, symbol7, prefix7,  symbols7Text, symbol8, prefix8, symbols8Text])
        this.pageviewContainer.add(this.pages[2]);

        this.pages[3] = this.add.container(0, 0);  // Position off-screen initially

        // const riskGameHeading = this.add.text(this.scale.width/2.3, 270, "Risk Game", {fontFamily:"crashLandingItalic", color: "#ffffff", fontSize: "80px"})

        // const riskGameImg = this.add.sprite(this.scale.width/2.9, 550, "riskGameimage").setScale(0.25)

        // const riskGameDescription = this.add.text(this.scale.width/1.95, 385, `The player can click the "Double" Button After a win to activate the risk game.  the player faces off against the dealer with the total four cards. the player selects one of three face-down cards first, then the dealer reveals their card, if the player chosen card is higher in value than the delear's card, the players winnings are doubled. If not then player receives nothing.`, {fontFamily:"crashLandingItalic", align:"center", color: "#ffffff", fontSize: "40px", wordWrap:{ width: 550, useAdvancedWrap: true }})
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
}