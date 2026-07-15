'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MarketChart } from '../features/market/components/market-chart';
import { AuthControl } from '../features/auth/components/auth-control';
import { LiveWatchlist } from '../features/market/components/live-watchlist';

type Analysis = {
  symbol: string; interval: string; price: number; signal: string; score: number;
  direction: string; rsi: number; ema20: number; ema50: number; ema200: number;
  atr: number; support: number; resistance: number; entryLow: number; entryHigh: number;
  stopLoss: number; takeProfit1: number; takeProfit2: number; reasons: string[]; disclaimer: string;
  candles: Array<{ time: number; open: number; high: number; low: number; close: number }>;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type View = 'dashboard' | 'analysis' | 'chat';

const money = (value: number) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits: value < 10 ? 4 : 2,
}).format(value);

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Welcome to the Crypto-Pro-AI Project Chat. Share a product idea, feature request, trading question, or improvement you want to add.',
    createdAt: new Date().toISOString(),
  },
];

function buildAssistantReply(message: string) {
  const text = message.toLowerCase();
  const singlish = /\b(karanna|karamu|puluwan|puluwanda|kohomada|mokak|api|mata|oyata|aluth|weda|hadanna|danna|ganna|thiyenawa|nadda|hari|eka|tika|methanin|onema|coin|thoran|thoranna|bene|meka|wenawa|kiyada|balanna|hoyanna)\b/.test(text);
  if (singlish && (text.includes('chat') || text.includes('katha') || text.includes('puluwanda'))) {
    return 'Ow, puluwan. Oya Singlish walinma ahanna. Mama project ideas, dashboard changes, trading logic, saha roadmap decisions gena reply karannam.';
  }
  if (singlish && (text.includes('dashboard') || text.includes('ui') || text.includes('weda'))) {
    return 'Hari, me idea eka dashboard improvement ekak widihata note kala. Api eka feature task ekak karala next sprint eke implement karamu.';
  }
  if (singlish && (text.includes('buy') || text.includes('sell') || text.includes('trade'))) {
    return 'Hari, market data balala risk eka consider karala plan ekak hadamu. Real trade ekakata kalin paper trading use karanna.';
  }
  if (singlish && (text.includes('coin') || text.includes('thoran') || text.includes('thoranna'))) {
    return 'Ow, puluwan. Coin eka select karanna symbol eka saha timeframe eka denna. Api trend, RSI, volume, support/resistance balala suitable setup eka identify karamu.';
  }
  if (text.includes('elliott') || text.includes('wave')) {
    return 'Good idea. Elliott Wave should be combined with Fibonacci, volume, RSI, and trend confirmation instead of being used alone.';
  }
  if (text.includes('binance') || text.includes('trade') || text.includes('buy') || text.includes('sell')) {
    return 'This belongs in the trading roadmap. We will begin with public market data, then Paper Trading, Binance Testnet, manual confirmation, and later controlled automation with strict risk limits.';
  }
  if (text.includes('dashboard') || text.includes('design') || text.includes('ui')) {
    return 'Noted as a dashboard improvement. We can convert this idea into a feature task and implement it in the next UI sprint.';
  }
  return 'Idea recorded. In the full AI version, this will be stored in project memory and converted into a feature, decision, or task when appropriate.';
}

function NavigationItem({ label, active, onClick, badge }: { label: string; active?: boolean; onClick?: () => void; badge?: number }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick} type="button">
      <span>{label}</span>
      {typeof badge === 'number' && <small>{badge}</small>}
    </button>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const savedIdeaCount = useMemo(() => messages.filter((item) => item.role === 'user').length, [messages]);

  async function analyze() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/analyze?symbol=${symbol}&interval=${interval}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Analysis failed.');
      setData(json);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: cleanMessage, createdAt: new Date().toISOString() };
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: buildAssistantReply(cleanMessage), createdAt: new Date().toISOString() };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setMessage('');
  }

  function clearChat() {
    setMessages(initialMessages);
    localStorage.removeItem('crypto-pro-ai-project-chat');
  }

  useEffect(() => {
    analyze();
    const savedMessages = localStorage.getItem('crypto-pro-ai-project-chat');
    if (savedMessages) {
      try { setMessages(JSON.parse(savedMessages) as ChatMessage[]); }
      catch { localStorage.removeItem('crypto-pro-ai-project-chat'); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crypto-pro-ai-project-chat', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">CP</div>
          <div><strong>Crypto-Pro-AI</strong><span>Trading Intelligence</span></div>
        </div>

        <div className="nav-group">
          <span className="nav-label">WORKSPACE</span>
          <NavigationItem label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavigationItem label="Market Analysis" active={activeView === 'analysis'} onClick={() => setActiveView('analysis')} />
          <NavigationItem label="AI Project Chat" active={activeView === 'chat'} onClick={() => setActiveView('chat')} badge={savedIdeaCount} />
        </div>

        <div className="nav-group muted-nav">
          <span className="nav-label">COMING NEXT</span>
          <NavigationItem label="Markets" />
          <NavigationItem label="Watchlist" />
          <NavigationItem label="Portfolio" />
          <NavigationItem label="Signals" />
          <NavigationItem label="Settings" />
        </div>

        <div className="sidebar-footer">
          <span className="live-dot" />
          <div><strong>Market Data Online</strong><span>Binance public feed</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">BETA MVP · VERSION 0.3</span>
            <h1>{activeView === 'dashboard' ? 'Dashboard' : activeView === 'analysis' ? 'Market Analysis' : 'AI Project Chat'}</h1>
            <p>{activeView === 'dashboard' ? 'Monitor the market, review signals, and continue building your AI trading workspace.' : activeView === 'analysis' ? 'Generate a structured technical trade plan from live market data.' : 'Save product ideas, trading workflows, and roadmap decisions.'}</p>
          </div>
          <div className="top-actions">
            <AuthControl />
            <button className="ghost-button" type="button">Notifications</button>
            <div className="profile-chip"><span>SK</span><div><strong>Shiran</strong><small>Project Owner</small></div></div>
          </div>
        </header>

        {activeView === 'dashboard' && (
          <>
            <section className="metric-grid">
              <article className="metric-card"><span>Tracked Asset</span><strong>{data?.symbol.replace('USDT', '/USDT') || 'BTC/USDT'}</strong><small>Current market focus</small></article>
              <article className="metric-card"><span>Latest Signal</span><strong className={`text-${data?.signal.toLowerCase() || 'wait'}`}>{data?.signal || 'WAIT'}</strong><small>{data ? `${data.score}/100 confidence` : 'Analyzing market'}</small></article>
              <article className="metric-card"><span>Current Price</span><strong>${data ? money(data.price) : '—'}</strong><small>{data?.direction || 'Loading market trend'}</small></article>
              <article className="metric-card"><span>Saved Ideas</span><strong>{savedIdeaCount}</strong><small>Project memory entries</small></article>
            </section>

            <section className="dashboard-grid">
              <article className="panel market-panel">
                <div className="panel-heading"><div><span className="eyebrow">MARKET SNAPSHOT</span><h2>{data?.symbol || 'BTCUSDT'}</h2></div><button className="link-button" onClick={() => setActiveView('analysis')}>Open full analysis →</button></div>
                <div className="price-row"><div><strong>${data ? money(data.price) : 'Loading…'}</strong><span>{data?.direction || 'Connecting to market data'}</span></div><div className={`signal-badge ${data?.signal.toLowerCase() || 'wait'}`}><small>AI SIGNAL</small><strong>{data?.signal || 'WAIT'}</strong></div></div>
                {data ? <MarketChart candles={data.candles} /> : <div className="chart-placeholder"><span>Connecting to live chart…</span></div>}
                <div className="quick-levels">
                  <div><span>Support</span><strong>${data ? money(data.support) : '—'}</strong></div>
                  <div><span>Resistance</span><strong>${data ? money(data.resistance) : '—'}</strong></div>
                  <div><span>RSI</span><strong>{data ? data.rsi.toFixed(1) : '—'}</strong></div>
                  <div><span>ATR</span><strong>{data ? money(data.atr) : '—'}</strong></div>
                </div>
              </article>

              <article className="panel watchlist-panel">
                <div className="panel-heading"><div><span className="eyebrow">WATCHLIST</span><h2>Market Movers</h2></div><span className="mini-status">Live</span></div>
                <LiveWatchlist />
                <button className="secondary-button full-width" type="button">Manage Watchlist</button>
              </article>
            </section>

            <section className="dashboard-grid lower-grid">
              <article className="panel"><div className="panel-heading"><div><span className="eyebrow">TRADE PLAN</span><h2>Latest Setup</h2></div></div><dl>
                <div><dt>Entry Zone</dt><dd>{data ? `$${money(data.entryLow)} – $${money(data.entryHigh)}` : '—'}</dd></div>
                <div><dt>Stop Loss</dt><dd>{data ? `$${money(data.stopLoss)}` : '—'}</dd></div>
                <div><dt>Take Profit 1</dt><dd>{data ? `$${money(data.takeProfit1)}` : '—'}</dd></div>
                <div><dt>Take Profit 2</dt><dd>{data ? `$${money(data.takeProfit2)}` : '—'}</dd></div>
              </dl></article>
              <article className="panel"><div className="panel-heading"><div><span className="eyebrow">PROJECT WORKSPACE</span><h2>Build with AI</h2></div></div><p className="panel-copy">Record a product idea, improve the dashboard, define a trading rule, or plan the next development sprint.</p><button className="primary-button full-width" onClick={() => setActiveView('chat')}>Open AI Project Chat</button></article>
            </section>
          </>
        )}

        {activeView === 'analysis' && (
          <>
            <section className="controls panel">
              <label>Cryptocurrency<select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
                <option value="BTCUSDT">Bitcoin (BTC/USDT)</option><option value="ETHUSDT">Ethereum (ETH/USDT)</option><option value="BNBUSDT">BNB (BNB/USDT)</option><option value="SOLUSDT">Solana (SOL/USDT)</option><option value="XRPUSDT">XRP (XRP/USDT)</option>
                <option value="DOGEUSDT">Dogecoin (DOGE/USDT)</option><option value="ADAUSDT">Cardano (ADA/USDT)</option><option value="AVAXUSDT">Avalanche (AVAX/USDT)</option><option value="DOTUSDT">Polkadot (DOT/USDT)</option><option value="LINKUSDT">Chainlink (LINK/USDT)</option><option value="LTCUSDT">Litecoin (LTC/USDT)</option><option value="TRXUSDT">TRON (TRX/USDT)</option><option value="ATOMUSDT">Cosmos (ATOM/USDT)</option><option value="NEARUSDT">NEAR Protocol (NEAR/USDT)</option><option value="APTUSDT">Aptos (APT/USDT)</option><option value="ARBUSDT">Arbitrum (ARB/USDT)</option><option value="OPUSDT">Optimism (OP/USDT)</option><option value="SUIUSDT">Sui (SUI/USDT)</option><option value="PEPEUSDT">Pepe (PEPE/USDT)</option><option value="SHIBUSDT">Shiba Inu (SHIB/USDT)</option><option value="UNIUSDT">Uniswap (UNI/USDT)</option><option value="ETCUSDT">Ethereum Classic (ETC/USDT)</option><option value="FILUSDT">Filecoin (FIL/USDT)</option><option value="HBARUSDT">Hedera (HBAR/USDT)</option>
              </select></label>
              <label>Timeframe<select value={interval} onChange={(event) => setInterval(event.target.value)}>
                <option value="1m">1 Minute</option><option value="3m">3 Minutes</option><option value="5m">5 Minutes</option><option value="15m">15 Minutes</option><option value="30m">30 Minutes</option><option value="1h">1 Hour</option><option value="2h">2 Hours</option><option value="4h">4 Hours</option><option value="6h">6 Hours</option><option value="8h">8 Hours</option><option value="12h">12 Hours</option><option value="1d">1 Day</option><option value="3d">3 Days</option><option value="1w">1 Week</option><option value="1M">1 Month</option>
              </select></label>
              <button className="primary-button" onClick={analyze} disabled={loading}>{loading ? 'Analyzing…' : 'Run Analysis'}</button>
            </section>
            {error && <p className="error">{error}</p>}
            {data && <>
              <section className="hero panel"><div><small>{data.symbol} · {data.interval}</small><h2>${money(data.price)}</h2><p>{data.direction}</p></div><div className={`signal ${data.signal.toLowerCase()}`}><small>AI SIGNAL</small><strong>{data.signal}</strong><span>Confidence {data.score}/100</span></div></section>
              <section className="analysis-grid"><article className="panel"><h3>Trade Plan</h3><dl><div><dt>Entry Zone</dt><dd>${money(data.entryLow)} – ${money(data.entryHigh)}</dd></div><div><dt>Stop Loss</dt><dd>${money(data.stopLoss)}</dd></div><div><dt>Take Profit 1</dt><dd>${money(data.takeProfit1)}</dd></div><div><dt>Take Profit 2</dt><dd>${money(data.takeProfit2)}</dd></div></dl></article><article className="panel"><h3>Key Levels</h3><dl><div><dt>Support</dt><dd>${money(data.support)}</dd></div><div><dt>Resistance</dt><dd>${money(data.resistance)}</dd></div><div><dt>RSI (14)</dt><dd>{data.rsi.toFixed(1)}</dd></div><div><dt>ATR</dt><dd>{money(data.atr)}</dd></div></dl></article></section>
              <section className="panel"><h3>Analysis Summary</h3><ul>{data.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></section>
              <p className="notice">⚠️ {data.disclaimer} Use paper trading, testnet, and independent research before risking real funds.</p>
            </>}
          </>
        )}

        {activeView === 'chat' && (
          <section className="chat-layout">
            <aside className="panel chat-sidebar"><span className="eyebrow">PROJECT MEMORY</span><h3>Turn ideas into product decisions.</h3><p>Use this space for feature ideas, UI changes, trading logic, bugs, and roadmap decisions.</p><div className="idea-stat"><strong>{savedIdeaCount}</strong><span>Ideas saved locally</span></div><button className="secondary-button full-width" onClick={clearChat}>Clear Chat</button></aside>
            <section className="panel chat-panel"><div className="chat-heading"><div><span className="eyebrow">AI WORKSPACE</span><h2>Project Chat</h2></div><span className="prototype-label">Local Prototype</span></div><div className="messages" aria-live="polite">{messages.map((item) => <article className={`message ${item.role}`} key={item.id}><span>{item.role === 'assistant' ? 'AI' : 'You'}</span><p>{item.content}</p></article>)}</div><form className="composer" onSubmit={sendMessage}><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe an idea, feature, issue, or trading workflow…" rows={3}/><button className="primary-button" type="submit">Send Idea</button></form></section>
          </section>
        )}
      </main>
    </div>
  );
}
