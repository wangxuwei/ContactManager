package com.contactmanager.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_group")
public class Group extends BaseTimeStampedEntity {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    
}
