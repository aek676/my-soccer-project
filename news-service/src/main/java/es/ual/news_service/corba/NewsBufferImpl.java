package es.ual.news_service.corba;

import NewsBufferApp._NewsBufferImplBase;
import org.omg.CORBA.ORB;
import org.omg.CORBA.StringHolder;

public class NewsBufferImpl extends _NewsBufferImplBase {
    private String[] buffer;
    private int count;
    private int maxSize;
    private static final int DEFAULT_MAX = 20;
    private ORB orb;

    public NewsBufferImpl() {
        maxSize = DEFAULT_MAX;
        buffer = new String[maxSize];
        count = 0;
    }

    public void setORB(ORB orb_val) {
        orb = orb_val;
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

    public boolean get(StringHolder newsXML) {
        if (count > 0) {
            newsXML.value = buffer[0];
            for (int i = 0; i < count - 1; i++) {
                buffer[i] = buffer[i + 1];
            }
            count--;
            System.out.println("GET: News extracted. Total: " + count + "/" + maxSize);
            return true;
        } else {
            newsXML.value = "";
            System.out.println("GET: Buffer EMPTY. Cannot extract.");
            return false;
        }
    }

    public boolean read(StringHolder newsXML) {
        if (count > 0) {
            newsXML.value = buffer[0];
            System.out.println("READ: News at top: " + buffer[0]);
            return true;
        } else {
            newsXML.value = "";
            System.out.println("READ: Buffer EMPTY.");
            return false;
        }
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

    public int getLimit() {
        return maxSize;
    }

    public void setLimit(int maxNews) {
        if (maxNews < 0) {
            maxNews = 0;
        }
        maxSize = maxNews;
        if (count > maxSize) {
            int removed = count - maxSize;
            for (int i = maxSize; i < count; i++) {
                buffer[i] = null;
            }
            count = maxSize;
            System.out.println("LIMIT SET: Buffer trimmed from " + (count + removed) + " to " + count + " (limit: " + maxSize + ")");
        } else {
            System.out.println("LIMIT SET: " + maxSize + " (current elements: " + count + ")");
        }
    }

    public void shutdown() {
        System.out.println("Shutting down NewsBuffer server...");
        if (orb != null) {
            orb.shutdown(false);
        }
    }
}