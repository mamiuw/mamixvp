const VALORANT_SVG = `<svg class="val-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 3H9L22 16V21H15L2 8V3Z" fill="#ff4655"/>
</svg>`;

const AppState = {
  getUser() {
    const data = localStorage.getItem('vanguard_user');
    return data ? JSON.parse(data) : null;
  },
  saveUser(user) {
    localStorage.setItem('vanguard_user', JSON.stringify(user));
    this.updateUI();
  },
  login(username, password) {
    if (!username || username.trim().length < 3) {
      showToast('Riot ID / Kullanıcı adı en az 3 karakter olmalıdır.', true);
      return false;
    }
    const existing = this.getUser();
    if (existing && existing.username.toLowerCase() === username.trim().toLowerCase()) {
      existing.loggedIn = true;
      this.saveUser(existing);
      showToast(`Tekrar hoş geldin, ${existing.username}!`);
      return true;
    }
    const newUser = {
      username: username.trim(),
      tagLine: Math.floor(1000 + Math.random() * 9000),
      balance: 100, // 100 VP bonus
      wagered: 0,
      loggedIn: true,
      history: [
        { type: 'Bonus', detail: 'Hoş Geldin Hediyesi', amount: '+100 VP', date: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}) }
      ]
    };
    this.saveUser(newUser);
    showToast(`Giriş başarılı! +100 VP başlangıç bakiyesi tanımlandı.`);
    return true;
  },
  register(username, tagLineInput, password) {
    if (!username || username.trim().length < 3) {
      showToast('Geçerli bir Riot ID girin.', true);
      return false;
    }
    if (!password || password.length < 4) {
      showToast('Şifre en az 4 karakter olmalıdır.', true);
      return false;
    }
    const newUser = {
      username: username.trim(),
      tagLine: tagLineInput && tagLineInput.trim() ? tagLineInput.trim() : Math.floor(1000 + Math.random() * 9000),
      balance: 100, // 100 VP kayıt bonusu
      wagered: 0,
      loggedIn: true,
      history: [
        { type: 'Kayıt Bonusu', detail: 'Yeni Hesap Hediyesi', amount: '+100 VP', date: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}) }
      ]
    };
    this.saveUser(newUser);
    showToast(`Kayıt tamamlandı! 100 VP başlangıç bakiyesi eklendi.`);
    return true;
  },
  logout() {
    const user = this.getUser();
    if (user) {
      user.loggedIn = false;
      this.saveUser(user);
    }
    showToast('Hesaptan çıkış yapıldı.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  },
  addBalance(amount, reason = 'VP Yatırımı') {
    const user = this.getUser();
    if (!user || !user.loggedIn) {
      showToast('Lütfen önce giriş yapın!', true);
      return false;
    }
    user.balance = Math.round((user.balance + amount) * 100) / 100;
    user.history.unshift({
      type: amount >= 0 ? 'Kazanç / Yükleme' : 'Oyun / Çekim',
      detail: reason,
      amount: (amount >= 0 ? '+' : '') + amount + ' VP',
      date: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})
    });
    if (user.history.length > 20) user.history.pop();
    this.saveUser(user);
    return true;
  },
  updateUI() {
    const user = this.getUser();
    const isLogged = user && user.loggedIn;

    const navBalanceEl = document.getElementById('nav-balance-val');
    const navAuthBtns = document.getElementById('nav-auth-buttons');
    const navUserBox = document.getElementById('nav-user-box');
    const navUsernameEl = document.getElementById('nav-username');

    if (navBalanceEl) {
      navBalanceEl.textContent = isLogged ? user.balance.toLocaleString('tr-TR') : '0';
    }
    if (navAuthBtns && navUserBox) {
      navAuthBtns.style.display = isLogged ? 'none' : 'flex';
      navUserBox.style.display = isLogged ? 'flex' : 'none';
      if (isLogged && navUsernameEl) {
        navUsernameEl.textContent = user.username;
      }
    }
  }
};

function showToast(msg, isError = false) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function initFallingValorant() {
  const bgContainer = document.createElement('div');
  bgContainer.className = 'falling-valorant-container';
  const symbols = ['VP', '⚔️', '🎯', '🔥', '🛡️'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'falling-val';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = (Math.random() * -100) + 'px';
    el.style.fontSize = (Math.floor(Math.random() * 18) + 14) + 'px';
    el.style.animationDuration = (Math.floor(Math.random() * 10) + 8) + 's';
    el.style.animationDelay = (Math.random() * 8) + 's';
    bgContainer.appendChild(el);
  }
  document.body.prepend(bgContainer);
}

function renderLayout(activePage) {
  initFallingValorant();
  const discordLink = localStorage.getItem('vanguard_discord') || 'https://discord.gg/vanguardval';
  AppState.updateUI();
}
// MAMİXVP visual layer: keeps the existing application state and handlers intact.
(function(){
  document.documentElement.dataset.brand='MAMİXVP';
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href="index.html"]').forEach(function(el){
      el.setAttribute('aria-label','MAMİXVP Ana Sayfa');
    });
  });
})();
