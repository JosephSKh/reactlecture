import { useState, useEffect, useCallback } from "react";

/* ─── syntax highlighter ─────────────────────────────────── */
function Code({ children }) {
  const lines = children.trim().split("\n");
  return (
    <pre style={{
      background:"#0d1117",border:"1px solid #30363d",borderRadius:8,
      padding:"14px 18px",fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize:12.5,lineHeight:1.75,overflowX:"auto",margin:0,textAlign:"left",color:"#e6edf3",
    }}>
      {lines.map((line,i)=><div key={i}>{hl(line)}</div>)}
    </pre>
  );
}
function hl(line){
  const rules=[
    {re:/(\/\/.*$)/,c:"#8b949e"},
    {re:/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/,c:"#a5d6ff"},
    {re:/\b(import|export|default|from|return|const|let|var|function|if|else|for|of|in|new|true|false|null|undefined)\b/,c:"#ff7b72"},
    {re:/\b(useState|useEffect|useCallback|useRef|props|React)\b/,c:"#d2a8ff"},
    {re:/(<\/?[A-Z][A-Za-z0-9]*)/,c:"#79c0ff"},
    {re:/(<\/?[a-z][a-z0-9]*)/,c:"#7ee787"},
    {re:/(\/>|>)/,c:"#7ee787"},
    {re:/\b(\d+)\b/,c:"#f8c8a0"},
  ];
  let rem=line,res=[],k=0;
  while(rem.length>0){
    let matched=false;
    for(const{re,c}of rules){
      const m=rem.match(new RegExp("^((?:(?!"+re.source+")[\\s\\S])*?)"+re.source));
      if(m&&m[2]!==undefined){
        if(m[1])res.push(<span key={k++}>{m[1]}</span>);
        res.push(<span key={k++} style={{color:c}}>{m[2]}</span>);
        rem=rem.slice(m[1].length+m[2].length);
        matched=true;break;
      }
    }
    if(!matched){res.push(<span key={k++}>{rem}</span>);rem="";}
  }
  return res;
}

/* ─── atoms ────────────────────────────────────────────────── */
const H2=({children,color="#e6edf3"})=>
  <h2 style={{fontSize:"clamp(18px,2.8vw,32px)",fontWeight:800,color,margin:"0 0 16px",fontFamily:"'JetBrains Mono','Courier New',monospace",lineHeight:1.2}}>{children}</h2>;
const H3=({children,color="#58a6ff"})=>
  <h3 style={{fontSize:14,fontWeight:700,color,margin:"0 0 8px",fontFamily:"monospace"}}>{children}</h3>;
const P=({children})=>
  <p style={{fontSize:14,color:"#8b949e",lineHeight:1.75,margin:"0 0 10px",fontFamily:"monospace"}}>{children}</p>;
const Tag=({children,color="#58a6ff"})=>
  <span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",border:`1px solid ${color}55`,color,borderRadius:4,padding:"2px 9px",fontFamily:"monospace",display:"inline-block",marginBottom:12}}>{children}</span>;
const Chip=({children,color="#58a6ff"})=>
  <span style={{display:"inline-block",background:color+"18",border:`1px solid ${color}44`,borderRadius:4,padding:"2px 8px",fontSize:11,color,fontFamily:"monospace",margin:"2px 3px 2px 0"}}>{children}</span>;
const Card=({children,style={}})=>
  <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:10,padding:"14px 18px",...style}}>{children}</div>;
const LiveTag=()=>
  <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,color:"#3fb950",border:"1px solid #3fb95044",borderRadius:4,padding:"2px 9px",fontFamily:"monospace",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:"#3fb950",display:"inline-block"}}/>Interactive
  </span>;

/* ─── interactive demos ────────────────────────────────────── */
function DomDemo(){
  const[n,setN]=useState(0);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Card>
        <H3 color="#ff7b72">Without React</H3>
        <Code>{`// You must manually find & update
// every element that needs to change
const btn = document.getElementById('btn');
const display = document.getElementById('n');
const title = document.getElementById('title');

btn.addEventListener('click', () => {
  let n = parseInt(display.innerText);
  n++;
  display.innerText = n;       // update 1
  title.innerText = 'Clicked ' + n; // update 2
  // ...update 5 more things 😰
});`}</Code>
      </Card>
      <Card>
        <H3 color="#3fb950">With React</H3>
        <Code>{`// Just describe WHAT the UI should look like
// React handles all the DOM updates for you
function Counter() {
  const [n, setN] = useState(0);
  return (
    <div>
      <h1>Clicked {n} times</h1>
      <button onClick={() => setN(n + 1)}>
        Click me 🎉
      </button>
    </div>
  );
}`}</Code>
        <div style={{marginTop:10,padding:"10px 14px",background:"#0d1117",borderRadius:8,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <button onClick={()=>setN(c=>c+1)} style={{background:"#21262d",border:"1px solid #30363d",color:"#e6edf3",borderRadius:6,padding:"6px 16px",cursor:"pointer",fontFamily:"monospace",fontSize:13}}>Click me</button>
          <span style={{color:"#58a6ff",fontFamily:"monospace",fontSize:14}}>Clicked <b style={{color:"#e6edf3"}}>{n}</b> times 🎉</span>
        </div>
      </Card>
    </div>
  );
}

function ComponentsDemo(){
  const ProfileCard=({name,role,color})=>(
    <div style={{background:"#161b22",border:`1px solid ${color}44`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{name[0]}</div>
      <div><div style={{color:"#e6edf3",fontFamily:"monospace",fontWeight:700,fontSize:13}}>{name}</div><div style={{color:"#8b949e",fontFamily:"monospace",fontSize:11}}>{role}</div></div>
    </div>
  );
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div>
        <P>Define <b style={{color:"#d2a8ff"}}>once</b>:</P>
        <Code>{`function ProfileCard({ name, role, color }) {
  return (
    <div style={{ border: \`1px solid \${color}\` }}>
      <Avatar letter={name[0]} />
      <strong>{name}</strong>
      <p>{role}</p>
    </div>
  );
}`}</Code>
      </div>
      <div>
        <P>Reuse <b style={{color:"#3fb950"}}>many times</b>:</P>
        <Code>{`<ProfileCard name="Alice" role="Engineer"
             color="#58a6ff" />
<ProfileCard name="Bob"   role="Designer"
             color="#d2a8ff" />
<ProfileCard name="Carol" role="PM"
             color="#3fb950" />`}</Code>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:10}}>
          <ProfileCard name="Alice" role="Engineer" color="#58a6ff"/>
          <ProfileCard name="Bob" role="Designer" color="#d2a8ff"/>
          <ProfileCard name="Carol" role="PM" color="#3fb950"/>
        </div>
      </div>
    </div>
  );
}

function PropsDemo(){
  const[name,setName]=useState("Alice");
  const[color,setColor]=useState("#58a6ff");
  const[emoji,setEmoji]=useState("🚀");
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div>
        <P>Edit the props live ↓</P>
        <Card style={{display:"flex",flexDirection:"column",gap:10}}>
          <label style={{fontFamily:"monospace",fontSize:13,color:"#8b949e",display:"flex",alignItems:"center",gap:8}}>
            name:
            <input value={name} onChange={e=>setName(e.target.value)} style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:5,color:"#e6edf3",padding:"4px 10px",fontFamily:"monospace",fontSize:13,width:120}}/>
          </label>
          <label style={{fontFamily:"monospace",fontSize:13,color:"#8b949e",display:"flex",alignItems:"center",gap:8}}>
            color:
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:32,height:26,border:"none",background:"none",cursor:"pointer"}}/>
            <span style={{color:"#58a6ff",fontSize:12}}>{color}</span>
          </label>
          <div style={{fontFamily:"monospace",fontSize:13,color:"#8b949e",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            emoji:
            {["🚀","🎉","⚡","🔥","💡"].map(e=>(
              <button key={e} onClick={()=>setEmoji(e)} style={{background:emoji===e?"#21262d":"transparent",border:"1px solid #30363d",borderRadius:4,cursor:"pointer",fontSize:16,padding:"2px 6px"}}>{e}</button>
            ))}
          </div>
        </Card>
        <div style={{marginTop:10}}><Code>{`<GreetCard\n  name="${name}"\n  color="${color}"\n  emoji="${emoji}"\n/>`}</Code></div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:12,padding:"24px 32px",textAlign:"center",width:"100%"}}>
          <div style={{fontSize:40,marginBottom:10}}>{emoji}</div>
          <div style={{color:"#e6edf3",fontFamily:"monospace",fontSize:22,fontWeight:800}}>Hello, {name}!</div>
          <div style={{color:"#8b949e",fontFamily:"monospace",fontSize:11,marginTop:6}}>color: {color}</div>
        </div>
      </div>
    </div>
  );
}

function StateDemo(){
  const[count,setCount]=useState(0);
  const mood=count<0?"😢":count===0?"😐":count<5?"🙂":count<10?"😄":"🤩";
  const[history,setHistory]=useState([]);
  const change=d=>{const n=count+d;setCount(n);setHistory(h=>[...h.slice(-5),n]);};
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div>
        <Code>{`// useState returns [currentValue, setter]
const [count, setCount] = useState(0);

// Calling the setter triggers a re-render
function increment() {
  setCount(count + 1); // ✅ triggers re-render
}

// ❌ NEVER mutate state directly
// count = count + 1;  // React won't notice!

// Functional update (safer for async)
setCount(prev => prev + 1);`}</Code>
        <Card style={{marginTop:12}}>
          <H3 color="#e3b341">Golden rule</H3>
          <P>Always use the setter function. Never modify the state variable directly.</P>
        </Card>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{fontSize:52}}>{mood}</div>
        <div style={{fontFamily:"monospace",fontSize:48,fontWeight:800,color:"#58a6ff"}}>{count}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>change(-1)} style={{background:"#21262d",border:"1px solid #ff7b7255",color:"#ff7b72",borderRadius:8,padding:"8px 22px",cursor:"pointer",fontFamily:"monospace",fontSize:22,fontWeight:800}}>−</button>
          <button onClick={()=>change(1)} style={{background:"#21262d",border:"1px solid #3fb95055",color:"#3fb950",borderRadius:8,padding:"8px 22px",cursor:"pointer",fontFamily:"monospace",fontSize:22,fontWeight:800}}>+</button>
        </div>
        <button onClick={()=>{setCount(0);setHistory([]);}} style={{background:"transparent",border:"1px solid #30363d",color:"#8b949e",borderRadius:6,padding:"4px 14px",cursor:"pointer",fontFamily:"monospace",fontSize:12}}>reset</button>
        {history.length>0&&<div style={{fontFamily:"monospace",fontSize:11,color:"#484f58"}}>history: [{history.join(", ")}]</div>}
      </div>
    </div>
  );
}

function EventsDemo(){
  const[log,setLog]=useState([]);
  const add=msg=>setLog(l=>[{msg,id:Date.now()},...l.slice(0,6)]);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div>
        <Code>{`// Pass a REFERENCE — not a call!
// ❌ Wrong: runs immediately on render
<button onClick={handleClick()}>

// ✅ Right: runs when clicked
<button onClick={handleClick}>

// ✅ Arrow fn — useful for arguments
<button onClick={() => remove(item.id)}>

// The event object
<input onChange={(e) => {
  console.log(e.target.value);
}} />

// Common events: onClick, onChange,
// onSubmit, onFocus, onBlur,
// onMouseEnter, onMouseLeave, onKeyDown`}</Code>
      </div>
      <div>
        <P>Try these:</P>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>add("onClick fired!")} style={{background:"#21262d",border:"1px solid #30363d",color:"#e6edf3",borderRadius:6,padding:"7px 14px",cursor:"pointer",fontFamily:"monospace",fontSize:12,textAlign:"left"}}>Click me (onClick)</button>
          <input placeholder="Type here (onChange, onFocus, onBlur)..." onChange={e=>add(`onChange: "${e.target.value}"`)} onFocus={()=>add("onFocus!")} onBlur={()=>add("onBlur!")} style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:6,color:"#e6edf3",padding:"7px 12px",fontFamily:"monospace",fontSize:12,outline:"none"}}/>
          <div onMouseEnter={()=>add("onMouseEnter!")} onMouseLeave={()=>add("onMouseLeave!")} style={{background:"#161b22",border:"1px dashed #30363d",borderRadius:6,padding:"7px 12px",fontFamily:"monospace",fontSize:12,color:"#8b949e",textAlign:"center",cursor:"default"}}>
            Hover over me
          </div>
        </div>
        <div style={{marginTop:10,background:"#0d1117",borderRadius:8,padding:"8px 12px",minHeight:70}}>
          {log.length===0&&<span style={{color:"#484f58",fontFamily:"monospace",fontSize:11}}>// events appear here</span>}
          {log.map((l,i)=>(
            <div key={l.id} style={{fontFamily:"monospace",fontSize:11,color:i===0?"#3fb950":"#484f58"}}>▶ {l.msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConditionalDemo(){
  const[loggedIn,setLoggedIn]=useState(false);
  const[score,setScore]=useState(72);
  const grade=score>=90?"A":score>=80?"B":score>=70?"C":score>=60?"D":"F";
  const gc=score>=90?"#3fb950":score>=70?"#e3b341":"#ff7b72";
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div>
        <Code>{`// 1. if/else (in the function body)
if (isLoggedIn) return <Dashboard />;
return <Login />;

// 2. Ternary operator (inline, most common)
{isLoggedIn ? <Dashboard /> : <Login />}

// 3. && short-circuit
// (renders nothing if condition is false)
{isAdmin && <DeleteButton />}

// 4. Conditional className / style
<div className={isActive ? 'active' : ''}>
<p style={{ color: error ? 'red' : 'green' }}>`}</Code>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <H3>Auth example</H3>
            <button onClick={()=>setLoggedIn(l=>!l)} style={{background:loggedIn?"#3fb95022":"#21262d",border:`1px solid ${loggedIn?"#3fb950":"#30363d"}`,color:loggedIn?"#3fb950":"#8b949e",borderRadius:6,padding:"4px 12px",cursor:"pointer",fontFamily:"monospace",fontSize:11}}>
              {loggedIn?"Log out":"Log in"}
            </button>
          </div>
          {loggedIn
            ?<div style={{color:"#3fb950",fontFamily:"monospace",fontSize:13}}>✓ Welcome back, Alice! <span style={{color:"#484f58"}}>(Dashboard)</span></div>
            :<div style={{color:"#ff7b72",fontFamily:"monospace",fontSize:13}}>✗ Please log in <span style={{color:"#484f58"}}>(Login form)</span></div>
          }
          {loggedIn&&<div style={{marginTop:8,color:"#e3b341",fontFamily:"monospace",fontSize:12}}>🔒 Admin panel (&&)</div>}
        </Card>
        <Card>
          <H3>Grade calculator</H3>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <input type="range" min={0} max={100} value={score} onChange={e=>setScore(+e.target.value)} style={{flex:1,accentColor:"#58a6ff"}}/>
            <span style={{fontFamily:"monospace",fontSize:13,color:"#e6edf3",minWidth:28}}>{score}</span>
          </div>
          <div style={{fontFamily:"monospace",fontSize:28,fontWeight:800,color:gc}}>Grade: {grade}</div>
        </Card>
      </div>
    </div>
  );
}

function ListsDemo(){
  const[fruits,setFruits]=useState(["🍎 Apple","🍌 Banana","🍇 Grapes","🍊 Orange"]);
  const[input,setInput]=useState("");
  const[filter,setFilter]=useState("");
  const add=()=>{if(input.trim()){setFruits(f=>[...f,input.trim()]);setInput("");}};
  const remove=i=>setFruits(f=>f.filter((_,idx)=>idx!==i));
  const shown=fruits.filter(f=>f.toLowerCase().includes(filter.toLowerCase()));
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div>
        <Code>{`const fruits = ["Apple", "Banana", "Grapes"];

// .map() renders a list
// key is REQUIRED — helps React track items
{fruits.map((fruit, index) => (
  <li key={index}>{fruit}</li>
))}

// ✅ Better: use a unique id
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ Avoid index as key if list can
//    be reordered or filtered`}</Code>
        <Card style={{marginTop:10}}>
          <H3 color="#e3b341">Why keys matter</H3>
          <P>Keys let React track which items changed, were added, or removed — it avoids re-rendering the entire list on every change.</P>
        </Card>
      </div>
      <div>
        <Card>
          <div style={{display:"flex",gap:7,marginBottom:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Add item..." style={{flex:1,background:"#0d1117",border:"1px solid #30363d",borderRadius:6,color:"#e6edf3",padding:"6px 10px",fontFamily:"monospace",fontSize:12,outline:"none"}}/>
            <button onClick={add} style={{background:"#238636",border:"1px solid #2ea043",color:"#fff",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontFamily:"monospace",fontSize:12}}>Add</button>
          </div>
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter..." style={{width:"100%",background:"#0d1117",border:"1px solid #30363d",borderRadius:6,color:"#e6edf3",padding:"6px 10px",fontFamily:"monospace",fontSize:12,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
          <div style={{maxHeight:180,overflowY:"auto"}}>
            {shown.length===0&&<div style={{color:"#484f58",fontFamily:"monospace",fontSize:12}}>No items found.</div>}
            {shown.map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #21262d"}}>
                <span style={{fontFamily:"monospace",fontSize:13,color:"#e6edf3"}}>{item}</span>
                <button onClick={()=>remove(fruits.indexOf(item))} style={{background:"transparent",border:"none",color:"#ff7b72",cursor:"pointer",fontSize:15,padding:"0 4px"}}>×</button>
              </div>
            ))}
          </div>
          <div style={{marginTop:6,color:"#484f58",fontFamily:"monospace",fontSize:10}}>{shown.length} of {fruits.length} items</div>
        </Card>
      </div>
    </div>
  );
}

function CapstoneDemo(){
  const[todos,setTodos]=useState([
    {id:1,text:"Learn React",done:true},
    {id:2,text:"Build something cool",done:false},
    {id:3,text:"Show off to friends",done:false},
  ]);
  const[input,setInput]=useState("");
  const[filter,setFilter]=useState("all");
  const add=()=>{if(input.trim()){setTodos(t=>[...t,{id:Date.now(),text:input.trim(),done:false}]);setInput("");}};
  const toggle=id=>setTodos(t=>t.map(x=>x.id===id?{...x,done:!x.done}:x));
  const remove=id=>setTodos(t=>t.filter(x=>x.id!==id));
  const shown=todos.filter(t=>filter==="all"?true:filter==="active"?!t.done:t.done);
  const doneCount=todos.filter(t=>t.done).length;
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Code>{`function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput]  = useState("");

  const add = () => {
    setTodos([...todos, {
      id: Date.now(), text: input, done: false
    }]);
    setInput("");
  };

  const toggle = (id) => setTodos(
    todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    )
  );

  const shown = todos.filter(t =>
    filter === "all"    ? true    :
    filter === "active" ? !t.done : t.done
  );

  return (
    <>
      <input value={input}
        onChange={e => setInput(e.target.value)} />
      <button onClick={add}>Add</button>

      {shown.map(todo => (
        <li key={todo.id}
            onClick={() => toggle(todo.id)}>
          {todo.done ? "✓" : "○"} {todo.text}
        </li>
      ))}
    </>
  );
}`}</Code>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Card>
          <div style={{display:"flex",gap:7,marginBottom:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="What needs doing?" style={{flex:1,background:"#0d1117",border:"1px solid #30363d",borderRadius:6,color:"#e6edf3",padding:"6px 10px",fontFamily:"monospace",fontSize:12,outline:"none"}}/>
            <button onClick={add} style={{background:"#238636",border:"1px solid #2ea043",color:"#fff",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontFamily:"monospace",fontSize:12}}>Add</button>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {["all","active","done"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"#21262d":"transparent",border:`1px solid ${filter===f?"#58a6ff":"#30363d"}`,color:filter===f?"#58a6ff":"#8b949e",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"monospace",fontSize:11}}>{f}</button>
            ))}
          </div>
          <div style={{maxHeight:180,overflowY:"auto"}}>
            {shown.map(todo=>(
              <div key={todo.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #21262d"}}>
                <button onClick={()=>toggle(todo.id)} style={{width:18,height:18,borderRadius:3,border:`1.5px solid ${todo.done?"#3fb950":"#30363d"}`,background:todo.done?"#3fb95022":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0}}>
                  {todo.done&&<span style={{color:"#3fb950",fontSize:10,lineHeight:1}}>✓</span>}
                </button>
                <span style={{flex:1,fontFamily:"monospace",fontSize:13,color:todo.done?"#484f58":"#e6edf3",textDecoration:todo.done?"line-through":"none"}}>{todo.text}</span>
                <button onClick={()=>remove(todo.id)} style={{background:"transparent",border:"none",color:"#484f58",cursor:"pointer",fontSize:14,padding:"0 2px"}}>×</button>
              </div>
            ))}
            {shown.length===0&&<div style={{color:"#484f58",fontFamily:"monospace",fontSize:12,padding:"8px 0"}}>Nothing here.</div>}
          </div>
          <div style={{marginTop:8,display:"flex",justifyContent:"space-between",color:"#484f58",fontFamily:"monospace",fontSize:10}}>
            <span>{doneCount}/{todos.length} done</span>
            {doneCount>0&&<button onClick={()=>setTodos(t=>t.filter(x=>!x.done))} style={{background:"transparent",border:"none",color:"#484f58",cursor:"pointer",fontFamily:"monospace",fontSize:10,padding:0}}>Clear done</button>}
          </div>
        </Card>
        <Card>
          <H3 color="#e3b341">Concepts in this app:</H3>
          {["useState — todos array + input + filter","Array .map() — render each todo",".filter() — show only matching todos","key prop — on each todo","onClick / onChange — events","Spread {...t, done:!t.done} — update item","Conditional style — done → strikethrough"].map((c,i)=>(
            <div key={i} style={{fontFamily:"monospace",fontSize:11,color:"#8b949e",marginBottom:3}}>✓ {c}</div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── slides ─────────────────────────────────────────────────── */
const SLIDES=[
  {label:"Lecture",title:"Introduction to React",render:()=>(
    <div style={{textAlign:"center",maxWidth:660,margin:"0 auto"}}>
      <div style={{fontFamily:"monospace",fontSize:13,color:"#3fb950",marginBottom:24,letterSpacing:"0.06em"}}>
        {">"} npx create-react-app my-first-app<span style={{animation:"blink 1s infinite",display:"inline-block"}}>█</span>
      </div>
      <H2 color="#e6edf3">Introduction to <span style={{color:"#61dafb"}}>React</span></H2>
      <p style={{fontFamily:"monospace",fontSize:15,color:"#8b949e",lineHeight:1.75,margin:"14px 0 28px"}}>
        Build modern, interactive UIs without losing your mind.<br/>
        A beginner-friendly deep dive — no prior web knowledge assumed.
      </p>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        {["Components","JSX","Props","State","Events","Conditional Rendering","Lists & Keys"].map(t=><Chip key={t} color="#61dafb">{t}</Chip>)}
      </div>
      <p style={{fontFamily:"monospace",fontSize:11,color:"#484f58",marginTop:28}}>Press → or click Next to begin</p>
    </div>
  )},
  {label:"Overview",title:"Agenda",min:"2",render:()=>(
    <div style={{width:"100%"}}>
      <Tag>Today's plan</Tag>
      <H2>What we'll cover <span style={{fontSize:"0.55em",color:"#484f58",fontWeight:400}}>~120 min total</span></H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          ["01","How websites work (HTML/CSS/JS)","5 min"],
          ["02","The DOM problem → why React?","8 min"],
          ["03","What is React?","10 min"],
          ["04","Components","12 min"],
          ["05","JSX — writing HTML in JavaScript","15 min"],
          ["06","Props — passing data in","12 min"],
          ["07","State & useState hook","15 min"],
          ["08","Handling Events","10 min"],
          ["09","Conditional Rendering","8 min"],
          ["10","Lists & Keys","10 min"],
          ["11","The React Ecosystem","3 min"],
          ["12","Summary + What's Next","5 min"],
        ].map(([n,t,m])=>(
          <div key={n} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#161b22",borderRadius:6,border:"1px solid #21262d"}}>
            <span style={{fontFamily:"monospace",fontSize:10,color:"#58a6ff",minWidth:20}}>{n}</span>
            <span style={{fontFamily:"monospace",fontSize:12,color:"#c9d1d9",flex:1}}>{t}</span>
            <span style={{fontFamily:"monospace",fontSize:10,color:"#484f58"}}>{m}</span>
          </div>
        ))}
      </div>
    </div>
  )},
  {label:"Foundation",title:"How Websites Work",min:"5",render:()=>(
    <div style={{width:"100%"}}>
      <Tag>Before React</Tag>
      <H2>The three layers of the web</H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16}}>
        {[
          {lang:"HTML",color:"#e34c26",icon:"🏗",desc:"Structure",code:`<h1>Hello World</h1>\n<button>Click me</button>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>`},
          {lang:"CSS",color:"#264de4",icon:"🎨",desc:"Style",code:`button {\n  background: blue;\n  color: white;\n  border-radius: 8px;\n  padding: 8px 16px;\n}`},
          {lang:"JS",color:"#f7df1e",icon:"⚡",desc:"Behaviour",code:`document\n  .querySelector('button')\n  .addEventListener(\n    'click',\n    () => alert('Hi!')\n  );`},
        ].map(({lang,color,icon,desc,code})=>(
          <Card key={lang} style={{borderColor:color+"33"}}>
            <div style={{fontSize:24,marginBottom:4}}>{icon}</div>
            <div style={{fontFamily:"monospace",fontWeight:800,fontSize:18,color,marginBottom:2}}>{lang}</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#8b949e",marginBottom:10}}>{desc}</div>
            <Code>{code}</Code>
          </Card>
        ))}
      </div>
      <Card>
        <H3 color="#e3b341">How a page loads</H3>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          {["Browser requests URL","→","Server sends HTML","→","Browser parses HTML","→","Loads CSS & JS","→","JS runs","→","Page is interactive"].map((s,i)=>(
            <span key={i} style={{fontFamily:"monospace",fontSize:12,color:i%2===1?"#58a6ff":"#e6edf3"}}>{s}</span>
          ))}
        </div>
      </Card>
    </div>
  )},
  {label:"Why React?",title:"The DOM Problem",min:"8",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>The <span style={{color:"#ff7b72"}}>DOM problem</span> — why React exists</H2>
      <P>The DOM is the browser's internal tree of your HTML elements. Manually updating it becomes <em style={{color:"#ff7b72"}}>painful</em> as apps grow.</P>
      <DomDemo/>
      <Card style={{marginTop:14,borderColor:"#58a6ff33"}}>
        <H3>React's core idea</H3>
        <P>Instead of telling the browser <em>how</em> to change the DOM step by step, you <span style={{color:"#58a6ff"}}>describe what the UI should look like</span>, and React figures out the minimal changes needed.</P>
      </Card>
    </div>
  )},
  {label:"Introduction",title:"What is React?",min:"10",render:()=>(
    <div style={{width:"100%"}}>
      <Tag color="#61dafb">React</Tag>
      <H2>What is <span style={{color:"#61dafb"}}>React</span>?</H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <H3>The one-liner</H3>
          <P>React is a <span style={{color:"#61dafb"}}>JavaScript library</span> for building user interfaces — made by Meta (Facebook), open-sourced in 2013. It handles the <b style={{color:"#e6edf3"}}>View</b> layer only.</P>
        </Card>
        <Card>
          <H3>Why is it popular?</H3>
          {["Component-based — build UIs like LEGO bricks","Declarative — describe what, not how","Huge ecosystem & community","Same skills → mobile (React Native)","Used by: Meta, Netflix, Airbnb, Shopify…"].map((p,i)=>(
            <div key={i} style={{fontFamily:"monospace",fontSize:12,color:"#8b949e",marginBottom:4}}>→ {p}</div>
          ))}
        </Card>
        <Card>
          <H3 color="#3fb950">React is just JavaScript</H3>
          <P>There's no magic. React is a JS library you import. Your logic, loops, conditions — all plain JS.</P>
          <Code>{`import { useState } from 'react';
// That's it — it's just a library import`}</Code>
        </Card>
        <Card>
          <H3 color="#e3b341">Key terms to know</H3>
          {[["Component","A reusable piece of UI"],["JSX","HTML-like syntax in JS"],["State","Data that can change over time"],["Props","Data passed into a component"],["Hook","e.g. useState — adds capabilities"]].map(([t,d])=>(
            <div key={t} style={{fontFamily:"monospace",fontSize:12,marginBottom:4}}>
              <span style={{color:"#e3b341"}}>{t}</span><span style={{color:"#484f58"}}> — </span><span style={{color:"#8b949e"}}>{d}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )},
  {label:"Core Concept",title:"Components",min:"12",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>Components — <span style={{color:"#d2a8ff"}}>LEGO bricks for UI</span></H2>
      <P>A component is a <span style={{color:"#d2a8ff"}}>reusable, self-contained piece of UI</span>. Every React app is a tree of components.</P>
      <ComponentsDemo/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
        <Card>
          <H3>Rules</H3>
          {["Name MUST start with a capital letter","Returns JSX","Can be reused as many times as you want","Can contain other components"].map((r,i)=>(
            <div key={i} style={{fontFamily:"monospace",fontSize:12,color:"#8b949e",marginBottom:4}}>✓ {r}</div>
          ))}
        </Card>
        <Card>
          <H3>Component tree</H3>
          <Code>{`<App>\n  <Header />\n  <Main>\n    <Sidebar />\n    <Content>\n      <Article />\n      <Article />\n    </Content>\n  </Main>\n  <Footer />\n</App>`}</Code>
        </Card>
      </div>
    </div>
  )},
  {label:"Syntax",title:"JSX — Your First Component",min:"15",render:()=>(
    <div style={{width:"100%"}}>
      <Tag color="#f7df1e">JSX</Tag>
      <H2>JSX — HTML inside JavaScript</H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <H3>What is JSX?</H3>
          <P>JSX lets you write HTML-like code inside JS. It's not a string — Babel compiles it to <code style={{fontFamily:"monospace",color:"#d2a8ff",fontSize:11}}>React.createElement()</code> calls.</P>
          <Code>{`// You write:
const el = <h1>Hello, world!</h1>;

// Babel compiles to:
const el = React.createElement(
  'h1', null, 'Hello, world!'
);`}</Code>
        </Card>
        <Card>
          <H3>JS expressions in JSX</H3>
          <P>Use <code style={{fontFamily:"monospace",color:"#58a6ff",fontSize:11}}>{"{ }"}</code> to embed any JS expression.</P>
          <Code>{`const name = "Alice";
return (
  <div>
    <h1>Hello, {name}!</h1>
    <p>2 + 2 = {2 + 2}</p>
    <p>{name.toUpperCase()}</p>
    <p>{new Date().toDateString()}</p>
  </div>
);`}</Code>
        </Card>
      </div>
      <Card>
        <H3 color="#e3b341">Your first component (full example)</H3>
        <Code>{`// 1. Define — a plain JavaScript function
function Greeting({ name }) {
  return (
    <div>
      <h1>Hello, {name}! 👋</h1>
      <p>Welcome to React.</p>
    </div>
  );
}

// 2. Use — like an HTML tag
function App() {
  return <Greeting name="Alice" />;
}

// 3. Mount — once in your index.jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />);`}</Code>
      </Card>
    </div>
  )},
  {label:"Syntax",title:"JSX Rules",render:()=>(
    <div style={{width:"100%"}}>
      <Tag color="#f7df1e">JSX Rules</Tag>
      <H2>JSX — the important rules</H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <H3 color="#ff7b72">❌ Common mistakes</H3>
          <Code>{`// Must return ONE root element
return (
  <h1>Title</h1>
  <p>Text</p>   // ❌ two roots!
);

// class → className
<div class="box">  // ❌

// self-closing tags need /
<img src="...">    // ❌
<input>            // ❌

// JS keywords are reserved
<label for="x">   // ❌`}</Code>
        </Card>
        <Card>
          <H3 color="#3fb950">✅ Correct versions</H3>
          <Code>{`// Wrap in a parent or Fragment (<>)
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);

// className
<div className="box">  // ✅

// self-closing
<img src="..." />      // ✅
<input />              // ✅

// htmlFor
<label htmlFor="x">   // ✅`}</Code>
        </Card>
        <Card>
          <H3>Styling in JSX</H3>
          <Code>{`// Inline: double {{  }}, camelCase props
<div style={{ backgroundColor: 'blue',
              fontSize: 16 }}>

// className (external CSS file)
<div className="my-card">

// CSS Modules (recommended)
import s from './Card.module.css';
<div className={s.card}>`}</Code>
        </Card>
        <Card>
          <H3 color="#d2a8ff">Expressions only in {"{ }"}</H3>
          <Code>{`// ✅ expressions (produce a value)
{name.toUpperCase()}
{count + 1}
{isAdmin ? <AdminBtn /> : null}
{items.map(i => <li key={i}>{i}</li>)}

// ❌ statements don't work in JSX
{if (x) { ... }}   // syntax error
{for (let i…) {}}  // syntax error`}</Code>
        </Card>
      </div>
    </div>
  )},
  {label:"Data Flow",title:"Props",min:"12",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>Props — <span style={{color:"#3fb950"}}>passing data into components</span></H2>
      <P>Props (short for properties) are how a parent passes data to a child. They're <span style={{color:"#e6edf3"}}>read-only</span> — a child never modifies its own props.</P>
      <PropsDemo/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
        <Card>
          <H3>Destructuring props</H3>
          <Code>{`// Option A — access via props object
function Card(props) {
  return <h1>{props.title}</h1>;
}

// Option B — destructure ✅ (cleaner)
function Card({ title, color, size = 16 }) {
  //                         ↑ default value
  return <h1 style={{ color, fontSize: size }}>
    {title}
  </h1>;
}`}</Code>
        </Card>
        <Card>
          <H3>children prop</H3>
          <Code>{`// Special built-in prop: children
function Box({ children, color }) {
  return (
    <div style={{ background: color }}>
      {children}
    </div>
  );
}

// Usage:
<Box color="blue">
  <p>Anything can go in here!</p>
  <button>Click me</button>
</Box>`}</Code>
        </Card>
      </div>
    </div>
  )},
  {label:"State",title:"State — the concept",min:"10",render:()=>(
    <div style={{width:"100%"}}>
      <Tag color="#d2a8ff">State</Tag>
      <H2>State — <span style={{color:"#d2a8ff"}}>data that changes over time</span></H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <P>State is data that belongs to a component and <span style={{color:"#d2a8ff"}}>can change</span>. When state changes, React automatically <span style={{color:"#3fb950"}}>re-renders</span> the component.</P>
          <Card>
            <H3 color="#e3b341">Props vs State</H3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Props","#3fb950",["Passed from parent","Read-only","Like fn arguments"]],["State","#d2a8ff",["Defined inside component","Can be changed","Triggers re-render"]]].map(([name,color,facts])=>(
                <div key={name}>
                  <div style={{fontFamily:"monospace",fontWeight:700,color,fontSize:13,marginBottom:6}}>{name}</div>
                  {facts.map((f,i)=><div key={i} style={{fontFamily:"monospace",fontSize:11,color:"#8b949e",marginBottom:3}}>→ {f}</div>)}
                </div>
              ))}
            </div>
          </Card>
          <Card style={{marginTop:10}}>
            <H3>When do you need state?</H3>
            {["A counter that increments","A form input the user types in","Whether a modal is open or closed","Data fetched from an API","Current user, theme, language…"].map((s,i)=>(
              <div key={i} style={{fontFamily:"monospace",fontSize:12,color:"#8b949e",marginBottom:3}}>✓ {s}</div>
            ))}
          </Card>
        </div>
        <div>
          <Code>{`// Static component (no state)
// — the name never changes
function StaticGreet() {
  const name = "Alice";
  return <h1>Hello, {name}</h1>;
}

// Dynamic component (has state)
// — user can change the name!
function EditableGreet() {
  const [name, setName] = useState("Alice");

  return (
    <>
      <h1>Hello, {name}</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
    </>
  );
}
// Every keystroke calls setName → re-render`}</Code>
        </div>
      </div>
    </div>
  )},
  {label:"State",title:"useState Hook",min:"15",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>useState — <span style={{color:"#d2a8ff"}}>your first Hook</span></H2>
      <P>A <span style={{color:"#d2a8ff"}}>Hook</span> is a special React function that lets components access React features. <code style={{fontFamily:"monospace",color:"#d2a8ff",fontSize:12}}>useState</code> gives a component memory.</P>
      <StateDemo/>
      <Card style={{marginTop:14}}>
        <Code>{`const [value, setValue] = useState(initialValue);\n//     ↑ current    ↑ setter fn    ↑ starting value\n//       state value\n\n// setValue triggers a re-render with the new value\n// Always call it — never mutate 'value' directly`}</Code>
      </Card>
    </div>
  )},
  {label:"Interactivity",title:"Handling Events",min:"10",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>Event handling in React</H2>
      <P>React uses <span style={{color:"#58a6ff"}}>camelCase</span> event names and you pass a <span style={{color:"#58a6ff"}}>function</span> (not a string). React wraps all browser events in a <span style={{color:"#58a6ff"}}>SyntheticEvent</span> — same API in all browsers.</P>
      <EventsDemo/>
    </div>
  )},
  {label:"Patterns",title:"Conditional Rendering",min:"8",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>Conditional rendering</H2>
      <P>React shows/hides UI based on conditions — using plain JavaScript logic inside JSX.</P>
      <ConditionalDemo/>
    </div>
  )},
  {label:"Patterns",title:"Lists & Keys",min:"10",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>Lists & Keys</H2>
      <P>Use <code style={{fontFamily:"monospace",color:"#58a6ff",fontSize:12}}>.map()</code> to render arrays of data. Every element needs a unique <code style={{fontFamily:"monospace",color:"#e3b341",fontSize:12}}>key</code> prop so React can track changes efficiently.</P>
      <ListsDemo/>
    </div>
  )},
  {label:"Ecosystem",title:"The React Ecosystem",min:"3",render:()=>(
    <div style={{width:"100%"}}>
      <Tag color="#61dafb">Ecosystem</Tag>
      <H2>Beyond React — the ecosystem</H2>
      <P>React handles the UI layer. These popular libraries fill in the rest:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[
          {name:"Next.js",color:"#e6edf3",cat:"Framework",desc:"Full-stack React — routing, SSR, API routes. The most popular React framework."},
          {name:"React Router",color:"#f44250",cat:"Routing",desc:"Client-side navigation between pages within your app."},
          {name:"Zustand / Redux",color:"#e3b341",cat:"State Mgmt",desc:"Manage global state shared across many components."},
          {name:"React Query",color:"#ff4154",cat:"Data Fetching",desc:"Fetch, cache & sync server data with minimal boilerplate."},
          {name:"Tailwind CSS",color:"#38bdf8",cat:"Styling",desc:"Utility-first CSS — extremely popular paired with React."},
          {name:"React Native",color:"#61dafb",cat:"Mobile",desc:"Build iOS & Android apps using your React knowledge."},
          {name:"shadcn/ui",color:"#e6edf3",cat:"Components",desc:"Beautiful, accessible pre-built UI components."},
          {name:"Vite",color:"#bd34fe",cat:"Build Tool",desc:"Blazing-fast dev server. Replaces Create React App."},
          {name:"TypeScript",color:"#3178c6",cat:"Language",desc:"Type-safe JavaScript — used in most professional React projects."},
        ].map(({name,color,cat,desc})=>(
          <Card key={name} style={{borderColor:color+"33"}}>
            <div style={{fontFamily:"monospace",fontWeight:800,color,fontSize:14,marginBottom:4}}>{name}</div>
            <Chip color={color}>{cat}</Chip>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#8b949e",marginTop:6,lineHeight:1.6}}>{desc}</div>
          </Card>
        ))}
      </div>
    </div>
  )},
  {label:"Capstone",title:"Putting It All Together",render:()=>(
    <div style={{width:"100%"}}>
      <LiveTag/>
      <H2>Capstone — a <span style={{color:"#3fb950"}}>full Todo app</span></H2>
      <P>All the concepts we've learned in one component: state, events, conditional rendering, lists & keys, and array methods.</P>
      <CapstoneDemo/>
    </div>
  )},
  {label:"Wrap-up",title:"Summary",min:"5",render:()=>(
    <div style={{width:"100%"}}>
      <Tag color="#3fb950">Summary</Tag>
      <H2>What we covered today</H2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          ["🏗","HTML/CSS/JS","Structure, style, and behaviour — the three web layers"],
          ["🔥","DOM Problem","Why manually updating the DOM is painful at scale"],
          ["⚛","React","A library for building UIs with a component model"],
          ["🧩","Components","Reusable, self-contained UI building blocks"],
          ["📝","JSX","HTML-like syntax that compiles to JavaScript"],
          ["📦","Props","Read-only data passed from parent to child"],
          ["🔄","State","Data that lives in a component and triggers re-renders"],
          ["🪝","useState","Hook to add state to function components"],
          ["🖱","Events","onClick, onChange — camelCase, always pass a function"],
          ["❓","Conditionals","Ternary & && to show/hide UI based on conditions"],
          ["📋","Lists","Array.map() + unique key prop for rendering collections"],
          ["🌐","Ecosystem","Next.js, Router, Tailwind, React Native, and more…"],
        ].map(([icon,title,desc])=>(
          <div key={title} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 10px",background:"#161b22",borderRadius:7,border:"1px solid #21262d"}}>
            <span style={{fontSize:14,flexShrink:0}}>{icon}</span>
            <div>
              <div style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#e6edf3",marginBottom:1}}>{title}</div>
              <div style={{fontFamily:"monospace",fontSize:11,color:"#8b949e"}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )},
  {label:"Next Steps",title:"What's Next",render:()=>(
    <div style={{textAlign:"center",maxWidth:640,margin:"0 auto"}}>
      <div style={{fontSize:52,marginBottom:16}}>🚀</div>
      <H2 color="#e6edf3">You're ready to <span style={{color:"#3fb950"}}>start building!</span></H2>
      <p style={{fontFamily:"monospace",fontSize:14,color:"#8b949e",lineHeight:1.75,margin:"14px 0 24px"}}>
        The best way to learn React is to build things.<br/>Start small, break things, Google everything — that's what every React dev does.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,textAlign:"left",marginBottom:20}}>
        {[
          ["📚","docs.react.dev","The official React docs — excellent and modern"],
          ["⚡","npm create vite@latest","Scaffold a new project in seconds"],
          ["🎓","react.dev/learn","Interactive step-by-step tutorial"],
          ["🛠","Project ideas","Todo → Weather → Clone a site you love"],
        ].map(([icon,title,desc])=>(
          <Card key={title}>
            <div style={{fontSize:18,marginBottom:5}}>{icon}</div>
            <div style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#58a6ff",marginBottom:4}}>{title}</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#8b949e"}}>{desc}</div>
          </Card>
        ))}
      </div>
      <Code>{`# Start your first project right now!
npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev`}</Code>
      <p style={{fontFamily:"monospace",fontSize:11,color:"#484f58",marginTop:18}}>Questions? Ask away — no question is too basic! 🙂</p>
    </div>
  )},
];

/* ─── main app ────────────────────────────────────────────────── */
export default function ReactLecture(){
  const[cur,setCur]=useState(0);
  const[dir,setDir]=useState(null);

  const go=useCallback((d)=>{
    const n=cur+d;
    if(n<0||n>=SLIDES.length)return;
    setDir(d>0?"left":"right");
    setTimeout(()=>{setCur(n);setDir(null);},170);
  },[cur]);

  useEffect(()=>{
    const h=e=>{
      if(e.key==="ArrowRight"||e.key==="ArrowDown")go(1);
      if(e.key==="ArrowLeft"||e.key==="ArrowUp")go(-1);
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[go]);

  const slide=SLIDES[cur];
  const pct=(cur/(SLIDES.length-1))*100;

  return(
    <div style={{fontFamily:"'JetBrains Mono','Courier New',monospace",background:"#0d1117",minHeight:"100vh",display:"flex",flexDirection:"column",color:"#c9d1d9"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        *{box-sizing:border-box;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes slideOut{to{opacity:0;transform:translateX(-30px)}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#0d1117}
        ::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px}
        input[type=range]{accent-color:#58a6ff}
      `}</style>

      {/* title bar */}
      <div style={{background:"#161b22",borderBottom:"1px solid #21262d",padding:"9px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",gap:6}}>
          <div style={{width:11,height:11,borderRadius:"50%",background:"#ff5f57"}}/>
          <div style={{width:11,height:11,borderRadius:"50%",background:"#ffbd2e"}}/>
          <div style={{width:11,height:11,borderRadius:"50%",background:"#28c840"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"#8b949e",letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:12}}>
          <span>react-lecture.jsx</span>
          {slide.min&&<span style={{color:"#484f58"}}>~{slide.min} min</span>}
        </div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"#484f58"}}>{cur+1}/{SLIDES.length}</div>
      </div>

      {/* slide minimap */}
      <div style={{background:"#161b22",borderBottom:"1px solid #21262d",padding:"5px 20px",display:"flex",gap:3,alignItems:"center",overflowX:"auto"}}>
        {SLIDES.map((s,i)=>(
          <button key={i} onClick={()=>{setDir(i>cur?"left":"right");setTimeout(()=>{setCur(i);setDir(null);},170);}}
            title={s.title}
            style={{width:i===cur?20:6,height:6,borderRadius:3,background:i===cur?"#58a6ff":i<cur?"#238636":"#21262d",border:"none",cursor:"pointer",transition:"all 0.25s",flexShrink:0,padding:0}}/>
        ))}
        <div style={{flex:1}}/>
        <span style={{fontFamily:"monospace",fontSize:9,color:"#484f58",whiteSpace:"nowrap"}}>← → keys</span>
      </div>

      {/* slide */}
      <div style={{flex:1,overflow:"auto"}}>
        <div style={{padding:"26px 36px",maxWidth:1040,width:"100%",margin:"0 auto",animation:dir?"slideOut 0.17s ease forwards":"fadeIn 0.2s ease"}}>
          <div style={{marginBottom:8}}>
            <span style={{fontFamily:"monospace",fontSize:10,color:"#58a6ff",letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid #58a6ff33",borderRadius:4,padding:"2px 8px"}}>{slide.label}</span>
          </div>
          {slide.render()}
        </div>
      </div>

      {/* nav */}
      <div style={{background:"#161b22",borderTop:"1px solid #21262d",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button onClick={()=>go(-1)} disabled={cur===0}
          style={{fontFamily:"monospace",fontSize:12,padding:"6px 16px",background:cur===0?"transparent":"#21262d",border:`1px solid ${cur===0?"#21262d":"#30363d"}`,borderRadius:6,color:cur===0?"#484f58":"#c9d1d9",cursor:cur===0?"default":"pointer"}}>
          ← prev
        </button>
        <div style={{flex:1,height:3,background:"#21262d",borderRadius:2,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:"#58a6ff",transition:"width 0.3s ease"}}/>
        </div>
        <span style={{fontFamily:"monospace",fontSize:11,color:"#8b949e",maxWidth:200,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{slide.title}</span>
        <div style={{flex:1,height:3,background:"#21262d",borderRadius:2,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:"#58a6ff",transition:"width 0.3s ease"}}/>
        </div>
        <button onClick={()=>go(1)} disabled={cur===SLIDES.length-1}
          style={{fontFamily:"monospace",fontSize:12,padding:"6px 16px",background:cur===SLIDES.length-1?"transparent":"#21262d",border:`1px solid ${cur===SLIDES.length-1?"#21262d":"#30363d"}`,borderRadius:6,color:cur===SLIDES.length-1?"#484f58":"#c9d1d9",cursor:cur===SLIDES.length-1?"default":"pointer"}}>
          next →
        </button>
      </div>
    </div>
  );
}
