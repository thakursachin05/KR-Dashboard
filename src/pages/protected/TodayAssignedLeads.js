import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TodayAssignedLeads from '../../features/leads/TodayAssignedLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Assigned Leads"}))
      }, [dispatch])


    return(
        // <AssignedLeads />
        <TodayAssignedLeads/>
    )
}

export default InternalPage