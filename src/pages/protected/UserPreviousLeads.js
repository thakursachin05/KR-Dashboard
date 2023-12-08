import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UserPreviousLeads from '../../features/user/UserPreviousLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        
        dispatch(setPageTitle({ title : "Total Open User Leads"}))
      }, [dispatch])


    return(
        <UserPreviousLeads />
    )
}

export default InternalPage