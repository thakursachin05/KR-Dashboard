import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TotalAssignedLeads from '../../features/leads/TotalAssignedLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Assigned Leads"}))
      }, [dispatch])


    return(
        // <AssignedLeads />
        <TotalAssignedLeads/>
    )
}

export default InternalPage