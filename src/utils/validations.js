
const validateSponsorEditData=(req)=>{
    const editableFields= ["name", "about", "methods", "logo", "budget", "eventType", "attendees", "address"];

    const isEditableField= Object.keys(req.body).every((k)=>editableFields.includes(k));

    if(!isEditableField){
        throw new Error("Edit Not Allowed");
    }
}

const validateOrganizerEditData=(req)=>{
    const editableFields= ["name", "events", "about", "logo", "address"];

    const isEditableField= Object.keys(req.body).every((k)=>editableFields.includes(k));

    if(!isEditableField){
        throw new Error("Edit Not Allowed");
    }
}


module.exports={validateSponsorEditData, validateOrganizerEditData};