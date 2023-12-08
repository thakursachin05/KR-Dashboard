import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UserClosedLeads from '../../features/user/UserClosedLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        
        dispatch(setPageTitle({ title : "Total Closed User Leads"}))
      }, [dispatch])


    return(
        <UserClosedLeads />
    )
}

export default InternalPage