package com.eventManagement.Event_Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.eventManagement.Event_Service.EventRepo.EventRepository;

//@RequestMapping("/api")
@RestController
@CrossOrigin
public class EventController {

    @Autowired
    private EventRepository repo;

    @GetMapping("/test")
    public String test() {
        return "WORKING";
    }

    @GetMapping("/events")
    public List<Event> getEvents() {
        System.out.println("EVENT API HIT ");
        return repo.findAll();
    }

    @PostMapping("/events")
    public Event createEvent(
            @RequestHeader("role") String role,
            @RequestBody Event event
    ) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Access Denied !");
        }

        return repo.save(event);
    }

    @PutMapping("/events/{id}")
    public Event update(
            @RequestHeader("role") String role,
            @PathVariable Long id,
            @RequestBody Event e
    ) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Access Denied !");
        }

        Event existing = repo.findById(id).orElseThrow();
        existing.setTitle(e.getTitle());
        existing.setVenue(e.getVenue());
        existing.setDate(e.getDate());

        return repo.save(existing);
    }

    @DeleteMapping("/events/{id}")
    public void delete(
            @RequestHeader("role") String role,
            @PathVariable Long id
    ) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Access Denied !");
        }

        repo.deleteById(id);
    }
}
