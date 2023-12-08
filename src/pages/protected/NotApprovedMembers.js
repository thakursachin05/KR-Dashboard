import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import NotApprovedMembers from '../../features/settings/team/NotApprovedMember'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Integrations"}))
      }, [dispatch])
      
    return(
        <NotApprovedMembers />
    )
}

export default InternalPage