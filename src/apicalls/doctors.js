
import { message } from "antd";
import { addDoc, collection, doc, getDoc, getDocs, query, where , setDoc} from "firebase/firestore";
import firestoreDatabase from "../firebaseConfig";

export const AddDoctor = async (payload) => {
    try {

        await setDoc(doc(firestoreDatabase, "doctors" , payload.userId), payload);
        return {
            success: true,
            message: "Doctor was added successfully, please wait for approval"
        }


    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

export const CheckIfDoctorAccountIsApplied = async (id) => {

    try {
        const doctors = await getDocs(
            query(collection(firestoreDatabase, "doctors"), where("userId", "==", id))
        );
        if (doctors.size > 0) {
            return {
                success: true,
                message: "Doctor account already applied",
            };
        }
        return {
            success: false,
            message: "Doctor account not applied",

        };

    } catch (error) {
        return {
            success: false,
            message: error.message,
        };

    }
};