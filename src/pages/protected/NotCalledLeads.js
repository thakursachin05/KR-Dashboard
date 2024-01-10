import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import CalledLeads from '../../features/leads/CalledLeads'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Not Called Leads"}))
      }, [dispatch])
      
    return(
        <CalledLeads />
    )
}

export default InternalPage