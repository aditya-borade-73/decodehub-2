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
    label: "Other",
    items: [
      {
        id: "sha256",
        name: "SHA-256",
        shortDesc: "computes the SHA-256 cryptographic hash of the input. Produces a 64-character hex string. Widely used for data integrity verification.",
        encode: async (s) => {
          const msgBuffer = new TextEncoder().encode(s);
          const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },
        decode: (_) => { throw new Error("SHA-256 is a one-way hash function and cannot be decoded."); },
      },
      {
        id: "sha1",
        name: "SHA-1",
        shortDesc: "computes the SHA-1 cryptographic hash. Produces a 40-character hex string. Considered cryptographically broken but still used for legacy compatibility.",
        encode: async (s) => {
          const msgBuffer = new TextEncoder().encode(s);
          const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },
        decode: (_) => { throw new Error("SHA-1 is a one-way hash function and cannot be decoded."); },
      },
      {
        id: "md5",
        name: "MD5",
        shortDesc: "computes the MD5 message digest. Produces a 32-character hex string. No longer secure for cryptographic purposes but still used for checksums.",
        encode: (s) => {
          // Simple MD5 implementation for client-side use
          const md5cycle = (x, k) => {
            let a = x[0], b = x[1], c = x[2], d = x[3];
            const ff = (a, b, c, d, x, s, t) => { const n = a + (b & c | ~b & d) + x + t; return ((n << s) | (n >>> (32 - s))) + b; };
            const gg = (a, b, c, d, x, s, t) => { const n = a + (b & d | c & ~d) + x + t; return ((n << s) | (n >>> (32 - s))) + b; };
            const hh = (a, b, c, d, x, s, t) => { const n = a + (b ^ c ^ d) + x + t; return ((n << s) | (n >>> (32 - s))) + b; };
            const ii = (a, b, c, d, x, s, t) => { const n = a + (c ^ (b | ~d)) + x + t; return ((n << s) | (n >>> (32 - s))) + b; };
            a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
            a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
            a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
            a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
            x[0] = (x[0] + a) >>> 0; x[1] = (x[1] + b) >>> 0; x[2] = (x[2] + c) >>> 0; x[3] = (x[3] + d) >>> 0;
          };
          const md5blk = (s) => {
            const md5blks = [];
            for (let i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            return md5blks;
          };
          let state = [1732584193, -271733879, -1732584194, 271733878];
          const n = s.length;
          const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let i = 0; i < n; i += 64) {
            const block = md5blk(s.substring(i, i + 64));
            md5cycle(state, block);
          }
          s = s.substring(n - n % 64);
          let i = n % 64;
          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) { md5cycle(state, tail); for (let i = 0; i < 16; i++) tail[i] = 0; }
          tail[14] = n * 8;
          md5cycle(state, tail);
          return Array(4).fill(0).map((_, i) => ('00000000' + (state[i] >>> 0).toString(16)).slice(-8)).join('');
        },
        decode: (_) => { throw new Error("MD5 is a one-way hash function and cannot be decoded."); },
      },
      {
        id: "rot13",
        name: "ROT13",
        shortDesc: "replaces each letter with the one 13 positions after it in the alphabet. Applying it twice returns the original — it is its own inverse.",
        encode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0)-b+13)%26)+b); }),
        decode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0)-b+13)%26)+b); }),
      },
      {
        id: "rot47",
        name: "ROT47",
        shortDesc: "rotates ASCII characters in the range 33-126 by 47 positions. Encodes letters, numbers, and symbols.",
        encode: (s) => s.replace(/[!-~]/g, c => String.fromCharCode(33 + (c.charCodeAt(0) - 33 + 47) % 94)),
        decode: (s) => s.replace(/[!-~]/g, c => String.fromCharCode(33 + (c.charCodeAt(0) - 33 + 47) % 94)),
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
      {
        id: "caesar",
        name: "Caesar (ROT3)",
        shortDesc: "shifts each letter by 3 positions in the alphabet (Caesar cipher). One of the simplest encryption techniques.",
        encode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0)-b+3)%26)+b); }),
        decode: (s) => s.replace(/[a-zA-Z]/g, c => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0)-b+23)%26)+b); }),
      },
    ],
  },
];

const ALL_ENCODINGS = CATEGORIES.flatMap(c => c.items);
let selectedEncoding = ALL_ENCODINGS[0];
let mode = "encode";

// Get encoding from current page (for separate HTML files)
function getEncodingFromPage() {
  // Check if TOOL_ID is defined (set in individual tool HTML files)
  if (typeof TOOL_ID !== 'undefined') {
    return ALL_ENCODINGS.find(e => e.id === TOOL_ID);
  }
  // Fallback: try to get from URL path
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  const encodingId = filename.replace(/-/g, '_');
  return ALL_ENCODINGS.find(e => e.id === encodingId);
}

const inputEl      = document.getElementById("inputText");
const outputEl     = document.getElementById("outputText");
const errorMsg     = document.getElementById("errorMsg");
const infoName     = document.getElementById("infoName");
const infoDesc     = document.getElementById("infoDesc");
const clearBtn     = document.getElementById("clearBtn");
const copyBtn      = document.getElementById("copyBtn");
const sampleBtn    = document.getElementById("sampleBtn");
const encodeBtn    = document.getElementById("encodeBtn");
const decodeBtn    = document.getElementById("decodeBtn");
const sidebarList  = document.getElementById("sidebarList");
const darkToggle   = document.getElementById("darkToggle");
const toolTitle    = document.getElementById("toolTitle");
const toolSubtitle = document.getElementById("toolSubtitle");
const breadcrumbCategory = document.getElementById("breadcrumbCategory");

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
  // If sidebarList doesn't exist (on individual tool pages with static sidebar), skip
  if (!sidebarList) return;
  
  sidebarList.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const label = document.createElement("div");
    label.className = "category-label";
    label.textContent = cat.label;
    sidebarList.appendChild(label);
    cat.items.forEach(enc => {
      const link = document.createElement("a");
      link.href = '/encode-decode/' + enc.id.replace(/_/g, '-');
      link.className = "sidebar-item" + (enc.id === selectedEncoding.id ? " selected" : "");
      link.textContent = enc.name;
      sidebarList.appendChild(link);
    });
  });
}

// No hash changes needed for separate HTML files

// Sample data for each encoding
const SAMPLE_DATA = {
  base64: "Hello World",
  base64url: "Hello World",
  base32: "Hello World",
  unicode_escape: "Hello World",
  json_escape: 'Hello "World"',
  url_encode: "Hello World! @#$%",
  url_full: "Hello World",
  html_entities: '<div class="test">Hello & World</div>',
  html_full: "Hello World",
  json_prettify: '{"name":"John","age":30,"city":"New York"}',
  jwt_decode: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  hex: "Hello World",
  binary: "Hello",
  octal: "Hello",
  decimal: "Hello",
  ascii_codes: "Hello",
  rot13: "Hello World",
  rot47: "Hello World",
  atbash: "Hello World",
  morse: "HELLO WORLD",
  caesar: "Hello World",
  sha256: "Hello World",
  sha1: "Hello World",
  md5: "Hello World",
};

function updateInfo() {
  infoName.textContent = selectedEncoding.name + " ";
  infoDesc.textContent = selectedEncoding.shortDesc;
  
  // Update tool header
  const category = CATEGORIES.find(c => c.items.some(i => i.id === selectedEncoding.id));
  if (category) {
    breadcrumbCategory.textContent = category.label;
  }
  toolTitle.textContent = selectedEncoding.name + " Encode / Decode";
  
  // Update subtitle based on encoding
  const subtitles = {
    base64: "Encode and decode text using Base64 encoding scheme",
    base64url: "URL-safe Base64 variant for web applications",
    base32: "Encode and decode using Base32 alphabet",
    unicode_escape: "Convert text to Unicode escape sequences",
    json_escape: "Escape special characters for JSON strings",
    url_encode: "Percent-encode special characters for URLs",
    url_full: "Encode all characters to percent-encoded form",
    html_entities: "Convert special characters to HTML entities",
    html_full: "Encode all characters as HTML entities",
    json_prettify: "Format and minify JSON data",
    jwt_decode: "Decode JSON Web Token header and payload",
    hex: "Convert text to hexadecimal representation",
    binary: "Convert text to binary representation",
    octal: "Convert text to octal representation",
    decimal: "Convert text to decimal ASCII codes",
    ascii_codes: "Convert characters to ASCII/Unicode values",
    rot13: "Rotate letters by 13 positions",
    rot47: "Rotate ASCII characters by 47 positions",
    atbash: "Substitute letters with reverse alphabet",
    morse: "Convert text to Morse code",
    caesar: "Shift letters by 3 positions (Caesar cipher)",
    sha256: "Generate SHA-256 hash of input text",
    sha1: "Generate SHA-1 hash of input text",
    md5: "Generate MD5 hash of input text",
  };
  toolSubtitle.textContent = subtitles[selectedEncoding.id] || "Encode and decode text";
}

function updateCounts() {
  // Character counts removed in new design
}

async function run() {
  const input = inputEl.value;
  if (errorMsg) errorMsg.textContent = "";
  outputEl.parentElement.classList.remove("error-state");

  if (!input.trim()) {
    outputEl.value = "";
    return;
  }

  try {
    const fn = mode === "encode" ? selectedEncoding.encode : selectedEncoding.decode;
    const result = await fn(input);
    outputEl.value = result;
  } catch (e) {
    outputEl.value = "";
    outputEl.parentElement.classList.add("error-state");
    if (errorMsg) errorMsg.textContent = e.message || "Could not process input.";
  }
}

function setMode(m) {
  mode = m;
  encodeBtn.classList.toggle("active", m === "encode");
  decodeBtn.classList.toggle("active", m === "decode");
  inputEl.placeholder = m === "encode"
    ? "Enter text to encode..."
    : "Enter text to decode...";
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
inputEl.addEventListener("input", () => { run(); });

clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  outputEl.value = "";
  if (errorMsg) errorMsg.textContent = "";
  outputEl.parentElement.classList.remove("error-state");
  inputEl.focus();
});

sampleBtn.addEventListener("click", () => {
  const sample = SAMPLE_DATA[selectedEncoding.id] || "Hello World";
  inputEl.value = sample;
  run();
});

copyBtn.addEventListener("click", () => copyText(outputEl.value, copyBtn));

// Check current page on load
const pageEncoding = getEncodingFromPage();
if (pageEncoding) {
  selectedEncoding = pageEncoding;
}

// Update format count if element exists
const formatCountEl = document.getElementById("formatCount");
if (formatCountEl) {
  formatCountEl.textContent = ALL_ENCODINGS.length + " formats";
}

buildSidebar();
updateInfo();
updateCounts();