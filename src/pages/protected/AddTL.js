import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddTeamLeader from '../../features/settings/team/AddTeamLeader'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add Team Leader"}))
      }, [dispatch])


    return(
        <AddTeamLeader/>
    )
}

export default InternalPage