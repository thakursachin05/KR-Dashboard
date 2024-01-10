import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TeamLeader from '../../features/settings/team/TeamLeader'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Team Leaders"}))
      }, [dispatch])


    return(
        <TeamLeader/>
    )
}

export default InternalPage