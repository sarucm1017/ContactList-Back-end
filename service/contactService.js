const contactModel = require("../models/contactListModel");


const getAllContact = async (searchQuery, currentPage, pageSize) =>{
  
    const matchFor = {};

    if(searchQuery){
        matchFor.$or = [
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { phone: { $regex: searchQuery, $options: 'i' } }, 
        ];
    }
    const pipeline =[
        {$match: matchFor },
        {$sort: { createdAt: -1}},
        {
            $facet: {
                contacts: [
                    { $project: { _id: 1, firstName: 1, image: 1, lastName: 1, email: 1, phone: 1, createdAt: 1 } },
                    { $skip: (currentPage - 1) * pageSize },
                    { $limit: pageSize },  
                ],
                totalPages: [
                    { $count: 'count' }
                ],
            }
        },
        {
            $project: {
                contacts: 1,
                totalPages: { $ifNull: [{ $arrayElemAt: ['$totalPages.count', 0] }, 0] },
            }
        }

    ];
    const result = await contactModel.aggregate(pipeline);

    return result[0];
};

const getContactById = async (id) => {
    try {
        const contact = await contactModel.findById(id)
        if(!contact){
            throw new Error("contact not  Found");
        }
        return contact;
    } catch (error) {
        throw new Error("Error while fetching contact by id");
    }
};

const createContact = async(newContact) => {
    try {
        const createNewContact = await contactModel.create(newContact);
        return createNewContact;
    } catch (error) {
        throw new Error ("Error while Creating the contact");
    }
};

const updateContact = async(id , updatingContact) => {
    try {
      return await contactModel.findByIdAndUpdate(id, updatingContact , {new:true});

    } catch (error) {
        throw new Error("Error while updating contact");
    }
};

const deleteContact = async (id) => {
    try {
        const deletedContact = await contactModel.findByIdAndDelete(id);
        if(!deletedContact){
            throw new Error("Contact not found");
        }
        return deletedContact;
    } catch (error) {
        throw new Error("Error while deleting contact")
    }
};

module.exports = {getAllContact, getContactById, createContact, updateContact,deleteContact}