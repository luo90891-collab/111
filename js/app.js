// 主应用
class App {
  constructor() {
    this.authUI = null;
    this.characterUI = null;
    this.mainGameUI = null;
    this.init();
  }
  
  init() {
    const currentUser = StorageManager.getItem('currentUser');
    const currentPlayer = StorageManager.getItem('currentPlayer');
    
    if (currentPlayer) {
      this.showMainGame();
    } else if (currentUser) {
      this.showCharacterScreen();
    } else {
      this.showAuthScreen();
    }
  }
  
  showAuthScreen() {
    this.authUI = new AuthUI();
    this.authUI.render();
  }
  
  showCharacterScreen() {
    this.characterUI = new CharacterUI();
    this.characterUI.render();
  }
  
  showMainGame() {
    const playerId = StorageManager.getItem('currentPlayer');
    const player = Player.load(playerId);
    
    if (!player) {
      this.showCharacterScreen();
      return;
    }
    
    this.mainGameUI = new MainGameUI();
    this.mainGameUI.render(player);
  }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
});