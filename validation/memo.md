
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