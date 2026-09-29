/* Tabi Fani — form validation + WhatsApp hand-off */

/* ====== EDIT THESE ====== */
// Number that receives requests (international format, no + or spaces). TEST NUMBER for now.
const WHATSAPP_NUMBER = "96550000000";
// Add your real links here — they fill every Instagram/TikTok icon on the page.
const SOCIAL_LINKS = {
  instagram: "", // e.g. "https://instagram.com/yourpage"
  tiktok: ""     // e.g. "https://tiktok.com/@yourpage"
};
/* ======================== */

// Social links: hide icons until a real link is set
[["instagram", ["link-instagram", "foot-instagram"]], ["tiktok", ["link-tiktok", "foot-tiktok"]]]
  .forEach(([key, ids]) => ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (SOCIAL_LINKS[key]) el.href = SOCIAL_LINKS[key];
    else el.removeAttribute("href"); // no link yet: icon stays visible, click does nothing
  }));

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");

// Kuwait mobile numbers: 8 digits starting with 5, 6 or 9 (optional +965 / 00965)
const normalizePhone = v => v.replace(/[\s\-()]/g, "").replace(/^(\+|00)?965/, "");
const rules = {
  name:    v => v.trim().length >= 3 || "اكتب اسمك (3 حروف على الأقل)",
  phone:   v => /^[569]\d{7}$/.test(normalizePhone(v)) || "اكتب رقم كويتي صحيح من 8 أرقام",
  email:   v => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "البريد الإلكتروني مو صحيح",
  service: v => v !== "" || "اختر نوع الخدمة",
  message: () => true
};

function check(field) {
  const wrap = field.closest(".field");
  const result = rules[field.name](field.value);
  const ok = result === true;
  wrap.classList.toggle("invalid", !ok);
  wrap.querySelector(".err").textContent = ok ? "" : result;
  return ok;
}

form.addEventListener("input", e => {
  if (e.target.closest(".field")?.classList.contains("invalid")) check(e.target);
});

form.addEventListener("submit", e => {
  e.preventDefault();
  statusEl.textContent = ""; statusEl.className = "status";
  const fields = [...form.elements].filter(el => rules[el.name]);
  const allOk = fields.map(check).every(Boolean);
  if (!allOk) { fields.find(f => f.closest(".invalid"))?.focus(); return; }

  const d = Object.fromEntries(new FormData(form));
  const text = [
    "طلب جديد من موقع تبي فني",
    `الاسم: ${d.name.trim()}`,
    `الهاتف: ${normalizePhone(d.phone)}`,
    d.email.trim() && `البريد: ${d.email.trim()}`,
    `الخدمة: ${d.service}`,
    d.message.trim() && `التفاصيل: ${d.message.trim()}`
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  statusEl.textContent = "تم! كمّل الإرسال من الواتساب وبنتواصل معك قريب.";
  statusEl.classList.add("ok");
  form.reset();
});

// Demo data so you can test the flow before going live
document.getElementById("fill-test").addEventListener("click", () => {
  form.name.value = "عبدالله (تجربة)";
  form.phone.value = "50000000";
  form.email.value = "test@example.com";
  form.service.value = "صيانة التكييف";
  form.message.value = "السالمية، المكيف ما يبرد. طلب تجريبي.";
  [...form.elements].filter(el => rules[el.name]).forEach(check);
});
