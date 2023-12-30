package main

import (
    "fmt"
    "log"
    "os"
    "database/sql"
    "net/http"
    "github.com/joho/godotenv"
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"
    "github.com/TvGelderen/film-finder/backend/internal/database"
    "github.com/TvGelderen/film-finder/backend/handlers"

    _ "github.com/lib/pq"
)

func main() {
    godotenv.Load(".env")

    port := os.Getenv("FILM_FINDER_PORT")
    if port == "" {
        log.Fatal("PORT is missing")
    }

    dbConnectionString := os.Getenv("FILM_FINDER_DB_CONNECTION_STRING")
    if dbConnectionString == "" {
        log.Fatal("Database connection string is missing")
    }

    connection, err := sql.Open("postgres", dbConnectionString)
    if err != nil {
        log.Fatal("Unable to establish connection with database: ", err)
    }

    apiCfg := handlers.ApiConfig {
        DB: database.New(connection),
    }

    router := chi.NewRouter()

    router.Use(cors.Handler(cors.Options {
        AllowedOrigins: []string { "https://*", "http://*" },
        AllowedMethods: []string { "GET", "POST", "PUT", "DELETE", "OPTIONS" },
        AllowedHeaders: []string { "*" },
        ExposedHeaders: []string { "Link" },
        AllowCredentials: true,
        MaxAge: 300,
    }))

    base := "/film-finder"

    router.Get(base + "/health", handlers.HandlerSuccess)

    router.Get(base + "/users", apiCfg.MiddlewareAuth(apiCfg.HandlerGetUser))

    // Auth
    router.Post(base + "/auth/register", apiCfg.HandlerRegister)
    router.Post(base + "/auth/login", apiCfg.HandlerLogin)
    router.Post(base + "/auth/logout", apiCfg.MiddlewareAuth(apiCfg.HandlerLogout))

    // Save movies
    router.Get(base + "/movies", apiCfg.MiddlewareAuth(apiCfg.HandlerGetSavedMovies))
    router.Post(base + "/movies", apiCfg.MiddlewareAuth(apiCfg.HandlerSaveMovie))
    router.Delete(base + "/movies", apiCfg.MiddlewareAuth(apiCfg.HandlerRemoveMovie))

    server := &http.Server {
        Handler: router,
        Addr: ":" + port,
    }

    fmt.Println("Server starting on port: ", port)

    err = server.ListenAndServe()
    if err != nil {
        log.Fatal(err)
    }
}
