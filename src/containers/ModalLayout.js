// import { useEffect } from 'react'
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import AddLeadModalBody from '../features/leads/components/AddLeadModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import DuplicateLeadModalBody from '../features/leads/components/DuplicateLeadModalBody'
import AssignLeadModalBody from '../features/leads/components/AssignLeadModalBody'
import ActiveLeadModalBody from '../features/leads/components/ActiveLeadModalBody'
import InActiveLeadModalBody from '../features/leads/components/InActiveLeadModalBody'
import TotalLeadModalBody from '../features/leads/components/TotalLeadModalBody'
import StatsLeadModalBody from '../features/leads/components/StatsLeadModalBody'
import SingleLeadModalBody from '../features/leads/components/SingleLeadModalBody'
import AssignHRModel from '../features/settings/team/components/AssignHRModel'
import TLLeadModalBody from '../features/leads/components/TLLeadModalBody'

function ModalLayout(){


    const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = (e) => {
        dispatch(closeModal(e))
    }



    return(
        <>
        {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''}`}>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
                <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>


                {/* Loading modal body according to different modal type */}
                {
                    {
                             [MODAL_BODY_TYPES.LEAD_ADD_NEW] : <AddLeadModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CONFIRMATION] : <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.DUPLICATE_LEADS] : <DuplicateLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.STATS_LEADS] : <StatsLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.CHANGE_TL] : <AssignHRModel extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_TL] : <AssignHRModel extraObject={extraObject} closeModal={close}/>,
                            
                             [MODAL_BODY_TYPES.ASSIGN_HR] : <AssignHRModel extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_LEADS] : <AssignLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_TO_ACTIVE] : <ActiveLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_TO_INACTIVE] : <InActiveLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_TO_TOTAL] : <TotalLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_TO_SINGLE] : <SingleLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.ASSIGN_TO_TL] : <TLLeadModalBody extraObject={extraObject} closeModal={close}/>,
                             
                             [MODAL_BODY_TYPES.DEFAULT] : <div></div>
                    }[bodyType]
                }
            </div>
            </div>
            </>
    )
}

export default ModalLayout