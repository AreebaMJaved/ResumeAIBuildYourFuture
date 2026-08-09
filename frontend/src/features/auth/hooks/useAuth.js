import {useContext} from "react";
import {AuthContext} from "../auth.context";
import {Login,Signup,Logout,Getme} from "../services/auth.api";
export const useAuth=()=>{
    const context=useContext(AuthContext)
    const {user,setUser,loading,setLoading}= context
const handleLogin = async ({email, password}) => {
    setLoading(true)
   try {
    const data = await Login({email, password})
    setUser(data.user)
   } catch(err) {
        throw err;      
   }
   finally { setLoading(false) }
}

const handleRegister = async ({username, email, password}) => {
    setLoading(true)
   try {
    const data = await Signup({username, email, password})
    setUser(data.user)
   } catch(err) {
        throw err;      
   }
   finally { setLoading(false) }
}
     const handleLogout=async ()=>{
        setLoading(true)
        try{
        const data=await Logout()

        setUser(null)}
        catch(err){
            
        }
        finally{
        setLoading(false)
    }}

    return{user,loading,handleRegister,handleLogin,handleLogout}
        
        

}