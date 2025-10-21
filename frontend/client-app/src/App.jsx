import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const GATEWAY = import.meta.env.VITE_API_GATEWAY || 'http://localhost:3000'
const WS = import.meta.env.VITE_WS_URL || 'http://localhost:3001'

export default function App(){
  const [tickets, setTickets] = useState([])
  const [log, setLog] = useState([])

  useEffect(()=>{
    fetch(`${GATEWAY}/api/tickets`, { headers: { 'content-type':'application/json', 'x-user-id':'frontend-user' } })
      .then(r=>r.json()).then(setTickets).catch(e=>setLog(l=>[...l, 'fetch error:'+e.message]))
    const socket = io(WS, { transports: ['websocket'] })
    socket.on('connect', ()=> setLog(l=>[...l, 'ws connected']))
    socket.on('ticket:update', payload=>{
      setLog(l=>[...l, 'ticket:update '+JSON.stringify(payload)])
      fetch(`${GATEWAY}/api/tickets`, { headers: { 'content-type':'application/json', 'x-user-id':'frontend-user' } })
        .then(r=>r.json()).then(setTickets).catch(e=>setLog(l=>[...l, 'fetch error:'+e.message]))
    })
    socket.on('connect_error', (e)=> setLog(l=>[...l, 'ws error:'+e.message]))
    return ()=> socket.close()
  },[])

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', padding: 20 }}>
      <h1>Network Service Desk — Frontend</h1>
      <section style={{ marginBottom:20 }}>
        <h2>Tickets</h2>
        <ul>
          {tickets && tickets.length ? tickets.map(t=>(
            <li key={t.id || t.ticketNumber}>{t.ticketNumber || t.id} — {t.status} — {t.companyName || t.subject}</li>
          )) : <li>No tickets yet</li>}
        </ul>
      </section>
      <section>
        <h2>Realtime Log</h2>
        <div style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:10, minHeight:100 }}>
          {log.map((l,i)=><div key={i}>{l}</div>)}
        </div>
      </section>
    </div>
  )
}
