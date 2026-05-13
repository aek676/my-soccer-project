package es.ual.news_service.corba;

import org.omg.CORBA.ORB;
import org.omg.CosNaming.NamingContext;
import org.omg.CosNaming.NamingContextHelper;
import org.omg.CosNaming.NameComponent;

public class NewsBufferServer {
    public static void main(String[] args) {
        try {
            ORB orb = ORB.init(args, null);

            NewsBufferImpl bufferRef = new NewsBufferImpl();
            bufferRef.setORB(orb);
            orb.connect(bufferRef);

            org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
            NamingContext ncRef = NamingContextHelper.narrow(objRef);

            NameComponent nc = new NameComponent("NewsBuffer", "");
            NameComponent[] path = {nc};
            ncRef.rebind(path, bufferRef);

            System.out.println("NewsBuffer Server ready and waiting...");
            System.out.println("Buffer configured with max 20 news.");

            java.lang.Object sync = new java.lang.Object();
            synchronized (sync) {
                sync.wait();
            }

        } catch (Exception e) {
            System.err.println("ERROR: " + e);
            e.printStackTrace(System.out);
        }
    }
}