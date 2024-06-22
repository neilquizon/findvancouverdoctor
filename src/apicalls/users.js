import { message } from "antd";
import firestoreDatabase from "../firebaseConfig";
import { collection, addDoc , getDocs , query , where } from "firebase/firestore";
import CryptoJS from "crypto-js";



export const CreateUser = async (payload) => {

    try {

        // check if user already exist in the database using email

        const qry = query(collection(firestoreDatabase, "users"), where("email", "==", payload.email));

        const querySnapshot = await getDocs(qry);
        if (querySnapshot.size > 0) {

            throw new Error("user already existx");
        }

        // hash password
        const hashedPassword = CryptoJS.AES.encrypt(
            payload.password,
            "findvancouverdoctor"
        ).toString();
        payload.password = hashedPassword;


        const docRef = collection(firestoreDatabase, "users");
        await addDoc(docRef, payload);
        return {
            success: true,
            message: "User created successfully"
        }

    } catch (error) {
        return error;
    }
}
