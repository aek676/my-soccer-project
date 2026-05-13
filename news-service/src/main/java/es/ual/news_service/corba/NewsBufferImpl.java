package es.ual.news_service.corba;

import NewsBufferApp._NewsBufferImplBase;
import org.omg.CORBA.StringHolder;

public class NewsBufferImpl extends _NewsBufferImplBase {
    private String[] buffer;
    private int count;
    private int maxSize;
    private static final int DEFAULT_MAX = 20;

    public NewsBufferImpl() {
        maxSize = DEFAULT_MAX;
        buffer = new String[maxSize];
        count = 0;
    }

    public boolean put(String newsXML) {
        if (count < maxSize) {
            buffer[count] = newsXML;
            count++;
            System.out.println("PUT: News inserted. Total: " + count + "/" + maxSize);
            return true;
        } else {
            System.out.println("PUT: Buffer FULL (" + count + "/" + maxSize + "). Cannot insert.");
            return false;
        }
    }

    public boolean getAll(StringHolder allNewsXML) {
        StringBuilder xml = new StringBuilder();
        xml.append("<newsList>");
        for (int i = 0; i < count; i++) {
            xml.append(buffer[i]);
        }
        xml.append("</newsList>");
        allNewsXML.value = xml.toString();
        System.out.println("GETALL: Returning " + count + " news.");
        return true;
    }

    public boolean getById(int idNews, StringHolder newsXML) {
        for (int i = 0; i < count; i++) {
            if (buffer[i] != null && buffer[i].contains("<idNews>" + idNews + "</idNews>")) {
                newsXML.value = buffer[i];
                System.out.println("GETBYID: Found news with id: " + idNews);
                return true;
            }
        }
        newsXML.value = "";
        System.out.println("GETBYID: News with id " + idNews + " not found.");
        return false;
    }

    public boolean isEmpty() {
        return count == 0;
    }

    public int getCount() {
        return count;
    }
}
