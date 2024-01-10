import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TeamLeaderHR from '../../features/settings/team/TeamLeaderHR'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All HR of particular TL"}))
      }, [dispatch])


    return(
        <TeamLeaderHR/>
    )
}

export default InternalPage