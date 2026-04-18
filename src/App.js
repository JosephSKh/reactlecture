import { useState, useEffect, useCallback } from "react";

/* ── palette ─────────────────────────────────────────── */
const C = {
  bg: "#0d1117", surface: "#161b22", border: "#21262d",
  border2: "#30363d", text: "#e6edf3", muted: "#8b949e",
  dim: "#484f58", blue: "#58a6ff", green: "#3fb950",
  purple: "#d2a8ff", red: "#ff7b72", yellow: "#e3b341",
  teal: "#61dafb",
};

/* ── syntax hi-lighter ───────────────────────────────── */
function Code({ children, fontSize = 15 }) {
  const lines = children.trim().split("\n");
  return (
    <pre style={{
      background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 10,
      padding: "20px 26px", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize, lineHeight: 1.85, overflowX: "auto", margin: 0,
      textAlign: "left", color: C.text,
    }}>
      {lines.map((line, i) => <div key={i}>{hl(line)}</div>)}
    </pre>
  );
}
function hl(line) {
  const rules = [
    { re: /(\/\/.*$)/, c: C.dim },
    { re: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, c: "#a5d6ff" },
    { re: /\b(import|export|default|from|return|const|let|var|function|if|else|for|of|in|new|true|false|null|undefined)\b/, c: C.red },
    { re: /\b(useState|useEffect|useCallback|useRef|props|React)\b/, c: C.purple },
    { re: /(<\/?[A-Z][A-Za-z0-9]*)/, c: "#79c0ff" },
    { re: /(<\/?[a-z][a-z0-9]*)/, c: C.green },
    { re: /(\/>|>)/, c: C.green },
    { re: /\b(\d+)\b/, c: "#f8c8a0" },
  ];
  let rem = line, res = [], k = 0;
  while (rem.length > 0) {
    let matched = false;
    for (const { re, c } of rules) {
      const m = rem.match(new RegExp("^((?:(?!" + re.source + ")[\\s\\S])*?)" + re.source));
      if (m && m[2] !== undefined) {
        if (m[1]) res.push(<span key={k++}>{m[1]}</span>);
        res.push(<span key={k++} style={{ color: c }}>{m[2]}</span>);
        rem = rem.slice(m[1].length + m[2].length);
        matched = true; break;
      }
    }
    if (!matched) { res.push(<span key={k++}>{rem}</span>); rem = ""; }
  }
  return res;
}

/* ── atoms ───────────────────────────────────────────── */
const Label = ({ children, color = C.blue }) => (
  <div style={{
    fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em",
    textTransform: "uppercase", color, marginBottom: 18,
    display: "flex", alignItems: "center", gap: 8,
  }}>
    {children}
  </div>
);
const LiveDot = () => (
  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
);
const BigTitle = ({ children }) => (
  <h1 style={{
    fontFamily: "'JetBrains Mono','Courier New',monospace",
    fontSize: "clamp(28px, 4.5vw, 58px)", fontWeight: 800,
    color: C.text, margin: "0 0 20px", lineHeight: 1.1,
  }}>{children}</h1>
);
const SlideTitle = ({ children }) => (
  <h2 style={{
    fontFamily: "'JetBrains Mono','Courier New',monospace",
    fontSize: "clamp(22px, 3.5vw, 42px)", fontWeight: 800,
    color: C.text, margin: "0 0 28px", lineHeight: 1.15,
  }}>{children}</h2>
);
const Body = ({ children }) => (
  <p style={{ fontFamily: "monospace", fontSize: 17, color: C.muted, lineHeight: 1.85, margin: "0 0 14px" }}>{children}</p>
);
const Hl = ({ children, color = C.blue }) => <span style={{ color }}>{children}</span>;
const Card = ({ children, color, style = {} }) => (
  <div style={{
    background: C.surface, border: `1px solid ${color ? color + "44" : C.border}`,
    borderRadius: 12, padding: "20px 26px", ...style,
  }}>{children}</div>
);
const Chip = ({ children, color = C.blue }) => (
  <span style={{
    display: "inline-block", background: color + "18", border: `1px solid ${color}44`,
    borderRadius: 5, padding: "4px 12px", fontSize: 13, color,
    fontFamily: "monospace", margin: "4px 5px 4px 0",
  }}>{children}</span>
);
const Row = ({ children, gap = 24, style = {} }) => (
  <div style={{ display: "flex", gap, alignItems: "flex-start", ...style }}>{children}</div>
);
const Col = ({ children, style = {} }) => (
  <div style={{ flex: 1, ...style }}>{children}</div>
);

/* ── interactive demos ───────────────────────────────── */
function DomCounterDemo() {
  const [n, setN] = useState(0);
  return (
    <div style={{ textAlign: "center" }}>
      <Body>React updates the DOM automatically. You just call <Hl color={C.purple}>setN</Hl>.</Body>
      <div style={{ margin: "32px 0 24px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 72, fontWeight: 800, color: C.blue, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: C.dim, marginTop: 8 }}>click count</div>
      </div>
      <button
        onClick={() => setN(c => c + 1)}
        style={{ background: C.surface, border: `1px solid ${C.blue}66`, color: C.blue, borderRadius: 10, padding: "14px 40px", cursor: "pointer", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}
      >
        Click me 🎉
      </button>
      <div style={{ marginTop: 20, fontFamily: "monospace", fontSize: 13, color: C.dim }}>
        No querySelector. No innerText. Just state.
      </div>
    </div>
  );
}

function ComponentReuseDemo() {
  const profiles = [
    { name: "Alice", role: "Engineer", color: C.blue },
    { name: "Bob", role: "Designer", color: C.purple },
    { name: "Carol", role: "PM", color: C.green },
  ];
  const ProfileCard = ({ name, role, color }) => (
    <div style={{ background: C.surface, border: `1px solid ${color}44`, borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color, flexShrink: 0 }}>{name[0]}</div>
      <div>
        <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: C.text }}>{name}</div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>{role}</div>
      </div>
    </div>
  );
  return (
    <div>
      <Body>One component definition. Used three times — each with different props.</Body>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {profiles.map(p => <ProfileCard key={p.name} {...p} />)}
      </div>
    </div>
  );
}

function PropsLiveDemo() {
  const [name, setName] = useState("Alice");
  const [color, setColor] = useState(C.blue);
  const [emoji, setEmoji] = useState("🚀");
  return (
    <div>
      <Body>Props are like <Hl color={C.yellow}>arguments to a function</Hl>. Change them here and watch the component update.</Body>
      <Row gap={24} style={{ marginTop: 12 }}>
        <Col>
          <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: C.blue, minWidth: 50 }}>name</span>
              <input value={name} onChange={e => setName(e.target.value)}
                style={{ flex: 1, background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 6, color: C.text, padding: "6px 12px", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
            </label>
            <label style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: C.blue, minWidth: 50 }}>color</span>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 36, height: 30, border: "none", background: "none", cursor: "pointer" }} />
              <span style={{ fontSize: 12, color: C.dim }}>{color}</span>
            </label>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.blue, minWidth: 50 }}>emoji</span>
              {["🚀", "🎉", "⚡", "🔥", "💡"].map(e => (
                <button key={e} onClick={() => setEmoji(e)}
                  style={{ background: emoji === e ? C.border2 : "transparent", border: `1px solid ${C.border2}`, borderRadius: 5, cursor: "pointer", fontSize: 18, padding: "3px 7px" }}>{e}</button>
              ))}
            </div>
          </Card>
        </Col>
        <Col style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: color + "18", border: `1px solid ${color}44`, borderRadius: 14, padding: "30px 40px", textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
            <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 24, color: C.text }}>Hello, {name}!</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, marginTop: 8 }}>color: {color}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

function StateLiveDemo() {
  const [count, setCount] = useState(0);
  const mood = count < 0 ? "😢" : count === 0 ? "😐" : count < 5 ? "🙂" : count < 10 ? "😄" : "🤩";
  return (
    <div style={{ textAlign: "center" }}>
      <Body>When <Hl color={C.purple}>setCount</Hl> is called, React re-renders the component with the new value.</Body>
      <div style={{ margin: "28px auto", maxWidth: 260 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{mood}</div>
        <div style={{ fontFamily: "monospace", fontSize: 64, fontWeight: 800, color: C.blue, lineHeight: 1 }}>{count}</div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: C.dim, marginTop: 6 }}>current count</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button onClick={() => setCount(c => c - 1)}
            style={{ background: C.surface, border: `1px solid ${C.red}55`, color: C.red, borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontFamily: "monospace", fontSize: 24, fontWeight: 800 }}>−</button>
          <button onClick={() => setCount(c => c + 1)}
            style={{ background: C.surface, border: `1px solid ${C.green}55`, color: C.green, borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontFamily: "monospace", fontSize: 24, fontWeight: 800 }}>+</button>
        </div>
        <button onClick={() => setCount(0)}
          style={{ marginTop: 12, background: "transparent", border: `1px solid ${C.border2}`, color: C.dim, borderRadius: 6, padding: "5px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 12 }}>reset</button>
      </div>
    </div>
  );
}

function EventsLiveDemo() {
  const [log, setLog] = useState([]);
  const add = msg => setLog(l => [{ msg, id: Date.now() + Math.random() }, ...l.slice(0, 7)]);
  return (
    <div>
      <Body>Interact below — watch the events fire.</Body>
      <Row gap={20} style={{ marginTop: 12 }}>
        <Col style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => add("onClick fired")}
            style={{ background: C.surface, border: `1px solid ${C.border2}`, color: C.text, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontFamily: "monospace", fontSize: 14, textAlign: "left" }}>
            Click me <span style={{ color: C.dim, fontSize: 12 }}>(onClick)</span>
          </button>
          <input placeholder="Type something…" onChange={e => add(`onChange: "${e.target.value}"`)} onFocus={() => add("onFocus")} onBlur={() => add("onBlur")}
            style={{ background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text, padding: "10px 14px", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
          <div onMouseEnter={() => add("onMouseEnter")} onMouseLeave={() => add("onMouseLeave")}
            style={{ background: C.surface, border: `1px dashed ${C.border2}`, borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 14, color: C.muted, textAlign: "center", cursor: "default" }}>
            Hover over me <span style={{ color: C.dim, fontSize: 12 }}>(onMouseEnter/Leave)</span>
          </div>
        </Col>
        <Col>
          <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 16px", minHeight: 160, fontFamily: "monospace", fontSize: 13 }}>
            {log.length === 0 && <span style={{ color: C.dim }}>// events appear here</span>}
            {log.map((l, i) => (
              <div key={l.id} style={{ color: i === 0 ? C.green : C.dim, marginBottom: 4 }}>▶ {l.msg}</div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}

function ConditionalLiveDemo() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [score, setScore] = useState(72);
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const gc = score >= 90 ? C.green : score >= 70 ? C.yellow : C.red;
  return (
    <div>
      <Body>React renders different JSX based on regular JavaScript conditions.</Body>
      <Row gap={20} style={{ marginTop: 14 }}>
        <Col>
          <Card color={C.blue} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "monospace", fontSize: 14, color: C.muted }}>isLoggedIn = <Hl color={loggedIn ? C.green : C.red}>{loggedIn.toString()}</Hl></span>
              <button onClick={() => setLoggedIn(l => !l)}
                style={{ background: loggedIn ? C.green + "22" : C.surface, border: `1px solid ${loggedIn ? C.green : C.border2}`, color: loggedIn ? C.green : C.muted, borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontFamily: "monospace", fontSize: 12 }}>
                {loggedIn ? "Log out" : "Log in"}
              </button>
            </div>
            {loggedIn
              ? <div style={{ fontFamily: "monospace", fontSize: 15, color: C.green }}>✓ Welcome back, Alice!</div>
              : <div style={{ fontFamily: "monospace", fontSize: 15, color: C.red }}>✗ Please log in to continue.</div>
            }
            {loggedIn && <div style={{ fontFamily: "monospace", fontSize: 13, color: C.yellow, marginTop: 8 }}>🔒 Admin panel (only shown via &&)</div>}
          </Card>
        </Col>
        <Col>
          <Card color={C.yellow}>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginBottom: 12 }}>Grade calculator</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <input type="range" min={0} max={100} value={score} onChange={e => setScore(+e.target.value)} style={{ flex: 1, accentColor: C.blue }} />
              <span style={{ fontFamily: "monospace", fontSize: 14, color: C.text, minWidth: 28 }}>{score}</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 36, fontWeight: 800, color: gc }}>Grade: {grade}</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function ListsLiveDemo() {
  const [items, setItems] = useState(["🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍊 Orange"]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");
  const add = () => { if (input.trim()) { setItems(f => [...f, input.trim()]); setInput(""); } };
  const remove = i => setItems(f => f.filter((_, idx) => idx !== i));
  const shown = items.filter(f => f.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <Body>Use <Hl color={C.blue}>.map()</Hl> to render a list. Every item needs a unique <Hl color={C.yellow}>key</Hl> prop.</Body>
      <Card style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add item…"
            style={{ flex: 1, background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, color: C.text, padding: "8px 12px", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
          <button onClick={add} style={{ background: "#238636", border: "1px solid #2ea043", color: "#fff", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 14, fontWeight: 700 }}>Add</button>
        </div>
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter list…"
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, color: C.text, padding: "8px 12px", fontFamily: "monospace", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {shown.length === 0 && <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 14, padding: "8px 0" }}>No items.</div>}
          {shown.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 15, color: C.text }}>{item}</span>
              <button onClick={() => remove(items.indexOf(item))} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 18, padding: "0 4px" }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 11, color: C.dim }}>{shown.length} of {items.length} items</div>
      </Card>
    </div>
  );
}

function TodoCapstone() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", done: true },
    { id: 2, text: "Build something cool", done: false },
    { id: 3, text: "Show off to friends", done: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const add = () => { if (input.trim()) { setTodos(t => [...t, { id: Date.now(), text: input.trim(), done: false }]); setInput(""); } };
  const toggle = id => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = id => setTodos(t => t.filter(x => x.id !== id));
  const shown = todos.filter(t => filter === "all" ? true : filter === "active" ? !t.done : t.done);
  const doneCount = todos.filter(t => t.done).length;
  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="What needs doing?"
          style={{ flex: 1, background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text, padding: "9px 14px", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
        <button onClick={add} style={{ background: "#238636", border: "1px solid #2ea043", color: "#fff", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 14, fontWeight: 700 }}>Add</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["all", "active", "done"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? C.border2 : "transparent", border: `1px solid ${filter === f ? C.blue : C.border2}`, color: filter === f ? C.blue : C.muted, borderRadius: 6, padding: "4px 14px", cursor: "pointer", fontFamily: "monospace", fontSize: 12 }}>{f}</button>
        ))}
      </div>
      <Card>
        {shown.map(todo => (
          <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => toggle(todo.id)}
              style={{ width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${todo.done ? C.green : C.border2}`, background: todo.done ? C.green + "22" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}>
              {todo.done && <span style={{ color: C.green, fontSize: 11, lineHeight: 1 }}>✓</span>}
            </button>
            <span style={{ flex: 1, fontFamily: "monospace", fontSize: 15, color: todo.done ? C.dim : C.text, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
            <button onClick={() => remove(todo.id)} style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontSize: 16, padding: "0 2px" }}>×</button>
          </div>
        ))}
        {shown.length === 0 && <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 14, padding: "8px 0" }}>Nothing here.</div>}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", color: C.dim, fontFamily: "monospace", fontSize: 11 }}>
          <span>{doneCount}/{todos.length} done</span>
          {doneCount > 0 && <button onClick={() => setTodos(t => t.filter(x => !x.done))} style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontFamily: "monospace", fontSize: 11, padding: 0 }}>Clear done</button>}
        </div>
      </Card>
    </div>
  );
}

/* ── slides ─────────────────────────────────────────── */
const SLIDES = [
  // 0 — title
  {
    section: "Welcome", title: "Introduction to React",
    render: () => (
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto", paddingTop: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: C.green, marginBottom: 28, letterSpacing: "0.06em" }}>
          {">"} npm create vite@latest my-app -- --template react<span style={{ animation: "blink 1s infinite", display: "inline-block" }}>█</span>
        </div>
        <BigTitle>Introduction to{"\n"}<span style={{ color: C.teal }}>React</span></BigTitle>
        <Body>Build modern, interactive UIs without losing your mind.</Body>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          {["Components", "JSX", "Props", "State", "Events", "Hooks"].map(t => <Chip key={t} color={C.teal}>{t}</Chip>)}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, marginTop: 32 }}>Use ← → arrow keys or the buttons below to navigate</div>
      </div>
    ),
  },

  // 1 — agenda
  {
    section: "Overview", title: "Agenda",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label>Today's plan</Label>
        <SlideTitle>What we'll cover</SlideTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["How websites work", "5 min"],
            ["The DOM problem → why React?", "8 min"],
            ["What is React?", "10 min"],
            ["Components", "12 min"],
            ["JSX", "15 min"],
            ["Props", "12 min"],
            ["State & useState", "15 min"],
            ["Handling Events", "10 min"],
            ["Conditional Rendering", "8 min"],
            ["Lists & Keys", "10 min"],
            ["Ecosystem + What's Next", "8 min"],
          ].map(([topic, time], i) => (
            <div key={topic} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: "monospace", fontSize: 15, color: C.text, flex: 1 }}>{topic}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: C.dim }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 2 — web layers
  {
    section: "Foundation", title: "HTML, CSS & JavaScript",
    render: () => (
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <Label>Before React</Label>
        <SlideTitle>The three layers of the web</SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          {[
            { lang: "HTML", color: "#e34c26", icon: "🏗", desc: "Structure", sub: "What's on the page" },
            { lang: "CSS", color: "#264de4", icon: "🎨", desc: "Style", sub: "How it looks" },
            { lang: "JS", color: "#f7df1e", icon: "⚡", desc: "Behaviour", sub: "How it responds" },
          ].map(({ lang, color, icon, desc, sub }) => (
            <Card key={lang} color={color} style={{ textAlign: "center", padding: "32px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 26, color, marginBottom: 6 }}>{lang}</div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: C.text, marginBottom: 4 }}>{desc}</div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>{sub}</div>
            </Card>
          ))}
        </div>
        <Card style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {["Browser loads URL", "→", "Gets HTML", "→", "Loads CSS & JS", "→", "Page is interactive"].map((s, i) => (
              <span key={i} style={{ fontFamily: "monospace", fontSize: 14, color: i % 2 === 1 ? C.blue : C.text }}>{s}</span>
            ))}
          </div>
        </Card>
      </div>
    ),
  },

  // 3 — DOM problem
  {
    section: "Why React?", title: "The DOM Problem",
    render: () => (
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <Label color={C.red}>The problem</Label>
        <SlideTitle>Manually managing the DOM <Hl color={C.red}>hurts</Hl></SlideTitle>
        <Body>Every time data changes, you have to find each element and update it by hand.</Body>
        <Code fontSize={14}>{`// A single button click might need to update MANY places
document.getElementById('count').innerText = n;
document.getElementById('title').innerText = 'Clicked ' + n + ' times';
document.getElementById('badge').style.display = n > 0 ? 'block' : 'none';
document.getElementById('reset-btn').disabled = n === 0;
// ...and 6 more elements 😰
// What if you forget one? What if the IDs change?`}</Code>
        <Card style={{ marginTop: 20 }}>
          <Body><Hl color={C.blue}>React's answer:</Hl> You describe <em>what</em> the UI should look like. React figures out <em>which</em> DOM changes to make.</Body>
        </Card>
      </div>
    ),
  },

  // 4 — DOM demo
  {
    section: "Why React?", title: "React handles the DOM for you",
    live: true,
    render: () => (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Label color={C.green}><LiveDot /> Live demo</Label>
        <SlideTitle>You update <Hl color={C.purple}>state</Hl>. React updates the DOM.</SlideTitle>
        <Code fontSize={14}>{`function Counter() {
  const [n, setN] = useState(0);

  return (
    <button onClick={() => setN(n + 1)}>
      Clicked {n} times
    </button>
  );
}`}</Code>
        <div style={{ marginTop: 28 }}>
          <DomCounterDemo />
        </div>
      </div>
    ),
  },

  // 5 — what is React
  {
    section: "React", title: "What is React?",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.teal}>React</Label>
        <SlideTitle>A <Hl color={C.teal}>JavaScript library</Hl> for building UIs</SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Made by Meta", color: C.blue, body: "Open-sourced in 2013. Used by Facebook, Instagram — and millions of other sites." },
            { title: "Just JavaScript", color: C.yellow, body: "No magic. React is a library you import. Your logic is plain JS." },
            { title: "Component-based", color: C.purple, body: "Build your UI from small, reusable pieces — like LEGO bricks." },
            { title: "Declarative", color: C.green, body: "Describe what your UI should look like. React handles the how." },
          ].map(({ title, color, body }) => (
            <Card key={title} color={color} style={{ padding: "24px" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 17, color, marginBottom: 10 }}>{title}</div>
              <Body>{body}</Body>
            </Card>
          ))}
        </div>
      </div>
    ),
  },

  // 6 — component concept
  {
    section: "Components", title: "Components",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <Label color={C.purple}>Core concept</Label>
        <SlideTitle>A component is a <Hl color={C.purple}>reusable piece of UI</Hl></SlideTitle>
        <Body>Every React app is a tree of components. You build the pieces — React assembles the page.</Body>
        <Code fontSize={15}>{`// A component is just a JavaScript function
// that returns JSX (HTML-like syntax)

function WelcomeBanner() {
  return (
    <div className="banner">
      <h1>Welcome to React! 👋</h1>
      <p>Let's build something great.</p>
    </div>
  );
}

// Use it like an HTML tag
<WelcomeBanner />`}</Code>
        <Card style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["Starts with a Capital letter", "Returns JSX", "Can be reused anywhere", "Can contain other components"].map((r, i) => (
              <Chip key={i} color={C.purple}>✓ {r}</Chip>
            ))}
          </div>
        </Card>
      </div>
    ),
  },

  // 7 — component reuse demo
  {
    section: "Components", title: "Define once. Use everywhere.",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}><LiveDot /> Live demo</Label>
        <SlideTitle>One component. <Hl color={C.green}>Many instances.</Hl></SlideTitle>
        <ComponentReuseDemo />
      </div>
    ),
  },

  // 8 — JSX what is it
  {
    section: "JSX", title: "JSX",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <Label color={C.yellow}>Syntax</Label>
        <SlideTitle>JSX — <Hl color={C.yellow}>HTML inside JavaScript</Hl></SlideTitle>
        <Body>JSX isn't a string. It compiles down to regular JavaScript function calls.</Body>
        <Code fontSize={15}>{`// You write JSX:
const element = <h1>Hello, world!</h1>;

// Babel compiles it to:
const element = React.createElement(
  'h1',
  null,
  'Hello, world!'
);`}</Code>
        <div style={{ marginTop: 20 }}>
          <Body>Embed any JavaScript expression using <Hl color={C.blue}>{"{ }"}</Hl>:</Body>
          <Code fontSize={15}>{`const name = "Alice";
const age  = 25;

return (
  <h1>Hello, {name}! You are {age} years old.</h1>
  // { } can hold any JS expression:
  // {2 + 2}  {name.toUpperCase()}  {isAdmin ? "Admin" : "User"}
);`}</Code>
        </div>
      </div>
    ),
  },

  // 9 — JSX rules
  {
    section: "JSX", title: "JSX Rules",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.yellow}>Common gotchas</Label>
        <SlideTitle>A few things JSX does differently</SlideTitle>
        <Row gap={20}>
          <Col>
            <Card color={C.red} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.red, marginBottom: 12 }}>❌ Common mistakes</div>
              <Code fontSize={13}>{`// Two root elements
return (
  <h1>Title</h1>
  <p>Text</p>
);

// HTML attribute names
<div class="box">
<label for="inp">
<img src="...">
<input>`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.green, marginBottom: 12 }}>✅ Correct versions</div>
              <Code fontSize={13}>{`// Wrap in a Fragment <> or a div
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);

// JSX uses camelCase
<div className="box">
<label htmlFor="inp">
<img src="..." />
<input />`}</Code>
            </Card>
          </Col>
        </Row>
      </div>
    ),
  },

  // 10 — props concept
  {
    section: "Props", title: "Props",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <Label color={C.green}>Data flow</Label>
        <SlideTitle>Props — <Hl color={C.green}>passing data into components</Hl></SlideTitle>
        <Body>Props are like arguments to a function. A parent passes them in; the child reads them. They're <Hl color={C.text}>read-only</Hl>.</Body>
        <Code fontSize={15}>{`// Define a component that accepts props
function Greeting({ name, color }) {
  return <h1 style={{ color }}>Hello, {name}!</h1>;
}

// Pass props from the parent
<Greeting name="Alice" color="blue" />
<Greeting name="Bob"   color="green" />
<Greeting name="Carol" color="purple" />`}</Code>
        <Card style={{ marginTop: 20 }}>
          <Body><Hl color={C.blue}>Default values:</Hl> <code style={{ fontFamily: "monospace", color: C.yellow, fontSize: 14 }}>{`function Card({ size = 16 }) { ... }`}</code> — used when the prop isn't passed.</Body>
        </Card>
      </div>
    ),
  },

  // 11 — props demo
  {
    section: "Props", title: "Props are like function arguments",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.green}><LiveDot /> Live demo</Label>
        <SlideTitle>Change the props. Watch the component update.</SlideTitle>
        <PropsLiveDemo />
      </div>
    ),
  },

  // 12 — state concept
  {
    section: "State", title: "State",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.purple}>Reactivity</Label>
        <SlideTitle>State — <Hl color={C.purple}>data that changes over time</Hl></SlideTitle>
        <Body>Props come from the parent. State lives <Hl color={C.text}>inside</Hl> the component. When state changes, React re-renders automatically.</Body>
        <Row gap={20} style={{ marginTop: 8 }}>
          <Col>
            <Card color={C.muted}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.muted, marginBottom: 10 }}>Props</div>
              {["Passed from parent", "Read-only", "Like fn arguments"].map((t, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginBottom: 6 }}>→ {t}</div>)}
            </Card>
          </Col>
          <Col>
            <Card color={C.purple}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.purple, marginBottom: 10 }}>State</div>
              {["Defined inside component", "Can change with setter fn", "Triggers a re-render"].map((t, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginBottom: 6 }}>→ {t}</div>)}
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 16 }}>
          <Body><Hl color={C.yellow}>When do you need state?</Hl> Whenever something on screen needs to change: a counter, form input, open/closed modal, fetched data, selected tab…</Body>
        </Card>
      </div>
    ),
  },

  // 13 — useState syntax
  {
    section: "State", title: "useState",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <Label color={C.purple}>Hook</Label>
        <SlideTitle><Hl color={C.purple}>useState</Hl> — your first Hook</SlideTitle>
        <Body>A Hook is a special React function that adds capabilities to your component.</Body>
        <Code fontSize={15}>{`import { useState } from 'react';

function Counter() {
  //        ↓ value    ↓ setter      ↓ initial value
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`}</Code>
        <Row gap={16} style={{ marginTop: 20 }}>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.green, fontWeight: 700, marginBottom: 8 }}>✅ Always use the setter</div>
              <Code fontSize={13}>{`setCount(count + 1); // ✅`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.red}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.red, fontWeight: 700, marginBottom: 8 }}>❌ Never mutate directly</div>
              <Code fontSize={13}>{`count = count + 1; // ❌`}</Code>
            </Card>
          </Col>
        </Row>
      </div>
    ),
  },

  // 14 — state demo
  {
    section: "State", title: "useState in action",
    live: true,
    render: () => (
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <Label color={C.purple}><LiveDot /> Live demo</Label>
        <SlideTitle>State changes → <Hl color={C.purple}>React re-renders</Hl></SlideTitle>
        <StateLiveDemo />
      </div>
    ),
  },

  // 15 — events concept
  {
    section: "Events", title: "Handling Events",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <Label color={C.blue}>Interactivity</Label>
        <SlideTitle>Events in React — <Hl color={C.blue}>camelCase + functions</Hl></SlideTitle>
        <Body>Same events as the browser — just camelCase. You pass a function reference, not a string.</Body>
        <Code fontSize={15}>{`// ❌ Wrong — calls the function immediately on render
<button onClick={handleClick()}>

// ✅ Right — passes the function, called on click
<button onClick={handleClick}>

// ✅ Arrow function — useful when you need arguments
<button onClick={() => deleteItem(item.id)}>

// The event object is passed automatically
<input onChange={(e) => setName(e.target.value)} />`}</Code>
        <Card style={{ marginTop: 20 }}>
          <Body>Common events: <Chip>onClick</Chip><Chip>onChange</Chip><Chip>onSubmit</Chip><Chip>onFocus</Chip><Chip>onBlur</Chip><Chip>onKeyDown</Chip><Chip>onMouseEnter</Chip></Body>
        </Card>
      </div>
    ),
  },

  // 16 — events demo
  {
    section: "Events", title: "Events firing live",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.blue}><LiveDot /> Live demo</Label>
        <SlideTitle>See events fire in real time</SlideTitle>
        <EventsLiveDemo />
      </div>
    ),
  },

  // 17 — conditional concept
  {
    section: "Conditional", title: "Conditional Rendering",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.yellow}>Patterns</Label>
        <SlideTitle>Show or hide UI with <Hl color={C.yellow}>plain JS logic</Hl></SlideTitle>
        <Body>No special directive needed — just JavaScript inside your JSX.</Body>
        <Row gap={20}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, marginBottom: 8 }}>Ternary (most common)</div>
            <Code fontSize={14}>{`{isLoggedIn
  ? <Dashboard />
  : <LoginPage />
}`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, margin: "16px 0 8px" }}>Short-circuit (show or nothing)</div>
            <Code fontSize={14}>{`{isAdmin && <DeleteButton />}`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, marginBottom: 8 }}>if/else (in the function body)</div>
            <Code fontSize={14}>{`function Page() {
  if (isLoading) {
    return <Spinner />;
  }
  return <Content />;
}`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, margin: "16px 0 8px" }}>Conditional style</div>
            <Code fontSize={14}>{`<p style={{
  color: error ? 'red' : 'green'
}}>`}</Code>
          </Col>
        </Row>
      </div>
    ),
  },

  // 18 — conditional demo
  {
    section: "Conditional", title: "Conditional rendering live",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.yellow}><LiveDot /> Live demo</Label>
        <SlideTitle>UI changes based on <Hl color={C.yellow}>state conditions</Hl></SlideTitle>
        <ConditionalLiveDemo />
      </div>
    ),
  },

  // 19 — lists concept
  {
    section: "Lists", title: "Lists & Keys",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <Label color={C.teal}>Patterns</Label>
        <SlideTitle>Render arrays with <Hl color={C.blue}>.map()</Hl> and <Hl color={C.yellow}>key</Hl></SlideTitle>
        <Body>Use JavaScript's <code style={{ fontFamily: "monospace", color: C.blue }}>Array.map()</code> to turn data into JSX. Each item needs a unique <code style={{ fontFamily: "monospace", color: C.yellow }}>key</code> prop.</Body>
        <Code fontSize={15}>{`const fruits = ["Apple", "Banana", "Grapes"];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
        //  ↑ key helps React track which item is which
      ))}
    </ul>
  );
}`}</Code>
        <Card style={{ marginTop: 20 }}>
          <Body><Hl color={C.yellow}>Why key?</Hl> Without it, React doesn't know which item changed — it re-renders the whole list every time. Use a unique ID when possible instead of index.</Body>
        </Card>
      </div>
    ),
  },

  // 20 — lists demo
  {
    section: "Lists", title: "Lists in action",
    live: true,
    render: () => (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Label color={C.teal}><LiveDot /> Live demo</Label>
        <SlideTitle>Add, remove, and filter a list</SlideTitle>
        <ListsLiveDemo />
      </div>
    ),
  },

  // 21 — capstone code
  {
    section: "Capstone", title: "Putting it all together",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}>Full example</Label>
        <SlideTitle>A complete <Hl color={C.green}>Todo App</Hl></SlideTitle>
        <Body>Every concept we've learned in one component.</Body>
        <Code fontSize={13}>{`function TodoApp() {
  const [todos, setTodos] = useState([]);      // state
  const [input, setInput] = useState("");      // state

  const add = () => {
    setTodos([...todos, { id: Date.now(),      // spread
                          text: input, done: false }]);
    setInput("");
  };

  const toggle = (id) => setTodos(             // .map()
    todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    )
  );

  return (
    <>
      <input value={input}
             onChange={e => setInput(e.target.value)} />
      <button onClick={add}>Add</button>

      {todos.map(todo => (                     // list
        <li key={todo.id}                      // key
            onClick={() => toggle(todo.id)}
            style={{ textDecoration:           // conditional
              todo.done ? 'line-through' : '' }}>
          {todo.text}
        </li>
      ))}
    </>
  );
}`}</Code>
      </div>
    ),
  },

  // 22 — capstone demo
  {
    section: "Capstone", title: "Todo App — live",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}><LiveDot /> Live demo</Label>
        <SlideTitle>State · Events · Conditionals · Lists — all together</SlideTitle>
        <TodoCapstone />
      </div>
    ),
  },

  // 23 — ecosystem
  {
    section: "Ecosystem", title: "The React Ecosystem",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.teal}>Beyond today</Label>
        <SlideTitle>React is just the start</SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { name: "Next.js", color: C.text, cat: "Framework", desc: "Full-stack React — routing, SSR, API" },
            { name: "React Router", color: "#f44250", cat: "Routing", desc: "Client-side navigation" },
            { name: "Zustand", color: C.yellow, cat: "State", desc: "Global state — simple & fast" },
            { name: "React Query", color: "#ff4154", cat: "Data", desc: "Fetch & cache server data" },
            { name: "Tailwind CSS", color: "#38bdf8", cat: "Styling", desc: "Utility-first CSS" },
            { name: "React Native", color: C.teal, cat: "Mobile", desc: "iOS & Android with React" },
          ].map(({ name, color, cat, desc }) => (
            <Card key={name} color={color} style={{ padding: "18px 20px" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, color, fontSize: 15, marginBottom: 4 }}>{name}</div>
              <Chip color={color}>{cat}</Chip>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginTop: 8 }}>{desc}</div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },

  // 24 — summary
  {
    section: "Summary", title: "What we covered",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}>Wrap-up</Label>
        <SlideTitle>You now know the <Hl color={C.green}>fundamentals</Hl></SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["🏗", "HTML/CSS/JS", "The three layers of the web"],
            ["⚛", "React", "A library for building component-based UIs"],
            ["🧩", "Components", "Reusable functions that return JSX"],
            ["📝", "JSX", "HTML-like syntax inside JavaScript"],
            ["📦", "Props", "Read-only data passed from parent to child"],
            ["🔄", "State", "Internal data that triggers re-renders"],
            ["🪝", "useState", "The hook that gives components memory"],
            ["🖱", "Events", "camelCase handlers — pass a function, not a call"],
            ["❓", "Conditional", "Ternary & && to show/hide UI"],
            ["📋", "Lists", ".map() + key prop for rendering arrays"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12, padding: "10px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: C.text }}>{title}</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 25 — what's next
  {
    section: "Next Steps", title: "What's Next",
    render: () => (
      <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🚀</div>
        <BigTitle>Go <Hl color={C.green}>build something!</Hl></BigTitle>
        <Body>The best way to learn React is to build things. Start small, break things, Google everything.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left", margin: "28px 0" }}>
          {[
            ["📚", "docs.react.dev", "The official docs — excellent & modern"],
            ["⚡", "npm create vite@latest", "Scaffold a new project instantly"],
            ["🎓", "react.dev/learn", "Interactive tutorial from the React team"],
            ["🛠", "Project ideas", "Todo → Weather app → Clone a site you love"],
          ].map(([icon, title, desc]) => (
            <Card key={title}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: C.blue, marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{desc}</div>
            </Card>
          ))}
        </div>
        <Code fontSize={14}>{`npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev`}</Code>
      </div>
    ),
  },
];

/* ── shell ─────────────────────────────────────────── */
export default function ReactLecture() {
  const [cur, setCur] = useState(0);
  const [anim, setAnim] = useState(null);

  const go = useCallback((d) => {
    const n = cur + d;
    if (n < 0 || n >= SLIDES.length) return;
    setAnim(d > 0 ? "out-left" : "out-right");
    setTimeout(() => { setCur(n); setAnim("in"); setTimeout(() => setAnim(null), 250); }, 180);
  }, [cur]);

  const jump = useCallback((i) => {
    if (i === cur) return;
    setAnim(i > cur ? "out-left" : "out-right");
    setTimeout(() => { setCur(i); setAnim("in"); setTimeout(() => setAnim(null), 250); }, 180);
  }, [cur]);

  useEffect(() => {
    const h = e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  const slide = SLIDES[cur];
  const pct = (cur / (SLIDES.length - 1)) * 100;

  const animStyle = {
    "out-left": { opacity: 0, transform: "translateX(-32px)", transition: "all 0.18s ease" },
    "out-right": { opacity: 0, transform: "translateX(32px)", transition: "all 0.18s ease" },
    "in": { opacity: 0, transform: "translateY(10px)" },
    null: { opacity: 1, transform: "none", transition: "all 0.22s ease" },
  }[anim] || {};

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border2}; border-radius: 2px; }
        input[type=range] { accent-color: ${C.blue}; }
      `}</style>

      {/* top bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "monospace", fontSize: 12, color: C.dim }}>
          <span>react-lecture.jsx</span>
          {slide.live && <span style={{ color: C.green, display: "flex", alignItems: "center", gap: 5 }}><LiveDot />interactive</span>}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim }}>{cur + 1} / {SLIDES.length}</div>
      </div>

      {/* section + minimap */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "5px 22px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, whiteSpace: "nowrap", marginRight: 6 }}>{slide.section}</span>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => jump(i)} title={s.title}
            style={{ width: i === cur ? 18 : 6, height: 6, borderRadius: 3, background: i === cur ? C.blue : i < cur ? C.green + "88" : C.border, border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "all 0.25s" }} />
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "monospace", fontSize: 9, color: C.dim, whiteSpace: "nowrap" }}>← → keys</span>
      </div>

      {/* slide content */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "40px 44px", width: "100%", maxWidth: 1020, margin: "0 auto", ...animStyle }}>
          {slide.render()}
        </div>
      </div>

      {/* nav */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "10px 22px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={() => go(-1)} disabled={cur === 0}
          style={{ fontFamily: "monospace", fontSize: 12, padding: "6px 18px", background: cur === 0 ? "transparent" : C.border, border: `1px solid ${cur === 0 ? C.border : C.border2}`, borderRadius: 7, color: cur === 0 ? C.dim : C.text, cursor: cur === 0 ? "default" : "pointer" }}>
          ← prev
        </button>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: C.blue, transition: "width 0.35s ease" }} />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, maxWidth: 220, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{slide.title}</span>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: C.blue, transition: "width 0.35s ease" }} />
        </div>
        <button onClick={() => go(1)} disabled={cur === SLIDES.length - 1}
          style={{ fontFamily: "monospace", fontSize: 12, padding: "6px 18px", background: cur === SLIDES.length - 1 ? "transparent" : C.border, border: `1px solid ${cur === SLIDES.length - 1 ? C.border : C.border2}`, borderRadius: 7, color: cur === SLIDES.length - 1 ? C.dim : C.text, cursor: cur === SLIDES.length - 1 ? "default" : "pointer" }}>
          next →
        </button>
      </div>
    </div>
  );
}