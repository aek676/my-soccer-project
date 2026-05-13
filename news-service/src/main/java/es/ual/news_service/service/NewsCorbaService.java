package es.ual.news_service.service;

import es.ual.news_service.corba.NewsBufferClient;
import es.ual.news_service.model.News;
import es.ual.news_service.xml.NewsSchemaValidator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsCorbaService {
    private NewsBufferClient client;
    private NewsSchemaValidator validator;
    private boolean initialized = false;

    public NewsCorbaService() {
        this.validator = new NewsSchemaValidator();
    }

    private void initializeClient() {
        if (!initialized) {
            try {
                client = new NewsBufferClient();
                String[] args = {"-ORBInitialPort", "2001"};
                client.initialize(args);
                initialized = true;
            } catch (Exception e) {
                System.err.println("Failed to initialize CORBA client: " + e.getMessage());
            }
        }
    }

    public News getNews() {
        initializeClient();
        if (client == null) {
            return null;
        }
        String xml = client.get();
        if (xml != null && !xml.isEmpty()) {
            return News.fromXML(xml);
        }
        return null;
    }

    public News readNews() {
        initializeClient();
        if (client == null) {
            return null;
        }
        String xml = client.read();
        if (xml != null && !xml.isEmpty()) {
            return News.fromXML(xml);
        }
        return null;
    }

    public News getNewsById(int idNews) {
        initializeClient();
        if (client == null) {
            return null;
        }
        String xml = client.getById(idNews);
        if (xml != null && !xml.isEmpty()) {
            return News.fromXML(xml);
        }
        return null;
    }

    public List<News> getAllNews() {
        initializeClient();
        if (client == null) {
            return java.util.Collections.emptyList();
        }
        String xml = client.getAll();
        return News.listFromXML(xml);
    }

    public boolean putNews(News news) {
        initializeClient();
        if (client == null) {
            return false;
        }
        if (news.getCreated() == null) {
            news.setCreated(LocalDateTime.now());
        }
        String xml = news.toXML();
        if (!validator.validate(xml)) {
            System.err.println("XML validation failed for news: " + news.getTitle());
            return false;
        }
        return client.put(xml);
    }

    public boolean isEmpty() {
        if (client == null) {
            return true;
        }
        return client.isEmpty();
    }

    public int getCount() {
        if (client == null) {
            return 0;
        }
        return client.getCount();
    }
}