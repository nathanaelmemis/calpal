import { useContext, useEffect } from "react"
import { UserDataContext } from "../context/UserDataContext"
import { useNavigate } from "react-router-dom"

export async function checkState() {
    const navigate = useNavigate()
    
    const { 
        getData,
        userData
    } = useContext(UserDataContext)

    useEffect(() => {
        async function _() {
            // userData.name can never be empty unless state was lost
            if (userData.name === "") {
                getData(['userData', 'foods', 'dishes', 'foodEaten', 'dishEaten'])
                navigate('/dashboard')
            }
        }

        _()
    }, [])
}