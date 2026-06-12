// 认证UI
class AuthUI {
  constructor() {
    this.isLogin = true;
    this.users = StorageManager.getItem('users') || {};
    this.currentUser = null;
  }
  
  render() {
    const root = document.getElementById('root');
    root.innerHTML = `
      <div id="authScreen" class="screen active">
        <div class="auth-container">
          <h1 class="auth-title">${this.isLogin ? '登录' : '注册'}</h1>
          <form class="auth-form" id="authForm">
            <div class="form-group">
              <label>账户名</label>
              <input type="text" id="username" placeholder="输入账户名" required>
            </div>
            <div class="form-group">
              <label>密码</label>
              <input type="password" id="password" placeholder="输入密码" required>
            </div>
            ${!this.isLogin ? `
              <div class="form-group">
                <label>确认密码</label>
                <input type="password" id="confirmPassword" placeholder="确认密码" required>
              </div>
            ` : ''}
            <button type="submit" class="btn primary">${this.isLogin ? '登录' : '创建账户'}</button>
            <div id="errorMsg" class="error-msg"></div>
          </form>
          <div class="auth-toggle">
            ${this.isLogin ? '没有账户？' : '已有账户？'}
            <button id="toggleBtn">${this.isLogin ? '注册' : '登录'}</button>
          </div>
        </div>
      </div>
    `;
    
    this.attachEvents();
  }
  
  attachEvents() {
    const form = document.getElementById('authForm');
    const toggleBtn = document.getElementById('toggleBtn');
    const errorMsg = document.getElementById('errorMsg');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      if (!username || !password) {
        errorMsg.textContent = '用户名和密码不能为空';
        return;
      }
      
      if (this.isLogin) {
        this.login(username, password, errorMsg);
      } else {
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
          errorMsg.textContent = '两次输入的密码不一致';
          return;
        }
        this.register(username, password, errorMsg);
      }
    });
    
    toggleBtn.addEventListener('click', () => {
      this.isLogin = !this.isLogin;
      this.render();
    });
  }
  
  login(username, password, errorMsg) {
    const user = this.users[username];
    if (!user || user.password !== password) {
      errorMsg.textContent = '用户名或密码错误';
      return;
    }
    
    this.currentUser = username;
    StorageManager.setItem('currentUser', username);
    app.showCharacterScreen();
  }
  
  register(username, password, errorMsg) {
    if (this.users[username]) {
      errorMsg.textContent = '用户名已存在';
      return;
    }
    
    this.users[username] = {
      password: password,
      players: [],
      createdAt: new Date().toISOString()
    };
    
    StorageManager.setItem('users', this.users);
    this.currentUser = username;
    StorageManager.setItem('currentUser', username);
    errorMsg.style.color = 'var(--success-color)';
    errorMsg.textContent = '注册成功！即将进入角色创建...';
    setTimeout(() => app.showCharacterScreen(), 1500);
  }
}