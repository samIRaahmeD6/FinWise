import db from '../database/db.js'
import bycrypt from 'bcryptjs'
import fetch from "node-fetch";

export const registerUser = (req, res) =>{
    const {username, email, password } = req.body;

    if (!username || !email || !password){
        return res.status(400).json({message:"Username, email & password are required"});

    }

    const checkEmailSql = "SELECT user_id FROM users where email = ?";
    db.query(checkEmailSql, [email], (err, results)=>{
        if (err){
            console.error("DB error checking mail:", err);
            return res.status(500).json({message:"Database Error"});

        }
        if(results.length>0){
            return res.status(409).json({message: "Email already registered"});
        }

        const saltRounds = 10;
        bycrypt.hash(password, saltRounds, (hashErr, hashedPassword) =>{
            if(hashErr){
                console.error("Hashing error", hashErr);
                return res.status(500).json({message:"Server Error"});

            }
        const insertSql = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
        db.query(insertSql, [username, email, hashedPassword], (insertErr, insertResult)=>{
            if(insertErr){
                console.error("DB insert error", insertErr);
                return res.status(500).json({message: "Database error while inserting user"});
            }

            return res.status(201).json({
                message: "User registerd successfully",
                user: {id: insertResult.insertId, username, email},
            })
         })

       })
    })
}

export const loginUser = (req, res) =>{
    const {email, password} = req.body;
    
    if(!email || !password)
        return res.status(400).json({message: "Please provide Email and Password"})

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async(err, results)=>{
        if(err) return res.status(500).json({message:"Database error!"})
        if(results.length === 0) return res.status(401).json({message: "Email not registered"})

        const user = results[0];

        const isMatch = await bycrypt.compare(password, user.password);
         if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

         res.status(200).json({
            
            message:"Login Successful",
            user: { user_id: user.user_id, username: user.username, email: user.email }
        })
    })
}

export const addIncome = (req, res) => {
    console.log(req.body);
  const { user_id, date, category, income } = req.body;


  if (!user_id || !date || !category || !income) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const [year, month] = date.split("-");

  const sql = `
    INSERT INTO main_wallet (user_id, month, year, income) 
    VALUES (?, ?, ?, ?)`;

  db.query(sql, [user_id, month, year, income], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(201).json({ message: "Income Added Successfully" });
  });
};

export const getIncome = (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = `
    SELECT *
    FROM main_wallet
    WHERE user_id = ?
      AND month = MONTH(CURDATE())
      AND year = YEAR(CURDATE())
    ORDER BY id DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};


export const updateIncome = (req, res) => {
  const { user_id, income } = req.body;

  const sql = `
    UPDATE main_wallet
    SET income = ?
    WHERE user_id = ?
  `;

  db.query(sql, [income, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    return res.json({ message: "Income updated successfully" });
  });
};

export const addExpenses = (req, res) => {
    console.log(req.body);
  const { user_id, date, category, amount, payment_method, description } = req.body;


  if (!user_id || !date || !category || !amount || !payment_method) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO expenses (user_id, date, category, amount, payment_method, description) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [user_id, date, category, amount, payment_method, description ], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(201).json({ message: "Income Added Successfully" });
  });
};

export const getExpenses = (req, res) => {
  const { user_id, month, year } = req.query;

  if (!user_id || !month || !year) {
    return res.status(400).json({
      message: "user_id, month and year are required"
    });
  }

  const sql = `
    SELECT *
    FROM expenses
    WHERE user_id = ?
      AND MONTH(date) = ?
      AND YEAR(date) = ?
    ORDER BY date DESC
  `;

  db.query(sql, [user_id, month, year], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};


export const deleteExpense = (req, res) => {
  const { expense_id } = req.params;

  const sql = `DELETE FROM expenses WHERE expense_id = ?`;

  db.query(sql, [expense_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    return res.json({ message: "Expense deleted successfully" });
  });
};


export const getRemainingBalance = (req, res) => {
  const { user_id, month, year } = req.query;

  const incomeSql = `
    SELECT SUM(income) AS total_income
    FROM main_wallet
    WHERE user_id = ? AND month = ? AND year = ?
  `;

  const expenseSql = `
    SELECT SUM(amount) AS total_expense
    FROM expenses
    WHERE user_id = ?
      AND MONTH(date) = ?
      AND YEAR(date) = ?
  `;

  db.query(incomeSql, [user_id, month, year], (err, incomeResult) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(expenseSql, [user_id, month, year], (err, expenseResult) => {
      if (err) return res.status(500).json({ error: err.message });

      const total_income = incomeResult[0].total_income || 0;
      const total_expense = expenseResult[0].total_expense || 0;

      res.json({
        remaining: total_income - total_expense,
        total_income,
        total_expense
      });
    });
  });
};
export const getMonthlyExpense = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "User ID is required" });

  const date = new Date();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear();  

  const sql = `
    SELECT COALESCE(SUM(amount), 0) AS total_expense
    FROM expenses
    WHERE user_id = ? 
      AND MONTH(date) = ? 
      AND YEAR(date) = ?
  `;

  db.query(sql, [user_id, month, year], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total_expense: result[0].total_expense });
  });
};

export const getAllTransactions = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "User ID is required" });

  const sql = `
    SELECT 'Income' AS type, income AS amount, month, year, created_at AS date, NULL AS category
    FROM main_wallet
    WHERE user_id = ?

    UNION ALL

    SELECT 'Expense' AS type, amount, MONTH(date) AS month, YEAR(date) AS year, date, category
    FROM expenses
    WHERE user_id = ?

    ORDER BY year ASC, month ASC, date ASC
  `;

  db.query(sql, [user_id, user_id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};



export const getChartData = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ message: "user_id is required" });

  const sql = `
    SELECT 
      months.year,
      months.month,
      COALESCE(w.total_income, 0) AS income,
      COALESCE(e.total_expense, 0) AS expense,
      (COALESCE(w.total_income, 0) - COALESCE(e.total_expense, 0)) AS remaining
    FROM (
      -- get all unique year/month from income and expense tables
      SELECT DISTINCT year, month FROM main_wallet
      UNION
      SELECT DISTINCT YEAR(date) AS year, MONTH(date) AS month FROM expenses
    ) months
    LEFT JOIN (
      -- sum income per month
      SELECT user_id, year, month, SUM(income) AS total_income
      FROM main_wallet
      WHERE user_id = ?
      GROUP BY year, month
    ) w
    ON months.year = w.year AND months.month = w.month
    LEFT JOIN (
      -- sum expense per month
      SELECT user_id, YEAR(date) AS year, MONTH(date) AS month, SUM(amount) AS total_expense
      FROM expenses
      WHERE user_id = ?
      GROUP BY YEAR(date), MONTH(date)
    ) e
    ON months.year = e.year AND months.month = e.month
    ORDER BY months.year ASC, months.month ASC
  `;

  db.query(sql, [user_id, user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.json(result);
  });
};

export const getMostSpentCategory = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const sql = `
    SELECT category, SUM(amount) AS total
    FROM expenses
    WHERE user_id = ?
      AND MONTH(date) = MONTH(CURRENT_DATE())
      AND YEAR(date) = YEAR(CURRENT_DATE())
    GROUP BY category
    ORDER BY total DESC
    LIMIT 1
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.json({
        category: null,
        total: 0,
        message: "No expenses found for this month"
      });
    }

    res.json({
      category: result[0].category,
      total: result[0].total
    });
  });
};

export const getPredictedExpenses = async (req, res) => {
  const { user_id, month } = req.body;

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, month }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Python API error:", text);
      return res.status(500).json({ error: "Python API failed" });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};