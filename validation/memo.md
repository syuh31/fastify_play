### [GitHub validation error](https://docs.github.com/en/rest/issues/issues#list-issues-assigned-to-the-authenticated-user--status-codes)
|||
|-|-|
|200	|OK|
|304	|Not modified|
|404|Resource not found|
|422	|Validation failed|
	





### [Twitter API Error code](https://developer.twitter.com/en/docs/twitter-ads-api/response-codes)
|HTTP Code	|Error Code|
|-|-|
|403	|ACCOUNT_LOCKED_OUT|
|404	|ACCOUNT_MEDIA_NOT_FOUND|
|403	|ACCOUNT_NOT_FOUND|


```
GET {{schima}}://{{host}}/foo_bar
    ?bar=2
    &baz=3
```

```
HTTP/1.1 400 Bad Request
content-type: application/json; charset=utf-8
content-length: 98
Date: Thu, 21 Jul 2022 07:00:44 GMT
Connection: close

{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "querystring must have required property 'foo'"
}
```

```

GET {{schima}}://{{host}}/foo_bar
    ?foo=1
    &bar=2
    &baz=3
    &qux=4
```

Ajv.allErrorsがtrueの場合
```
HTTP/1.1 400 Bad Request
content-type: application/json; charset=utf-8
content-length: 441
Date: Thu, 21 Jul 2022 08:04:52 GMT
Connection: close

{
  "message": "A validation error occurred when validating the querystring...",
  "errors": [
    {
      "instancePath": "",
      "schemaPath": "#/additionalProperties",
      "keyword": "additionalProperties",
      "params": {
        "additionalProperty": "baz"
      },
      "message": "must NOT have additional properties"
    },
    {
      "instancePath": "",
      "schemaPath": "#/additionalProperties",
      "keyword": "additionalProperties",
      "params": {
        "additionalProperty": "qux"
      },
      "message": "must NOT have additional properties"
    }
  ]
}

```

Ajv.allErrorsがfalseの場合
```
HTTP/1.1 400 Bad Request
content-type: application/json; charset=utf-8
content-length: 264
Date: Thu, 21 Jul 2022 08:03:11 GMT
Connection: close

{
  "message": "A validation error occurred when validating the querystring...",
  "errors": [
    {
      "instancePath": "",
      "schemaPath": "#/additionalProperties",
      "keyword": "additionalProperties",
      "params": {
        "additionalProperty": "baz"
      },
      "message": "must NOT have additional properties"
    }
  ]
}
```