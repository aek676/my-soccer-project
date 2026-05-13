package es.ual.news_service.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class News {
    private int idNews;
    private String title;
    private String body;
    private String tags;
    private LocalDateTime created;
    private int idPlayer;

    public News() {
    }

    public News(int idNews, String title, String body, String tags, LocalDateTime created, int idPlayer) {
        this.idNews = idNews;
        this.title = title;
        this.body = body;
        this.tags = tags;
        this.created = created;
        this.idPlayer = idPlayer;
    }

    public int getIdNews() {
        return idNews;
    }

    public void setIdNews(int idNews) {
        this.idNews = idNews;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public int getIdPlayer() {
        return idPlayer;
    }

    public void setIdPlayer(int idPlayer) {
        this.idPlayer = idPlayer;
    }

    public String toXML() {
        StringBuilder xml = new StringBuilder();
        xml.append("<news>");
        xml.append("<idNews>").append(idNews).append("</idNews>");
        xml.append("<title>").append(escapeXML(title)).append("</title>");
        xml.append("<body>").append(escapeXML(body)).append("</body>");
        xml.append("<tags>").append(escapeXML(tags)).append("</tags>");
        xml.append("<created>").append(created != null ? created.toString() : "").append("</created>");
        xml.append("<idPlayer>").append(idPlayer).append("</idPlayer>");
        xml.append("</news>");
        return xml.toString();
    }

    public static News fromXML(String xml) {
        try {
            News news = new News();
            news.setIdNews(Integer.parseInt(extractValue(xml, "idNews")));
            news.setTitle(extractValue(xml, "title"));
            news.setBody(extractValue(xml, "body"));
            news.setTags(extractValue(xml, "tags"));
            String createdStr = extractValue(xml, "created");
            if (createdStr != null && !createdStr.isEmpty()) {
                news.setCreated(LocalDateTime.parse(createdStr));
            }
            news.setIdPlayer(Integer.parseInt(extractValue(xml, "idPlayer")));
            return news;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static List<News> listFromXML(String xml) {
        List<News> list = new ArrayList<>();
        if (xml == null || xml.isEmpty()) return list;
        String startTag = "<news>";
        String endTag = "</news>";
        int start = xml.indexOf(startTag);
        while (start != -1) {
            int end = xml.indexOf(endTag, start);
            if (end == -1) break;
            String itemXml = xml.substring(start, end + endTag.length());
            News news = fromXML(itemXml);
            if (news != null) {
                list.add(news);
            }
            start = xml.indexOf(startTag, end);
        }
        return list;
    }

    private static String extractValue(String xml, String tag) {
        String openTag = "<" + tag + ">";
        String closeTag = "</" + tag + ">";
        int start = xml.indexOf(openTag);
        if (start == -1) return "";
        start += openTag.length();
        int end = xml.indexOf(closeTag, start);
        if (end == -1) return "";
        return xml.substring(start, end);
    }

    private static String escapeXML(String str) {
        if (str == null) return "";
        return str.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&apos;");
    }
}