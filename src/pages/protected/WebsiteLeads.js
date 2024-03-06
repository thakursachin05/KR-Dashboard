import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import WebsiteLeads from '../../features/leads/WebsiteLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Website Leads"}))
      }, [dispatch])


    return(
        // <AssignedLeads />
        <WebsiteLeads/>
    )
}

export default InternalPage