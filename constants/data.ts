import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";
import * as Icons from 'phosphor-react-native';

export const expenseCategories: ExpenseCategoriesType = {
    groceries: {
        label: "Groceries",
        value: "groceries",
        icon: Icons.ShoppingCartIcon,
        bgColor: "#4B5563",   //Deep Teal Green
    },
    rent: {
        label: "Rent",
        value: "rent",
        icon: Icons.HouseIcon,
        bgColor: "#075985",  //Dark Blue
    },
    utilities: {
        label: "Utilities",
        value: "utilities",
        icon: Icons.LightbulbIcon,
        bgColor: "#ca8a04",  //Dark Golden Brown
    },
    transportation: {
        label: "Transportation",
        value: "transportation",
        icon: Icons.CarIcon,
        bgColor: "#b45309",  //Dark Orange-Red
    },
    entertainment: {
        label: "Entertainment",
        value: "entertainment",
        icon: Icons.FilmScriptIcon,
        bgColor: "#0f766e",  //Dark Red-Brown
    },
    dining: {
        label: "Dining",
        value: "dining",
        icon: Icons.ForkKnifeIcon,
        bgColor: "#be185d",  //Dark Red
    },
    health: {
        label: "Health",
        value: "health",
        icon: Icons.HeartIcon,
        bgColor: "#e11d48",  //Dark Purple
    },
    insurance: {
        label: "Insurance",
        value: "insurance",
        icon: Icons.ShieldCheckIcon,
        bgColor: "#404040",  //Dark grey
    },
    savings: {
        label: "Savings",
        value: "savings",
        icon: Icons.PiggyBankIcon,
        bgColor: "#065F46",  //Dark Teal Green
    },
    clothing: {
        label: "Clothing",
        value: "clothing",
        icon: Icons.TShirtIcon,
        bgColor: "#7c3aed",  //Dark indigo
    },
    personal: {
        label: "Personal",
        value: "personal",
        icon: Icons.UserIcon,
        bgColor: "#a21caf",  //Dark pink
    },
    others: {
        label: "Others",
        value: "others",
        icon: Icons.QuestionMarkIcon,
        bgColor: "#525252",  //Dark Neutral Gray
    },
};

export const incomeCategory: CategoryType = {
    label: "Income",
    value: "income",
    icon: Icons.CurrencyInrIcon,
    bgColor: "#16a34a",  //Dark Green
};

export const transactionTypes = [
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
]