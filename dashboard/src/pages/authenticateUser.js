import axios from "axios";
 
const AuthenticateUser = async (navigate) => {
    const storedCreds = JSON.parse(localStorage.getItem("user"));
 
    if (!storedCreds) {
        navigate("/");
    } else {
        try {
            const response = await axios.post(
                "http://localhost:1337/login",
                storedCreds
            );
 
            const result = response.data;
 
            if (!result.success) {
                localStorage.removeItem("user");
                alert("Please login again.");
                navigate("/");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occured. Please try again.");
        }
    }
};
 
export default AuthenticateUser;