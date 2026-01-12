import { MdOutlineArrowDropDown } from "react-icons/md";

import { useState, useEffect } from "react";
export const AddExpenseModal = ({ onClose }) => {
  const user_id = localStorage.getItem("user_id");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    date: "",
    amount: "",
    payment_method: "",
    description: ""
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
      alert("User not logged in. Cannot add expense.");
      return;
    }

    const payload = {
      user_id,
      category: formData.category,
      date: formData.date,
      amount: formData.amount,
      payment_method: formData.payment_method,
      description: formData.description
    };

    try {
      const res = await fetch("http://localhost:3000/api/addExpenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.status === 201) {
        alert("Expense added successfully!");
        setFormData({
          date: formData.date, 
          amount: "",
          description: "",
          payment_method: "",
          category: ""
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
        <h2 className="text-xl font-bold mb-4 text-[#FFF8D4]">Add Expense</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
          <input
            type="date"
            value={formData.date}
            name="date"
            onChange={handleChange}
            className="w-[367px] bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4]"
          />
         <div className="relative w-[370px]">
              <select
                value={formData.payment_method}
                onChange={handleChange}
                name="payment_method"
                className="w-full bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4] appearance-none pr-10"
              >
                <option value="" className="text-[#FFF8D4]">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <MdOutlineArrowDropDown className="text-[#FFF8D4] text-xl" />
              </div>
            </div>
            </div>
          <div className="flex flex-row gap-4">
            <div className="relative w-[480px]">
              <select
                value={formData.category}
                name="category"
                onChange={handleChange}
                className="w-full bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4] appearance-none pr-10"
              >
                <option value="">Select Category</option>
                <option value="MainWallet">Main Wallet</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <MdOutlineArrowDropDown className="text-[#FFF8D4] text-xl" />
              </div>
            </div>

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              name="amount"
              onChange={handleChange}
              className="w-[480px] bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4]"
            />
          </div>
             <input type="text" name="description" id="" value={formData.description}  placeholder="Description" onChange={handleChange} className="w-full h-16 bg-[#435663] shadow-2xl p-2 rounded-lg text-[#FFF8D4]"/>
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
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal