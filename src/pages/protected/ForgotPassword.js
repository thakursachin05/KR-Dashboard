import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ForgotPassword from '../../features/settings/forgotPassword'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Add New Members"}))
      }, [dispatch])


    return(
        // <AddMember/>
        // <AddMember/>
        <ForgotPassword/>
    )
}

export default InternalPage