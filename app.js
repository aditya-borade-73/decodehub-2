const CATEGORIES = [
  {
    label: "Text",
    items: [
      {
        id: "base64",
        name: "Base64",
        shortDesc: "encodes binary data as ASCII text using 64 printable characters. Commonly used in email attachments, data URIs, and HTTP auth headers.",
        encode: (s) => btoa(unescape(encodeURIComponent(s))),
        decode: (s) => decodeURIComponent(escape(atob(s.trim()))),
      },
      {
        id: "base64url",
        name: "Base64 URL",
        shortDesc: "URL-safe Base64 variant replacing + with - and / with _. Safe for use in URLs and filenames without percent-encoding.",
        encode: (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),
        decode: (s) => {
          let b = s.trim().replace(/-/g,"+").replace(/_/g,"/");
          while (b.length % 4) b += "=";
          return decodeURIComponent(escape(atob(b)));
        },
      },
      {
        id: "base32",
        name: "Base32",
        shortDesc: "encodes data using 32 uppercase letters (A–Z) and digits (2–7). Human-readable and case-insensitive, used in TOTP tokens and Onion addresses.",
        encode: (s) => {
          const bytes = new TextEncoder().encode(s);
          const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
          let bits = 0, value = 0, out = "";
          for (const byte of bytes) {
            value = (value << 8) | byte; bits += 8;
            while (bits >= 5) { out += alpha[(value >>> (bits - 5)) & 31]; bits -= 5; }
          }
          if (bits > 0) out += alpha[(value << (5 - bits)) & 31];
          while (out.length % 8) out += "=";
          return out;
        },
        decode: (s) => {
          const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
          s = s.toUpperCase().replace(/=+$/,"");
          const bytes = []; let bits = 0, value = 0;
          for (const c of s) {
            const idx = alpha.indexOf(c); if (idx === -1) continue;
            value = (value << 5) | idx; bits += 5;
            if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8; }
          }
          return new TextDecoder().decode(new Uint8Array(bytes));
        },
      },
      {
        id: "unicode_escape",
        name: "Unicode Escape",
        shortDesc: "converts each character to a \\uXXXX escape sequence. Used in JavaScript string literals and various programming environments.",
        encode: (s) => Array.from(s).map(c => "\\u" + c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")).join(""),
        decode: (s) => s.replace(/\\u([0-9A-Fa-f]{4,6})/g, (_,h) => String.fromCodePoint(parseInt(h,16))),
      },
      {
        id: "json_escape",
        name: "JSON Escape",
        shortDesc: "escapes special characters (quotes, backslashes, newlines, etc.) so a string can be safely embedded inside a JSON value.",
        encode: (s) => JSON.stringify(s).slice(1,-1),
        decode: (s) => JSON.parse('"' + s.replace(/"/g,'\\"') + '"'),
      },
    ],
  },
  {
    label: "URL",
    items: [
      {
        id: "url_encode",
        name: "URL Encode",
        shortDesc: "percent-encodes special characters with % followed by their hex value, making strings safe for use in URLs.",
        encode: (s) => encodeURIComponent(s),
        decode: (s) => decodeURIComponent(s),
      },
      {
        id: "url_full",
        name: "URL Full Encode",
        shortDesc: "encodes every character — including letters and digits — into percent-encoded form. More aggressive than standard URL encoding.",
        encode: (s) => Array.from(new TextEncoder().encode(s)).map(b => "%" + b.toString(16).toUpperCase().padStart(2,"0")).join(""),
        decode: (s) => decodeURIComponent(s),
      },
    ],
  },
  {
    label: "HTML",
    items: [
      {
        id: "html_entities",
        name: "HTML Entities",
        shortDesc: "converts special HTML characters (<, >, &, \") into entity equivalents to prevent XSS issues and display problems in web pages.",
        encode: (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),
        decode: (s) => { const el = document.createElement("textarea"); el.innerHTML = s; return el.value; },
      },
      {
        id: "html_full",
        name: "HTML Full Encode",
        shortDesc: "encodes every character as a decimal HTML entity (&#NNN;), not just special ones. Fully obfuscates text in HTML source while keeping it visually identical.",
        encode: (s) => Array.from(s).map(c => "&#" + c.codePointAt(0) + ";").join(""),
        decode: (s) => { const el = document.createElement("textarea"); el.innerHTML = s; return el.value; },
      },
    ],
  },
  {
    label: "JSON",
    items: [
      {
        id: "json_prettify",
        name: "JSON Prettify",
        shortDesc: "formats raw or minified JSON into a human-readable, indented structure. Encode = prettify (2-space indent). Decode = minify (compact).",
        encode: (s) => JSON.stringify(JSON.parse(s), null, 2),
        decode: (s) => JSON.stringify(JSON.parse(s)),
      },
    ],
  },
  {
    label: "Token",
    items: [
      {
        id: "jwt_decode",
        name: "JWT Decode",
        shortDesc: "decodes a JSON Web Token (JWT) and displays its header and payload as formatted JSON. Does not verify the signature — decode-only tool.",
        encode: (_) => { throw new Error("JWT Decode is decode-only. Switch to Decode mode and paste your JWT."); },
        decode: (s) => {
          const parts = s.trim().split(".");
          if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 parts separated by '.'");
          const decode64 = (str) => {
            str = str.replace(/-/g,"+").replace(/_/g,"/");
            while (str.length % 4) str += "=";
            return JSON.parse(decodeURIComponent(escape(atob(str))));
          };
          const header = decode64(parts[0]);
          const payload = decode64(parts[1]);
          return JSON.stringify({ header, payload }, null, 2);
        },
      },
    ],
  },
  {
    label: "Binary",
    items: [
      {
        id: "hex",
        name: "Hex",
        shortDesc: "converts each character to its hexadecimal UTF-8 byte representation. Used for binary inspection, color codes, and low-level debugging.",
        encode: (s) => Array.from(new TextEncoder().encode(s)).map(b => b.toString(16).padStart(2,"0")).join(" "),
        decode: (s) => new TextDecoder().decode(new Uint8Array(s.replace(/\s+/g,"").match(/.{1,2}/g).map(h => parseInt(h,16)))),
      },
      {
        id: "binary",
        name: "Binary",
        shortDesc: "represents each character as an 8-bit binary number. Useful for understanding data at the bit level.",
        encode: (s) => Array.from(new TextEncoder().encode(s)).map(b => b.toString(2).padStart(8,"0")).join(" "),
        decode: (s) => new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).map(b => parseInt(b,2)))),
      },
      {
        id: "octal",
        name: "Octal",
        shortDesc: "represents each character byte as a base-8 number. Used in Unix file permissions and some legacy programming contexts.",
        encode: (s) => Array.from(new TextEncoder().encode(s)).map(b => b.toString(8).padStart(3,"0")).join(" "),
        decode: (s) => new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).map(b => parseInt(b,8)))),
      },
      {
        id: "decimal",
        name: "Decimal",
        shortDesc: "represents each character as its decimal ASCII/UTF-8 byte value. Useful for inspecting character codes in a readable number format.",
        encode: (s) => Array.from(new TextEncoder().encode(s)).map(b => b.toString(10)).join(" "),
        decode: (s) => new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).map(b => parseInt(b,10)))),
      },
      {
        id: "ascii_codes",
        name: "ASCII Codes",
        shortDesc: "converts each character to its numeric Unicode code point. Helpful for debugging encoding issues and working with character values.",
        encode: (s) => Array.from(s).map(c => c.codePointAt(0)).join(" "),
        decode: (s) => s.trim().split(/\s+/).map(n => String.fromCodePoint(parseInt(n))).join(""),
      },
    ],
  },
  {
    label: "Cipher",
    items: [
      {
        id: "rot13",
        name: "ROT13",
        shortDesc: "replaces each letter with the one 13 positions after it in the alphabet. Applying it twice returns the original — it is its own inverse.",
        encode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0)-b+13)%26)+b); }),
        decode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0)-b+13)%26)+b); }),
      },
      {
        id: "atbash",
        name: "Atbash",
        shortDesc: "substitutes each letter with the corresponding letter in reverse alphabetical order (A=Z, B=Y…). One of the oldest known ciphers.",
        encode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(25-(c.charCodeAt(0)-b)+b); }),
        decode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(25-(c.charCodeAt(0)-b)+b); }),
      },
      {
        id: "morse",
        name: "Morse Code",
        shortDesc: "represents letters and digits as dots and dashes. Developed in the 1840s for telegraph communication. Words are separated by /.",
        encode: (s) => {
          const M = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."};
          return s.toUpperCase().split("").map(c => c===" " ? "/" : (M[c]||"?")).join(" ");
        },
        decode: (s) => {
          const M = {".-":"A","-...":"B","-.-.":"C","-..":"D",".":"E","..-.":"F","--.":"G","....":"H","..":"I",".---":"J","-.-":"K",".-..":"L","--":"M","-.":"N","---":"O",".--.":"P","--.-":"Q",".-.":"R","...":"S","-":"T","..-":"U","...-":"V",".--":"W","-..-":"X","-.--":"Y","--..":"Z","-----":"0",".----":"1","..---":"2","...--":"3","....-":"4",".....":"5","-....":"6","--...":"7","---..":"8","----.":"9"};
          return s.split(" / ").map(w => w.trim().split(" ").map(c => M[c]||"?").join("")).join(" ");
        },
      },
    ],
  },
  {
    label: "Fun",
    items: [
      {
        id: "leet",
        name: "Leet Speak",
        shortDesc: "replaces letters with visually similar numbers or symbols (E→3, A→4, S→5). Originated in hacker culture in the 1980s.",
        encode: (s) => s.replace(/[aeiostzb]/gi, c => ({a:"4",e:"3",i:"1",o:"0",s:"5",t:"7",z:"2",b:"8"})[c.toLowerCase()]),
        decode: (s) => s.replace(/[43105728]/g, n => ({"4":"a","3":"e","1":"i","0":"o","5":"s","7":"t","2":"z","8":"b"})[n]||n),
      },
      {
        id: "pig_latin",
        name: "Pig Latin",
        shortDesc: "moves leading consonants to the end and appends 'ay', or appends 'way' if the word starts with a vowel.",
        encode: (s) => s.split(" ").map(w => { const m = w.match(/^([^aeiouAEIOU]*)([aeiouAEIOU].*)$/i); if(!m) return w+"way"; return m[2]+m[1]+"ay"; }).join(" "),
        decode: (s) => s.split(" ").map(w => { if(w.endsWith("way")) return w.slice(0,-3); const m = w.match(/^(.+)([a-z]+)ay$/); if(!m) return w; return m[2]+m[1].replace(/ay$/,""); }).join(" "),
      },
      {
        id: "reverse",
        name: "Reverse",
        shortDesc: "reverses the order of characters in the input string. Applying it twice returns the original text.",
        encode: (s) => Array.from(s).reverse().join(""),
        decode: (s) => Array.from(s).reverse().join(""),
      },
    ],
  },
];

const ALL_ENCODINGS = CATEGORIES.flatMap(c => c.items);
let selectedEncoding = ALL_ENCODINGS[0];
let mode = "encode";

const inputEl      = document.getElementById("inputText");
const outputEl     = document.getElementById("outputText");
const charCount    = document.getElementById("charCount");
const byteCount    = document.getElementById("byteCount");
const outputCount  = document.getElementById("outputCount");
const errorMsg     = document.getElementById("errorMsg");
const infoName     = document.getElementById("infoName");
const infoDesc     = document.getElementById("infoDesc");
const clearBtn     = document.getElementById("clearBtn");
const swapBtn      = document.getElementById("swapBtn");
const copyBtn      = document.getElementById("copyBtn");
const copyInputBtn = document.getElementById("copyInputBtn");
const encodeBtn    = document.getElementById("encodeBtn");
const decodeBtn    = document.getElementById("decodeBtn");
const sidebarList  = document.getElementById("sidebarList");
const darkToggle   = document.getElementById("darkToggle");

/* ─── DARK MODE ─── */
function applyDark(on) {
  document.documentElement.classList.toggle("dark", on);
  localStorage.setItem("theme", on ? "dark" : "light");
}
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyDark(savedTheme === "dark" || (!savedTheme && prefersDark));
darkToggle.addEventListener("click", () => applyDark(!document.documentElement.classList.contains("dark")));

/* ─── SIDEBAR ─── */
function buildSidebar() {
  sidebarList.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const label = document.createElement("div");
    label.className = "category-label";
    label.textContent = cat.label;
    sidebarList.appendChild(label);
    cat.items.forEach(enc => {
      const btn = document.createElement("button");
      btn.className = "sidebar-item" + (enc.id === selectedEncoding.id ? " selected" : "");
      btn.textContent = enc.name;
      btn.addEventListener("click", () => {
        selectedEncoding = enc;
        buildSidebar();
        updateInfo();
        run();
        btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      sidebarList.appendChild(btn);
    });
  });
}

function updateInfo() {
  infoName.textContent = selectedEncoding.name + " ";
  infoDesc.textContent = selectedEncoding.shortDesc;
}

function updateCounts() {
  const val = inputEl.value;
  charCount.textContent = val.length.toLocaleString() + " char" + (val.length !== 1 ? "s" : "");
  const bytes = new TextEncoder().encode(val).length;
  byteCount.textContent = bytes.toLocaleString() + " byte" + (bytes !== 1 ? "s" : "");
}

function run() {
  const input = inputEl.value;
  errorMsg.textContent = "";
  outputEl.parentElement.classList.remove("error-state");

  if (!input.trim()) {
    outputEl.value = "";
    outputCount.textContent = "";
    return;
  }

  try {
    const fn = mode === "encode" ? selectedEncoding.encode : selectedEncoding.decode;
    const result = fn(input);
    outputEl.value = result;
    const len = result.length;
    outputCount.textContent = len.toLocaleString() + " char" + (len !== 1 ? "s" : "");
  } catch (e) {
    outputEl.value = "";
    outputCount.textContent = "";
    outputEl.parentElement.classList.add("error-state");
    errorMsg.textContent = e.message || "Could not process input.";
  }
}

function setMode(m) {
  mode = m;
  encodeBtn.classList.toggle("active", m === "encode");
  decodeBtn.classList.toggle("active", m === "decode");
  inputEl.placeholder = m === "encode"
    ? "Type or paste text to encode..."
    : "Type or paste encoded text to decode...";
  run();
}

async function copyText(text, btn) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy");
    document.body.removeChild(ta);
  }
  btn.textContent = "Copied!";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.innerHTML = btn === copyInputBtn
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`
      : "Copy";
    btn.classList.remove("copied");
  }, 1600);
}

encodeBtn.addEventListener("click", () => setMode("encode"));
decodeBtn.addEventListener("click", () => setMode("decode"));
inputEl.addEventListener("input", () => { updateCounts(); run(); });

clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  outputEl.value = "";
  errorMsg.textContent = "";
  outputCount.textContent = "";
  outputEl.parentElement.classList.remove("error-state");
  updateCounts();
  inputEl.focus();
});

swapBtn.addEventListener("click", () => {
  const out = outputEl.value;
  if (!out) return;
  inputEl.value = out;
  setMode(mode === "encode" ? "decode" : "encode");
  updateCounts();
});

copyBtn.addEventListener("click", () => copyText(outputEl.value, copyBtn));
copyInputBtn.addEventListener("click", () => copyText(inputEl.value, copyInputBtn));

document.getElementById("formatCount").textContent = ALL_ENCODINGS.length + " formats";
buildSidebar();
updateInfo();
updateCounts();