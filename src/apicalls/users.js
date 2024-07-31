import firestoreDatabase from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc } from "firebase/firestore";
import CryptoJS from "crypto-js";

export const CreateUser = async (payload) => {
  try {
    // check if user already exists using email
    const qry = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", payload.email)
    );
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.size > 0) {
      throw new Error("User already exists");
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
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const LoginUser = async (payload) => {
  try {
    const qry = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", payload.email)
    );
    const userSnapshots = await getDocs(qry);
    if (userSnapshots.size === 0) {
      throw new Error("User does not exist");
    }

    // decrypt password
    const user = userSnapshots.docs[0].data();
    user.id = userSnapshots.docs[0].id;
    const bytes = CryptoJS.AES.decrypt(user.password, "findvancouverdoctor");
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== payload.password) {
      throw new Error("Incorrect password");
    }

    return {
      success: true,
      message: "User logged in successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetAllUsers = async () => {
  try {
    const users = await getDocs(collection(firestoreDatabase, "users"));
    return {
      success: true,
      data: users.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      }),
    };
  } catch (error) {
    console.error("Error getting all users:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetUserById = async (id) => {
  try {
    const user = await getDoc(doc(firestoreDatabase, "users", id));
    return {
      success: true,
      data: {
        ...user.data(),
        id: user.id,
      },
    };
  } catch (error) {
    console.error("Error getting user by id:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetSecretQuestion = async (email) => {
  try {
    const qry = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", email)
    );
    const userSnapshots = await getDocs(qry);
    if (userSnapshots.size === 0) {
      throw new Error("User does not exist");
    }

    const user = userSnapshots.docs[0].data();
    return {
      success: true,
      secretQuestion: user.secretQuestion,
    };
  } catch (error) {
    console.error("Error getting secret question:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const ValidateSecretAnswer = async (payload) => {
  try {
    const qry = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", payload.email),
      where("secretAnswer", "==", payload.secretAnswer)
    );
    const userSnapshots = await getDocs(qry);
    if (userSnapshots.size === 0) {
      throw new Error("Incorrect secret answer");
    }

    return {
      success: true,
      message: "Secret answer is correct",
    };
  } catch (error) {
    console.error("Error validating secret answer:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const UpdatePassword = async (payload) => {
  try {
    const qry = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", payload.email),
      where("secretAnswer", "==", payload.secretAnswer)
    );
    const userSnapshots = await getDocs(qry);
    if (userSnapshots.size === 0) {
      throw new Error("User not found or incorrect secret answer");
    }

    const userDoc = userSnapshots.docs[0];
    const userRef = doc(firestoreDatabase, "users", userDoc.id);

    const hashedPassword = CryptoJS.AES.encrypt(
      payload.newPassword,
      "findvancouverdoctor"
    ).toString();

    await updateDoc(userRef, { password: hashedPassword });

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const UpdateUserProfile = async (user) => {
  try {
    console.log("Updating user profile:", user); // Log the user data being passed
    const userRef = doc(firestoreDatabase, "users", user.id);
    await updateDoc(userRef, {
      name: user.name,
      dob: user.dob,
      provincialHealthNumber: user.provincialHealthNumber,
      address: user.address,
      telephoneNumber: user.telephoneNumber,
      email: user.email,
      // Add any other fields that need to be updated
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error
    return {
      success: false,
      message: error.message,
    };
  }
};
