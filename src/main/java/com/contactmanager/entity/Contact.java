package com.contactmanager.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_contact")
@javax.persistence.SequenceGenerator(name = "SEQ_STORE", allocationSize = 1, sequenceName = "t_contact_id_seq")
public class Contact extends BaseEntity {

    private String name;
    private String address;
    private String email;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
