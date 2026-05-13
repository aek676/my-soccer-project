package es.ual.news_service.xml;

import javax.xml.transform.stream.StreamSource;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;

public class NewsSchemaValidator {
    private javax.xml.validation.Schema schema;

    public NewsSchemaValidator() {
        try {
            javax.xml.validation.SchemaFactory factory =
                javax.xml.validation.SchemaFactory.newInstance(javax.xml.XMLConstants.W3C_XML_SCHEMA_NS_URI);
            String schemaPath = getClass().getClassLoader().getResource("news.xsd").toURI().toString();
            schema = factory.newSchema(new StreamSource(schemaPath));
        } catch (Exception e) {
            System.err.println("Failed to load schema: " + e.getMessage());
        }
    }

    public boolean validate(String xml) {
        if (schema == null) {
            System.err.println("Schema not loaded, skipping validation");
            return true;
        }
        try {
            javax.xml.validation.Validator validator = schema.newValidator();
            validator.validate(new StreamSource(new StringReader(xml)));
            return true;
        } catch (Exception e) {
            System.err.println("Validation failed: " + e.getMessage());
            return false;
        }
    }
}