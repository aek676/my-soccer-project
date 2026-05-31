package es.ual.news_service.controller;

import es.ual.news_service.dto.NewsCreateRequest;
import es.ual.news_service.dto.NewsResponse;
import es.ual.news_service.service.NewsCorbaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

  private final NewsCorbaService newsService;

  @GetMapping
  public ResponseEntity<List<NewsResponse>> getAllNews() {
    return ResponseEntity.ok(newsService.getAllNews());
  }

  @GetMapping("/{id}")
  public ResponseEntity<NewsResponse> getNewsById(@PathVariable int id) {
    return ResponseEntity.ok(newsService.getNewsById(id));
  }

  @PostMapping
  public ResponseEntity<NewsResponse> createNews(@RequestBody NewsCreateRequest request) {
    NewsResponse response = newsService.putNews(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
}
