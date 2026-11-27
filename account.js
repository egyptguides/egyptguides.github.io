import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, getDoc, setDoc, doc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDRlkK67bw_Hm9U2x7BRyWp3giyrUcF-zs",
  authDomain: "egyptguides-site.firebaseapp.com",
  projectId: "egyptguides-site",
  storageBucket: "egyptguides-site.firebasestorage.app",
  messagingSenderId: "1092733638464",
  appId: "1:1092733638464:web:d773f27f91d05218d08ca5"
});
const auth = getAuth(app), db = getFirestore(app);
const $ = s => document.querySelector(s);
const T = {
 en:{prof:"My profile",rv_h:"Your review",rv_p:"Tell other travelers about your trip. Reviews are checked before they appear on the site.",rv_s:"Rating",rv_c:"Country (optional)",rv_t:"Your review",rv_send:"Send review",rv_del:"Delete my review",rv_ok:"Thank you! Your review was sent and will appear after approval.",rv_pend:"Status: waiting for approval",rv_pub:"Status: published on the site",rv_short:"Please write at least a few words.",bk_h:"My bookings",si:"Sign in",so:"Sign out",mb:"My bookings",t_in:"Sign in or create an account",t_p:"An account lets you save your booking requests and follow their status.",g:"Continue with Google",or:"or",em:"Email",pw:"Password (6+ characters)",nm:"Your name",login:"Sign in",create:"Create account",forgot:"Forgot password?",sent:"Password reset email sent.",save:"Save request to my account",saved:"Saved to your account. Now send it on WhatsApp to confirm.",needin:"Sign in to save this request to your account.",none:"No bookings yet.",st_new:"New",st_confirmed:"Confirmed",st_cancelled:"Cancelled",hi:"Signed in as",priv:"Privacy notice",wait:"Please wait...",err:"Something went wrong. Check your details and try again.",e_empty:"Please enter your email and password.",e_mail:"That email address does not look right.",e_cred:"Wrong email or password.",e_inuse:"This email already has an account. Try signing in instead.",e_weak:"Password is too short. Use at least 6 characters.",e_popup:"The Google window was blocked or closed. Allow pop-ups for this site and try again.",e_net:"Network problem. Check your connection and try again.",e_many:"Too many attempts. Please wait a few minutes and try again.",nonm:"Please enter your name in the form first.",note:"Optional. The WhatsApp button works without an account."},
 de:{prof:"Mein Profil",rv_h:"Ihre Bewertung",rv_p:"Erzählen Sie anderen Reisenden von Ihrer Reise. Bewertungen werden geprüft, bevor sie auf der Seite erscheinen.",rv_s:"Bewertung",rv_c:"Land (optional)",rv_t:"Ihre Bewertung",rv_send:"Bewertung senden",rv_del:"Meine Bewertung löschen",rv_ok:"Danke! Ihre Bewertung wurde gesendet und erscheint nach Freigabe.",rv_pend:"Status: wartet auf Freigabe",rv_pub:"Status: auf der Seite veröffentlicht",rv_short:"Bitte schreiben Sie ein paar Worte.",bk_h:"Meine Buchungen",si:"Anmelden",so:"Abmelden",mb:"Meine Buchungen",t_in:"Anmelden oder Konto erstellen",t_p:"Mit einem Konto können Sie Ihre Anfragen speichern und den Status verfolgen.",g:"Weiter mit Google",or:"oder",em:"E-Mail",pw:"Passwort (mind. 6 Zeichen)",nm:"Ihr Name",login:"Anmelden",create:"Konto erstellen",forgot:"Passwort vergessen?",sent:"E-Mail zum Zurücksetzen gesendet.",save:"Anfrage in meinem Konto speichern",saved:"In Ihrem Konto gespeichert. Senden Sie sie jetzt per WhatsApp zur Bestätigung.",needin:"Melden Sie sich an, um diese Anfrage zu speichern.",none:"Noch keine Buchungen.",st_new:"Neu",st_confirmed:"Bestätigt",st_cancelled:"Storniert",hi:"Angemeldet als",priv:"Datenschutz",wait:"Bitte warten...",err:"Etwas ist schiefgelaufen. Bitte prüfen Sie Ihre Angaben.",e_empty:"Bitte E-Mail und Passwort eingeben.",e_mail:"Die E-Mail-Adresse scheint nicht korrekt zu sein.",e_cred:"E-Mail oder Passwort ist falsch.",e_inuse:"Für diese E-Mail gibt es bereits ein Konto. Bitte melden Sie sich an.",e_weak:"Das Passwort ist zu kurz (mindestens 6 Zeichen).",e_popup:"Das Google-Fenster wurde blockiert oder geschlossen. Bitte Pop-ups erlauben und erneut versuchen.",e_net:"Netzwerkproblem. Bitte Verbindung prüfen.",e_many:"Zu viele Versuche. Bitte einige Minuten warten.",nonm:"Bitte geben Sie zuerst Ihren Namen im Formular ein.",note:"Optional. Der WhatsApp-Button funktioniert auch ohne Konto."},
 ar:{prof:"ملفي الشخصي",rv_h:"تقييمك",rv_p:"احكي للمسافرين التانيين عن رحلتك. التقييمات بتتراجع قبل ما تظهر على الموقع.",rv_s:"التقييم",rv_c:"الدولة (اختياري)",rv_t:"تقييمك",rv_send:"ابعت التقييم",rv_del:"امسح تقييمي",rv_ok:"شكراً! التقييم اتبعت وهيظهر بعد الموافقة.",rv_pend:"الحالة: في انتظار الموافقة",rv_pub:"الحالة: منشور على الموقع",rv_short:"اكتب كام كلمة على الأقل.",bk_h:"حجوزاتي",si:"تسجيل الدخول",so:"تسجيل الخروج",mb:"حجوزاتي",t_in:"سجّل الدخول أو أنشئ حساب",t_p:"الحساب بيخليك تحفظ طلبات الحجز وتتابع حالتها.",g:"المتابعة بحساب Google",or:"أو",em:"البريد الإلكتروني",pw:"كلمة المرور (6 أحرف على الأقل)",nm:"اسمك",login:"دخول",create:"إنشاء حساب",forgot:"نسيت كلمة المرور؟",sent:"تم إرسال رابط إعادة تعيين كلمة المرور.",save:"احفظ الطلب في حسابي",saved:"تم الحفظ في حسابك. ابعته دلوقتي على واتساب للتأكيد.",needin:"سجّل الدخول عشان تحفظ الطلب في حسابك.",none:"لا توجد حجوزات بعد.",st_new:"جديد",st_confirmed:"مؤكد",st_cancelled:"ملغي",hi:"مسجّل باسم",priv:"سياسة الخصوصية",wait:"من فضلك انتظر...",err:"حصلت مشكلة. راجع بياناتك وحاول تاني.",e_empty:"اكتب الإيميل والباسورد.",e_mail:"الإيميل مش مكتوب صح.",e_cred:"الإيميل أو الباسورد غلط.",e_inuse:"الإيميل ده عليه حساب بالفعل. جرّب تسجّل دخول.",e_weak:"الباسورد قصير، اكتب 6 حروف على الأقل.",e_popup:"نافذة جوجل اتقفلت أو اتحجبت. اسمح بالـ pop-ups للموقع وحاول تاني.",e_net:"مشكلة في الاتصال. راجع النت وحاول تاني.",e_many:"محاولات كتير. استنى كام دقيقة وحاول تاني.",nonm:"اكتب اسمك في النموذج الأول.",note:"اختياري. زر واتساب شغال من غير حساب."}
};
const lg = () => (document.documentElement.lang in T ? document.documentElement.lang : "en");
const t = k => T[lg()][k];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let user = null, mode = "in";

// header button
const tools = document.querySelector(".util .tools");
const btn = document.createElement("button");
btn.className = "chip-btn acct-btn"; btn.type = "button";
tools && tools.appendChild(btn);

// modal
const modal = document.createElement("div");
modal.className = "acct-modal"; modal.setAttribute("role","dialog"); modal.setAttribute("aria-modal","true");
modal.innerHTML = '<div class="acct-box"><button class="acct-x" type="button" aria-label="Close">×</button><div id="acctBody"></div></div>';
document.body.appendChild(modal);
const body = modal.querySelector("#acctBody");
const open = () => { modal.classList.add("open"); render(); };
const close = () => modal.classList.remove("open");
modal.addEventListener("click", e => { if (e.target === modal || e.target.closest(".acct-x")) close(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
btn.addEventListener("click", open);

function msg(text, err) { const m = body.querySelector(".acct-msg"); if (m) { m.textContent = text || ""; m.classList.toggle("err", !!err); } }
function privLink() { const base = location.pathname.includes("/travel-tips/") ? "../" : ""; return '<p class="acct-priv"><a href="' + base + 'privacy.html">' + t("priv") + '</a></p>'; }

async function render() {
  if (!modal.classList.contains("open")) return;
  if (!user) {
    body.innerHTML = '<h2>' + t("t_in") + '</h2><p>' + t("t_p") + '</p>' +
      '<button class="btn gbtn" id="gBtn" type="button">' + t("g") + '</button><div class="acct-sep">' + t("or") + '</div>' +
      (mode === "up" ? '<input id="aName" autocomplete="name" placeholder="' + t("nm") + '">' : '') +
      '<input id="aEm" type="email" autocomplete="email" placeholder="' + t("em") + '" dir="ltr">' +
      '<input id="aPw" type="password" autocomplete="' + (mode === "up" ? "new-password" : "current-password") + '" placeholder="' + t("pw") + '" dir="ltr">' +
      '<button class="btn primary" id="aGo" type="button">' + (mode === "up" ? t("create") : t("login")) + '</button>' +
      '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><button class="acct-link" id="aSw" type="button">' + (mode === "up" ? t("login") : t("create")) + '</button><button class="acct-link" id="aFg" type="button">' + t("forgot") + '</button></div>' +
      '<div class="acct-msg" aria-live="polite"></div>' + privLink();
    body.querySelector("#gBtn").onclick = () => run(() => signInWithPopup(auth, new GoogleAuthProvider()));
    body.querySelector("#aSw").onclick = () => { mode = mode === "up" ? "in" : "up"; render(); };
    body.querySelector("#aFg").onclick = async () => { const e = body.querySelector("#aEm").value.trim(); if (!e) { msg(t("e_empty"), true); return; } try { await sendPasswordResetEmail(auth, e); msg(t("sent")); } catch (x) { msg(errMsg(x), true); } };
    body.querySelector("#aGo").onclick = () => {
      const e = body.querySelector("#aEm").value.trim(), p = body.querySelector("#aPw").value;
      if (!e || !p) { msg(t("e_empty"), true); return; }
      if (mode === "up") run(async () => { const n = body.querySelector("#aName") && body.querySelector("#aName").value.trim(); const c = await createUserWithEmailAndPassword(auth, e, p); if (n) { await updateProfile(c.user, { displayName: n }); render(); } });
      else run(() => signInWithEmailAndPassword(auth, e, p));
    };
  } else {
    body.innerHTML = '<h2>' + t("prof") + '</h2><p>' + (user.displayName ? '<b>' + esc(user.displayName) + '</b> · ' : '') + t("hi") + ' <b dir="ltr">' + esc(user.email) + '</b></p><h3 class="acct-h3">' + t("bk_h") + '</h3><div class="acct-list" id="bl">' + t("wait") + '</div>' +
      '<h3 class="acct-h3">' + t("rv_h") + '</h3><p>' + t("rv_p") + '</p><select id="rvS" aria-label="' + t("rv_s") + '"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option><option value="2">★★☆☆☆</option><option value="1">★☆☆☆☆</option></select>' +
      '<input id="rvC" maxlength="60" placeholder="' + t("rv_c") + '"><textarea id="rvT" maxlength="1500" rows="4" placeholder="' + t("rv_t") + '"></textarea>' +
      '<button class="btn primary" id="rvGo" type="button">' + t("rv_send") + '</button><button class="acct-link" id="rvDel" type="button" hidden>' + t("rv_del") + '</button><div class="acct-msg" id="rvM" aria-live="polite"></div>' +
      '<button class="btn outline" id="aOut" type="button" style="margin-top:14px">' + t("so") + '</button>' + privLink();
    body.querySelector("#aOut").onclick = async () => { await signOut(auth); close(); };
    const rm = x => { const m = body.querySelector("#rvM"); if (m) m.textContent = x || ""; };
    const rref = doc(db, "reviews", user.uid);
    try {
      const rs = await getDoc(rref);
      if (rs.exists()) { const r = rs.data(); body.querySelector("#rvS").value = String(r.stars); body.querySelector("#rvC").value = r.country || ""; body.querySelector("#rvT").value = r.text || ""; body.querySelector("#rvDel").hidden = false; rm(t(r.approved ? "rv_pub" : "rv_pend")); }
    } catch (x) {}
    body.querySelector("#rvGo").onclick = async () => {
      const text = body.querySelector("#rvT").value.trim();
      if (text.length < 5) { rm(t("rv_short")); return; }
      try {
        await setDoc(rref, { uid: user.uid, name: (user.displayName || "Guest").slice(0, 80), country: body.querySelector("#rvC").value.trim().slice(0, 60), stars: parseInt(body.querySelector("#rvS").value, 10), text: text, lang: lg(), approved: false, createdAt: serverTimestamp() });
        body.querySelector("#rvDel").hidden = false; rm(t("rv_ok"));
      } catch (x) { rm(t("err")); }
    };
    body.querySelector("#rvDel").onclick = async () => { try { await deleteDoc(rref); body.querySelector("#rvT").value = ""; body.querySelector("#rvDel").hidden = true; rm(""); } catch (x) { rm(t("err")); } };
    try {
      const snap = await getDocs(query(collection(db, "bookings"), where("uid", "==", user.uid)));
      const rows = snap.docs.map(d => d.data()).sort((a, b) => (b.createdAt ? b.createdAt.seconds : 0) - (a.createdAt ? a.createdAt.seconds : 0));
      body.querySelector("#bl").innerHTML = rows.length ? rows.map(r =>
        '<div class="acct-item"><span class="acct-st ' + esc(r.status) + '">' + t("st_" + r.status) + '</span><b>' + esc(r.trip) + '</b><span>' + esc(r.date) + ' · ' + esc(r.adults) + '+' + esc(r.children) + '+' + esc(r.infants) + '</span></div>').join("") : t("none");
    } catch (x) { body.querySelector("#bl").textContent = t("err"); }
  }
}
const ERR = { "auth/invalid-email":"e_mail", "auth/missing-email":"e_empty", "auth/missing-password":"e_empty", "auth/invalid-credential":"e_cred", "auth/invalid-login-credentials":"e_cred", "auth/wrong-password":"e_cred", "auth/user-not-found":"e_cred", "auth/email-already-in-use":"e_inuse", "auth/weak-password":"e_weak", "auth/popup-blocked":"e_popup", "auth/popup-closed-by-user":"e_popup", "auth/cancelled-popup-request":"e_popup", "auth/network-request-failed":"e_net", "auth/too-many-requests":"e_many" };
function errMsg(x) { console.error("[account] auth error:", x && x.code, x && x.message); return t(ERR[x && x.code] || "err"); }
async function run(fn) { msg(t("wait")); try { await fn(); } catch (x) { msg(errMsg(x), true); } }

function label() { btn.textContent = user ? t("prof") : t("si"); }
onAuthStateChanged(auth, u => { user = u; label(); render(); saveUI(); });
new MutationObserver(() => { label(); render(); saveUI(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

// save-to-account on the request form
let box = null;
const actions = document.querySelector(".preview .actions");
if (actions) {
  box = document.createElement("div"); box.className = "acct-save";
  actions.parentNode.insertBefore(box, actions.nextSibling);
}
function saveUI() {
  if (!box) return;
  box.innerHTML = '<button class="btn outline" id="svBtn" type="button">' + t("save") + '</button><p class="note" id="svNote">' + t("note") + '</p>';
  box.querySelector("#svBtn").onclick = async () => {
    const note = box.querySelector("#svNote");
    if (!user) { note.textContent = t("needin"); open(); return; }
    const v = id => (document.querySelector(id).value || "").trim();
    const name = v("#name") || user.displayName || "";
    if (!name) { note.textContent = t("nonm"); return; }
    const trip = (typeof names === "function" ? names() : []).join(" / ") || "Custom";
    try {
      await addDoc(collection(db, "bookings"), {
        uid: user.uid, name: name.slice(0, 190), email: v("#email") || user.email || "", nationality: v("#nat"),
        trip: trip.slice(0, 500), date: v("#date"), adults: cnt.adults, children: cnt.children, infants: cnt.infants,
        language: document.querySelector("#tlang").value, budget: document.querySelector("#budget").value,
        hotel: v("#hotel"), notes: v("#notes").slice(0, 2900), lang: lg(), status: "new", createdAt: serverTimestamp()
      });
      note.textContent = t("saved");
    } catch (x) { note.textContent = t("err"); }
  };
}
label(); saveUI();

// published reviews (approved by admin only)
(async () => {
  try {
    const snap = await getDocs(query(collection(db, "reviews"), where("approved", "==", true)));
    window.FBREV = snap.docs.map(d => d.data()).sort((a, b) => (b.createdAt ? b.createdAt.seconds : 0) - (a.createdAt ? a.createdAt.seconds : 0)).map(r => ({ show: true, name: r.name, country: r.country, stars: r.stars, text_en: r.text, text_ar: r.text }));
    if (typeof window.renderReviews === "function") window.renderReviews();
  } catch (x) {}
})();
