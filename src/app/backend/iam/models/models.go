package models

// User schema of the user table
type User struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Token    string `json:"token"`
	Type     string `json:"type"`
}
