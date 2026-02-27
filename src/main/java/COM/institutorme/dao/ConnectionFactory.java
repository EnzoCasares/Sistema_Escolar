package COM.institutorme.dao;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public final class ConnectionFactory {

    private static final Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();

    private static final String HOST = getEnv("DB_HOST");
    private static final String PORT = getEnv("DB_PORT");
    private static final String DB_NAME = getEnv("DB_NAME");
    private static final String USER = getEnv("DB_USER");
    private static final String PASSWORD = getEnv("DB_PASSWORD");
    private static final String SSL_MODE = getEnv("DB_SSL_MODE");

    private static final String URL =
            "jdbc:postgresql://" + HOST + ":" + PORT + "/" + DB_NAME +
                    "?sslmode=" + SSL_MODE;

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("PostgreSQL Driver não encontrado.", e);
        }
    }

    private ConnectionFactory() {
        throw new UnsupportedOperationException("Classe utilitária.");
    }

    public static Connection getConnection() throws SQLException {

        Properties props = new Properties();
        props.setProperty("user", USER);
        props.setProperty("password", PASSWORD);
        props.setProperty("loginTimeout", "10");

        return DriverManager.getConnection(URL, props);
    }

    private static String getEnv(String key) {
        String value = dotenv.get(key);
        if (value == null || value.isBlank()) {
            value = System.getenv(key);
        }
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Variável obrigatória não definida: " + key);
        }
        return value;
    }
}