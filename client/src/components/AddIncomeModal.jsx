import { useState, useEffect } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

const AddIncomeModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    category: "MainWallet",
    date: "",
    amount: ""
  });
  useEffect(() => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: currentDate }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alert("User not logged in. Cannot add income.");
      return;
    }

    const payload = {
      user_id,
      category: formData.category,
      date: formData.date,
      income: formData.amount,
    };

    try {
      const res = await fetch("http://localhost:3000/api/addIncome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.status === 201) {
        alert("Income added successfully!");
        setFormData({
          category: "MainWallet",
          date: formData.date, 
          amount: ""
        });
        onClose();
      } else {
        alert(result.message || "Insertion failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-20 backdrop-blur-sm z-50">
      <div className="bg-[#313647] p-6 shadow-md w-[800px] rounded-2xl">
        <h2 className="text-xl font-bold mb-4 text-[#FFF8D4]">Add Income</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div className="flex gap-4">
            <input
              type="date"
              value={formData.date}
              name="date"
              onChange={handleChange}
              className="w-[367px] bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4]"
            />

            <div className="relative w-[480px]">
              <select
                value={formData.category}
                name="category"
                onChange={handleChange}
                className="w-full bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4] appearance-none pr-10"
              >
                <option value="MainWallet">Main Wallet</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <MdOutlineArrowDropDown className="text-[#FFF8D4] text-xl" />
              </div>
            </div>
          </div>

          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            name="amount"
            onChange={handleChange}
            className="w-full bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4]"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#A3B087] text-white rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#435663] text-white rounded"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;
