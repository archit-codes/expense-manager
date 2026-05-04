import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
) : Promise<ResponseType> => {
    try{
        const {id , type, walletId, amount , image} = transactionData;
        if(!amount || amount<=0 || !type || !walletId){
            return {
                success: false,
                msg: " Invalid transaction data!"
            }
        }
        if(id){
            // update existing transaction
            const oldTransactionSnapshot = await getDoc(
                doc(firestore, "transactions", id)
            );
            const oldTransaction= oldTransactionSnapshot.data() as TransactionType;
            const shouldRevertOriginal = 
                oldTransaction.type != type || 
                oldTransaction.amount != amount || 
                oldTransaction.walletId != walletId;
            if(shouldRevertOriginal){
                let res= await revertAndUpdateWallets(
                    oldTransaction , 
                    Number(amount) , 
                    type , 
                    walletId
                );
                if(!res.success) return res;
            }
        }else{
            // update wallet for new transaction
            let res = await updateWalletForNewTransaction(
                walletId!,
                Number(amount!),
                type
            );
            if(!res.success) return res;
        }

        if(image){
            const imageUploadRes = await uploadFileToCloudinary(
                image, 
                "transactions"
            );
            if(!imageUploadRes.success){
                return {
                    success: false,
                    msg: imageUploadRes.msg || "Receipt upload failed",
                };
            }
            transactionData.image = imageUploadRes.data;
        }

        const transactionRef = id
            ? doc(firestore, "transactions", id) 
            : doc(collection(firestore, "transactions"));
        
        await setDoc(transactionRef, transactionData, {merge: true});

        return {
            success: true , 
            data: {...transactionData, id: transactionRef.id} 
        };

            
    }catch(err:any){
        console.log("Error creating/updating transaction: ", err);
        return {
            success: false,
            msg: err.message,
        };
    }
};

const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string,
) => {
    try{
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnapshot = await getDoc(walletRef);
        if(!walletSnapshot.exists()){
            console.log("Error updating wallet for new transaction");
            return {success: false, msg: "Wallet not found!"}
        }
        const walletData = walletSnapshot.data() as WalletType;

        if(type=="expense" && walletData.amount! - amount < 0){
            return {success: false, msg: "Insufficient funds in the wallet!"}
        }


        const updateType = type=="income" ? "totalIncome" : "totalExpenses";
        const updatedWalletAmount = 
            type == "income" 
                ? Number(walletData.amount) + amount 
                : Number(walletData.amount) - amount;


        const updatedTotals = 
            type == "income" 
                ? Number(walletData.totalIncome) + amount 
                : Number(walletData.totalExpenses) + amount;
        
        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals
        });
        return {success: true};
    }catch(err:any){
        console.log("Error updating wallet for new transaction: ", err);
        return {
            success: false,
            msg: err.message,
        }
    }
}

const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string
) => {
    try{
        const originalWalletSnapshot = await getDoc(
            doc(firestore, "wallets", oldTransaction.walletId)
        );
        const originalWallet = originalWalletSnapshot.data() as WalletType;

        let newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId)
        );
        let newWallet = newWalletSnapshot.data() as WalletType;

        const revertType = oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";
        const revertIncomeExpense : number = oldTransaction.type == "income" 
            ? -Number(oldTransaction.amount) 
            : Number(oldTransaction.amount);
        
        const revertedWalletAmount = 
            Number(originalWallet.amount) + revertIncomeExpense;

        const revertedIncomeExpenseAmount = 
            Number(originalWallet[revertType]) - Number(oldTransaction.amount);
            // wallet amount , after the transaction is removed

        if(newTransactionType == "expense"){

            // if user tries to convert income to expense on the same wallet
            // or tries to update expense amount to a higher value, we need to check for sufficient funds

            if(oldTransaction.walletId == newWalletId && revertedWalletAmount < newTransactionAmount){
                return {
                    success: false,
                    msg: "Selected Wallet don't have sufficient funds for this update!"
                };
            }

            // if user tries to add expense from a new wallet but the wallet don't have enough balance
            if(newWallet.amount! < newTransactionAmount){
                return {
                    success: false,
                    msg: "Selected Wallet don't have sufficient funds for this update!"
                };
            }
        }

        await createOrUpdateWallet({
            id: oldTransaction.walletId,
            amount: revertedWalletAmount,
            [revertType]: revertedIncomeExpenseAmount,
        });


        //revert completed 

        ///////////////////////////////////////////////////////////////////////////////////////////////////

        // refetch the new wallet , because we may update it
        newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId)
        );
        newWallet = newWalletSnapshot.data() as WalletType;

        const updateType = newTransactionType=="income" ? "totalIncome" : "totalExpenses";

        const updatedTransactionAmount: number = newTransactionType == "income"
            ? Number(newTransactionAmount)
            : -Number(newTransactionAmount);

        const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

        const newIncomeExpenseAmount = Number(
            newWallet[updateType]! + newTransactionAmount
        );

        await createOrUpdateWallet({
            id: newWalletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount,
        });

        return {success: true};
    }catch(err:any){
        console.log("Error updating wallet for new transaction: ", err);
        return {
            success: false,
            msg: err.message,
        }
    }
}

export const deleteTransaction = async (
    transactionId: string,
    walletId: string
)=>{
    try{
        const transactionRef = doc(firestore, "transactions", transactionId);
        const transactionSnapshot = await getDoc(transactionRef);

        if(!transactionSnapshot.exists()){
            return {
                success: false,
                msg: "Transaction not found!"
            }
        }

        const transactionData = transactionSnapshot.data() as TransactionType;

        const transactionType = transactionData?.type;
        const transactionAmount = transactionData?.amount;

        // fetch wallet to update amount , totalIncome/totalExpense
        const walletSnapshot = await getDoc(
            doc(firestore, "wallets", walletId)
        );
        const walletData = walletSnapshot.data() as WalletType;

        // check the fields to be updated based on transaction type
        const updateType = transactionType == "income" ? "totalIncome" : "totalExpenses";
        const newWalletAmount = 
            walletData?.amount! - 
            (transactionType == "income" ? transactionAmount : -transactionAmount);

            const newIncomeExpenseAmount = 
            Number(walletData[updateType]) - Number(transactionAmount);

            if(transactionType=="income" && newWalletAmount < 0){
                return {
                    success: false,
                    msg: "Can't delete this transaction as the wallet balance will become negative!"
                }
            }
            await createOrUpdateWallet({
                id: walletId,
                amount: newWalletAmount,
                [updateType]: newIncomeExpenseAmount,
            });

            await deleteDoc(transactionRef);

        return {success: true};
    }catch(err:any){
        console.log("Error updating wallet for new transaction: ", err);
        return {
            success: false,
            msg: err.message,
        }
    }
}

export const fetchWeeklyStats = async (
    uid: string
) : Promise<ResponseType>=>{
    try{
        const db = firestore;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7); 

        const transactionsQuery = query(
            collection(db, "transactions"),
            where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
            where("date", "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(transactionsQuery);
        const weeklyData = getLast7Days();
        const transactions: TransactionType[] = [];

        // mapping each transaction in day
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id= doc.id;
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp)
                .toDate()
                .toISOString()
                .split("T")[0];  // as YYYY-MM-DD

            const dayData= weeklyData.find((day) => day.date == transactionDate);

            if(dayData){
                if(transaction.type == "income"){
                    dayData.income += transaction.amount;
                }else if(transaction.type == "expense"){
                    dayData.expense += transaction.amount;
                }
            }
        });

        //takes each day and creates two entries (income and expense) in an array
        const stats= weeklyData.flatMap((day)=>[
            {
                value: day.income,
                label: day.day,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: colors.primary,
            },
            { value: day.expense , frontColor: colors.rose},
        ]);
        return {
            success: true,
            data:{
                stats,
                transactions,
            },
        };
    }catch(err:any){
        console.log("Error fetching weekly stats: ", err);
        return {
            success: false,
            msg: err.message,
        };
    }
};

export const fetchMonthlyStats = async (
    uid: string
) : Promise<ResponseType>=>{
    try{
        const db = firestore;
        const today = new Date();
        const twelveMonthsAgo = new Date(today);
        twelveMonthsAgo.setMonth(today.getMonth() - 12);

        const transactionsQuery = query(
            collection(db, "transactions"),
            where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
            where("date", "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(transactionsQuery);
        const monthlyData = getLast12Months();
        const transactions: TransactionType[] = [];

        // mapping each transaction in day
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id= doc.id;
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp).toDate();
            const monthName = transactionDate.toLocaleString('default', { 
                month: 'short' 
            });
            const shortYear = transactionDate.getFullYear().toString().slice(-2);
            const monthData= monthlyData.find(
                (month) => month.month === `${monthName} ${shortYear}`
            );
            if(monthData){
                if(transaction.type == "income"){
                    monthData.income += transaction.amount;
                }else if(transaction.type == "expense"){
                    monthData.expense += transaction.amount;
                }
            }
            
        });

       // reformat monthly data to fit in chart , takes each month and creates two entries (income and expense) in an array
        const stats= monthlyData.flatMap((month)=>[
            {
                value: month.income,
                label: month.month,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: colors.primary,
            },
            { 
                value: month.expense , 
                frontColor: colors.rose
            },
        ]);
        return {
            success: true,
            data:{
                stats,
                transactions,
            },
        };
    }catch(err){
        console.log("Error fetching monthly stats: ", err);
        return {
            success: false,
            msg: "Failed to fetch monthly stats",
        };
    }
};


export const fetchYearlyStats = async (
    uid: string
) : Promise<ResponseType>=>{
    try{
        const db = firestore;

        const transactionsQuery = query(
            collection(db, "transactions"),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(transactionsQuery);
        const transactions: TransactionType[] = [];

        const firstTransaction = querySnapshot.docs.reduce((earliest , doc)=>{
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate : earliest;
        }, new Date());

        const firstYear = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();

        const yearlyData = getYearsRange(firstYear, currentYear);

        // mapping each transaction in day
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id= doc.id;
            transactions.push(transaction);

            const transactionYear = (transaction.date as Timestamp).toDate().getFullYear();
            
            
            const yearData= yearlyData.find(
                (item: any) => item.year === transactionYear.toString()
            );
            if(yearData){
                if(transaction.type == "income"){
                    yearData.income += transaction.amount;
                }else if(transaction.type == "expense"){
                    yearData.expense += transaction.amount;
                }
            }
            
        });

       // reformat yearly data to fit in chart , takes each year and creates two entries (income and expense) in an array
        const stats= yearlyData.flatMap((year: any)=>[
            {
                value: year.income,
                label: year.year,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: colors.primary,
            },
            { 
                value: year.expense , 
                frontColor: colors.rose
            },
        ]);
        return {
            success: true,
            data:{
                stats,
                transactions,
            },
        };
    }catch(err){
        console.log("Error fetching yearly stats: ", err);
        return {
            success: false,
            msg: "Failed to fetch yearly stats",
        };
    }
};



