package com.eventManagement.Event_Service.EventRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventManagement.Event_Service.Event;

public interface EventRepository extends JpaRepository<Event, Long> {}