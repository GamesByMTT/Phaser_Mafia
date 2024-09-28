import Phaser from "phaser";
import { initData } from "./Globals";
import { gameConfig } from "./appconfig";

let xOffset = -1;
let yOffset = -1;

export class LineGenerator extends Phaser.GameObjects.Container {
    lineArr: Lines[] = [];
    numberArr: Phaser.GameObjects.Text[] = [];

    constructor(scene: Phaser.Scene, yOf: number, xOf: number) {
        super(scene);
        xOffset = xOf;
        yOffset = yOf;

        // Create lines based on initData
        for (let i = 0; i < initData.gameData.Lines.length; i++) {
            let line = new Lines(scene, i);
            this.add(line);
            this.lineArr.push(line);
        }
        this.setPosition(gameConfig.scale.width / 4.25, gameConfig.scale.height/2.9);
        // Add this Container to the scene
        scene.add.existing(this);
    }


    showLines(lines: number[]) {
        // console.log(lines, "lines");
        
        lines.forEach(lineIndex => {
            if (lineIndex >= 0 && lineIndex < this.lineArr.length) {
                // console.log(this.lineArr[lineIndex], "this.lineArr[lineIndex]");
                this.lineArr[lineIndex].showLine(lineIndex);
            }
        });
    }

    hideLines() {
        this.lineArr.forEach(line => line.hideLine());
    }
}

export class Lines extends Phaser.GameObjects.Container {
    lineSprites: Phaser.GameObjects.Sprite[] = [];
    lineGraphics: Phaser.GameObjects.Graphics[] = [];

    constructor(scene: Phaser.Scene, index: number) {
        super(scene);
        for (let i = 0; i < 9; i++) {
            const lineSprite = this.createLineSprite(scene, i);
            this.lineSprites.push(lineSprite);
            this.add(lineSprite);
        }
        this.hideLine();
        scene.add.existing(this);
    }

    createLineSprite(scene: Phaser.Scene, index: number): Phaser.GameObjects.Sprite {
        const numberContainer = new Phaser.GameObjects.Container(scene);
        let lineSprite: Phaser.GameObjects.Sprite;
        let yPosition: number;

        switch (index) {
            case 0:
                yPosition = (index / 2) * 140 - 520;
                break;
            case 1:
                yPosition = index * 170 - 520;
                break;
            case 2:
                yPosition = index * 155 - 520;
                break;
            case 3:
                yPosition = index * 50 - 520;
                break;
            case 4:
                yPosition = (index / 2) * 140 - 520;
                break;
            case 5:
                yPosition = index * 83 - 520;
                break;
            case 6:
                yPosition = index * 42 - 520;
                break;
            case 7:
                yPosition = index * 55 - 520;
                break;
            case 8:
                yPosition = (index / 2) * 140 - 520;
                break;
            default:
                yPosition = 0; // Default position if index is out of range
                break;
        }

        // For left side sprites
        lineSprite = scene.add.sprite(gameConfig.scale.width / 1.75, yPosition + 380, `line${index}`);
        lineSprite.setOrigin(1, 0.5);
        lineSprite.setScale(0.9, 0.9);
        lineSprite.setVisible(false);

        return lineSprite;
    }

    showLine(index: number) {    
        // Hide all sprites first
        this.hideLine();
        if (index >= 0 && index < this.lineSprites.length) {
            this.lineSprites[index].setVisible(true);
        }
    }

    hideLine() {
        this.lineSprites.forEach(sprite => sprite.setVisible(false));
    }
}
