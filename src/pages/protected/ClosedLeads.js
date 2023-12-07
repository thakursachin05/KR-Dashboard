import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ClosedLeads from '../../features/leads/ClosedLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Closed Leads"}))
      }, [dispatch])


    return(
        <ClosedLeads />
    )
}

export default InternalPage