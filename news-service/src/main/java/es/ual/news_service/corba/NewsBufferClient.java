package es.ual.news_service.corba;

import NewsBufferApp.NewsBuffer;
import NewsBufferApp.NewsBufferHelper;
import org.omg.CORBA.ORB;
import org.omg.CORBA.StringHolder;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;

public class NewsBufferClient {
  private NewsBuffer bufferImpl;
  private ORB orb;

  public NewsBufferClient() {
  }

  public void initialize(String[] args) throws Exception {
    orb = ORB.init(args, null);
    org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
    NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

    String name = "NewsBuffer";
    bufferImpl = NewsBufferHelper.narrow(ncRef.resolve_str(name));

    System.out.println("NewsBuffer Client connected.");
  }

  public boolean put(String newsXML) {
    if (bufferImpl == null) {
      System.err.println("Client not initialized");
      return false;
    }
    return bufferImpl.put(newsXML);
  }

  public String get() {
    if (bufferImpl == null) {
      System.err.println("Client not initialized");
      return null;
    }
    StringHolder holder = new StringHolder();
    if (bufferImpl.get(holder)) {
      return holder.value;
    }
    return null;
  }

  public String read() {
    if (bufferImpl == null) {
      System.err.println("Client not initialized");
      return null;
    }
    StringHolder holder = new StringHolder();
    if (bufferImpl.read(holder)) {
      return holder.value;
    }
    return null;
  }

  public String getById(int idNews) {
    if (bufferImpl == null) {
      System.err.println("Client not initialized");
      return null;
    }
    StringHolder holder = new StringHolder();
    if (bufferImpl.getById(idNews, holder)) {
      return holder.value;
    }
    return null;
  }

  public boolean isEmpty() {
    if (bufferImpl == null) {
      return true;
    }
    return bufferImpl.isEmpty();
  }

  public int getCount() {
    if (bufferImpl == null) {
      return 0;
    }
    return bufferImpl.getCount();
  }

  public void shutdown() {
    if (bufferImpl != null) {
      bufferImpl.shutdown();
    }
  }
}
