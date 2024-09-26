import axios from "axios"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserDataContext"

export async function checkIfValidToken() {
    const navigate = useNavigate()

    const {
        getData
    } = useContext(UserDataContext)

    useEffect(() => {
        async function _() {
            try {
                const res = await axios.post('/api/authenticate')
    
                if (res.status === 200) {
                    getData(['userData', 'foods', 'dishes', 'foodEaten', 'dishEaten'])
                    navigate('/dashboard')
                }
            } catch (error) {
                console.error(error)
            }
        }

        _()
    }, [])
}