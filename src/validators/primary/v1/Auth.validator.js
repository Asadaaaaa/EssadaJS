class AuthValidator {
    login = {
        "type": "object",
        "properties": {
            "identity": {
                "type": "string",
                "minLength": 1,
                "maxLength": 60,
                "pattern": "^(?:[a-zA-Z0-9_.-]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})$",
                "nullable": false
            },
            "password": {
                "type": "string",
                "minLength": 1,
                "maxLength": 12,
                "pattern": "^\\S+$",
                "nullable": false
            }
        },
        "required": [
            "identity", "password"
        ],
        "additionalProperties": false
    };

    refreshToken = {
        "type": "object",
        "properties": {
            "refreshToken": {
                "type": "string",
                "pattern": "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$",
                "nullable": false
            }
        },
        "required": [
            "refreshToken"
        ],
        "additionalProperties": false
    }
}

export default AuthValidator;