
import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'
// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `
// setupCounter(document.querySelector('#counter'))
/**
 * @file 创建网页游戏sakirun！！！！
 * @author UniverseOverloadSuperCupMuFeng
 * @createdAt 2025/9/7
 * @lastModifiedAt 2025/9/15
 * @dependency .sakiRUN.css已给出且必要
 * @example
 * 
 * <!DOCTYPE html>
 * <html lang="en">
 * <head>
 *   <meta charset="UTF-8">
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *   <title>sakiRUN!!!!!!!!!!</title>
 *   <link rel="stylesheet" href="sakiRUN.css" />
 * </head>
 * <body>
 *  <div class =gameBox>
        <div class =backgroundlayer>      
 *  </div>
 *   </div>
 * </body>
 *  <script src="sakiRUN.js"></script>
 * </html>
 */
//游戏内实体
/**
 * 表示一个计数表
 * css依赖于sakiRUN.css提供的clock-display,或在css中自定义
 */
//BUG 当祥子起飞的时候按下暂停，起飞动作仍然会继续
class Clock {
  constructor(displayElement = null) {
    this.second = 0;
    this.minute = 0;
    this.hour = 0;
    this.timerId = null;
    this.displayElement = displayElement; // 存储显示时间的DOM元素
    this.listeners = []; // 存储监听器函数
  }

  addTime() {
    const SECONDS_PER_MINUTE = 60;
    const MINUTES_PER_HOUR = 60;
    const HOURS_PER_DAY = 24;

    this.second += 1;

    if (this.second >= SECONDS_PER_MINUTE) {
      this.second = 0;
      this.minute += 1;
    }
    if (this.minute >= MINUTES_PER_HOUR) {
      this.minute = 0;
      this.hour += 1;
    }
    if (this.hour >= HOURS_PER_DAY) {
      this.hour = 0;
    }

    this.updateDisplay(); // 更新时间显示
    this.notifyListeners(); // 通知监听器
  }
  setDisplayElement(element) {
    this.displayElement = element;
    this.updateDisplay();
  }
  // 更新显示的函数
  updateDisplay() {
    if (this.displayElement) {
      this.displayElement.textContent = this.toString();
    }
  }
  // 添加监听器
  addListener(callback) {
    this.listeners.push(callback);
  }

  // 移除监听器
  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // 通知所有监听器
  notifyListeners() {
    const totalSeconds = this.getTotalSeconds();
    this.listeners.forEach((listener) => listener(totalSeconds));
  }
  getTotalSeconds() {
    return this.hour * 3600 + this.minute * 60 + this.second;
  }
  start() {
    if (!this.timerId) {
      this.timerId = setInterval(() => this.addTime(), 1000);
      this.updateDisplay();
    }
  }
  pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  reset() {
    this.pause();
    this.second = 0;
    this.minute = 0;
    this.hour = 0;
    this.updateDisplay();
  }

  toString() {
    const pad = (num) => num.toString().padStart(2, "0");
    return `${pad(this.hour)}:${pad(this.minute)}:${pad(this.second)}`;
  }
}
/**
 * 表示一个可移动的方块元素，支持碰撞检测和动画控制，传入对碰撞的回调[options.onCollision]以实现对全局的控制
 * css依赖于sakiRUN.css提供的block_01,或在css中自定义
 * @example
 * const block = new Block(document.getElementById('container'), targetElement, {
 *   elementName: 'block_01',
 *   vx: 10。
 *   onCollision:()=>{
 * }
 * });
 */
class Block {
  /**
   * 创建一个Block实例
   * @param {HTMLElement} parentElement - 父容器元素
   * @param {Object} options - 配置选项
   * @param {string} [options.elementName='block_01'] -对css内元素绑定名
   * @param {number} [options.x=980] - 初始x坐标
   * @param {number} [options.y=0] - 初始y坐标
   * @param {number} [options.vx=10] - 初始x速度
   */
  constructor(parentElement, targetElement, options = {}) {
    // 参数验证
    if (!(parentElement instanceof HTMLElement)) {
      throw new Error("必须提供有效的父元素");
    }
    this.parentElement = parentElement;
    this.targetElement = targetElement;
    this.animationId = null;
    this.isMoving = false;
    this.destroyed = false;

    // 逻辑属性
    this.vx = options.vx !== undefined ? options.vx : 10;
    this.x = options.x !== undefined ? options.x : 980;
    this.y = options.y !== undefined ? options.y : 0;

    // 初始化元素
    this.element = document.createElement("div");
    this.element.className =
      options.elementName !== undefined ? options.elementName : "block_01";
    this.parentElement.appendChild(this.element);

    // 设置初始位置
    this.updatePosition();

    this.startMove(this.targetElement); // 开始移动并检测与其他物体的的碰撞
    this.onCollision = options.onCollision || this.onCollision; //碰撞的回调
    this.onDestroy = options.onDestroy || (() => {}); //销毁的回调
  }
  //更新位置
  updatePosition() {
    this.element.style.transform = `translate(${this.x}px, 0px)`;
    this.element.style.bottom = `${this.y}px`;
  }
  startMove(targetElement = null) {
    if (this.isMoving || this.destroyed) return;

    this.isMoving = true;
    let lastTime = performance.now();
    const speed = this.vx * 60;

    const animate = (now) => {
      if (this.destroyed) return;

      let delta = now - lastTime;
      lastTime = now;

      this.x -= speed * (delta / 1000);
      this.updatePosition();

      if (targetElement && this.ifCollisionWith(this.targetElement)) {
        this.onCollision();
        this.destroy();
        return;
      }

      if (this.isOutOfBounds()) {
        this.destroy();
        return;
      }

      if (this.isMoving) {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    this.animationId = requestAnimationFrame(animate);
  }
  ifCollisionWith(otherElement) {
    if (!otherElement || this.destroyed) return false;

    const thisRect = this.element.getBoundingClientRect();
    const otherRect = otherElement.getBoundingClientRect();

    return !(
      thisRect.right < otherRect.left ||
      thisRect.left > otherRect.right ||
      thisRect.bottom < otherRect.top ||
      thisRect.top > otherRect.bottom
    );
  }
  stopMove() {
    this.isMoving = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  isOutOfBounds() {
    const parentWidth = this.parentElement.clientWidth;
    return this.x + this.width < 0 || this.x > parentWidth;
  }
  destroy() {
    // 防止重复销毁
    if (this.destroyed) return;

    // 停止所有动画和事件
    this.stopMove();

    // 移除DOM元素
    if (this.element && this.element.parentNode && this.parentElement) {
      this.parentElement.removeChild(this.element);
    }

    // 清理所有引用
    this.element = null;
    this.parentElement = null;
    this.animationId = null;

    // 标记为已销毁
    this.destroyed = true;
    this.onDestroy();

    console.log("Block destroyed");
  }
}
/**
 * 表示一个血条状态栏
 * @example
 * const heart =new hearts()
 *
 */
class hearts {
  /**
   * 创建一个hearts实例
   * @param {HTMLElement} parentElement - 父容器元素
   * @param {Object} options - options
   * @param {Number} [options.maxHearts=3] -最大心数量
   * @param {String} [heartName ='heart'] -心样式名
   * @param {String} [emptyHeartName ='empty-heart'] -空心样式名
   */
  constructor(parentElement, options = {}) {
    // 参数验证
    if (!(parentElement instanceof HTMLElement)) {
      throw new Error("必须提供有效的父元素");
    }
    this.parent = parentElement;
    this.maxHearts = options.maxHearts !== undefined ? options.maxHearts : 3;
    this.currentHearts = this.maxHearts;
    this.hearts = [];
    this.heartName =
      options.heartName !== undefined ? options.heartName : "heart";
    this.emptyHeartName =
      options.emptyHeartName !== undefined
        ? options.emptyHeartName
        : "empty-heart";
    // 创建3个独立的心形元素
    for (let i = 0; i < this.maxHearts; i++) {
      const heart = document.createElement("div");
      heart.className = this.heartName;
      this.parent.appendChild(heart);
      this.hearts.push(heart);
    }
  }
  //减小心形
  decrease() {
    if (this.currentHearts > 0) {
      this.hearts[--this.currentHearts].className = this.emptyHeartName;
      console.log(this.currentHearts);
    }
  }
  // 增加心形
  increase() {
    if (this.currentHearts < this.maxHearts) {
      this.hearts[this.currentHearts].className = this.heartName;
      this.currentHearts++;
    }
  }
  reset() {
    this.currentHearts = this.maxHearts;
    this.hearts.forEach((heart) => {
      heart.className = this.heartName;
    });
  }
  isEmpty() {
    return this.currentHearts === 0;
  }
}
/**
 * 表示一个可跳跃的saki，支持跳跃动画控制
 * css依赖于sakiRUN.css提供的saki,或在css中自定义
 * @example
 * gameSaki=new saki(parentElement)
 */
class saki {
  /**
   * 创建一个Saki实例
   * @param {HTMLElement} parentElement - 父容器元素
   * @param {Object} options - 配置选项
   * @param {number} [options.x=400] - 初始x坐标
   * @param {number} [options.y=5] - 初始y坐标
   * @param {string} [options.elementName='saki'] - 祥子样式
   * @param {number} [options.jumpHeight=300] - 跳跃高度(px)
   * @param {number} [options.jumpDuration=800] - 跳跃持续时间(ms)
   */
  constructor(parentElement, options = {}) {
    if (!(parentElement instanceof HTMLElement)) {
      throw new Error("必须提供有效的父元素");
    }

    this.parentElement = parentElement;
    this.animationId = null;
    this.isJumping = false;

    // 创建元素并设置类名
    this.element = document.createElement("div");
    this.element.className = options.elementName || "saki";

    // 初始化位置属性
    this.x = options.x || 400;
    this.y = options.y || 5;
    this.jumpHeight = options.jumpHeight || 300;

    // 初始化跳跃状态管理器
    this.jumpStatus = {
      toped: false,
      paused: false,
      initialY: 0,
      startTime: 0,
      elapsedBeforePause: 0,
      duration: options.jumpDuration || 800,
      jumpHeight: this.jumpHeight,

      reset: function () {
        this.toped = false;
        this.paused = false;
        this.initialY = 0;
        this.startTime = 0;
        this.elapsedBeforePause = 0;
      },

      pause: function (animationId) {
        if (!this.paused) {
          this.paused = true;
          this.elapsedBeforePause += performance.now() - this.startTime;
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        }
      },

      resume: function (callback) {
        if (this.paused) {
          this.paused = false;
          this.startTime = performance.now();
          if (callback) callback();
        }
      },

      calculatePosition: function (now) {
        if (this.paused) return null;

        const elapsed = this.elapsedBeforePause + (now - this.startTime);
        const progress = Math.min(elapsed / this.duration, 1);

        if (!this.toped && progress >= 0.5) {
          this.toped = true;
        }

        return {
          y:
            this.initialY -
            4 * this.jumpHeight * Math.pow(progress - 0.5, 2) +
            this.jumpHeight,
          progress: progress,
        };
      },
    };

    // 应用初始样式
    this.applyStyles({
      transformOrigin:
        options.transformOriginX && options.transformOriginY
          ? `${options.transformOriginX}% ${options.transformOriginY}%`
          : null,
    });

    this.parentElement.appendChild(this.element);
  }

  /**
   * 应用样式
   * @param {Object} overrides - 需要覆盖的样式
   */
  applyStyles(overrides = {}) {
    const style = {
      position: "absolute",
      bottom: `${this.y}px`,
      left: `${this.x}px`,
      ...(overrides.transformOrigin && {
        transformOrigin: overrides.transformOrigin,
      }),
    };
    Object.assign(this.element.style, style);
  }

  /**
   * 执行跳跃动画
   */
  jump() {
    // 如果已经在跳跃且未暂停，则不允许重复跳跃
    if (this.isJumping && !this.jumpStatus.paused) return;

    // 初始化跳跃状态
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpStatus.reset();
      this.jumpStatus.initialY = this.y;
      this.jumpStatus.startTime = performance.now();
      this.jumpStatus.jumpHeight = this.jumpHeight; // 更新当前跳跃高度
    } else if (this.jumpStatus.paused) {
      // 如果是暂停后恢复跳跃
      this.jumpStatus.resume(() => {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
      });
      return;
    }

    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * 动画帧处理函数
   * @param {number} now - 当前时间戳
   */
  animate(now) {
    const position = this.jumpStatus.calculatePosition(now);
    if (!position) return; // 如果暂停，直接退出

    // 更新位置
    this.y = position.y;
    this.applyStyles();

    // 动画未完成则继续
    if (position.progress < 1) {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    } else {
      // 动画完成，重置状态
      this.isJumping = false;
      this.jumpStatus.reset();
      this.animationId = null;
    }
  }

  /**
   * 暂停跳跃动画
   */
  pauseJump() {
    if (this.isJumping) {
      this.jumpStatus.pause(this.animationId);
    }
  }

  /**
   * 恢复跳跃动画
   */
  resumeJump() {
    if (this.isJumping && this.jumpStatus.paused) {
      this.jumpStatus.resume(() => {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
      });
    }
  }
}
// ================ 全局变量声明区域 ================
const gameBox = document.querySelector(".gameBox");
let menuButton = null;
let testMenuButton = null;
const gameClock = new Clock();
let menuContainer = null; // 从 resumeGame 函数中提取
let restartBtn = null; // 从 overMode 函数中提取

// 游戏状态变量
let gameMode = 0; // 0: waiting, 1: playing, 2: gameover
let heart = null;
let gameSaki = null;

// 游戏逻辑控制变量
let nextBlockGenerateTime = 0;
const blockList = []; //存储所有活跃的Block实例
//gamelogic
//finished
function timerStart() {
  const clockDisplay = document.createElement("div");
  clockDisplay.className = "clock-display";
  gameBox.appendChild(clockDisplay);
  gameClock.setDisplayElement(clockDisplay);
  console.log("timer starts");
  gameClock.start();
}
//finished
function createSence() {
  gameBox.style.backgroundImage = "url('')";
  console.log("sence created");
}
//finished
function createSaki() {
  gameSaki = new saki(gameBox);
  console.log("Saki created");
}
//finished
function createDog() {
  const misumi = document.createElement("div");
  misumi.className = "misumi";
  //2.添加到box
  const gameBox = document.querySelector(".gameBox");
  gameBox.appendChild(misumi);
  console.log("Misumi created");
}
//finished
function createBlock(gamebox, options = {}) {
  if (!(gamebox instanceof HTMLElement)) {
    throw new Error("必须提供有效的gamebox元素");
  }

  const block = new Block(gamebox, gameSaki.element, {
    onCollision: () => {
      if (heart.currentHearts - 1 == 0) {
        heart.decrease();
        console.log("attackWin");
        overMode();
        return;
      }
      heart.decrease();
    },
    onDestroy: () => {
      // 从blockList中移除
      const index = blockList.indexOf(block);
      if (index !== -1) {
        blockList.splice(index, 1);
      }
    },
  });

  // 添加到blockList
  blockList.push(block);
  return block;
}
//finished
function waittingMode() {
  gameMode = 0;
  // 1. 创建菜单容器
  const menuContainer = document.createElement("div");
  menuContainer.className = "menuContainer";
  menuContainer.style.position = "absolute";
  menuContainer.style.bottom = "200px";
  menuContainer.style.left = "400px";
  menuContainer.style.width = "200px";
  menuContainer.style.height = "100px";
  menuContainer.style.padding = "10px";
  menuContainer.style.zIndex = "1000";

  // 2. 添加菜单选项
  const options = [
    {
      text: "点击开始",
      action: () => {
        startGame();
        const gameBox = document.querySelector(".gameBox");
        gameBox.removeChild(menuContainer);
      },
    },
  ];

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.style.display = "block";
    button.style.width = "100%";
    button.style.height = "100%";
    button.style.margin = "5px 0";
    button.style.padding = "8px";
    button.style.border = "none";
    button.style.borderRadius = "3px";
    button.style.cursor = "pointer";
    button.addEventListener("click", option.action);
    menuContainer.appendChild(button);
  });

  // 3. 添加到游戏框
  const gameBox = document.querySelector(".gameBox");
  gameBox.appendChild(menuContainer);

  console.log("waitting to start");
}
//finished
function overMode() {
  gameMode = 2;
  const elements = document.querySelectorAll(".gameBox *");
  //暂停动画
  elements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.animationName !== "none") {
      el.style.animationPlayState = "paused";
    }
  });
  //断开控制
  document.removeEventListener("keydown", handleKeyDown);
  gameClock.pause();
  console.log("gameOver,waitting to start again");

  // 创建重新开始按钮
  let restartBtn = document.createElement("button");
  restartBtn.textContent = "重新开始";
  restartBtn.style.position = "absolute";
  restartBtn.style.left = "50%";
  restartBtn.style.top = "50%";
  restartBtn.style.transform = "translate(-50%, -50%)";
  restartBtn.style.zIndex = "2000";
  restartBtn.style.padding = "16px 32px";
  restartBtn.style.fontSize = "20px";
  restartBtn.style.border = "none";
  restartBtn.style.borderRadius = "8px";
  restartBtn.style.cursor = "pointer";
  restartBtn.id = "restartGameBtn";

  // 防止重复添加
  if (!document.getElementById("restartGameBtn")) {
    const gameBox = document.querySelector(".gameBox");
    gameBox.appendChild(restartBtn);
  }

  restartBtn.onclick = function () {
    // 移除按钮
    restartBtn.remove();
    restartGame();
  };
}
//finished
//finished
function restartGame() {
  // 1. 重置计时器和心数
  gameClock.reset();
  gameClock.start();
  heart.reset();

  // 2. 清除所有障碍物和敌人
  const gameBox = document.querySelector(".gameBox");

  // 使用blockList清理所有block
  while (blockList.length > 0) {
    const block = blockList.pop();
    block.destroy();
  }

  // 移除所有 misumi
  const misumis = gameBox.querySelectorAll(".misumi");
  misumis.forEach((misumi) => misumi.remove());
  // 移除所有 saki
  const sakis = gameBox.querySelectorAll(".saki");
  sakis.forEach((saki) => saki.remove());

  // 3. 重新创建主角和敌人
  createSaki();
  createDog();
  //重新链接控制
  document.addEventListener("keydown", handleKeyDown);
  // 4. 恢复游戏模式
  gameMode = 1;

  // 5. 重新开始计时和方块生成
  nextBlockGenerateTime =
    gameClock.getTotalSeconds() + getRandomIntInclusive(2, 4);

  console.log("游戏已重启");
}
//finished
function startGame() {
  createSaki();
  document.addEventListener("keydown", handleKeyDown);
  createDog();
  timerStart();
  heart = new hearts(gameBox);
  gameMode = 1;
  console.log("game started");
}
function pauseGame() {
  // 暂停所有动画
  const elements = document.querySelectorAll(".gameBox *");
  elements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.animationName !== "none") {
      el.style.animationPlayState = "paused";
    }
  });

  // // 停止saki的跳跃
  gameSaki.pauseJump();

  // 停止所有block的移动（使用blockList）
  blockList.forEach((block) => {
    block.stopMove();
  });

  //断开控制
  document.removeEventListener("keydown", handleKeyDown);
  // 暂停计时器
  gameClock.pause();
  gameMode = 0;
  console.log("游戏已暂停");
}
function resumeGame() {
  // 恢复所有动画
  const elements = document.querySelectorAll(".gameBox *");
  elements.forEach((el) => {
    el.style.animationPlayState = "running";
  });
  //恢复跳跃
  gameSaki.resumeJump();
  // 恢复所有block的移动（使用blockList）
  blockList.forEach((block) => {
    block.startMove(gameSaki.element);
  });

  const gameBox = document.querySelector(".gameBox");
  menuContainer = document.querySelector(".menuContainer");
  gameBox.removeChild(menuContainer);
  //恢复控制
  document.addEventListener("keydown", handleKeyDown);
  //恢复计时器
  gameClock.start();
  gameMode = 1;
  console.log("游戏已继续");
}
//unfinished
function sakiIsXxxxedByMisum() {
  console.log("saki is Xxxxxed by misumi");
}
//event
// 监听键盘事件（空格键触发跳跃）
function handleKeyDown(event) {
  if (event.code === "Space") {
    // 阻止默认行为（防止默认按键触发）
    if (!["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
      event.preventDefault();
    }

    // 确保 saki 存在且未在跳跃中
    if (gameSaki && !gameSaki.isJumping) {
      gameSaki.jump();
      console.log("saki jump");
    }
  }
}
window.addEventListener("DOMContentLoaded", () => {
  if (!gameBox) return;
  // 创建主菜单按钮
  menuButton = document.createElement("button");
  menuButton.className = "menuButton";
  menuButton.title = "菜单";
  menuButton.innerHTML = "≡";
  gameBox.appendChild(menuButton);

  // 创建测试菜单按钮
  testMenuButton = document.createElement("button");
  testMenuButton.className = "testMenuButton";
  testMenuButton.title = "测试";
  testMenuButton.innerHTML = "?";
  gameBox.appendChild(testMenuButton);
  //进入预备模式
  waittingMode(); // 文档解析完成后执行
  //绑定事件监听
  menuButton.addEventListener("click", function () {
    console.log("clickedButtonMenu");
    // 暂停动画
    if (gameMode === 0) return;
    pauseGame();

    // 1. 创建菜单容器
    menuContainer = document.createElement("div");
    menuContainer.className = "menuContainer";
    menuContainer.style.position = "absolute";
    menuContainer.style.bottom = "200px";
    menuContainer.style.left = "400px";
    menuContainer.style.width = "200px";
    menuContainer.style.height = "100px";
    menuContainer.style.padding = "10px";
    menuContainer.style.zIndex = "1000";

    // 2. 添加菜单选项
    const options = [{ text: "continue", action: resumeGame }];

    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option.text;
      button.style.display = "block";
      button.style.width = "100%";
      button.style.height = "100%";
      button.style.margin = "5px 0";
      button.style.padding = "8px";
      button.style.border = "none";
      button.style.borderRadius = "3px";
      button.style.cursor = "pointer";
      button.addEventListener("click", option.action);
      menuContainer.appendChild(button);
    });

    // 3. 添加到游戏框
    const gameBox = document.querySelector(".gameBox");
    gameBox.appendChild(menuContainer);
  });
  testMenuButton.addEventListener("click", testMenu);
});
gameClock.addListener((totalSeconds) => {
  // 只在游戏进行中时处理
  if (gameMode !== 1) return;
  // 检查是否到达生成时间
  if (totalSeconds >= nextBlockGenerateTime) {
    try {
      // 生成新方块
      createBlock(gameBox);
      console.log("生成新方块");
      // 计算下一次生成时间（当前时间+随机间隔）
      nextBlockGenerateTime = totalSeconds + getRandomIntInclusive(2, 4);

      // 可选：随着游戏进行，逐渐缩短生成间隔
      if (totalSeconds > 60) {
        // 游戏进行1分钟后
        nextBlockGenerateTime = totalSeconds + getRandomIntInclusive(1, 3);
      }
    } catch (error) {
      console.error("生成方块失败:", error);
      nextBlockGenerateTime = totalSeconds + 1;
    }
  }
  console.log(
    `游戏时间: ${totalSeconds}秒，下次生成: ${nextBlockGenerateTime}秒`
  );
});
// assistant
//test code
function testMenu() {
  console.log("get testMenu");
  const testMenuContainer = document.createElement("div");
  testMenuContainer.className = "menuContainer";
  testMenuContainer.style.position = "absolute";
  testMenuContainer.style.bottom = "200px";
  testMenuContainer.style.left = "400px";
  testMenuContainer.style.width = "200px";
  testMenuContainer.style.height = "100px";
  testMenuContainer.style.padding = "10px";
  testMenuContainer.style.zIndex = "1000";
  const options = [
    { text: "测试祥子", action: createSaki },
    { text: "测试初华", action: createDog },
    {
      text: "退出测试",
      action: () => {
        const gameBox = document.querySelector(".gameBox");
        gameBox.removeChild(testMenuContainer);
      },
    },
  ];

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.style.display = "block";
    button.style.width = "100%";
    button.style.height = "50%";
    button.style.margin = "5px 0";
    button.style.padding = "8px";
    button.style.border = "none";
    button.style.borderRadius = "3px";
    button.style.cursor = "pointer";
    button.addEventListener("click", option.action);
    testMenuContainer.appendChild(button);
  });
  const gameBox = document.querySelector(".gameBox");
  gameBox.appendChild(testMenuContainer);
}
//tools
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

