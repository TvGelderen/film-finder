package handlers

import (
	"net/http"
    "github.com/TvGelderen/film-finder/backend/internal/database"
)

func (apiCfg *ApiConfig) HandlerGetUser(w http.ResponseWriter, r *http.Request, user database.User) {
	respondWithJSON(w, 200, mapDbUserToUser(user))
}
