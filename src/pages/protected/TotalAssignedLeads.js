import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
// import KrLeads from '../../features/KrLeads/KrLeads'
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