import {
    _decorator,
    instantiate,
    Component,
    Node,
    Prefab,
    Sprite,
    Button,
    Vec3,
    Collider2D,
    Contact2DType,
    PhysicsSystem2D,
    IPhysics2DContact,
    systemEvent,
    SystemEvent,
    EventTouch,
    EventMouse,
    Touch,
    SpriteFrame,
    Label,
    AudioClip,
    view,
    tween,
    UIOpacity,
    AnimationComponent,
    Game,
    director,
    UITransform,
} from "cc";
const { ccclass, property } = _decorator;

export enum GameStatus {
    Game_Ready = 0,
    Game_Playing,
    Game_Over,
    Game_Loading,
}

const FIRST_OBSTACLE_DISTANCE = 500;
const OBSTACLE_SPACING = 600;
const OBSTACLE_SPEED = 3.0;
const JUMP_SPEED = 7;
const GRAVITY = 0.3;
const MAX_Y = 120;
const MIN_Y = -120;
const FADE_SECONDS = 0.5;
const SPEED_MULTIPLIER = 1.01;

@ccclass("MainScript")
export class MainScript extends Component {

    @property(Node)
    backgroundLayer: Node = null;
    @property(Node)
    background: Node = null;
    clouds: Node[] = [];
    @property(Prefab)
    cloudPrefab: Prefab = null;
    @property(SpriteFrame)
    cloudImages: SpriteFrame[] = [];
    @property(Node)
    shade: Node = null;

    @property(Node)
    plane: Node = null;
    planeSpeed = 0;
    touching = false;

    @property(Node)
    coin: Node = null;

    @property(Prefab)
    pipePrefab: Prefab = null;
    obstacles: Node[] = [null, null, null];
    @property(SpriteFrame)
    obstacleImages: SpriteFrame[] = [];
    last_image: SpriteFrame = null;

    @property(Node)
    readyLayer: Node = null;
    @property(Node)
    gameOverLayer: Node = null;
    @property(Button)
    btnStart: Button = null;
    @property(Button)
    btnCredits: Button = null;
    @property(Button)
    btnInstructions: Button = null;
    @property(Button)
    btnPlayAgain: Button = null;
    @property(Label)
    scoreLabel: Label = null;
    score: number = 0;
    @property(Label)
    gameOverScoreLabel: Label = null;
    @property(Label)
    gameOverHighScoreLabel: Label = null;
    @property(Label)
    playHighScoreLabel: Label = null;

    @property({type: AudioClip})
    backgroundMusic: AudioClip = null;
    @property({type: AudioClip})
    pointSound: AudioClip = null;
    @property({type: AudioClip})
    fallSound: AudioClip = null;
    // sound effect when bird flying
    // @property({type:cc.AudioClip})
    // flySound: cc.AudioClip = null;
    // flySound.playOneShot()

    // @property({type:cc.AudioClip})
    // scoreSound: cc.AudioClip = null;

    // @property({type:cc.AudioClip})
    // dieSound: cc.AudioClip = null;
    
    gameStatus: GameStatus = GameStatus.Game_Loading; 
    
    // Define the state all objects should be in when starting each status
    setStatus(event, status: GameStatus) {
        status = parseInt(status.toString())
        this.gameStatus = status
        if (status === GameStatus.Game_Loading) {
            this.coin.setPosition(-view.getVisibleSize().x, 0)
            this.plane.setPosition(-view.getVisibleSize().x/2 - (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x/2), 0);
            this.plane.setRotationFromEuler(new Vec3(0, 0, 0));
            this.readyLayer.getComponent(UIOpacity).opacity = 0;
            this.btnStart.interactable = false;
            this.btnStart.enabled = false;
            this.btnInstructions.interactable = false;
            this.btnInstructions.enabled = false;
            this.btnCredits.interactable = false;
            this.btnCredits.enabled = false;
            let gameoverOpacity = this.gameOverLayer.getComponent(UIOpacity);
            tween(gameoverOpacity).to(FADE_SECONDS, { opacity: 0 }).start();
            this.btnPlayAgain.interactable = false;
            this.btnPlayAgain.enabled = false;
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                tween(op).to(FADE_SECONDS, { opacity: 0 }).start();
            }
            this.score = 0
            this.scoreLabel.string = this.score.toString()
            this.scoreLabel.node.active = false;
        } else if (status === GameStatus.Game_Ready) {
            this.coin.setPosition(-view.getVisibleSize().x, 0)
            this.plane.setPosition(-view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2), 0);
            this.plane.setRotationFromEuler(new Vec3(0, 0, 0));
            tween(this.readyLayer.getComponent(UIOpacity)).to(FADE_SECONDS, { opacity: 255 }).start();
            this.btnStart.interactable = true;
            this.btnStart.enabled = true;
            this.btnInstructions.interactable = true;
            this.btnInstructions.enabled = true;
            this.btnCredits.interactable = true;
            this.btnCredits.enabled = true;
            let gameoverOpacity = this.gameOverLayer.getComponent(UIOpacity);
            gameoverOpacity.opacity = 0;
            this.btnPlayAgain.interactable = false;
            this.btnPlayAgain.enabled = false;
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                op.opacity = 0;
            }
            this.scoreLabel.node.active = false;
            this.playHighScoreLabel.string = "High Score: " + this.getHighscore()
        } else if (status === GameStatus.Game_Playing) {
            this.plane.setPosition(-view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2), 0);
            this.plane.setRotationFromEuler(new Vec3(0, 0, 0));
            tween(this.readyLayer.getComponent(UIOpacity)).to(FADE_SECONDS, { opacity: 0 }).start();
            this.btnStart.interactable = false;
            this.btnStart.enabled = false;
            this.btnInstructions.interactable = false;
            this.btnInstructions.enabled = false;
            this.btnCredits.interactable = false;
            this.btnCredits.enabled = false;
            let gameoverOpacity = this.gameOverLayer.getComponent(UIOpacity);
            gameoverOpacity.opacity = 0;
            this.btnPlayAgain.interactable = false;
            this.btnPlayAgain.enabled = false;
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                op.opacity = 255;
            }
            this.scoreLabel.node.active = true;

            for (let i = 0; i < this.obstacles.length; i++) {
                this.setupObstacle(i, true)
            }
            this.setupCoin()

            this.score = 0
            this.scoreLabel.string = this.score.toString()
            this.planeSpeed = JUMP_SPEED
        } else if (status === GameStatus.Game_Over) {
            this.coin.setPosition(-view.getVisibleSize().x, 0)
            this.readyLayer.getComponent(UIOpacity).opacity = 0;
            this.btnStart.interactable = false;
            this.btnStart.enabled = false;
            this.btnInstructions.interactable = false;
            this.btnInstructions.enabled = false;
            this.btnCredits.interactable = false;
            this.btnCredits.enabled = false;
            let gameoverOpacity = this.gameOverLayer.getComponent(UIOpacity);
            tween(gameoverOpacity).to(FADE_SECONDS, { opacity: 255 }).start();
            this.btnPlayAgain.interactable = true;
            this.btnPlayAgain.enabled = true;
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                op.opacity = 255;
            }
            this.scoreLabel.node.active = false;
            this.planeSpeed = 0
            this.gameOverScoreLabel.string = "Score: " + this.score.toString()
            this.gameOverHighScoreLabel.string = "High Score: " + this.getHighscore()
        }
    }

    onLoad() {
        // Start Music
        this.backgroundMusic.setLoop(true);
        this.backgroundMusic.play();
        // Setup listeners
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(
                Contact2DType.BEGIN_CONTACT,
                this.onBeginContact,
                this
                );
            }
        // this.btnStart.node.on(Node.EventType.TOUCH_END, () => this.setStatus(null, GameStatus.Game_Playing), this);
        // this.btnPlayAgain.node.on(Node.EventType.TOUCH_END, () => this.setStatus(null, GameStatus.Game_Loading), this);
        // this.btnCredits.node.on(Node.EventType.TOUCH_END, this.creditBtn, this)
        // Set layout

        this.background.setScale(1, view.getViewportRect().height / view.getViewportRect().width)
        this.shade.setScale(1, view.getViewportRect().height / view.getViewportRect().width)
        // this.backgroundLayer.getComponent(UITransform).setContentSize(view.getViewportRect())
        // console.log(view.getViewportRect())
        // this.shade.getComponent(UITransform).setContentSize(view.getViewportRect())
        // this.logoNode.setPosition(0, view.getVisibleSize().y/2 - (this.logoNode.getComponent(UITransform).contentSize.height * this.logoNode.scale.y/2) - 10)
        // this.gameOverNode.setPosition(0, view.getVisibleSize().y/2 - (this.gameOverNode.getComponent(UITransform).contentSize.height * this.gameOverNode.scale.y/2) - 10)
        // this.scoreLabel.node.setPosition(0, view.getVisibleSize().y/2 - 20)
        // this.btnStart.node.setPosition(0, 0)
        // this.btnInstructions.node.setPosition(0, -75)
        // this.btnCredits.node.setPosition(0, -140)
        // this.btnPlayAgain.node.setPosition(0, 0)
        // Create Obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i] = instantiate(this.pipePrefab);
            this.node.getChildByName("PlayingLayer").getChildByName("Pipe").addChild(this.obstacles[i]);
            this.obstacles[i].getComponent(UIOpacity).opacity = 0;
        }
        let cloud1 = instantiate(this.cloudPrefab)
        cloud1.children[0].getComponent(Sprite).spriteFrame = this.cloudImages[0];
        this.node.getChildByName("BackgroundLayer").getChildByName("Clouds").addChild(cloud1)
        this.clouds.push(cloud1)
        let cloud2 = instantiate(this.cloudPrefab)
        cloud2.children[0].getComponent(Sprite).spriteFrame = this.cloudImages[1];
        this.node.getChildByName("BackgroundLayer").getChildByName("Clouds").addChild(cloud2)
        this.clouds.push(cloud2)
        this.setupCloud(0, true)
        this.setupCloud(1, false)
        // Set initial game state
        this.setStatus(null, GameStatus.Game_Loading)
    }

    setupObstacle(i: number, first: boolean) {
        let x = this.obstacles[(i + this.obstacles.length - 1) % this.obstacles.length].getPosition().x + OBSTACLE_SPACING;
        if (first) {
            x = FIRST_OBSTACLE_DISTANCE + OBSTACLE_SPACING * i
        }
        this.obstacles[i].setPosition(x, MIN_Y + Math.random() * (MAX_Y - MIN_Y))
        let frames = this.obstacleImages.filter(f => f !== this.last_image)
        let random = frames[Math.floor(Math.random()*frames.length)];
        this.obstacles[i].children[0].getComponent(Sprite).spriteFrame = random;
        this.obstacles[i].children[1].getComponent(Sprite).spriteFrame = random;
        this.last_image = random;
    }

    setupCloud(i: number, first: boolean) {
        let x = this.clouds[(i + this.clouds.length - 1) % this.clouds.length].getPosition().x + OBSTACLE_SPACING;
        if (first) {
            x = OBSTACLE_SPACING * i
        }
        this.clouds[i].setPosition(x, -view.getVisibleSize().height/2 + Math.random() * (view.getVisibleSize().height))
    }

    setupCoin() {
        let x = Math.max(...this.obstacles.map(o => o.getPosition().x)) + (OBSTACLE_SPACING * 4.5)
        this.coin.setPosition(x, MIN_Y/2 + Math.random() * (MAX_Y/2 - MIN_Y/2))
    }

    update(deltaTime: number) {
        // Update pipes
        for (let i = 0; i < this.obstacles.length; i++) {
            let x = this.obstacles[i].getPosition().x - (OBSTACLE_SPEED * (SPEED_MULTIPLIER ** this.score));
            let y = this.obstacles[i].getPosition().y;
            if (x <= -550) {
                //get screen width
                this.setupObstacle(i, false)
            } else {
                this.obstacles[i].setPosition(x, y);
            }
        }
        // Update clouds
        for (let i = 0; i < this.clouds.length; i++) {
            let x = this.clouds[i].getPosition().x - (OBSTACLE_SPEED/2  * (SPEED_MULTIPLIER ** this.score));
            let y = this.clouds[i].getPosition().y;
            if (x <= -550) {
                //get screen width
                this.setupCloud(i, false)
            } else {
                this.clouds[i].setPosition(x, y);
            }
        }

        if (this.gameStatus === GameStatus.Game_Loading) {
            let x = this.plane.getPosition().x
            x += 1
            if (x > -view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2)) {
                x = -view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2)
                this.setStatus(null, GameStatus.Game_Ready)
            }
            this.plane.setPosition(
                x, this.plane.getPosition().y
            );
        }

        if (this.gameStatus === GameStatus.Game_Playing) {
            let x = this.coin.getPosition().x - (OBSTACLE_SPEED * (SPEED_MULTIPLIER ** this.score));
            if (x <= -550) { //get screen width
                this.setupCoin()
            } else {
                this.coin.setPosition(x, this.coin.getPosition().y)
            }

            // Update Clouds

            // Update plane
            this.planeSpeed -= GRAVITY  * (SPEED_MULTIPLIER ** this.score);
            if (this.touching && this.planeSpeed < -1) {
                this.planeSpeed = -1
            }
            let y = this.plane.getPosition().y + this.planeSpeed
            if (y > view.getVisibleSize().y/2) {
                y = view.getVisibleSize().y/2
            }
            if (y < -view.getVisibleSize().y/2) {
                y = -view.getVisibleSize().y/2
            }
            this.plane.setPosition(
                this.plane.getPosition().x,
                y
            );

            var angle = this.planeSpeed * 4;
            if (angle >= 70) {
                angle = 70;
            }
            if (angle <= -70) {
                angle = -70;
            }
            this.plane.setRotationFromEuler(new Vec3(0, 0, angle));
        }

        if (this.gameStatus === GameStatus.Game_Over) {

            // Update Clouds
            // No Coins

            // Update plane
            this.planeSpeed -= GRAVITY;
            this.plane.setPosition(
                this.plane.getPosition().x - OBSTACLE_SPEED/2,
                this.plane.getPosition().y + this.planeSpeed
            );

            var angle = this.planeSpeed * 10;
            // if (angle >= 70) {
            //     angle = 70;
            // }
            // if (angle <= -70) {
            //     angle = -70;
            // }
            this.plane.setRotationFromEuler(new Vec3(0, 0, angle));
        }
        
    }

    getHighscore() {
        return JSON.parse(localStorage.getItem("highscore") || "0")
    }

    submitHighscore(score) {
        if (score > this.getHighscore()) {
            localStorage.setItem("highscore", this.score.toString())
        }
    }

    // Contact - Gameover or Score
    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (this.gameStatus === GameStatus.Game_Playing) {
            if (selfCollider.tag === 0 || otherCollider.tag === 0) {
                if (this.gameStatus == GameStatus.Game_Playing) {
                    this.submitHighscore(this.score)
                    this.fallSound.play();
                    this.setStatus(null, GameStatus.Game_Over)
                }
            } else if (selfCollider.tag === 1 || otherCollider.tag === 1) {
                this.score++;
                this.scoreLabel.string = this.score.toString();
            } else if (selfCollider.tag === 2 || otherCollider.tag === 2) {
                this.score += 3;
                this.scoreLabel.string = this.score.toString();
                this.setupCoin();
                this.pointSound.play();
            }
        }
    }

    // Callbacks
    onTouchStart(touch: Touch, event: EventTouch) {
        this.touching = true;
        if (this.gameStatus == GameStatus.Game_Playing) {
            this.planeSpeed = JUMP_SPEED * (SPEED_MULTIPLIER ** (this.score/2));
        }
    }
    onMouseDown(event: EventMouse) {
        this.touching = true;
        if (this.gameStatus == GameStatus.Game_Playing) {
            this.planeSpeed = JUMP_SPEED * (SPEED_MULTIPLIER ** (this.score/2));
        }
    }
    onMouseUp(event: EventMouse) {
        this.touching = false;
    }
    onTouchEnd(touch: Touch, event: EventTouch) {
        this.touching = false;   
    }

    setOverlay(event, type) {
        if (type === "credits") {
            this.node.getChildByName("OverlayLayer").active = true
            this.node.getChildByName("OverlayLayer").getChildByName("CreditOverlay").active = true
            this.node.getChildByName("OverlayLayer").getChildByName("InstructionsOverlay").active = false
            this.btnStart.interactable = false;
            this.btnStart.enabled = false;
            this.btnInstructions.interactable = false;
            this.btnInstructions.enabled = false;
            this.btnCredits.interactable = false;
            this.btnCredits.enabled = false;
        } else if (type === "instructions") {
            this.node.getChildByName("OverlayLayer").active = true
            this.node.getChildByName("OverlayLayer").getChildByName("CreditOverlay").active = false
            this.node.getChildByName("OverlayLayer").getChildByName("InstructionsOverlay").active = true
            this.btnStart.interactable = false;
            this.btnStart.enabled = false;
            this.btnInstructions.interactable = false;
            this.btnInstructions.enabled = false;
            this.btnCredits.interactable = false;
            this.btnCredits.enabled = false;
        } else {
            this.node.getChildByName("OverlayLayer").active = false
            this.btnStart.interactable = true;
            this.btnStart.enabled = true;
            this.btnInstructions.interactable = true;
            this.btnInstructions.enabled = true;
            this.btnCredits.interactable = true;
            this.btnCredits.enabled = true;
        }
    }
}
