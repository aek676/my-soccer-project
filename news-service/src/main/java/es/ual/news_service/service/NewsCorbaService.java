package es.ual.news_service.service;

import es.ual.news_service.corba.NewsBufferClient;
import es.ual.news_service.dto.NewsCreateRequest;
import es.ual.news_service.dto.NewsResponse;
import es.ual.news_service.exception.NewsNotFoundException;
import es.ual.news_service.model.News;
import es.ual.news_service.xml.NewsSchemaValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsCorbaService {

  private NewsBufferClient client;
  private final NewsSchemaValidator validator = new NewsSchemaValidator();
  private boolean initialized = false;

  private synchronized void initializeClient() {
    if (!initialized) {
      try {
        client = new NewsBufferClient();
        String[] args = {"-ORBInitialPort", "2001"};
        client.initialize(args);
        initialized = true;
      } catch (Exception e) {
        log.error("Failed to initialize CORBA client: {}", e.getMessage());
      }
    }
  }

  public NewsResponse getNewsById(int idNews) {
    initializeClient();
    if (client == null) {
      throw new NewsNotFoundException(idNews);
    }
    String xml = client.getById(idNews);
    if (xml == null || xml.isEmpty()) {
      throw new NewsNotFoundException(idNews);
    }
    News news = News.fromXML(xml);
    if (news == null) {
      throw new NewsNotFoundException(idNews);
    }
    return toResponse(news);
  }

  public List<NewsResponse> getAllNews() {
    initializeClient();
    if (client == null) {
      return Collections.emptyList();
    }
    String xml = client.getAll();
    return News.listFromXML(xml).stream()
        .map(NewsCorbaService::toResponse)
        .collect(Collectors.toList());
  }

  public synchronized NewsResponse putNews(NewsCreateRequest request) {
    initializeClient();
    if (client == null) {
      throw new RuntimeException("CORBA client not available");
    }

    List<NewsResponse> allNews = getAllNews();
    int maxId = allNews.stream().mapToInt(NewsResponse::getIdNews).max().orElse(0);

    News news = News.builder()
        .idNews(maxId + 1)
        .title(request.getTitle())
        .body(request.getBody())
        .tags(request.getTags())
        .created(LocalDateTime.now())
        .idPlayer(request.getIdPlayer())
        .build();

    String xml = news.toXML();
    if (!validator.validate(xml)) {
      throw new RuntimeException("XML validation failed for news: " + news.getTitle());
    }

    boolean result = client.put(xml);
    if (!result) {
      throw new RuntimeException("Failed to insert news");
    }

    return toResponse(news);
  }

  private static NewsResponse toResponse(News news) {
    return NewsResponse.builder()
        .idNews(news.getIdNews())
        .title(news.getTitle())
        .body(news.getBody())
        .tags(news.getTags())
        .created(news.getCreated())
        .idPlayer(news.getIdPlayer())
        .build();
  }
}