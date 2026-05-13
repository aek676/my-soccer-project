package es.ual.news_service.controller;

import es.ual.news_service.model.News;
import es.ual.news_service.service.NewsCorbaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsCorbaService newsService;

    public NewsController(NewsCorbaService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNews() {
        List<News> newsList = newsService.getAllNews();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", newsList);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNewsById(@PathVariable int id) {
        News news = newsService.getNewsById(id);
        Map<String, Object> response = new HashMap<>();
        if (news != null) {
            response.put("success", true);
            response.put("data", news);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "News with id " + id + " not found");
            return ResponseEntity.ok(response);
        }
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> putNews(@RequestBody News news) {
        boolean result = newsService.putNews(news);
        Map<String, Object> response = new HashMap<>();
        response.put("success", result);
        if (result) {
            response.put("message", "News inserted successfully");
        } else {
            response.put("message", "Failed to insert news or buffer is full");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getCount() {
        int count = newsService.getCount();
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/empty")
    public ResponseEntity<Map<String, Object>> isEmpty() {
        boolean empty = newsService.isEmpty();
        Map<String, Object> response = new HashMap<>();
        response.put("empty", empty);
        return ResponseEntity.ok(response);
    }
}