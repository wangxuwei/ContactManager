package com.contactmanager.dao;


import java.util.ArrayList;
import java.util.List;

import com.contactmanager.entity.Contact;
import com.contactmanager.entity.GroupContact;

public class ContactDao extends BaseHibernateDao<Contact> {

    public List<GroupContact> getSelectGroups(Long contactId){
        List<GroupContact>  list = (List<GroupContact>) daoHelper.find(0,100,"from GroupContact o where o.contact_id= ? ", contactId);
        return list;
    }
    
    public List<Contact> getContactsByGroup(Long groupId){
        List<Contact>  list = null;
        if(groupId != null){
            list = (List<Contact>) daoHelper.find(0,100,"select o from Contact o, GroupContact groupContact where o.id = groupContact.contact_id and groupContact.group_id= ? ", groupId);
        }else{
            list = (List<Contact>) daoHelper.find(0,100,"select o from Contact o");
        }
        return list;
    }
    
    public void updateGroups(Long contactId,Long[] selectGroupIds){
        List<GroupContact>  selectGroups = (List<GroupContact>) daoHelper.find(0,100,"from GroupContact o where o.contact_id= ? ", contactId);
        List removeList = new ArrayList();
        for(GroupContact groupContact : selectGroups){
            boolean exist = false;
            for(Long nSelectId : selectGroupIds){
                if(groupContact.getGroup_id().equals(nSelectId)){
                    exist = true;
                    break;
                }
            }
            if(!exist){
                removeList.add(groupContact);
            }
        }
        List addList = new ArrayList();
        for(Long nSelectId : selectGroupIds){
            boolean exist = false;
            for(GroupContact groupContact : selectGroups){
                if(groupContact.getGroup_id().equals(nSelectId)){
                    exist = true;
                    break;
                }
            }
            if(!exist){
                GroupContact gc = new GroupContact();
                gc.setContact_id(contactId);
                gc.setGroup_id(nSelectId);
                addList.add(gc);
            }
        }
        
        daoHelper.deleteEntities(removeList);
        daoHelper.saveEntities(addList);
    }
    
}
