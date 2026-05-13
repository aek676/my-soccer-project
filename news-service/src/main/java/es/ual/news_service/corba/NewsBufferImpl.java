package es.ual.news_service.corba;

import NewsBufferApp._NewsBufferImplBase;
import org.omg.CORBA.StringHolder;
import java.util.ArrayList;
import java.util.List;

public class NewsBufferImpl extends _NewsBufferImplBase {
    private List<String> buffer;

    public NewsBufferImpl() {
        buffer = new ArrayList<>();
    }

    public boolean put(String newsXML) {
        buffer.add(newsXML);
        System.out.println("PUT: News inserted. Total: " + buffer.size());
        return true;
    }

    public boolean getAll(StringHolder allNewsXML) {
        StringBuilder xml = new StringBuilder();
        xml.append("<newsList>");
        for (String item : buffer) {
            xml.append(item);
        }
        xml.append("</newsList>");
        allNewsXML.value = xml.toString();
        System.out.println("GETALL: Returning " + buffer.size() + " news.");
        return true;
    }

    public boolean getById(int idNews, StringHolder newsXML) {
        for (String item : buffer) {
            if (item != null && item.contains("<idNews>" + idNews + "</idNews>")) {
                newsXML.value = item;
                System.out.println("GETBYID: Found news with id: " + idNews);
                return true;
            }
        }
        newsXML.value = "";
        System.out.println("GETBYID: News with id " + idNews + " not found.");
        return false;
    }
}
