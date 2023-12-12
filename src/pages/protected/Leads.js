import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
// import KrLeads from '../../features/KrLeads/KrLeads'
import Leads from '../../features/leads'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Upload Leads in CSV or XLSX file"}))
      }, [dispatch])


    return(
        <Leads />
    )
}

export default InternalPage