import { useEffect, useState } from "react";

export const AllTransactionCards = () => {
  const [transactions, setTransactions] = useState([]);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/getAllTransactions?user_id=${user_id}`
        );
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    if (user_id) fetchTransactions();
  }, [user_id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="mt-6 text-[#313647] font-bold text-3xl">All Transactions</div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white p-4 w-[1000px] rounded-lg shadow-lg flex justify-between items-center"
          >
            <div className="flex gap-6 items-center">
              <h2 className="text-[#313647] text-md font-semibold">
                {tx.type === "Expense" ? tx.category : "Income"}
              </h2>
              <h5 className="text-[#313647] text-sm">
                {tx.date ? new Date(tx.date).toLocaleDateString() : `${tx.month}/${tx.year}`}
              </h5>
            </div>
            <div>
              <p
                className={`${
                  tx.type === "Expense" ? "text-red-500" : "text-green-500"
                } font-bold`}
              >
                {tx.type === "Expense" ? `- ${tx.amount}` : `+ ${tx.amount}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTransactionCards;
