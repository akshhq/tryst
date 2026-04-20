// ================= simulator.js =================

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ===== CONFIG =====
const URL = "https://script.google.com/macros/s/AKfycbziAlj2zqIrnktyPRolQ3i_zctCi9EMp0vfFay6l5gEsfDbXKNgzzQPbUaVBRZLSACI/exec";
const SECRET = "TRYST2026";

// ===== LOAD EVENTS =====
const TRYST_EVENTS = require("./events.json");

const EVENTS = Object.values(TRYST_EVENTS)
  .filter(e => !e.descriptionOnly)
  .map(e => e.title);

// ===== FILE FILTER (IMAGES + PDF ONLY) =====
const allowedExt = [".jpg", ".jpeg", ".png", ".pdf"];

const allFiles = fs.readdirSync(__dirname)
  .map(name => path.join(__dirname, name))
  .filter(p => {
    try {
      const ext = path.extname(p).toLowerCase();
      return fs.statSync(p).isFile() && allowedExt.includes(ext);
    } catch {
      return false;
    }
  });

if (allFiles.length === 0) {
  console.log("❌ No valid image/pdf files found in folder");
  process.exit(1);
}

function getRandomFile() {
  return allFiles[Math.floor(Math.random() * allFiles.length)];
}

// ===== FILE → BASE64 =====
function fileToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  let mime = "image/jpeg";
  if (ext === ".png") mime = "image/png";
  if (ext === ".pdf") mime = "application/pdf";

  return `data:${mime};base64,${file.toString("base64")}`;
}

// ===== RANDOM DATA =====
function randPhone() {
  return "9" + Math.floor(100000000 + Math.random() * 900000000);
}

function randEmail(tag) {
  return `${tag}_${Date.now()}_${Math.floor(Math.random()*1000)}@test.com`;
}

function randName(i) {
  return `Trial User ${i} trial`;
}

// ===== ATTENDEE =====
function createAttendee(i) {
  return {
    token: SECRET,
    formType: "attendee",

    name: randName(i),
    email: randEmail("att"),
    phone: randPhone(),

    college: "Test College",
    course: "B.Tech",
    year: "2nd Year",
    gender: "Male",

    collegeId: fileToBase64(getRandomFile()),
    task1: fileToBase64(getRandomFile()),
    task2: fileToBase64(getRandomFile())
  };
}

// ===== SOLO =====
function createSolo(event, i) {
  return {
    token: SECRET,
    formType: "event",

    event: event,
    type: "solo",
    brand: `SoloBrand${i}`,

    mainEmail: randEmail("solo"),
    mainPhone: randPhone(),

    members: [
      {
        name: randName(i),
        email: randEmail("solo"),
        phone: randPhone(),
        course: "B.Tech",
        year: "2nd Year",
        idFile: fileToBase64(getRandomFile())
      }
    ]
  };
}

// ===== GROUP =====
function createGroup(event, i) {
  const size = 3 + Math.floor(Math.random() * 3);
  const members = [];

  for (let j = 1; j <= size; j++) {
    members.push({
      name: `${randName(i)}_${j}`,
      email: randEmail("grp"),
      phone: randPhone(),
      course: "B.Tech",
      year: "2nd Year",
      idFile: fileToBase64(getRandomFile())
    });
  }

  return {
    token: SECRET,
    formType: "event",

    event: event,
    type: "group",
    brand: `GroupBrand${i}`,

    mainEmail: members[0].email,
    mainPhone: members[0].phone,

    members: members
  };
}

// ===== TYPE LOGIC =====
function getType(event) {
  if (event.toLowerCase().includes("solo")) return ["solo"];
  if (event.toLowerCase().includes("group")) return ["group"];
  return ["solo", "group"];
}

// ===== SEND =====
async function send(payload, label) {
  try {
    const formData = new URLSearchParams();
    formData.append("payload", JSON.stringify(payload));

    const res = await axios.post(URL, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log(`✅ ${label}:`, res.data);

  } catch (err) {
    console.log(`❌ ${label}:`, err.message);
  }
}

function delay() {
  return new Promise(r => setTimeout(r, 2000));
}

// ===== MAIN =====
async function run(X) {
  let counter = 1;

  console.log("\n🔥 STARTING TEST\n");

  for (let i = 1; i <= X; i++) {
    await send(createAttendee(i), `ATTENDEE ${counter++}`);
    await delay();
  }

  for (const event of EVENTS) {
    const types = getType(event);

    for (let i = 1; i <= X; i++) {
      for (const type of types) {

        if (type === "solo") {
          await send(createSolo(event, i), `${event} SOLO ${counter++}`);
        }

        if (type === "group") {
          await send(createGroup(event, i), `${event} GROUP ${counter++}`);
        }

        await delay();
      }
    }
  }

  console.log("\n✅ TEST COMPLETE\n");
}

// ===== INPUT =====
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter X registrations per type: ", (ans) => {
  run(parseInt(ans));
  rl.close();
});


// ================= events.json =================
// (unchanged)