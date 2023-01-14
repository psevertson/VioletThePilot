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

const FIRST_OBSTACLE_DISTANCE = 400;
const OBSTACLE_SPACING = 500;
const OBSTACLE_SPEED = 3.0;
const JUMP_SPEED = 7;
const GRAVITY = 0.3;
const MAX_Y = 120;
const MIN_Y = -120;
// const BUILDING_NUMBERS = [1, 2, 3, 4];

@ccclass("MainScript")
export class MainScript extends Component {
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
    logoNode: Node = null;
    @property(Node)
    gameOverNode: Node = null;
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

    @property({type: AudioClip})
    backgroundMusic: AudioClip = null;
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
    setStatus(status: GameStatus) {
        this.gameStatus = status
        if (status === GameStatus.Game_Loading) {
            this.coin.setPosition(-view.getVisibleSize().x, 0)
            this.plane.setPosition(-view.getVisibleSize().x/2 - (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x/2), 0);
            this.plane.setRotationFromEuler(new Vec3(0, 0, 0));
            let opacity = this.logoNode.getComponent(UIOpacity);
            opacity.opacity = 0;
            let gameoverOpacity = this.gameOverNode.getComponent(UIOpacity);
            tween(gameoverOpacity).to(2, { opacity: 0 }).start();
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                tween(op).to(2, { opacity: 0 }).start();
            }
            this.gameOverNode.active = false;
            this.btnStart.node.active = false;
            this.btnCredits.node.active = false;
            this.btnInstructions.node.active = false;
            this.btnPlayAgain.node.active = false;
            this.scoreLabel.node.active = false;
        } else if (status === GameStatus.Game_Ready) {
            this.coin.setPosition(-view.getVisibleSize().x, 0)
            this.plane.setPosition(-view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2), 0);
            this.plane.setRotationFromEuler(new Vec3(0, 0, 0));
            let opacity = this.logoNode.getComponent(UIOpacity);
            tween(opacity).to(2, { opacity: 255 }).start();
            let gameoverOpacity = this.gameOverNode.getComponent(UIOpacity);
            gameoverOpacity.opacity = 0;
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                op.opacity = 0;
            }
            this.gameOverNode.active = false;
            this.btnStart.node.active = true;
            this.btnCredits.node.active = true;
            this.btnInstructions.node.active = true;
            this.btnPlayAgain.node.active = false;
            this.scoreLabel.node.active = false;
        } else if (status === GameStatus.Game_Playing) {
            this.plane.setPosition(-view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2), 0);
            this.plane.setRotationFromEuler(new Vec3(0, 0, 0));
            let opacity = this.logoNode.getComponent(UIOpacity);
            tween(opacity).to(2, { opacity: 0 }).start();
            let gameoverOpacity = this.gameOverNode.getComponent(UIOpacity);
            gameoverOpacity.opacity = 0;
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                op.opacity = 255;
            }
            this.gameOverNode.active = false;
            this.btnStart.node.active = false;
            this.btnCredits.node.active = false;
            this.btnInstructions.node.active = false;
            this.btnPlayAgain.node.active = false;
            //make playagain fade in
            this.scoreLabel.node.active = true;

            for (let i = 0; i < this.obstacles.length; i++) {
                this.setupObstacle(i, true)
            }
            this.setupCoin()

            this.score = 0
            this.scoreLabel.string = this.score.toString()
            this.planeSpeed = 0
        } else if (status === GameStatus.Game_Over) {
            this.coin.setPosition(-view.getVisibleSize().x, 0)
            let opacity = this.logoNode.getComponent(UIOpacity);
            opacity.opacity = 0
            let gameoverOpacity = this.gameOverNode.getComponent(UIOpacity);
            tween(gameoverOpacity).to(2, { opacity: 255 }).start();
            for (let i = 0; i < this.obstacles.length; i++) {
                let op = this.obstacles[i].getComponent(UIOpacity);
                op.opacity = 255;
            }
            this.gameOverNode.active = true;
            this.btnStart.node.active = false;
            this.btnCredits.node.active = false;
            this.btnInstructions.node.active = false;
            this.btnPlayAgain.node.active = true;
            this.scoreLabel.node.active = false;
            this.planeSpeed = 0
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
        this.btnStart.node.on(Node.EventType.TOUCH_END, () => this.setStatus(GameStatus.Game_Playing), this);
        this.btnPlayAgain.node.on(Node.EventType.TOUCH_END, () => this.setStatus(GameStatus.Game_Loading), this);
        this.btnCredits.node.on(Node.EventType.TOUCH_END, this.creditBtn, this)
        // Set layout
        this.node.getChildByName("Bg").getComponent(UITransform).setContentSize(view.getViewportRect())
        this.node.getChildByName("ShadeOverlay").getComponent(UITransform).setContentSize(view.getViewportRect())
        this.logoNode.setPosition(0, view.getVisibleSize().y/2 - (this.logoNode.getComponent(UITransform).contentSize.height * this.logoNode.scale.y/2) - 10)
        this.gameOverNode.setPosition(0, view.getVisibleSize().y/2 - (this.gameOverNode.getComponent(UITransform).contentSize.height * this.gameOverNode.scale.y/2) - 10)
        this.scoreLabel.node.setPosition(-view.getVisibleSize().x/2 + 20, view.getVisibleSize().y/2 - 20)
        this.btnStart.node.setPosition(0, 0)
        this.btnInstructions.node.setPosition(0, -75)
        this.btnCredits.node.setPosition(0, -140)
        this.btnPlayAgain.node.setPosition(0, 0)
        // Create Obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i] = instantiate(this.pipePrefab);
            this.node.getChildByName("Pipe").addChild(this.obstacles[i]);
            this.obstacles[i].getComponent(UIOpacity).opacity = 0;
        }
        // Set initial game state
        this.setStatus(GameStatus.Game_Loading)
    }

    creditBtn() {
        this.node.getChildByName("ShadeOverlay").active = true;
        this.node.getChildByName("CreditOverlay").active = true;
        this.btnStart.interactable = false;
        this.btnInstructions.interactable = false;
        this.btnCredits.interactable = false;
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

    setupCoin() {
        let x = Math.max(...this.obstacles.map(o => o.getPosition().x)) + (OBSTACLE_SPACING * 4.5)
        this.coin.setPosition(x, MIN_Y/2 + Math.random() * (MAX_Y/2 - MIN_Y/2))
    }

    update(deltaTime: number) {
        // Update pipes
        for (let i = 0; i < this.obstacles.length; i++) {
            let x = this.obstacles[i].getPosition().x - OBSTACLE_SPEED;
            let y = this.obstacles[i].getPosition().y;
            if (x <= -550) {
                //get screen width
                this.setupObstacle(i, false)
            } else {
                this.obstacles[i].setPosition(x, y);
            }
        }

        if (this.gameStatus === GameStatus.Game_Loading) {
            let x = this.plane.getPosition().x
            x += 1
            if (x > -view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2)) {
                x = -view.getVisibleSize().width / 2 + (this.plane.getComponent(UITransform).contentSize.width * this.plane.scale.x /2)
                this.setStatus(GameStatus.Game_Ready)
            }
            this.plane.setPosition(
                x, this.plane.getPosition().y
            );
        }

        if (this.gameStatus === GameStatus.Game_Playing) {
            let x = this.coin.getPosition().x - OBSTACLE_SPEED;
            if (x <= -550) { //get screen width
                this.setupCoin()
            } else {
                this.coin.setPosition(x, this.coin.getPosition().y)
            }

            // Update Clouds

            // Update plane
            this.planeSpeed -= GRAVITY;
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

    // Contact - Gameover or Score
    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (selfCollider.tag === 0 || otherCollider.tag === 0) {
            if (this.gameStatus == GameStatus.Game_Playing) {
                this.setStatus(GameStatus.Game_Over)
            }
        } else if (selfCollider.tag === 1 || otherCollider.tag === 1) {
            this.score++;
            this.scoreLabel.string = this.score.toString();
        } else if (selfCollider.tag === 2 || otherCollider.tag === 2) {
            this.score += 3;
            this.scoreLabel.string = this.score.toString();
            this.setupCoin();
            //coin sound
        }
    }

    // Callbacks
    onTouchStart(touch: Touch, event: EventTouch) {
        if (this.gameStatus == GameStatus.Game_Playing) {
            this.planeSpeed = JUMP_SPEED;
            this.touching = true;
        }
    }
    onMouseDown(event: EventMouse) {
        if (this.gameStatus == GameStatus.Game_Playing) {
            this.planeSpeed = JUMP_SPEED;
            this.touching = true;   
        }
    }
    onMouseUp(event: EventMouse) {
        if (this.node.getChildByName("ShadeOverlay").active) {
            this.node.getChildByName("ShadeOverlay").active = false;
            this.node.getChildByName("CreditOverlay").active = false;
            //other overlay
            this.btnStart.interactable = true;
            this.btnInstructions.interactable = true;
            this.btnCredits.interactable = true;
        }
        if (this.gameStatus == GameStatus.Game_Playing) {
            this.touching = false;
        }
    }
    onTouchEnd(touch: Touch, event: EventTouch) {
        if (this.node.getChildByName("ShadeOverlay").active) {
            this.node.getChildByName("ShadeOverlay").active = false;
            this.node.getChildByName("CreditOverlay").active = false;
            //other overlay
            this.btnStart.interactable = true;
            this.btnInstructions.interactable = true;
            this.btnCredits.interactable = true;
        }
        if (this.gameStatus == GameStatus.Game_Playing) {
            this.touching = false;   
        }
    }
}
