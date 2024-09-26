import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export async function checkAuth() {
    const navigate = useNavigate()

    useEffect(() => {
        async function _() {
            try {
                const res = await axios.post('/api/authenticate')
    
                if (res.status !== 200) {
                    navigate('/login')
                    return false
                }

                return true
            } catch (error) {
                console.log(error)
                navigate('/login')
                return false
            }
        }

        _()
    }, [])
}