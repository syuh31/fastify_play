## fastify api エラーハンドリング

APIのエラーの形式は複数用意します。
基本形を基本的に使用し、それで対応できない場合は他のエラー形式を使用します。
これは、基本形以外を使用する場合はschemaを指定しないといけないため可読性が下がったり、作業量が増えたりするためです。

エラーのメッセージは人間が理解できるメッセージとします。
ただ、そのメッセージはAPI利用者が理解できる形式のメッセージであり、エンドユーザーが理解する形式のメッセージでは基本的にありません。
ユーザーが理解できるメッセージは、エラーコードをAPIを利用するフロント側のコードで判定し、適切な文言にしてユーザーに表示するようにする認識です。

### fastify エラー　基本形

```
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "httpErrors is not defined"
}
```

### fastify エラー　エラーコード込み

```
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "httpErrors is not defined"
  "code": 999,
}
```

### fastify エラー　複数エラー

```
{
  "statusCode": 500,
  "errors": [
    {
       "resource": "user_name",     // プログラムが判断するフィールド名
       "field": "ユーザー名",        // 人がわかるフィールド名
       "code": 111
       "message": "エラーメッセージ"
    }
  ]
}
```

### すべてのエラー構造をカバーする型構造
```
{
  "statusCode": int,
  "error": string,
  "message": string
  "code": int,
  "errors": [
    {
       "resource": string,
       "field": string,
       "code": int
       "message": string
    }
  ]
}
```


## 参考
[WebAPIでエラーをどう表現すべき？15のサービスを調査してみた](https://qiita.com/suin/items/f7ac4de914e9f3f35884)

### addSchemaサンプルコード
https://github.com/bykof/pokecoin-server/blob/502c4c325a2205c2261f5f3c654dfb57054e61ef/src/users/schemas/index.ts

### addSchemaとコードを同じところに書く
https://github.com/julianduque/mntd-envivo/blob/a39058cff1889eff48e9f6bf22bb5a82ce00ed9b/node/mntd-pass-api/server.js

### open apiとschemaの組み合わせ
https://github.com/karlosos/react-fastify-smarthome/blob/4039ad27529e46230aa01fd0250c83a91d0d5db4/src/docs/schemas/generic-error.json