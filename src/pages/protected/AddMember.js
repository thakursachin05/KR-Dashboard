import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import AddMember from '../../features/settings/addMember'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add New Members"}))
      }, [dispatch])


    return(
        // <AddMember/>
        <AddMember/>
    )
}

export default InternalPage