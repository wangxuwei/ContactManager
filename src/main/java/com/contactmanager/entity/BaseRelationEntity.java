package com.contactmanager.entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class BaseRelationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --------- Persistent Getters & Setters --------- //
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    // --------- /Persistent Getters & Setters --------- //
}
