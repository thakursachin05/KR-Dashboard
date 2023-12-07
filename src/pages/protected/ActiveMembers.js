import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import ActiveMembers from '../../features/settings/team/ActiveMembers'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add New Members"}))
      }, [dispatch])


    return(
        // <AddMember/>
        <ActiveMembers/>
    )
}

export default InternalPage