export const availabilityToString = (availability) => {
    switch(availability){
        case 1: 
            return "Pending"
        case 2: 
            return "Accept"
        case 3: 
            return "Cancel"
        default:
            return "Unknown"
    }
}