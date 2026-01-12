import { useState } from 'react';
import Navbar from '../components/Navbar';
import MainContent from '../components/MainContent';
import AddExpenseModal from '../components/AddExpenseModal';
import AddIncomeModal from '../components/AddIncomeModal';
export const Main = () => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const[isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);  // NEW
  const [editMode, setEditMode] = useState(false);
  const openModalExpense = () => setIsExpenseModalOpen(true);
  const closeModalExpense = () => setIsExpenseModalOpen(false);
 const openModalIncome = () => setIsIncomeModalOpen(true);
  const closeModalIncome = () => setIsIncomeModalOpen(false);
  // Toggle delete mode
  const toggleDeleteMode = () => setDeleteMode(prev => !prev);
  const toggleEditMode = () => setEditMode(prev=>!prev)
  return (
    <div className='w-screen h-screen bg-[#FFF8D4] flex flex-row'>
      
      {/* Pass two handlers */}
      <Navbar 
        onAddIncomeClick={openModalIncome}
        onAddExpenseClick={openModalExpense}
        onDeleteExpenseClick={toggleDeleteMode}
        onEditExpenseClick={toggleEditMode}
          // NEW
      />

      {/* Pass deleteMode to MainContent */}
      <MainContent deleteMode={deleteMode} editMode={editMode} />
      {isIncomeModalOpen && <AddIncomeModal onClose={closeModalIncome} />}
      {isExpenseModalOpen && <AddExpenseModal onClose={closeModalExpense} />}
    </div>
  );
};

export default Main;
