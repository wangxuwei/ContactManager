package com.contactmanager.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_group_contact")
public class GroupContact extends BaseRelationEntity{
    
    private Long contact_id;
    private Long group_id;
    
    public Long getContact_id() {
        return contact_id;
    }
    public void setContact_id(Long contact_id) {
        this.contact_id = contact_id;
    }
    public Long getGroup_id() {
        return group_id;
    }
    public void setGroup_id(Long group_id) {
        this.group_id = group_id;
    }
}
