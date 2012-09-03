package com.contactmanager.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.britesnow.snow.web.handler.annotation.WebActionHandler;
import com.britesnow.snow.web.handler.annotation.WebModelHandler;
import com.britesnow.snow.web.param.annotation.WebModel;
import com.britesnow.snow.web.param.annotation.WebParam;
import com.contactmanager.dao.ContactDao;
import com.contactmanager.dao.DaoRegistry;
import com.contactmanager.dao.IDao;
import com.contactmanager.entity.Group;
import com.contactmanager.entity.GroupContact;
import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class ContactWebHandlers {

    private DaoRegistry      daoRegistry;
    @Inject
    private ContactDao      contactDao;

    @Inject
    public ContactWebHandlers(DaoRegistry daoRegistry) {
        this.daoRegistry = daoRegistry;
    }


    @WebModelHandler(startsWith = "/getAllGroupsWithSelect")
    public void getAllGroupsWithSelect(@WebModel Map m, @WebParam("contactId") Long contactId) {
        IDao groupDao =  daoRegistry.getDao(Group.class);
        
        List<GroupContact> contactGroups = contactDao.getSelectGroups(contactId);
        List<Group> groups = groupDao.list(0, 100, null, null);
        List<Map> selectGroups = new ArrayList();
        for(Group group : groups){
            Map map = new HashMap();
            boolean exist = false;
            for(GroupContact  groupContact: contactGroups){
                if(groupContact.getGroup_id().equals(group.getId())){
                    exist = true;
                    break;
                }
            }
            
            map.put("id", group.getId());
            map.put("name", group.getName());
            if (exist) {
                map.put("checked", true);
            }
            selectGroups.add(map);
        }
        m.put("result", selectGroups);
    }
    
    @WebModelHandler(startsWith = "/getContactsByGroup")
    public void getContactsByGroup(@WebModel Map m, @WebParam("groupId") Long groupId) {
        List list = contactDao.getContactsByGroup(groupId);
        m.put("result", list);
    }
    
    @WebActionHandler
    public void updateGroups(@WebParam("contactId") Long contactId, @WebParam("selectGroupIds") String selectGroupIds) {
        String[] groupIds = selectGroupIds.split(",");
        Long[] sids = new Long[groupIds.length];
        int i = 0;
        for(String id : groupIds){
            sids[i] = Long.parseLong(id);
            i++;
        }
        contactDao.updateGroups(contactId, sids);
    }


}
