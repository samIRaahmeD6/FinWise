import express from "express";
import { loginUser, registerUser, addIncome, getIncome, addExpenses, getExpenses, updateIncome, deleteExpense, getRemainingBalance, getChartData, getMonthlyExpense, getAllTransactions, getMostSpentCategory, getPredictedExpenses} from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addIncome", addIncome);
router.get("/getIncome", getIncome);
router.post("/addExpenses", addExpenses)
router.get("/getExpenses", getExpenses)
router.delete("/deleteExpense/:expense_id", deleteExpense);
router.put("/updateIncome", updateIncome)
router.get("/getMonthlyExpense", getMonthlyExpense)
router.get("/getAllTransactions", getAllTransactions)
router.get("/getRemainingBalance", getRemainingBalance)
router.get("/getMostSpentCategory", getMostSpentCategory)
router.get("/getChartData", getChartData);
router.post("/getPredictedExpenses", getPredictedExpenses)
export default router;