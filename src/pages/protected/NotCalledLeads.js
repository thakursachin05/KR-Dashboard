import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import NotCalledLeads from '../../features/leads/NotCalledLeads'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Not Called Leads"}))
      }, [dispatch])
      
    return(
        <NotCalledLeads />
    )
}

export default InternalPage