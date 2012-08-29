package com.contactmanager.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_group")
@javax.persistence.SequenceGenerator(name = "SEQ_STORE", allocationSize = 1, sequenceName = "t_group_id_seq")
public class Group extends BaseEntity {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    
}
