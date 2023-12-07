import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UserLeads from '../../features/settings/team/UserLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        
        dispatch(setPageTitle({ title : "Total Open User Leads"}))
      }, [dispatch])


    return(
        <UserLeads />
    )
}

export default InternalPage