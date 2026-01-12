import { CiFilter } from "react-icons/ci";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useState, useEffect } from "react";
import { TbBrandCashapp } from "react-icons/tb";
import { IoWalletOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { TiDocumentDelete } from "react-icons/ti";


export const MainContent = ({ deleteMode, editMode }) => {
const [incomeData, setIncomeData] = useState([]);
const[expensesData, setExpensesData] = useState([]);
const [open, setOpen] = useState(false);
const [isEditingIncome, setIsEditingIncome] = useState(false);
const [newIncome, setNewIncome] = useState("");
const [remaining, setRemaining] = useState(0);
const user_id = localStorage.getItem("user_id");
useEffect(() => {
  const fetchIncome = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/getIncome?user_id=${user_id}`);
      if (!res.ok) throw new Error("Failed to fetch income");
      const result = await res.json();

      setIncomeData(result); 
      console.log("Fetched income:", result);
    } catch (err) {
      console.error("Error fetching income:", err);
      setIncomeData([]);
    }
  };

  if (user_id) fetchIncome();
}, [user_id]);

useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/getExpenses?user_id=${user_id}&month=${month}&year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch income");
      const result = await res.json();

      setExpensesData(result);  // <- corrected
      console.log("Fetched Expense:", result);
    } catch (err) {
      console.error("Error fetching Expense:", err);
      setExpensesData([]);
    }
  };

  if (user_id) fetchExpenses();
}, [user_id]);

const date = new Date();
const month = date.getMonth() + 1;
const year = date.getFullYear();
useEffect(() => {
  const fetchRemaining = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/getRemainingBalance?user_id=${user_id}&month=${month}&year=${year}`
      );
      const data = await res.json();
      setRemaining(data.remaining);
    } catch (err) {
      console.log(err);
    }
  };

  if (user_id) fetchRemaining();
}, [user_id, month, year]);
const updateIncome = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/updateIncome`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        income: newIncome,
      }),
    });

    const data = await res.json();
    console.log(data);

    setIsEditingIncome(false);
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};

const deleteExpense = async (expense_id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/deleteExpense/${expense_id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data.message);

    setExpenses(expenses.filter((exp) => exp.expense_id !== expense_id));
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="w-[8000px] h-[95vh] m-4 relative overflow-y-auto hide-scrollbar">
  {/* <div className="flex flex-row items-center">
    <CiFilter className="text-[#313647] text-3xl" />

    <p className="ml-1">Filter</p>

    <MdOutlineArrowDropDown
      className="text-[#313647] text-3xl cursor-pointer ml-1"
      onClick={() => setOpen(!open)}
    />
  </div> */}

  {/* DROPDOWN — positioned absolutely so it doesn't move layout
  {open && (
    <div className="absolute top-10 left-0 bg-[#FFF8D4] shadow-lg p-3 rounded-lg w-48 z-50">
      <p className="py-1 hover:bg-gray-200 cursor-pointer rounded">Last 7 Days</p>
      <p className="py-1 hover:bg-gray-200 cursor-pointer rounded">Last 30 Days</p>
      <p className="py-1 hover:bg-gray-200 cursor-pointer rounded">This Month</p>
      <p className="py-1 hover:bg-gray-200 cursor-pointer rounded">This Year</p>
    </div>
  )} */}

   <div className="flex gap-14">
   <div className="border-2 w-[500px] h-60 border-[#313647] rounded-lg mt-4 p-6 shadow-2xl">
      {/* Title */}
      <div className="bg-[#313647] w-40 h-10 flex items-center justify-center rounded-sm mb-4 shadow-xl">
        <h1 className="text-[#FFF8D4] flex justify-center items-center gap-1">
          <IoWalletOutline /> Main Wallet
        </h1>
      </div>

      {/* Amount Section */}
      <div className="bg-[#A3B087] h-10 flex items-center pl-6 rounded-sm mb-4 shadow-xl gap-2">

        {isEditingIncome ? (
          <>
            <input
              type="number"
              value={newIncome}
              onChange={(e) => setNewIncome(e.target.value)}
              className="w-24 bg-white border rounded px-2"
            />

            <button
              onClick={updateIncome}
              className="px-3 py-1 bg-[#313647] text-[#FFF8D4] rounded"
            >
              Save
            </button>
          </>
        ) : (
          <h1 className="text-[#313647]">
            ৳ Amount: {incomeData.length > 0 ? incomeData[0].income : 0}
          </h1>
        )}
      </div>


      {/* Edit Button */}
      <div className="flex justify-end mt-10">
        <div
      onClick={() => {
        setIsEditingIncome(true);
        setNewIncome(incomeData.length > 0 ? incomeData[0].income : "");
      }}
      className="border-2 border-[#313647] w-28 h-10 flex items-center justify-center rounded-sm cursor-pointer hover:bg-[#313647] hover:text-[#FFF8D4] transition shadow-xl"
    >
      <h1 className="flex justify-center items-center gap-1">
        <CiEdit /> Edit
      </h1>
    </div>
      </div>
    </div>
   <div className="border-2 w-[500px] h-60 border-[#313647] rounded-lg mt-4 shadow-2xl">
        <div className="bg-[#313647] w-40 h-10 flex items-center justify-center m-6 rounded-sm shadow-xl"><h1 className="text-[#FFF8D4]">Total Amount</h1></div>
        <div className="bg-[#A3B087] h-10 flex items-center pl-6 rounded-sm mb-4 ml-6 mr-6 shadow-xl">
        <h1 className="text-[#313647] flex justify-center items-center "> ৳ Amount: {remaining}</h1>
        </div>
    </div>
   </div>
   <div className="flex gap-14 mt-10 w-[1200px]">
  {/* CARD 1 */}
  {expensesData.length > 0 ? (
  expensesData.map((item) => (
    
    <div key={item.expense_id} className="relative border-2 w-[500px] h-60 border-[#313647] rounded-lg mt-4 shadow-2xl">

      {/* Delete Icon */}
      {deleteMode && (
        <TiDocumentDelete className="absolute top-6 right-4 text-[#313647] text-2xl cursor-pointer hover:text-red-400" onClick={() => deleteExpense(item.expense_id)} />
      )}

      {/* Edit Icon */}
      {/* {editMode && (
        <CiEdit className="absolute top-6 right-14 text-[#313647] text-2xl cursor-pointer hover:text-red-400" />
      )} */}

      {/* Date */}
      <div className="absolute top-6 h-10 left-48 text-[#313647] text-sm flex items-center">
        <h4>Date:{new Date(item.date).toISOString().split("T")[0]}</h4>
      </div>

      {/* Category Section */}
      <div className="bg-[#313647] w-40 h-10 flex items-center justify-center m-6 rounded-sm shadow-xl">
        <h1 className="text-[#FFF8D4]">{item.category}</h1>
      </div>

      {/* Amount Section */}
      <div className="bg-[#A3B087] h-10 flex items-center pl-6 rounded-sm mb-4 ml-6 mr-6 shadow-xl">
        <h1 className="text-[#313647] flex items-center gap-2 ml-2"> 
          ৳ Amount:
        </h1>
        <p className='text-[#313647] flex items-center gap-2 ml-2'>{item.amount}</p>
        <p className="mr-4 ml-50">{item.payment_method}</p>
      </div>

      {/* Description */}
      <div className="border-2 border-[#A3B087] h-16 flex items-center pl-6 rounded-sm mb-4 ml-6 mr-6 shadow-xl">
        <h1 className="text-[#313647] flex justify-center items-center">{item.description}</h1>
      </div>
    </div>
  ))
) : (
  <p>No expenses found</p>
)}
</div>



    {/* <div className="flex flex-row gap-14 mt-10">
    <div className="border-2 w-[500px] h-60 border-[#313647] rounded-lg mt-4 shadow-2xl">
        <div className="bg-[#313647] w-40 h-10 flex items-center justify-center m-6 rounded-sm shadow-xl"><h1 className="text-[#FFF8D4] shadow-xl">Total Amount</h1></div>
        <div className="bg-[#A3B087] h-10 flex items-center pl-6 rounded-sm mb-4 ml-6 mr-6 shadow-xl">
        <h1 className="text-[#313647] flex justify-center items-center"> <TbBrandCashapp />Amount:</h1>
        </div>
    </div>
    
   </div> */}
</div>

  )
}

export default MainContent