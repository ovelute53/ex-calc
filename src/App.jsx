import React, { useState, useEffect, useMemo } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  Calculator, 
  Globe, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

// 차트 플러그인 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_BASE = 'https://api.frankfurter.app';

function App() {
  // --- 상태 관리 (State Management) ---
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KRW');
  const [currencies, setCurrencies] = useState({});
  const [rate, setRate] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1M'); // 1M, 1Y (API limitation handles roughly 30 days or more)

  // --- 데이터 페칭 (Data Fetching) ---
  // 1. 통화 목록 가져오기
  useEffect(() => {
    fetch(`${API_BASE}/currencies`)
      .then(res => res.json())
      .then(data => {
        setCurrencies(data);
        setLoading(false);
      });
  }, []);

  // 2. 실시간 환율 가져오기
  useEffect(() => {
    if (from === to) {
      setRate(1);
      return;
    }
    fetch(`${API_BASE}/latest?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        setRate(data.rates[to]);
      })
      .catch(() => setRate(null));
  }, [from, to]);

  // 3. 차트 데이터 가져오기
  useEffect(() => {
    if (from === to) return;
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (period === '1W' ? 7 : period === '1M' ? 30 : 365));
    const startStr = startDate.toISOString().split('T')[0];

    fetch(`${API_BASE}/${startStr}..${endDate}?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          const labels = Object.keys(data.rates);
          const values = labels.map(date => data.rates[date][to]);
          setHistoryData({ labels, values });
        }
      });
  }, [from, to, period]);

  // --- 핸들러 ---
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // --- 차트 설정 ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: '#1e293b',
        padding: 12
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { borderDash: [4, 4] }, border: { display: false } }
    }
  };

  const chartDataConfig = useMemo(() => {
    if (!historyData) return null;
    return {
      labels: historyData.labels,
      datasets: [
        {
          label: `${from}/${to}`,
          data: historyData.values,
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
            gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
            return gradient;
          },
          borderColor: '#4f46e5',
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          borderWidth: 2
        },
      ],
    };
  }, [historyData, from, to]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 h-14 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1 rounded-md"><Globe size={18} /></div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Meowster <span className="text-indigo-600">Pro</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>LIVE API</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left: Calculator */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="text-indigo-600" size={20}/>
                <h2 className="font-bold text-lg text-slate-800">환율 계산기</h2>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">금액 (Amount)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-3xl font-bold text-slate-800 border-b-2 border-slate-200 py-2 focus:border-indigo-600 focus:outline-none bg-transparent font-mono transition-colors"
                />
              </div>

              <div className="space-y-4 mb-8">
                {/* From */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative hover:border-indigo-300 transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 uppercase absolute top-2 right-3">From</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-700">{from}</span>
                    <select 
                      value={from} 
                      onChange={(e) => setFrom(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    >
                      {Object.keys(currencies).map(c => <option key={c} value={c}>{c} - {currencies[c]}</option>)}
                    </select>
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-1">{currencies[from]}</div>
                </div>

                {/* Swap */}
                <div className="flex justify-center -my-6 relative z-10">
                  <button onClick={handleSwap} className="bg-indigo-600 text-white p-2 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform">
                    <ArrowRightLeft size={18} />
                  </button>
                </div>

                {/* To */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative hover:border-indigo-300 transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 uppercase absolute top-2 right-3">To</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-700">{to}</span>
                    <select 
                      value={to} 
                      onChange={(e) => setTo(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    >
                      {Object.keys(currencies).map(c => <option key={c} value={c}>{c} - {currencies[c]}</option>)}
                    </select>
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-1">{currencies[to]}</div>
                </div>
              </div>

              {/* Result */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-1">환전 예상 결과</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-indigo-900 font-mono tracking-tight">
                    {rate ? (amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '...'}
                  </span>
                  <span className="text-lg font-bold text-indigo-600">{to}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                  <p className="text-xs text-slate-500">
                    1 <span className="font-bold text-slate-700">{from}</span> = 
                    <span className="font-bold text-indigo-600 mx-1">{rate ? rate.toFixed(4) : '...'}</span> 
                    <span className="font-bold text-slate-700">{to}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Chart & Analysis */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={20}/>
                  <h3 className="font-bold text-lg text-slate-800">환율 변동 추이</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['1W', '1M', '1Y'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-grow w-full relative min-h-[300px]">
                {chartDataConfig ? <Line data={chartDataConfig} options={chartOptions} /> : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
                    <Loader2 className="animate-spin text-slate-400" size={30} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">High</p>
                  <p className="text-sm font-bold text-emerald-600 font-mono">
                    {historyData ? Math.max(...historyData.values).toFixed(2) : '--'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Low</p>
                  <p className="text-sm font-bold text-rose-600 font-mono">
                    {historyData ? Math.min(...historyData.values).toFixed(2) : '--'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Average</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">
                    {historyData ? (historyData.values.reduce((a,b)=>a+b,0)/historyData.values.length).toFixed(2) : '--'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-xs font-medium">Secured by Cloudflare</span>
          </div>
          <p className="text-xs text-slate-400">&copy; 2026 Meowster. React Application Build.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;