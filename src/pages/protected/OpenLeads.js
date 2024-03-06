import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import OpenLeads from '../../features/leads/OpenLeads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Open Leads"}))
      }, [dispatch])


    return(
        <OpenLeads />
    )
}

export default InternalPage