"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog";
import { formatDate } from "date-fns";
import { FilePenIcon, PlusIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

// type alias Of Expense
type Expense = {
  id: number;
  name: string;
  amount: number;
  date: Date;
};

// Data of expenses
const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Groceries",
    amount: 250,
    date: new Date("2024-05-15"),
  },
  {
    id: 2,
    name: "Rent",
    amount: 250,
    date: new Date("2024-06-01"),
  },
  {
    id: 3,
    name: "Utilities",
    amount: 250,
    date: new Date("2024-06-05"),
  },
  {
    id: 4,
    name: "Dining Out",
    amount: 250,
    date: new Date("2024-06-10"),
  },
];

// Componenet of Expense Tracker
const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModel, setShowModel] = useState<boolean>(true);
  const [isediting, setISediting] = useState<boolean>(false);
  const [cuurentExpenseId, setCurrentExpenseId] = useState<number | null>(null);
  const [newExpenses, setNewExpenses] = useState<{
    name: string;
    amount: number;
    date: Date;
  }>({
    name: "",
    amount: 0,
    date: new Date(),
  });

  // it check wether store item is present on localstorage
  // if its present then set in the setExpense
  // else initial expense will bes set in setExpense
  useEffect(() => {
    const storedItem = localStorage.getItem("expenses");

    if (storedItem) {
      setExpenses(
        JSON.parse(storedItem).map((item: Expense) => ({
          ...expenses,
          date: item.date,
        }))
      );
    } else {
      setExpenses(initialExpenses);
    }
  }, []);

  // If expesnes length is 0 then it will
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  // function to add expense

  const resetForm = () => {
    setNewExpenses({
      name: "",
      date: new Date(),
      amount: 0,
    });

    setISediting(false);
    setCurrentExpenseId(null);
  };
  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        name: newExpenses.name,
        amount: newExpenses.amount,
        date: newExpenses.date,
      },
    ]);

    resetForm();
    setShowModel(false);
  };

  const handleEditExpense = (id: number) => {
    const editExpense = expenses.find((expense) => expense.id === id);

    if (editExpense) {
      setExpenses([
        {
          name: editExpense.name,
          amount: editExpense.amount,
          date: editExpense.date,
          id: editExpense.id,
        },
      ]);
      setCurrentExpenseId(id);
      setShowModel(true);
      setISediting(true);
    }
  };

  const handleSaveEditExpense = () => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === cuurentExpenseId
          ? { ...expense, ...newExpenses, amount: newExpenses.amount }
          : expense
      )
    );

    resetForm();
    setShowModel(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewExpenses((prev) => ({
      ...prev,
      [id]:
        id === "amount"
          ? parseFloat(value)
          : id === "data"
          ? new Date(value)
          : value,
    }));
  };
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  return (
    <div>
      <header className="bg-cyan-800 p-9 flex justify-between">
        <h1 className="text-white text-4xl">Expense Tracker</h1>
        <div className="text-4xl font-bold text-white">
          Total:${totalExpenses.toFixed(2)}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-24 mt-6 w-full h-screen ">
        <ul>
          {expenses.map((expensee, key) => (
            <li key={key} className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold">{expensee.name}</h3>
                <h3>
                  {expensee.amount}{" "}
                
                {formatDate(expensee.date, "yyyy-MM-dd")}</h3>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    handleEditExpense(expensee.id);
                  }}
                  className="mb-4"
                >
                  <FilePenIcon />
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteExpense(expensee.id);
                  }}
                  className="mb-4"
                >
                  <TrashIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <div className="fixed bottom-6 right-6">
        <Button
          size={"icon"}
          onClick={() => {
            setShowModel(true);
            setISediting(false);
            resetForm();
          }}
        >
          <PlusIcon />
        </Button>
      </div>

      <Dialog open={showModel} onOpenChange={setShowModel}>
        <DialogContent className="bg-card p-6 rounded-lg shadow w-full max-w-md">
          <DialogHeader>
            <DialogTitle>
              <DialogDescription>{isediting ? "Edit Expense" : "Add Expense"}</DialogDescription>
              
            </DialogTitle>
          </DialogHeader>

          <div>
            <div className="grip gap-4">
              <Label htmlFor="name">Expense Name</Label>
              <div className="grid gap-2">
                <Input
                  id="name"
                  placeholder="Enter expense name"
                  value={newExpenses.name}
                  onChange={handleInputChange}
                />

                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter expense amount"
                    value={newExpenses.amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    placeholder="Enter expense amount"
                    value={newExpenses.date.toISOString()}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowModel(false)}>Cancel</Button>

              <Button
                onClick={isediting ? handleSaveEditExpense : handleAddExpense}
              >
                {isediting ? "Save Changes" : "Add Expense"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;
