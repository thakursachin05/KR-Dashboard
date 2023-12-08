import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UserTodayLeads from '../../features/user/UserTodayLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        
        dispatch(setPageTitle({ title : "Total Open User Leads"}))
      }, [dispatch])


    return(
        <UserTodayLeads />
    )
}

export default InternalPage