import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [mostSpentCategory, setMostSpentCategory] = useState(null);
  const [aiPrediction, setAiPrediction] = useState(null);

  const user_id = localStorage.getItem("user_id");

  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/api/getChartData?user_id=${user_id}`)
      .then(res => res.json())
      .then(setChartData)
      .catch(err => console.error(err));
  }, [user_id]);
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/api/getIncome?user_id=${user_id}`)
      .then(res => res.json())
      .then(setIncomeData)
      .catch(() => setIncomeData([]));
  }, [user_id]);
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/api/getMonthlyExpense?user_id=${user_id}`)
      .then(res => res.json())
      .then(data => setMonthlyExpense(data.total_expense || 0))
      .catch(() => setMonthlyExpense(0));
  }, [user_id]);
  useEffect(() => {
    if (!user_id) return;

    fetch(
      `http://localhost:3000/api/getRemainingBalance?user_id=${user_id}&month=${month}&year=${year}`
    )
      .then(res => res.json())
      .then(data => setRemaining(data.remaining || 0))
      .catch(err => console.error(err));
  }, [user_id, month, year]);
  useEffect(() => {
    if (!user_id) return;

    fetch(`http://localhost:3000/api/getMostSpentCategory?user_id=${user_id}`)
      .then(res => res.json())
      .then(data => setMostSpentCategory(data.category))
      .catch(err => console.error(err));
  }, [user_id]);


  useEffect(() => {
    if (!user_id) return;

    const fetchPrediction = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/getPredictedExpenses",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id,
              month: month + 1, // next month
            }),
          }
        );

        const data = await res.json();
        setAiPrediction(data.predicted_expense);
      } catch (err) {
        console.error("Prediction error:", err);
      }
    };

    fetchPrediction();
  }, [user_id, month]);

  const formatted = chartData.map(item => ({
    name: `${monthNames[item.month - 1]} ${item.year}`,
    Income: Number(item.income),
    Expense: Number(item.expense),
    Remaining: Number(item.remaining),
  }));

  return (
    <div className="flex h-screen w-screen bg-[#FFF8D4]">
      <div className="w-52 h-screen bg-[#313647]">
        <Navbar />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-[#313647] font-bold text-3xl mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-5 gap-6 mb-8">
          <Card title="Remaining" value={`৳ ${remaining}`} />

          <Card
            title="Income"
            value={`৳ ${incomeData.length ? incomeData[0].income : 0}`}
          />

          <Card title="Expense" value={`৳ ${monthlyExpense}`} />

          <Card
            title="Most Spent"
            value={mostSpentCategory ?? "Loading..."}
          />

          <Card
            title="AI Prediction"
            value={
              aiPrediction
                ? `৳ ${aiPrediction.toFixed(2)}`
                : "Loading..."
            }
          />
        </div>

        <div className="bg-white p-4 h-96 rounded-lg shadow-lg">
          <h2 className="text-[#313647] text-xl font-bold mb-2">
            Income vs Expense
          </h2>

          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#313647" />
              <Bar dataKey="Expense" fill="#A3B087" />
              <Line type="monotone" dataKey="Remaining" stroke="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
const Card = ({ title, value }) => (
  <div className="bg-[#313647] p-4 h-32 rounded-lg shadow-lg flex flex-col items-center justify-center">
    <h2 className="text-[#FFF8D4] text-lg font-semibold">{title}</h2>
    <p className="text-[#FFF8D4] mt-2 text-sm">{value}</p>
  </div>
);

export default Dashboard;
