// main.js — Intelligent Space Group Chat (FULL updated)
// - Works in Telegram WebApp + normal browser (fallback)
// - Telegram-like UI behavior, join/leave toggle, localStorage persistence
// - Sends to backend endpoints: /messages/{group}, /send-message, /update-members, /members/{group}
// -----------------------------------------------------------------------------

// ---------------------- CONFIG ----------------------
const API_BASE = "https://intelligentspace.onrender.com"; // change if needed
const POLL_INTERVAL_MS = 5000;
const MESSAGE_LIMIT_PER_GROUP = 5;
const SHARE_TEXT = "Promote your business and gain more audience and customer to patronize you and also meet new people by joining intelligent space group chat though this link below 👉 http://t.me/intelligentmarketbot/space";
const PREMIUM_PRICE_NGN = 5000;
const PREMIUM_PRICE_USD = 6;

// ---------------------- TELEGRAM FALLBACK ----------------------
if (!window.Telegram || !window.Telegram.WebApp) {
  window.Telegram = {
    WebApp: {
      expand: () => {},
      initDataUnsafe: {
        user: {
          id: "WEB_USER_001",
          first_name: "Website",
          last_name: "Tester",
          username: "webtester",
          photo_url: "https://via.placeholder.com/80"
        }
      }
    }
  };
}
const tg = window.Telegram.WebApp;

// ---------------------- STORAGE / STATE ----------------------
let poller = null;
let joinedGroups = JSON.parse(localStorage.getItem("joinedGroups") || "[]"); // array of groupIds
let premiumList = JSON.parse(localStorage.getItem("premiumList") || "[]"); // optional
let darkMode = localStorage.getItem("isDarkMode") === "true";

// ---------------------- HELPERS ----------------------
function el(id) { return document.getElementById(id); }
function q(sel, root=document) { return root.querySelector(sel); }
function safeJSON(obj) { try { return JSON.stringify(obj); } catch(e) { return "{}"; } }
function getGroupId(g) { return g.id ? String(g.id) : String(g.name); }

function linkify(text) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="chat-link">${url}</a>`);
}

function showMsg(html, type="info", autoHide=true) {
  const box = el("msgBox");
  if (!box) { console.log(`[${type}]`, html); return; }
  box.innerHTML = `<div class="msg ${type}">${html}</div>`;
  box.style.display = "block";
  if (autoHide) setTimeout(()=>{ box.style.display = "none"; }, 4500);
}

function hideMsg() {
  const box = el("msgBox");
  if (box) box.style.display = "none";
}

async function fetchJson(url, opts={}) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const t = await res.text().catch(()=>"");
      throw new Error(`${res.status} ${res.statusText} ${t}`);
    }
    return await res.json();
  } catch (err) {
    console.error("fetchJson error:", err, url, opts);
    throw err;
  }
}

function userHasJoined(groupId) {
  return joinedGroups.indexOf(groupId) !== -1;
}
function addJoined(groupId) {
  if (!userHasJoined(groupId)) {
    joinedGroups.push(groupId);
    localStorage.setItem("joinedGroups", JSON.stringify(joinedGroups));
  }
}
function removeJoined(groupId) {
  joinedGroups = joinedGroups.filter(g => g !== groupId);
  localStorage.setItem("joinedGroups", JSON.stringify(joinedGroups));
}

// ---------------------- USER INFO / THEME ----------------------
function loadUserInfoToUI() {
  const user = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : {};
  if (el("profilePic")) el("profilePic").src = user.photo_url || "https://via.placeholder.com/60";
  if (el("fullName")) el("fullName").textContent = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  if (el("username")) el("username").textContent = user.username ? "@" + user.username : "";
  if (el("userId")) el("userId").textContent = "ID: " + (user.id || "");
}

function initThemeToggle() {
  const t = el("themeToggle");
  document.body.classList.toggle("dark", darkMode);
  if (t) t.textContent = darkMode ? "☀️" : "🌙";
  if (!t) return;
  t.addEventListener("click", () => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
    t.textContent = darkMode ? "☀️" : "🌙";
    localStorage.setItem("isDarkMode", darkMode);
  });
}

// ---------------------- RENDER GROUP LIST (Groups / Hot) ----------------------
function renderGroupsList(groupArray) {
  const container = el("contentContainer");
  if (!container) return;
  container.innerHTML = "";
  groupArray.forEach((g, idx) => {
    const id = getGroupId(g);
    const members = parseInt(localStorage.getItem(g.name + "_members") || g.members || 0, 10);
    const card = document.createElement("div");
    card.className = "group-card";
    card.innerHTML = `
      <div class="group-left">
        <div class="group-name">${g.name}</div>
        <div class="group-default">${g.defaultMessages && g.defaultMessages[0] ? g.defaultMessages[0] : ""}</div>
      </div>
      <div class="group-right">
        <div id="groupMembers${idx}" class="group-members">${members} members</div>
        ${g.premium ? '<div class="premium-badge" title="Premium">★</div>' : ''}
      </div>
    `;

    // append join/leave control overlay (optional small button)
    const control = document.createElement("button");
    control.className = "group-mini-join";
    control.textContent = userHasJoined(id) ? "Leave" : "Join";
    if (userHasJoined(id)) control.classList.add("leave");
    control.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleJoinFromList(g, idx, control);
    });
    card.appendChild(control);

    // click to open chat
    card.addEventListener("click", () => openGroupChat(g, idx));
    container.appendChild(card);
  });
}

// toggle join/leave from the group list button
async function toggleJoinFromList(group, index, controlBtn) {
  const id = getGroupId(group);
  const joined = userHasJoined(id);

  if (joined) {
    // leave
    removeJoined(id);
    controlBtn.textContent = "Join";
    controlBtn.classList.remove("leave");

    // decrement members locally and on server if possible
    let members = parseInt(localStorage.getItem(group.name + "_members") || group.members || 0, 10);
    members = Math.max(0, members - 1);
    localStorage.setItem(group.name + "_members", members);
    const elm = el(`groupMembers${index}`);
    if (elm) elm.textContent = `${members} members`;

    try {
      await fetchJson(`${API_BASE}/update-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeJSON({ groupName: group.name, members })
      });
      showMsg(`You left "${group.name}"`, "info");
    } catch (err) {
      console.warn("leave update-members failed", err);
      showMsg("Left locally, but failed to update server.", "error");
    }
  } else {
    // join flow (same as join button)
    try {
      let members = parseInt(localStorage.getItem(group.name + "_members") || group.members || 0, 10);
      members += 1;
      localStorage.setItem(group.name + "_members", members);
      const elMembers = el(`groupMembers${index}`);
      if (elMembers) elMembers.textContent = `${members} members`;

      await fetchJson(`${API_BASE}/update-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeJSON({ groupName: group.name, members })
      });

      addJoined(id);
      controlBtn.textContent = "Leave";
      controlBtn.classList.add("leave");
      showMsg(`You joined "${group.name}"! 🎉`, "success");
      localStorage.setItem("taskCompleted_" + group.name, "true");
    } catch (err) {
      console.error("join from list failed", err);
      showMsg("Failed to join group (server error)", "error");
    }
  }

  // If this group is currently open in chat, update its join button too
  const joinBtnInChat = el("joinBtn");
  if (joinBtnInChat) {
    joinBtnInChat.textContent = userHasJoined(id) ? "Leave Group" : "Join Group";
    joinBtnInChat.classList.toggle("leave", userHasJoined(id));
  }
}

// ---------------------- OPEN GROUP CHAT ----------------------
async function openGroupChat(group, index) {
  currentGroup = group;
  currentGroupIndex = index;
  const container = el("contentContainer");
  if (!container) return;
container.innerHTML = `
  <div class="chat-header">
    <div class="chat-header-left">
      <button id="joinBtn" class="leave-btn">${userHasJoined(getGroupId(group)) ? "Leave Group" : "Join Group"}</button>
      <span class="chat-group-name">${group.name}</span>
    </div>
    <div class="chat-sub">${group.premium ? "Hot • Premium" : "Public"}</div>
  </div>
  <div class="messages" id="messages"></div>
  <div class="send-box">
    <input id="msgInput" placeholder="Type a message..." />
    <button id="sendBtn" class="btn">Send</button>
  </div>
`;
  const messagesDiv = el("messages");
  const sendBtn = el("sendBtn");
  const joinBtn = el("joinBtn");
  const msgInput = el("msgInput");

  if (!messagesDiv || !sendBtn || !joinBtn || !msgInput) {
    showMsg("Chat UI failed to render", "error");
    return;
  }

  // load messages
  async function loadMessages() {
    try {
      const serverMsgs = await fetchJson(`${API_BASE}/messages/${encodeURIComponent(group.name)}`);
      const all = [];

      if (group.defaultMessages && group.defaultMessages.length) {
        group.defaultMessages.forEach(dm => all.push({ fullName: "System", message: dm, system: true }));
      }
      if (Array.isArray(serverMsgs)) serverMsgs.forEach(m => all.push({ ...m, system: false }));

      const currentUserId = (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) ? tg.initDataUnsafe.user.id.toString() : "WEB_USER_001";

messagesDiv.innerHTML = all.map(m => {
  if (m.system) return `<div class="message system"><b>${m.fullName}:</b> ${linkify(m.message)}</div>`;
  const isMe = m.userId && m.userId.toString() === currentUserId;
  return `<div class="message ${isMe ? "user-right" : "user-left"}"><b>${m.fullName || m.username || "User"}:</b> ${linkify(m.message)}</div>`;
}).join("");
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (err) {
      messagesDiv.innerHTML = `<div class="msg error">Failed to load messages.</div>`;
      console.error("loadMessages error", err);
    }
  }

  // update members
  async function updateMembersDisplay() {
    try {
      const data = await fetchJson(`${API_BASE}/members/${encodeURIComponent(group.name)}`);
      const elMembers = el(`groupMembers${index}`);
      if (elMembers) elMembers.textContent = `${data.members} members`;
      localStorage.setItem(group.name + "_members", data.members);
    } catch (err) {
      console.warn("updateMembersDisplay error", err);
    }
  }

  await loadMessages();
  await updateMembersDisplay();

  // polling
  if (poller) clearInterval(poller);
  poller = setInterval(loadMessages, POLL_INTERVAL_MS);

  // join button behavior (toggle)
  joinBtn.onclick = async () => {
    const id = getGroupId(group);
    if (userHasJoined(id)) {
      // leave
      removeJoined(id);
      joinBtn.textContent = "Join Group";
      joinBtn.classList.remove("leave");

      let members = parseInt(localStorage.getItem(group.name + "_members") || group.members || 0, 10);
      members = Math.max(0, members - 1);
      localStorage.setItem(group.name + "_members", members);
      const listEl = el(`groupMembers${index}`);
      if (listEl) listEl.textContent = `${members} members`;

      try {
        await fetchJson(`${API_BASE}/update-members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: safeJSON({ groupName: group.name, members })
        });
        showMsg(`Left "${group.name}"`, "info");
      } catch (err) {
        console.warn("leave server failed", err);
        showMsg("Left locally, failed to update server", "error");
      }

      // also update list mini button if present
      const containerCards = Array.from(document.querySelectorAll(".group-card"));
      containerCards.forEach(card => {
        if (card.textContent.includes(group.name)) {
          const mini = card.querySelector(".group-mini-join");
          if (mini) { mini.textContent = "Join"; mini.classList.remove("leave"); }
        }
      });

    } else {
      // join
      // increment members locally and on server
      try {
        let members = parseInt(localStorage.getItem(group.name + "_members") || group.members || 0, 10);
        members += 1;
        localStorage.setItem(group.name + "_members", members);
        const listEl = el(`groupMembers${index}`);
        if (listEl) listEl.textContent = `${members} members`;

        await fetchJson(`${API_BASE}/update-members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: safeJSON({ groupName: group.name, members })
        });

        addJoined(getGroupId(group));
        joinBtn.textContent = "Leave Group";
        joinBtn.classList.add("leave");
        showMsg(`You joined "${group.name}"! 🎉`, "success");
        localStorage.setItem("taskCompleted_" + group.name, "true");

        // update list mini button if present
        const containerCards = Array.from(document.querySelectorAll(".group-card"));
        containerCards.forEach(card => {
          if (card.textContent.includes(group.name)) {
            const mini = card.querySelector(".group-mini-join");
            if (mini) { mini.textContent = "Leave"; mini.classList.add("leave"); }
          }
        });
      } catch (err) {
        console.error("join error", err);
        showMsg("Failed to join group (server error)", "error");
      }
    }
  };

  // send message handler
  async function sendMessageHandler() {
    const value = msgInput.value.trim();
    if (!value) return;

    const taskCompleted = localStorage.getItem("taskCompleted_" + group.name);
    const sentCount = parseInt(localStorage.getItem("sentCount_" + group.name) || "0", 10);

    if (!taskCompleted) {
      const shareHtml = `
        <div class="share-wrap">
          <p>Please share this webapp link on WhatsApp status & 5 groups before sending messages.</p>
          <button id="whatsappShareBtn" class="btn">Share to WhatsApp</button>
        </div>
      `;
      showMsg(shareHtml, "info", false);
      setTimeout(() => {
        const wb = el("whatsappShareBtn");
        if (wb) {
          wb.addEventListener("click", () => {
            window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`, "_blank");
            localStorage.setItem("taskCompleted_" + group.name, "true");
            showMsg("Thanks! You can now send messages.", "success");
          });
        }
      }, 120);
      return;
    }

    if (sentCount >= MESSAGE_LIMIT_PER_GROUP) {
      showMsg("Message limit reached in this group. Join another group or become premium.", "error");
      return;
    }

    // append locally for immediate UX
    const user = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : {};
    const displayName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || (user.username || "You");
    messagesDiv.insertAdjacentHTML("beforeend", `<div class="message user-right"><b>${displayName}:</b> ${linkify(value)}</div>`);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // send to server
    try {
      await fetchJson(`${API_BASE}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeJSON({
          groupName: group.name,
          userId: user.id ? user.id.toString() : "unknown",
          username: user.username || null,
          fullName: displayName,
          profilePic: user.photo_url || null,
          message: value
        })
      });
      localStorage.setItem("sentCount_" + group.name, (sentCount + 1).toString());
    } catch (err) {
      console.error("send-message failed", err);
      showMsg("Failed to send message to server", "error");
    }

    msgInput.value = "";
  }

  sendBtn.onclick = sendMessageHandler;
  msgInput.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); sendMessageHandler(); } };
}

// ---------------------- NAV / PREMIUM ----------------------
function setActiveNav(activeId) {
  ["groupsBtn","hotGroupsBtn","premiumBtn"].forEach(id => {
    const b = el(id);
    if (!b) return;
    b.classList.toggle("active", id === activeId);
  });
}

function initNav() {
  const g = el("groupsBtn"); if (g) g.addEventListener("click", () => { setActiveNav("groupsBtn"); renderGroupsList(window.groups || []); });
  const h = el("hotGroupsBtn"); if (h) h.addEventListener("click", () => { setActiveNav("hotGroupsBtn"); renderGroupsList(window.hotGroups || []); });
  const p = el("premiumBtn"); if (p) p.addEventListener("click", () => {
    setActiveNav("premiumBtn");
    const container = el("contentContainer");
    if (!container) return;
    container.innerHTML = `
      <div class="premium-page">
        <h2>Go Premium</h2>
        <p>Enjoy unlimited messages, priority listing, and perks.</p>
        <div class="price">NGN ${PREMIUM_PRICE_NGN} <button id="payNaira" class="btn">Pay with OPAY</button></div>
        <div class="price">USD ${PREMIUM_PRICE_USD} <button id="payUSD" class="btn">Pay with BTC</button></div>
        <p class="note">After payment, upload screenshot to verify premium status.</p>
      </div>
    `;
    setTimeout(() => {
      const pna = el("payNaira"), pusd = el("payUSD");
      if (pna) pna.addEventListener("click", ()=> showMsg(`Send NGN ${PREMIUM_PRICE_NGN} to OPAY 9114301708 (Olatunji Abdumalik Ayomide) and upload proof.`, "info"));
      if (pusd) pusd.addEventListener("click", ()=> showMsg(`Send BTC to: bc1qxhyddpkgvdc68tj9xk5gf5k2vnxmnfy4xrwwr4 and upload proof.`, "info"));
    }, 60);
  });  
}

// ---------------------- INIT ----------------------
document.addEventListener("DOMContentLoaded", () => {
  if (!el("contentContainer") || !el("msgBox")) {
    console.error("Missing UI elements: contentContainer or msgBox. Ensure index.html has them.");
  }

  try { tg.expand(); } catch(e) {}
  loadUserInfoToUI();
  initThemeToggle();
  initNav();

  // ensure default groups/hotGroups exist (you may load them from group.js/hotgroups.js)
  if (!window.groups) window.groups = [];
  if (!window.hotGroups) window.hotGroups = [];

  // initial view
  setActiveNav("groupsBtn");
  renderGroupsList(window.groups || []);
});

// cleanup
window.addEventListener("beforeunload", () => { if (poller) clearInterval(poller); });