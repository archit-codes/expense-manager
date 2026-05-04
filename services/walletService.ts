import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { firestore } from "@/config/firebase";
import { doc, collection, setDoc, deleteDoc, getDocs, where, query, writeBatch } from "firebase/firestore";

export const createOrUpdateWallet = async (
    walletData: Partial<WalletType>
): Promise<ResponseType> => {
    try{
        let walletTosave = {...walletData};
        if(walletData.image){
                    const imageUploadRes = await uploadFileToCloudinary(
                        walletData.image,
                        "wallets"
                    );
                    if(!imageUploadRes.success){
                        return {
                            success: false,
                            msg: imageUploadRes.msg || "Failed to upload wallet icon",
                        };
                    }
                    walletTosave.image = imageUploadRes.data;
                }
                if(!walletData?.id){
                    //create new wallet
                    walletTosave.amount = 0;
                    walletTosave.totalIncome = 0;
                    walletTosave.totalExpenses = 0;
                    walletTosave.created = new Date();
                    //call create wallet api
                }
                const walletRef= walletData?.id 
                ? doc(firestore, "wallets", walletData?.id) 
                : doc(collection(firestore, "wallets"));

                await setDoc(walletRef, walletTosave, {merge: true}); //updates only the data provided
                return {
                    success: true,
                    data : {...walletTosave , id: walletRef.id}
                };

    }catch(error: any){
        console.log("Error creating/updating wallet:", error);
        return {
            success: false,
            msg: error.message,
        }
    }
};

export const deleteWallet = async (walletId: string) : Promise<ResponseType> => {
    try{
        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);

        deleteTransactionsByWalletId(walletId); // delete all transactions related to this wallet

        return {
            success: true,
            msg: "Wallet deleted successfully",
        };
        
    }catch(err:any){
        console.log("Error deleting wallet: ", err);
        return {
            success: false,
            msg: err.message,
        }
    }
}

export const deleteTransactionsByWalletId = async (walletId: string) : Promise<ResponseType> => {
    try{
        let hasMoreTransactions = true;
        while(hasMoreTransactions){
            const transactionsQuery = query(
                collection(firestore, "transactions"), 
                where("walletId", "==", walletId), 
            );
            const transactionsSnapshot = await getDocs(transactionsQuery);
            if (transactionsSnapshot.size == 0) {
                hasMoreTransactions = false;
                break;
            }
            const batch = writeBatch(firestore);
            transactionsSnapshot.forEach((transactionDoc)=>{
                batch.delete(transactionDoc.ref);
            })
            await batch.commit();
            console.log(`${transactionsSnapshot.size} transactions deleted in this batch.`);
        }


        return {
            success: true,
            msg: "All transactions deleted successfully",
        };
        
    }catch(err:any){
        console.log("Error deleting wallet: ", err);
        return {
            success: false,
            msg: err.message,
        }
    }
}